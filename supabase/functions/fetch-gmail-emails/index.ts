import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching Gmail emails for user:', user.id);

    // Get user's connected email account with access token
    const { data: emailAccount, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single();

    if (accountError || !emailAccount) {
      return new Response(JSON.stringify({ error: 'No Gmail account connected' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!emailAccount.access_token) {
      return new Response(JSON.stringify({ error: 'No access token available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if access token needs refresh (Google tokens expire after 1 hour)
    let accessToken = emailAccount.access_token;
    const lastSynced = emailAccount.last_synced_at ? new Date(emailAccount.last_synced_at) : null;
    const hoursSinceSync = lastSynced ? (Date.now() - lastSynced.getTime()) / (1000 * 60 * 60) : 999;

    // Refresh token if it's been more than 50 minutes or if we get auth errors
    if (hoursSinceSync > 0.8 && emailAccount.refresh_token) {
      try {
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
            client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
            refresh_token: emailAccount.refresh_token,
            grant_type: 'refresh_token',
          }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          accessToken = refreshData.access_token;

          // Update access token in database
          await supabase
            .from('email_accounts')
            .update({ access_token: accessToken })
            .eq('id', emailAccount.id);

          console.log('Access token refreshed successfully');
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Continue with existing token and let Gmail API error if it's invalid
      }
    }

    // Update sync status
    await supabase
      .from('sync_status')
      .upsert({
        user_id: user.id,
        sync_in_progress: true,
        updated_at: new Date().toISOString(),
      });

    // Search for financial emails from Indian banks and payment apps
    const searchQuery = 'from:(hdfc OR icici OR axis OR sbi OR paytm OR phonepe OR googlepay OR amazon OR swiggy OR zomato OR uber OR ola OR flipkart) newer_than:90d';
    
    const gmailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(searchQuery)}&maxResults=50`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!gmailResponse.ok) {
      const errorText = await gmailResponse.text();
      console.error('Gmail API error:', gmailResponse.status, errorText);
      
      await supabase
        .from('sync_status')
        .upsert({
          user_id: user.id,
          sync_in_progress: false,
          error_message: `Gmail API error: ${gmailResponse.status}`,
          updated_at: new Date().toISOString(),
        });

      return new Response(JSON.stringify({ error: 'Gmail API error', details: errorText }), {
        status: gmailResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const gmailData = await gmailResponse.json();
    const messages = gmailData.messages || [];

    console.log(`Found ${messages.length} messages to process`);

    let processedCount = 0;
    let transactionsFound = 0;

    // Process each message
    for (const message of messages.slice(0, 20)) { // Limit to 20 emails per sync
      try {
        // Fetch full message details
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!messageResponse.ok) continue;

        const messageData = await messageResponse.json();
        
        // Extract subject and body
        const headers = messageData.payload.headers;
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
        
        let body = '';
        if (messageData.payload.body?.data) {
          body = atob(messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (messageData.payload.parts) {
          const textPart = messageData.payload.parts.find((p: any) => p.mimeType === 'text/plain');
          if (textPart?.body?.data) {
            body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
        }

        // Call parse function
        const parseResponse = await fetch(`${supabaseUrl}/functions/v1/parse-financial-emails`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailSubject: subject,
            emailBody: body,
            emailId: message.id,
          }),
        });

        if (parseResponse.ok) {
          const parseResult = await parseResponse.json();
          if (parseResult.is_transaction !== false) {
            transactionsFound++;
          }
        }

        processedCount++;
      } catch (error) {
        console.error('Error processing message:', message.id, error);
      }
    }

    // Update sync status
    await supabase
      .from('sync_status')
      .upsert({
        user_id: user.id,
        last_sync_at: new Date().toISOString(),
        sync_in_progress: false,
        emails_processed: processedCount,
        transactions_found: transactionsFound,
        error_message: null,
        updated_at: new Date().toISOString(),
      });

    // Update email account last_synced_at
    await supabase
      .from('email_accounts')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', emailAccount.id);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: processedCount,
      transactions_found: transactionsFound 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Try to update sync status to show error
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const authHeader = req.headers.get('Authorization')!;
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        await supabase
          .from('sync_status')
          .upsert({
            user_id: user.id,
            sync_in_progress: false,
            error_message: errorMsg,
            updated_at: new Date().toISOString(),
          });
      }
    } catch (e) {
      console.error('Failed to update sync status:', e);
    }
    
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});