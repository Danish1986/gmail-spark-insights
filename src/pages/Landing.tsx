import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background flex flex-col items-center justify-between px-6 py-8">
      {/* Top Section - Branding */}
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Illustration Area */}
        <div className="relative">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl">
            <TrendingUp className="w-20 h-20 text-primary-foreground" strokeWidth={2.5} />
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-success/20 animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-status-blue/20 animate-pulse delay-75" />
        </div>

        {/* App Name & Tagline */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            FinanceTracker
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            It's your money. You be the expert.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="w-full space-y-3 pt-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>AI-powered financial insights</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Track income & expenses effortlessly</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Smart credit card recommendations</span>
          </div>
        </div>
      </div>

      {/* Bottom Section - CTA */}
      <div className="w-full max-w-md space-y-6">
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          size="lg"
          className="w-full h-14 text-lg font-semibold shadow-lg"
        >
          {loading ? (
            "Redirecting..."
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Sign in with Google
            </>
          )}
        </Button>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <p>Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;