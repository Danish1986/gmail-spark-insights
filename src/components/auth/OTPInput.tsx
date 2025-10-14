import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OTPInputProps {
  phone: string;
  isSignUp: boolean;
  onVerified: () => void;
  onBack: () => void;
}

const TEST_OTP = "198608";

// Convert phone to email format for mock auth
const phoneToEmail = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, "");
  return `${cleanPhone}@growi.app`;
};

export const OTPInput = ({ phone, isSignUp, onVerified, onBack }: OTPInputProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode: string) => {
    setLoading(true);
    try {
      // Always use mock auth - check if OTP matches test OTP
      if (otpCode === TEST_OTP) {
        // Mock authentication - sign in with email format
        const email = phoneToEmail(phone);
        const password = phone; // Use phone as password
        
        // Try to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If sign in fails, user doesn't exist, sign them up
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (signUpError) throw signUpError;
        }
        
        toast.success("Phone verified successfully!");
        onVerified();
      } else {
        toast.error("Invalid OTP. Please use: " + TEST_OTP);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(60);
    toast.success("OTP resent! Use: " + TEST_OTP);
  };

  const maskedPhone = phone.replace(/(\+\d{2})(\d{5})(\d{5})/, "$1 $2 $3");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Enter verification code</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to {maskedPhone}
        </p>
      </div>

      {/* Always show test OTP hint */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500">
          🔧 Test Mode
        </p>
        <p className="text-xs text-yellow-600/80 dark:text-yellow-500/80 mt-1">
          Test OTP: <span className="font-mono font-bold">{TEST_OTP}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className="w-12 h-14 text-center text-2xl font-semibold bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => handleVerify(otp.join(""))}
            disabled={otp.some((d) => !d) || loading}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            {resendCooldown > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend OTP in {resendCooldown}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
              >
                Didn't receive? Resend OTP
              </button>
            )}
          </div>

          <button
            onClick={onBack}
            disabled={loading}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to phone number
          </button>
        </div>
      </div>
    </div>
  );
};
