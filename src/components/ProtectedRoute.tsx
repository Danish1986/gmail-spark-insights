import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading, initialized } = useAuth();
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    // If not initialized after 10 seconds, show recovery UI
    const timer = setTimeout(() => {
      if (!initialized) {
        setShowRecovery(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [initialized]);

  if (showRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Taking longer than expected</h1>
            <p className="text-muted-foreground">
              The app is having trouble loading. Please try refreshing.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Reload App
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/auth';
              }}
              className="w-full"
            >
              Clear Cache & Sign In Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if profile is incomplete
  if (user && profile && !profile.full_name) {
    return <Navigate to="/auth" state={{ profileIncomplete: true }} replace />;
  }

  return <>{children}</>;
};
