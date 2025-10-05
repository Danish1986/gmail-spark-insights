import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("Processing authentication...");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("🔐 OAuth callback initiated");
        
        // Extract tokens from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        const providerToken = params.get('provider_token');
        
        console.log("📝 Tokens extracted:", { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          hasProviderToken: !!providerToken,
          expiresIn 
        });

        if (!accessToken) {
          throw new Error("No access token found in OAuth callback");
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("❌ User error:", userError);
          throw new Error("Failed to get authenticated user");
        }

        console.log("✅ User authenticated:", user.id);
        setStatus("Connecting to Gmail...");

        // Get user's email from Google's userinfo endpoint using provider token
        let userEmail = user.email;
        if (providerToken) {
          try {
            const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${providerToken}` }
            });
            const userinfo = await userinfoResponse.json();
            userEmail = userinfo.email || user.email;
            console.log("📧 Gmail email:", userEmail);
          } catch (e) {
            console.warn("⚠️ Failed to fetch userinfo, using fallback email", e);
          }
        }

        // Check if email account already exists
        const { data: existingAccount } = await supabase
          .from('email_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .maybeSingle();

        if (existingAccount) {
          console.log("🔄 Updating existing email account");
          // Update existing account
          const { error: updateError } = await supabase
            .from('email_accounts')
            .update({
              access_token: providerToken || accessToken,
              refresh_token: refreshToken || existingAccount.refresh_token,
              email: userEmail,
              last_synced_at: new Date().toISOString()
            })
            .eq('id', existingAccount.id);

          if (updateError) {
            console.error("❌ Update error:", updateError);
            throw updateError;
          }
        } else {
          console.log("✨ Creating new email account");
          // Create new email account record
          const { error: insertError } = await supabase
            .from('email_accounts')
            .insert({
              user_id: user.id,
              email: userEmail,
              provider: 'google',
              access_token: providerToken || accessToken,
              refresh_token: refreshToken,
              connected_at: new Date().toISOString()
            });

          if (insertError) {
            console.error("❌ Insert error:", insertError);
            throw insertError;
          }
        }

        console.log("✅ Email account saved successfully");
        setStatus("Initializing sync...");

        // Initialize or update sync_status
        const { data: existingStatus } = await supabase
          .from('sync_status')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingStatus) {
          await supabase
            .from('sync_status')
            .update({
              sync_in_progress: false,
              last_sync_at: new Date().toISOString()
            })
            .eq('id', existingStatus.id);
        } else {
          await supabase
            .from('sync_status')
            .insert({
              user_id: user.id,
              sync_in_progress: false,
              last_sync_at: new Date().toISOString(),
              emails_processed: 0,
              transactions_found: 0
            });
        }

        console.log("✅ Sync status initialized");
        setStatus("Starting initial sync...");

        // Trigger initial sync in background
        setTimeout(async () => {
          try {
            console.log("🔄 Triggering initial sync");
            const { error: syncError } = await supabase.functions.invoke('fetch-gmail-emails');
            if (syncError) {
              console.error("❌ Initial sync error:", syncError);
            } else {
              console.log("✅ Initial sync triggered successfully");
            }
          } catch (e) {
            console.error("❌ Sync exception:", e);
          }
        }, 1000);

        toast.success("Gmail connected successfully!");
        
        // Redirect to dashboard with replace to prevent back button issues
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1500);

      } catch (error: any) {
        console.error("❌ OAuth callback error:", error);
        toast.error("Failed to connect Gmail: " + error.message);
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Setting up your account</h2>
            <p className="text-muted-foreground">{status}</p>
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
