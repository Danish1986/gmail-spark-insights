import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSyncStatus } from "@/hooks/useFinancialData";

export const SyncButton = () => {
  const [syncing, setSyncing] = useState(false);
  const { data: syncStatus } = useSyncStatus();

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-gmail-emails');
      
      console.log('Sync response:', { data, error });
      
      if (error) {
        console.error('Sync error details:', error);
        
        // Show user-friendly error messages based on error type
        if (error.message?.includes('NO_GMAIL_CONNECTED')) {
          toast.error("Please connect your Gmail account first by completing the onboarding process.");
        } else if (error.message?.includes('UNAUTHORIZED')) {
          toast.error("Session expired. Please sign in again.");
        } else {
          toast.error("Sync failed: " + (error.message || 'Unknown error'));
        }
        return;
      }

      if (data?.error) {
        console.error('Sync returned error:', data);
        toast.error(data.message || "Sync failed");
        return;
      }

      toast.success(`Synced ${data?.transactions_found || 0} new transactions from ${data?.processed || 0} emails`);
    } catch (error: any) {
      console.error('Sync exception:', error);
      toast.error("Sync failed: " + (error.message || 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  };

  const getLastSyncText = () => {
    if (!syncStatus?.last_sync_at) return "Never synced";
    
    const lastSync = new Date(syncStatus.last_sync_at);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Synced just now";
    if (diffMins < 60) return `Synced ${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Synced ${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Synced ${diffDays}d ago`;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{getLastSyncText()}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSync}
        disabled={syncing || syncStatus?.sync_in_progress}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${(syncing || syncStatus?.sync_in_progress) ? 'animate-spin' : ''}`} />
        Sync
      </Button>
    </div>
  );
};