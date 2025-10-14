import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "./PhoneInput";
import { OTPInput } from "./OTPInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Sparkles, Shield, CheckCircle2 } from "lucide-react";

type WizardStep = "phone" | "otp" | "profile" | "email-consent" | "completing";

export const OnboardingWizard = () => {
  console.log('🚀 OnboardingWizard mounted');
  console.log('Environment:', {
    dev: import.meta.env.DEV,
    hostname: window.location.hostname,
    href: window.location.href
  });
  
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>("phone");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setPhone(phoneNumber);
    setStep("otp");
  };

  const handleOTPVerified = async () => {
    // Ultra-robust dev mode detection with logging
    const isDev = import.meta.env.DEV || 
                  window.location.hostname === 'localhost' ||
                  window.location.hostname.includes('lovable.app') ||
                  window.location.hostname.includes('127.0.0.1');
    
    console.log('🔍 Dev mode check:', {
      isDev,
      mode: import.meta.env.DEV,
      hostname: window.location.hostname,
      url: window.location.href
    });
    
    if (isDev) {
      console.log('🔧 Dev mode: Bypassing auth, going directly to dashboard');
      // Set a flag so we know this is a dev session
      sessionStorage.setItem('dev_mode_active', 'true');
      navigate("/dashboard", { replace: true });
      return;
    }
    
    // Production flow
    console.log('📝 Production mode: Continuing to profile setup');
    setStep("profile");
  };

  const handleProfileSubmit = async () => {
    const isDev = sessionStorage.getItem('dev_mode_active') === 'true';
    
    if (isDev) {
      console.log('🔧 Dev mode profile bypass');
      navigate("/dashboard", { replace: true });
      return;
    }

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      toast.error("Taking too long - please try again");
      setLoading(false);
    }, 10000);

    try {
      // Parallel fetches for speed
      const [userResult, emailCheckResult] = await Promise.all([
        supabase.auth.getUser(),
        (async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return { data: null };
          return supabase
            .from("email_accounts")
            .select("*")
            .eq("user_id", user.id)
            .eq("provider", "google")
            .maybeSingle();
        })()
      ]);

      const { data: { user } } = userResult;
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          terms_accepted: termsAccepted,
          terms_accepted_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      clearTimeout(timeoutId);

      if (emailCheckResult.data) {
        // Gmail already connected, skip to dashboard
        navigate("/dashboard");
      } else {
        // Show email consent screen
        setStep("email-consent");
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailConsent = async (consentGiven: boolean) => {
    const isDev = sessionStorage.getItem('dev_mode_active') === 'true';
    
    if (isDev) {
      console.log('🔧 Dev mode: Skipping OAuth entirely');
      navigate("/dashboard", { replace: true });
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      toast.error("Connection timeout - please try again");
      setLoading(false);
      setStep("email-consent");
    }, 12000);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      if (consentGiven) {
        // Update consent in profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            email_consent: true,
            email_consent_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (profileError) throw profileError;

        clearTimeout(timeoutId);
        setStep("completing");

        // Initiate Google OAuth with Gmail scopes
        const redirectUrl = `${window.location.origin}/auth/callback`;
        
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
            scopes: "email profile https://www.googleapis.com/auth/gmail.readonly",
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (oauthError) throw oauthError;
      } else {
        clearTimeout(timeoutId);
        // User skipped Gmail connection
        navigate("/dashboard");
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Email consent error:", error);
      toast.error(error.message || "Failed to process consent");
      setLoading(false);
    }
  };

  if (step === "phone") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Welcome to Growi</h2>
          <p className="text-muted-foreground">
            Let's get you started with smart money management
          </p>
        </div>
        <PhoneInput onSuccess={handlePhoneSubmit} />
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Verify your number</h2>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to {phone}
          </p>
        </div>
        <OTPInput phone={phone} onSuccess={handleOTPVerified} />
      </div>
    );
  }

  if (step === "profile") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
          <p className="text-muted-foreground">
            We'll use this to personalize your experience
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the terms and conditions
            </Label>
          </div>

          <Button
            onClick={handleProfileSubmit}
            disabled={loading || !termsAccepted}
            size="lg"
            className="w-full"
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    );
  }

  if (step === "email-consent") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold">Connect your email</h2>
          <p className="text-muted-foreground">
            Get automatic insights from your bank transaction emails
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Smart Transaction Detection</h4>
                <p className="text-sm text-muted-foreground">
                  We automatically read bank transaction emails to track your spending
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Privacy Protected</h4>
                <p className="text-sm text-muted-foreground">
                  We only read financial transaction emails, not your personal conversations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Always in Control</h4>
                <p className="text-sm text-muted-foreground">
                  You can disconnect your email anytime from settings
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleEmailConsent(true)}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? "Connecting..." : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Connect Email Account
              </>
            )}
          </Button>

          <Button
            onClick={() => handleEmailConsent(false)}
            disabled={loading}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            Skip for now
          </Button>
        </div>
      </div>
    );
  }

  if (step === "completing") {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Connecting to Google...</h2>
          <p className="text-muted-foreground">
            You'll be redirected to complete the authorization
          </p>
        </div>
      </div>
    );
  }

  return null;
};
