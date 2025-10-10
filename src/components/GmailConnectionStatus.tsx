import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { SyncButton } from "./SyncButton";

export const GmailConnectionStatus = () => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, [user]);

  const checkConnection = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .maybeSingle();

      setConnected(!!data && !error);
    } catch (error) {
      console.error('Error checking Gmail connection:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth-callback`,
        scopes: "email profile https://www.googleapis.com/auth/gmail.readonly",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error('Error connecting Gmail:', error);
    }
  };

  if (loading) return null;

  if (!connected) {
    return (
      <div className="mb-6">
        <Alert className="border-primary/50 bg-primary/5">
          <Mail className="h-5 w-5 text-primary" />
          <AlertDescription className="flex flex-col gap-4">
            <div>
              <p className="font-semibold text-foreground mb-1">Connect Your Gmail</p>
              <p className="text-sm text-muted-foreground">
                We'll automatically track your transactions and provide personalized insights
              </p>
            </div>
            <Button onClick={handleConnect} className="w-full sm:w-auto gap-2">
              <Mail className="h-4 w-4" />
              Connect Gmail Account
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Alert className="mb-4 border-green-500/50 bg-green-500/10">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="text-green-700 dark:text-green-400">
          Gmail connected and ready to sync
        </span>
        <SyncButton />
      </AlertDescription>
    </Alert>
  );
};
