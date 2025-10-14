import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhoneInputProps {
  onSuccess: (phone: string, isSignUp: boolean) => void;
}

const DEV_MODE = import.meta.env.DEV;

// Convert phone to email format for mock auth
const phoneToEmail = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, "");
  return `${cleanPhone}@growi.app`;
};

export const PhoneInput = ({ onSuccess }: PhoneInputProps) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSignUp, setIsSignUp] = useState(true);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{5})(\d{0,5})/, "$1 $2").trim();
    }
    return numbers.slice(0, 10).replace(/(\d{5})(\d{5})/, "$1 $2");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async () => {
    const phoneDigits = phone.replace(/\D/g, "");
    
    if (phoneDigits.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!termsAccepted && isSignUp) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    const fullPhone = `+91${phoneDigits}`;
    setLoading(true);

    try {
      if (DEV_MODE) {
        // Mock mode: Create user with email/password format
        const email = phoneToEmail(fullPhone);
        const password = fullPhone; // Use phone as password
        
        if (isSignUp) {
          // Check if user already exists
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                phone: fullPhone,
              }
            }
          });
          
          if (signUpError && !signUpError.message.includes("already registered")) {
            throw signUpError;
          }
        }
        
        toast.success("OTP sent to your phone (Use: 198608)");
        onSuccess(fullPhone, isSignUp);
      } else {
        // Production: Real phone OTP
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({
            phone: fullPhone,
            password: crypto.randomUUID(),
          });

          if (error) throw error;
          toast.success("OTP sent to your phone");
          onSuccess(fullPhone, true);
        } else {
          const { error } = await supabase.auth.signInWithOtp({
            phone: fullPhone,
          });

          if (error) throw error;
          toast.success("OTP sent to your phone");
          onSuccess(fullPhone, false);
        }
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isSignUp ? "sign up" : "sign in"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignUp ? "Get started with smart money management" : "Sign in to continue"}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Phone Number</label>
          <div className="flex gap-2">
            <div className="flex items-center justify-center w-16 h-12 bg-secondary rounded-md border border-border">
              <span className="text-sm font-medium">+91</span>
            </div>
            <Input
              type="tel"
              placeholder="98765 43210"
              value={phone}
              onChange={handlePhoneChange}
              className="h-12 flex-1"
              disabled={loading}
              autoFocus
              maxLength={11}
              onKeyDown={(e) => {
                if (e.key === "Enter" && phone.replace(/\D/g, "").length === 10) {
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>

        {isSignUp && (
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none"
            >
              I agree to Growi's{" "}
              <span className="text-primary underline">Terms & Conditions</span> and{" "}
              <span className="text-primary underline">Privacy Policy</span>
            </label>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={phone.replace(/\D/g, "").length !== 10 || (isSignUp && !termsAccepted) || loading}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          {loading ? "Sending OTP..." : (isSignUp ? "Send OTP & Sign Up" : "Send OTP & Sign In")}
        </Button>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};
