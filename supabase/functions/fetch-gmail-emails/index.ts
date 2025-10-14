import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { safeLog } from "../_shared/logger.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BANK_DOMAINS = [
  "hdfcbank.com", "hdfcbank.net", "email.hdfcbank.com",
  "icicibank.com", "email.icicibank.com", "kotak.com", "kotakmail.com",
  "axisbank.com", "email.axisbank.com", "sbi.co.in", "sbicard.com",
  "americanexpress.com", "aexp.com", "hsbc.co.in", "hsbc.com",
  "citi.com", "citibank.com", "indusind.com", "yesbank.in",
  "dcbbank.com", "jupiter.money", "dbs.com", "paytm.com", "phonepe.com"
];

async function refreshAccessToken(
  refreshToken: string,
  emailAccountId: string,
  supabase: any
): Promise<string | null> {
  try {
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      safeLog.error('Missing Google OAuth credentials');
      return null;
    }

    const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      const newAccessToken = refreshData.access_token;

      await supabase
        .from('email_accounts')
        .update({ access_token: newAccessToken })
        .eq('id', emailAccountId);

      safeLog.info('Access token refreshed successfully');
      return newAccessToken;
    } else {
      safeLog.error('Token refresh failed', { status: refreshResponse.status });
      return null;
    }
  } catch (error) {
    safeLog.error('Error refreshing token', error);
    return null;
  }
}

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
        // Ignore decode errors
      }
    }
    
    return parts;
  }
  
  let fullText = findTextParts(payload).join('\n');
  fullText = fullText.replace(/<[^<]+?>/g, ' ');
  fullText = fullText
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'");
  
  return fullText.split(/\s+/).join(' ').trim();
}

