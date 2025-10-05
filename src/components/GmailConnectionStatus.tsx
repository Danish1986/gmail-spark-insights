import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Mail } from "lucide-react";

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
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
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
      <Alert className="mb-4 border-yellow-500/50 bg-yellow-500/10">
        <XCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-700 dark:text-yellow-400">
          Gmail connection in progress. Please sign in again if you see this message.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-500/50 bg-green-500/10">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertDescription className="text-green-700 dark:text-green-400">
        Gmail connected and ready to sync
      </AlertDescription>
    </Alert>
  );
};
