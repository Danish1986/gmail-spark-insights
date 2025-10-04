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
      
      if (error) {
        toast.error("Sync failed: " + error.message);
        return;
      }

      toast.success(`Synced ${data.transactions_found} new transactions from ${data.processed} emails`);
    } catch (error: any) {
      toast.error("Sync failed: " + error.message);
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