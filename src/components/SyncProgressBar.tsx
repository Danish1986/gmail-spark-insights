import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SyncStatus {
  sync_in_progress: boolean;
  sync_phase: string;
  progress_percentage: number;
  current_status: string;
  total_emails_found: number;
  emails_processed: number;
  transactions_found: number;
  phase_1_complete: boolean;
  phase_2_complete: boolean;
  phase_3_complete: boolean;
  phase_4_complete: boolean;
  estimated_completion_time: string | null;
  error_message: string | null;
}

export const SyncProgressBar = () => {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchStatus = async () => {
      const { data } = await supabase
        .from('sync_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) setSyncStatus(data as SyncStatus);
    };
    fetchStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('sync-progress')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sync_status',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setSyncStatus(payload.new as SyncStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!syncStatus?.sync_in_progress) return null;

  const getPhaseLabel = (phase: string) => {
    switch(phase) {
      case 'phase_1': return 'Recent data (45 days)';
      case 'phase_2': return 'Extended data (3 months)';
      case 'phase_3': return 'Historical data (6 months)';
      case 'phase_4': return 'Full history (18 months)';
      default: return 'Syncing...';
    }
  };

  const getTimeRemaining = () => {
    if (!syncStatus.estimated_completion_time) return null;
    const remaining = Math.ceil((new Date(syncStatus.estimated_completion_time).getTime() - Date.now()) / 1000);
    if (remaining < 0) return null;
    if (remaining < 60) return `~${remaining}s`;
    return `~${Math.ceil(remaining / 60)}m`;
  };

  return (
    <Card className="p-4 mb-4 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-semibold text-foreground">Syncing Your Financial Data</span>
          </div>
          <span className="text-sm font-medium text-primary">
            {syncStatus.progress_percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <Progress value={syncStatus.progress_percentage} className="h-2" />

        {/* Email Count & Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span>{syncStatus.emails_processed || 0} / {syncStatus.total_emails_found || 0} emails</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>{syncStatus.transactions_found || 0} transactions</span>
          </div>
        </div>

        {/* Current Phase */}
        <div className="text-sm text-muted-foreground">
          <strong className="text-foreground">{getPhaseLabel(syncStatus.sync_phase)}</strong>
          {syncStatus.current_status && ` • ${syncStatus.current_status}`}
        </div>

        {/* Phase Indicators */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            {syncStatus.phase_1_complete ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : syncStatus.sync_phase === 'phase_1' ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={syncStatus.phase_1_complete ? 'text-green-600 dark:text-green-400' : ''}>
              Recent data (45 days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus.phase_2_complete ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : syncStatus.sync_phase === 'phase_2' ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={syncStatus.phase_2_complete ? 'text-green-600 dark:text-green-400' : ''}>
              Extended data (3 months)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus.phase_3_complete ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : syncStatus.sync_phase === 'phase_3' ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={syncStatus.phase_3_complete ? 'text-green-600 dark:text-green-400' : ''}>
              Historical data (6 months)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus.phase_4_complete ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : syncStatus.sync_phase === 'phase_4' ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={syncStatus.phase_4_complete ? 'text-green-600 dark:text-green-400' : ''}>
              Full history (18 months)
            </span>
          </div>
        </div>

        {/* Estimated Time */}
        {getTimeRemaining() && (
          <div className="text-xs text-muted-foreground text-right">
            Estimated time remaining: {getTimeRemaining()}
          </div>
        )}

        {/* Error Display */}
        {syncStatus.error_message && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {syncStatus.error_message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};