async function processSyncPhase(
  phase: 1 | 2 | 3 | 4,
  startDate: Date,
  endDate: Date | null,
  userId: string,
  accessToken: string,
  authHeader: string,
  supabase: any,
  supabaseUrl: string
) {
  const phaseNames = {
    1: 'Recent data (45 days)',
    2: 'Extended data (3 months)',
    3: 'Historical data (6 months)',
    4: 'Full history (18 months)'
  };

  safeLog.info(`Starting Phase ${phase}: ${phaseNames[phase]}`);

  // Update sync status: starting phase
  await supabase
    .from('sync_status')
    .update({
      sync_phase: `phase_${phase}`,
      current_status: `Loading ${phaseNames[phase]}...`,
      sync_in_progress: true,
    })
    .eq('user_id', userId);

  // Build Gmail query
  const fromQuery = BANK_DOMAINS.map(d => `from:${d}`).join(' OR ');
  const keywordQuery = '(transaction alert OR debited OR spent OR credited OR received OR payment)';
  const afterQuery = `after:${startDate.toISOString().split('T')[0]}`;
  const beforeQuery = endDate ? `before:${endDate.toISOString().split('T')[0]}` : '';
  const searchQuery = `(${fromQuery}) ${keywordQuery} ${afterQuery} ${beforeQuery}`;

  // Fetch messages
  const gmailResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(searchQuery)}&maxResults=500`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );

  if (!gmailResponse.ok) {
    const errorText = await gmailResponse.text();
    safeLog.error(`Phase ${phase} Gmail API error`, { status: gmailResponse.status });
    
    await supabase
      .from('sync_status')
      .update({
        sync_in_progress: false,
        error_message: `Gmail API error in Phase ${phase}: ${gmailResponse.status}`,
      })
      .eq('user_id', userId);
    
    return;
  }

  const gmailData = await gmailResponse.json();
  const messages = gmailData.messages || [];

  safeLog.info(`Phase ${phase}: Found ${messages.length} messages`);

  // Update total emails found (for phase 1 only, accumulate for others)
  const currentStatus = await supabase
    .from('sync_status')
    .select('total_emails_found, emails_processed, transactions_found')
    .eq('user_id', userId)
    .single();

  const totalFound = (currentStatus.data?.total_emails_found || 0) + messages.length;
  
  await supabase
    .from('sync_status')
    .update({
      total_emails_found: totalFound,
      estimated_completion_time: new Date(Date.now() + (messages.length * 1500)).toISOString(),
    })
    .eq('user_id', userId);

  // Process in batches
  const BATCH_SIZE = 20;
  let processedCount = currentStatus.data?.emails_processed || 0;
  let transactionsFound = currentStatus.data?.transactions_found || 0;

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, Math.min(i + BATCH_SIZE, messages.length));
    
    // Process batch
    await Promise.all(
      batch.map(async (message: any) => {
        try {
          const messageResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
          );

          if (!messageResponse.ok) return;

          const messageData = await messageResponse.json();
          const headers = messageData.payload.headers;
          const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
          const body = getFullTextFromPayload(messageData.payload);

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
        } catch (error) {
          safeLog.error(`Error processing message ${message.id}`, error);
        }
      })
    );

    processedCount += batch.length;
    const progressPercentage = Math.floor((processedCount / totalFound) * 100);

    // Update progress
    await supabase
      .from('sync_status')
      .update({
        emails_processed: processedCount,
        transactions_found: transactionsFound,
        progress_percentage: Math.min(progressPercentage, 100),
        current_status: `Phase ${phase}: ${processedCount}/${totalFound} emails`,
      })
      .eq('user_id', userId);
  }

  // Mark phase complete
  await supabase
    .from('sync_status')
    .update({
      [`phase_${phase}_complete`]: true,
      current_status: `✅ ${phaseNames[phase]} complete`,
    })
    .eq('user_id', userId);

  safeLog.info(`Phase ${phase} completed: ${messages.length} emails, ${transactionsFound} transactions`);
}

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

    safeLog.info('Fetching Gmail emails for user', { userId: user.id });

    // Get email account
    const { data: emailAccount, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .maybeSingle();

    if (accountError || !emailAccount) {
      return new Response(JSON.stringify({ 
        error: 'NO_GMAIL_CONNECTED', 
        message: 'Please connect your Gmail account' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!emailAccount.access_token) {
      return new Response(JSON.stringify({ 
        error: 'NO_ACCESS_TOKEN', 
        message: 'Please reconnect your Gmail account' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Refresh token if needed
    let accessToken = emailAccount.access_token;
    const lastSynced = emailAccount.last_synced_at ? new Date(emailAccount.last_synced_at) : null;
    const hoursSinceSync = lastSynced ? (Date.now() - lastSynced.getTime()) / (1000 * 60 * 60) : 999;

    if (hoursSinceSync > 0.8 && emailAccount.refresh_token) {
      const newToken = await refreshAccessToken(emailAccount.refresh_token, emailAccount.id, supabase);
      if (newToken) accessToken = newToken;
    }

    // Initialize sync status
    await supabase
      .from('sync_status')
      .upsert({
        user_id: user.id,
        sync_in_progress: true,
        sync_phase: 'phase_1',
        emails_processed: 0,
        transactions_found: 0,
        progress_percentage: 0,
        phase_1_complete: false,
        phase_2_complete: false,
        phase_3_complete: false,
        phase_4_complete: false,
        error_message: null,
        updated_at: new Date().toISOString(),
      });

    // PHASE 1: Last 45 days (FOREGROUND - user waits)
    const phase1End = new Date();
    const phase1Start = new Date();
    phase1Start.setDate(phase1Start.getDate() - 45);
    
    await processSyncPhase(1, phase1Start, phase1End, user.id, accessToken, authHeader, supabase, supabaseUrl);

    // Update email account
    await supabase
      .from('email_accounts')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', emailAccount.id);

    // Return response after Phase 1
    const response = new Response(JSON.stringify({
      success: true,
      phase_1_complete: true,
      message: 'Recent data loaded. Syncing older data in background...'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

    // PHASES 2-4: Run in background
    // @ts-ignore - EdgeRuntime is available at runtime
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(
        (async () => {
          try {
            // Phase 2: 45 days → 3 months
            const phase2End = phase1Start;
            const phase2Start = new Date();
            phase2Start.setMonth(phase2Start.getMonth() - 3);
            await processSyncPhase(2, phase2Start, phase2End, user.id, accessToken, authHeader, supabase, supabaseUrl);

            // Phase 3: 3 → 6 months
            const phase3End = phase2Start;
            const phase3Start = new Date();
            phase3Start.setMonth(phase3Start.getMonth() - 6);
            await processSyncPhase(3, phase3Start, phase3End, user.id, accessToken, authHeader, supabase, supabaseUrl);

            // Phase 4: 6 → 18 months
            const phase4End = phase3Start;
            const phase4Start = new Date();
            phase4Start.setMonth(phase4Start.getMonth() - 18);
            await processSyncPhase(4, phase4Start, phase4End, user.id, accessToken, authHeader, supabase, supabaseUrl);

            // Final update
            await supabase
              .from('sync_status')
              .update({
                sync_in_progress: false,
                sync_phase: 'complete',
                progress_percentage: 100,
                current_status: '✅ All historical data synced',
                last_sync_at: new Date().toISOString(),
              })
              .eq('user_id', user.id);

            safeLog.info('All sync phases completed successfully');
          } catch (bgError) {
            safeLog.error('Background sync error', bgError);
            await supabase
              .from('sync_status')
              .update({
                sync_in_progress: false,
                error_message: 'Background sync failed. Recent data is available.',
              })
              .eq('user_id', user.id);
          }
        })()
      );
    }

    return response;

  } catch (error) {
    safeLog.error('Sync error', error);
    
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const authHeader = req.headers.get('Authorization')!;
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        await supabase
          .from('sync_status')
          .update({
            sync_in_progress: false,
            error_message: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('user_id', user.id);
      }
    } catch (e) {
      safeLog.error('Failed to update error status', e);
    }
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
