import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OTPInput } from "@/components/auth/OTPInput";
import { TermsModal } from "@/components/auth/TermsModal";
import { EmailConsentScreen } from "@/components/auth/EmailConsentScreen";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type AuthStep = "phone" | "otp" | "terms" | "email-consent" | "google-signin";

const Auth = () => {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [skipConsent, setSkipConsent] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const progress = {
    phone: 20,
    otp: 40,
    terms: 60,
    "email-consent": 80,
    "google-signin": 100,
  };

  const handleBack = () => {
    const steps: AuthStep[] = ["phone", "otp", "terms", "email-consent", "google-signin"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    } else {
      navigate("/");
    }
  };

  const handleOTPSent = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setStep("otp");
  };

  const handleOTPVerified = async () => {
    // Update profile with terms acceptance
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }
    setStep("terms");
  };

  const handleTermsAccepted = () => {
    setStep("email-consent");
  };

  const handleEmailConsent = async (skip: boolean) => {
    setSkipConsent(skip);
    
    // Update profile with email consent
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({
          email_consent: !skip,
          email_consent_at: skip ? null : new Date().toISOString(),
        })
        .eq("id", user.id);
    }
    
    setStep("google-signin");
  };

  const handleResendOTP = async () => {
    // Resend OTP logic is handled in OTPInput component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="max-w-md mx-auto mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {Object.keys(progress).indexOf(step) + 1} of 5</span>
              <span>{progress[step]}%</span>
            </div>
            <Progress value={progress[step]} className="h-2" />
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {step === "phone" && <PhoneInput onOTPSent={handleOTPSent} />}
            
            {step === "otp" && (
              <OTPInput 
                phone={phone} 
                onVerified={handleOTPVerified}
                onResend={handleResendOTP}
              />
            )}
            
            {step === "terms" && <TermsModal onAccept={handleTermsAccepted} />}
            
            {step === "email-consent" && (
              <EmailConsentScreen onConsent={handleEmailConsent} />
            )}
            
            {step === "google-signin" && (
              <GoogleSignIn 
                phone={phone}
                fullName={fullName}
                skipConsent={skipConsent}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
