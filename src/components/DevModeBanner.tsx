import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DevModeBanner = () => {
  const isDev = import.meta.env.DEV || 
                window.location.hostname === 'localhost' ||
                window.location.hostname.includes('lovableproject.com') ||
                window.location.hostname.includes('lovable.app');

  if (!isDev) return null;

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-0 bg-yellow-500/10 border-yellow-500/20">
      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-600 dark:text-yellow-400 text-xs font-medium">
        🔧 Development Mode - OTP bypass active (use: 198608)
      </AlertDescription>
    </Alert>
  );
};
