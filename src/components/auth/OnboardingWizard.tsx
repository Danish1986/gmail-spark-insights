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

type WizardStep = "phone" | "otp" | "profile";

export const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>("phone");
  const [phone, setPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = (phoneNumber: string, signUp: boolean) => {
    setPhone(phoneNumber);
    setIsSignUp(signUp);
    setStep("otp");
  };

  const handleOTPVerified = () => {
    if (isSignUp) {
      setStep("profile");
    } else {
      navigate("/dashboard");
    }
  };

  const handleProfileSubmit = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
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

      // Profile saved, go to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  if (step === "phone") {
    return <PhoneInput onSuccess={handlePhoneSubmit} />;
  }

  if (step === "otp") {
    return (
      <OTPInput 
        phone={phone} 
        isSignUp={isSignUp}
        onVerified={handleOTPVerified}
        onBack={() => setStep("phone")}
      />
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

  return null;
};
