import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Mail } from "lucide-react";
import { SyncButton } from "./SyncButton";

export const GmailConnectionStatus = ({ hasExistingData }: { hasExistingData: boolean }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    checkConnection();
    checkSyncStatus();
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
      console.log('Gmail connection status:', { connected: !!data && !error });
    } catch (error) {
      console.error('Error checking Gmail connection:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const checkSyncStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('sync_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setIsSyncing(data?.current_status === 'in_progress' || !data?.phase_1_complete || !data?.phase_2_complete);
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  const handleConnect = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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

  // Type A: Existing user with data - don't show anything
  if (hasExistingData) {
    return null;
  }

  // Type C: Connected but syncing - show sync in progress
  if (connected && isSyncing) {
    return (
      <Alert className="mb-4 border-blue-500/50 bg-blue-500/10">
        <CheckCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="flex items-center justify-between gap-4">
          <span className="text-blue-700 dark:text-blue-400">
            Gmail connected - syncing your transactions...
          </span>
          <SyncButton />
        </AlertDescription>
      </Alert>
    );
  }

  // Connected with sync button available
  if (connected) {
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
  }

  // Type B: Fresh user without Gmail - show connect option
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

  return null;
};
