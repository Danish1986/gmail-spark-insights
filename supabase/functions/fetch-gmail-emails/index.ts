import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Indian bank domains for email search
const BANK_DOMAINS = [
  "hdfcbank.com", "hdfcbank.net", "email.hdfcbank.com",
  "icicibank.com", "email.icicibank.com", "kotak.com", "kotakmail.com",
  "axisbank.com", "email.axisbank.com", "sbi.co.in", "sbicard.com",
  "americanexpress.com", "aexp.com", "hsbc.co.in", "hsbc.com",
  "citi.com", "citibank.com", "indusind.com", "yesbank.in",
  "dcbbank.com", "jupiter.money", "dbs.com", "paytm.com", "phonepe.com"
];

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

    console.log('✅ Fetching Gmail emails for user:', user.id);

    // Get user's connected email account with access token
    const { data: emailAccount, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .maybeSingle();

    console.log('📧 Email account query result:', { emailAccount, accountError });

    if (accountError) {
      console.error('❌ Database error fetching email account:', accountError);
      return new Response(JSON.stringify({ 
        error: 'DATABASE_ERROR', 
        message: 'Failed to fetch email account: ' + accountError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!emailAccount) {
      console.error('❌ No Gmail account connected for user:', user.id);
      return new Response(JSON.stringify({ 
        error: 'NO_GMAIL_CONNECTED', 
        message: 'No Gmail account connected. Please complete the onboarding process to connect your Gmail account.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Found email account:', emailAccount.email);

    if (!emailAccount.access_token) {
      console.error('❌ No access token available for email account');
      return new Response(JSON.stringify({ 
        error: 'NO_ACCESS_TOKEN', 
        message: 'No access token available. Please reconnect your Gmail account.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Access token found, checking if refresh needed...');

    // Check if access token needs refresh (Google tokens expire after 1 hour)
    let accessToken = emailAccount.access_token;
    const lastSynced = emailAccount.last_synced_at ? new Date(emailAccount.last_synced_at) : null;
    const hoursSinceSync = lastSynced ? (Date.now() - lastSynced.getTime()) / (1000 * 60 * 60) : 999;

    // Refresh token if it's been more than 50 minutes or if we get auth errors
    if (hoursSinceSync > 0.8 && emailAccount.refresh_token) {
      console.log('🔄 Token needs refresh (hours since sync:', hoursSinceSync, ')');
      try {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
        
        if (!clientId || !clientSecret) {
          console.error('❌ Missing Google OAuth credentials');
          return new Response(JSON.stringify({ 
            error: 'CONFIG_ERROR', 
            message: 'Google OAuth credentials not configured properly' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
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

          console.log('✅ Access token refreshed successfully');
        } else {
          const errorText = await refreshResponse.text();
          console.error('❌ Token refresh failed:', refreshResponse.status, errorText);
        }
      } catch (refreshError) {
        console.error('❌ Error refreshing token:', refreshError);
        // Continue with existing token and let Gmail API error if it's invalid
      }
    } else {
      console.log('✅ Token is fresh, no refresh needed');
    }

    // Update sync status
    await supabase
      .from('sync_status')
      .upsert({
        user_id: user.id,
        sync_in_progress: true,
        updated_at: new Date().toISOString(),
      });

    // Search for financial emails from the last 18 months (540 days)
    const searchQuery = `(${BANK_DOMAINS.map(d => `from:${d}`).join(' OR ')}) ` +
      `(transaction alert OR debited OR spent OR credited OR received OR payment) ` +
      `newer_than:540d`;
    
    const gmailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(searchQuery)}&maxResults=500`,
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

    console.log(`Found ${messages.length} messages to process (will process up to 200)`);

    let processedCount = 0;
    let transactionsFound = 0;

    // Recursive email body parser with HTML stripping and entity decoding
    function getFullTextFromPayload(payload: any): string {
      function findTextParts(p: any): string[] {
        if (!p) return [];
        const parts: string[] = [];
        
        if (p.parts && Array.isArray(p.parts)) {
          for (const part of p.parts) {
            parts.push(...findTextParts(part));
          }
        } else if (p.body?.data) {
          try {
            const decoded = atob(p.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            parts.push(decoded);
          } catch (e) {
            console.error('Failed to decode part:', e);
          }
        }
        
        return parts;
      }
      
      let fullText = findTextParts(payload).join('\n');
      
      // Strip HTML tags
      fullText = fullText.replace(/<[^<]+?>/g, ' ');
      
      // Decode HTML entities
      fullText = fullText
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'");
      
      // Normalize whitespace
      return fullText.split(/\s+/).join(' ').trim();
    }

    // Process messages (limit to 200 to avoid timeouts)
    for (const message of messages.slice(0, 200)) {
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
        
        // Extract subject and body using recursive parser
        const headers = messageData.payload.headers;
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
        const body = getFullTextFromPayload(messageData.payload);

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