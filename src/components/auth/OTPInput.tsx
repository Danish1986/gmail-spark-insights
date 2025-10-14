import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OTPInputProps {
  phone: string;
  onSuccess: () => void;
}

export const OTPInput = ({ phone, onSuccess }: OTPInputProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
    if (value && index === 5) {
      const otpCode = [...newOtp.slice(0, 5), value].join("");
      if (otpCode.length === 6) {
        setTimeout(() => handleVerify(otpCode), 100);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      // Development mode bypass - accept hardcoded OTP (localhost + preview)
      const isDev = import.meta.env.DEV || 
                    window.location.hostname === 'localhost' ||
                    window.location.hostname.includes('lovable.app');
      
      if (isDev) {
        // Dev mode: Check for hardcoded OTP
        if (code === "198608") {
          // Fast: Create instant anonymous session (no network delay)
          const { error } = await supabase.auth.signInAnonymously({
            options: {
              data: {
                phone: phone,
                full_name: 'Dev User',
                dev_mode: true,
              }
            }
          });

          if (error) throw error;

          toast.success("Phone verified successfully! (Dev mode)");
          onSuccess();
        } else {
          toast.error("Invalid OTP. Use 198608 for development");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } else {
        // Production mode: Real Supabase OTP verification
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: code,
          type: "sms",
        });

        if (error) throw error;

        toast.success("Phone verified successfully!");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      setOtp(["", "", "", "", "", ""]);
      setResendTimer(30);
      inputRefs.current[0]?.focus();
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Enter verification code
        </h1>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit code to<br />
          <span className="font-medium text-foreground">{phone}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="space-y-6">
        <div className="flex gap-2 justify-between">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold"
              disabled={loading}
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button 
          onClick={() => handleVerify()} 
          disabled={loading || otp.join("").length !== 6}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        {/* Resend OTP */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-muted-foreground">
              Didn't receive code? Resend in <span className="font-medium text-foreground">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm font-medium text-primary hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
