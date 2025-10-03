import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        const platform = Capacitor.getPlatform();
        console.log('[GoogleAuth] Platform:', platform);
        
        if (platform === 'android' || platform === 'ios') {
          console.log('[GoogleAuth] Initializing...');
          await GoogleAuth.initialize({
            clientId: '775297343977-l6k6f1sah7q52f3t9oam1lvlognrt892.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
          });
          console.log('[GoogleAuth] ✅ Initialization complete');
        }
      } catch (error) {
        console.error('[GoogleAuth] ❌ Initialization failed:', error);
        toast.error('Failed to initialize Google Sign-In');
      }
    };
    
    initializeGoogleAuth();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const platform = Capacitor.getPlatform();
      console.log('[GoogleAuth] Starting sign-in...');
      
      if (platform === 'android' || platform === 'ios') {
        console.log('[GoogleAuth] Calling GoogleAuth.signIn()...');
        const googleUser = await GoogleAuth.signIn();
        console.log('[GoogleAuth] Sign-in successful, got user');
        
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: googleUser.authentication.idToken,
        });

        if (error) throw error;
        
        navigate("/dashboard");
      } else {
        // Web OAuth flow for browsers
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
          },
        });

        if (error) throw error;
      }
    } catch (error: any) {
      console.error('[GoogleAuth] Sign-in error:', error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
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