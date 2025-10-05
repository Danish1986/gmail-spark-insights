import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("Processing authentication...");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const handleOAuthCallback = async () => {
      const startTime = Date.now();
      
      try {
        console.log("🔐 OAuth callback initiated");
        
        // Set 15-second timeout for entire process
        timeoutId = setTimeout(() => {
          if (isActive) {
            throw new Error("Authentication timeout - taking too long to process");
          }
        }, 15000);

        // Extract tokens from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const providerToken = params.get('provider_token');
        
        if (!accessToken) {
          throw new Error("No access token found in OAuth callback");
        }

        // Get current user with timeout
        setStatus("Verifying your account...");
        const userPromise = supabase.auth.getUser();
        const userResult = await Promise.race([
          userPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("User fetch timeout")), 5000)
          )
        ]) as Awaited<typeof userPromise>;
        
        const { data: { user }, error: userError } = userResult;
        
        if (userError || !user) {
          throw new Error("Failed to get authenticated user");
        }

        console.log("✅ User authenticated in", Date.now() - startTime, "ms");

        // Get user's email (simplified, no extra API call)
        const userEmail = user.email || "";
        setStatus("Connecting email account...");

        // Parallel database operations for speed
        const [existingAccountResult, existingStatusResult] = await Promise.all([
          supabase.from('email_accounts').select('*').eq('user_id', user.id).eq('provider', 'google').maybeSingle(),
          supabase.from('sync_status').select('*').eq('user_id', user.id).maybeSingle()
        ]);

        // Update or insert email account
        if (existingAccountResult.data) {
          const { error: updateError } = await supabase
            .from('email_accounts')
            .update({
              access_token: providerToken || accessToken,
              refresh_token: refreshToken || existingAccountResult.data.refresh_token,
              email: userEmail,
              last_synced_at: new Date().toISOString()
            })
            .eq('id', existingAccountResult.data.id);

          if (updateError) throw updateError;
        } else {
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

          if (insertError) throw insertError;
        }

        // Update or insert sync status
        setStatus("Setting up sync...");
        if (existingStatusResult.data) {
          await supabase
            .from('sync_status')
            .update({
              sync_in_progress: false,
              last_sync_at: new Date().toISOString()
            })
            .eq('id', existingStatusResult.data.id);
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

        console.log("✅ Setup completed in", Date.now() - startTime, "ms");
        clearTimeout(timeoutId);
        
        // Trigger background sync (non-blocking)
        setTimeout(() => {
          supabase.functions.invoke('fetch-gmail-emails').catch(console.error);
        }, 500);

        setStatus("All set! Redirecting...");
        toast.success("Gmail connected successfully!");
        
        // Quick redirect
        setTimeout(() => {
          if (isActive) {
            navigate("/dashboard", { replace: true });
          }
        }, 800);

      } catch (error: any) {
        clearTimeout(timeoutId);
        console.error("❌ OAuth callback error:", error);
        setError(error.message || "Authentication failed");
        setStatus("Something went wrong");
      }
    };

    handleOAuthCallback();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [navigate, retryCount]);

  const handleRetry = () => {
    setError(null);
    setStatus("Retrying...");
    setRetryCount(prev => prev + 1);
  };

  const handleSkip = () => {
    navigate("/dashboard", { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-destructive">Connection Failed</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full" size="lg">
                  Try Again
                </Button>
                <Button onClick={handleSkip} variant="outline" className="w-full" size="lg">
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
