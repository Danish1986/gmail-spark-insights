import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

interface GoogleSignInProps {
  phone: string;
  fullName: string;
  skipConsent: boolean;
}

export const GoogleSignIn = ({ phone, fullName, skipConsent }: GoogleSignInProps) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: skipConsent 
            ? "email profile" 
            : "email profile https://www.googleapis.com/auth/gmail.readonly",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Almost there!</h3>
        <p className="text-muted-foreground">
          Sign in with Google to complete your setup
        </p>
      </div>

      <Button 
        onClick={handleGoogleSignIn} 
        disabled={loading}
        variant="outline"
        size="lg"
        className="w-full"
      >
        {loading ? (
          "Redirecting..."
        ) : (
          <>
            <Mail className="w-5 h-5 mr-2" />
            Continue with Google
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By continuing, you agree to link your Google account with phone: {phone}
      </p>
    </div>
  );
};
