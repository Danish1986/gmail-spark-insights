import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SyncStatusBanner = () => {
  const [status, setStatus] = useState<{
    connected: boolean;
    syncing: boolean;
    lastSync: string | null;
    error: string | null;
  }>({
    connected: false,
    syncing: false,
    lastSync: null,
    error: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check email connection
      const { data: emailAccount } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Check sync status
      const { data: syncStatus } = await supabase
        .from('sync_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setStatus({
        connected: !!emailAccount,
        syncing: syncStatus?.sync_in_progress || false,
        lastSync: syncStatus?.last_sync_at || null,
        error: syncStatus?.error_message || null,
      });
    };

    fetchStatus();

    // Subscribe to sync status changes
    const channel = supabase
      .channel('sync-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sync_status',
        },
        () => {
          fetchStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!status.connected) {
    return null;
  }

  if (status.error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Sync error: {status.error}
        </AlertDescription>
      </Alert>
    );
  }

  if (status.syncing) {
    return (
      <Alert className="mb-4 border-primary/50 bg-primary/5">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <AlertDescription className="text-primary">
          Syncing your transactions...
        </AlertDescription>
      </Alert>
    );
  }

  if (status.lastSync) {
    const lastSyncDate = new Date(status.lastSync);
    const now = new Date();
    const diffMs = now.getTime() - lastSyncDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    let timeAgo = "";
    if (diffMins < 1) timeAgo = "just now";
    else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
    else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)}h ago`;
    else timeAgo = `${Math.floor(diffMins / 1440)}d ago`;

    return (
      <Alert className="mb-4 border-green-500/50 bg-green-500/5">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700 dark:text-green-400">
          Gmail connected • Last synced {timeAgo}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
