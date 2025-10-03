import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OTPInput } from "@/components/auth/OTPInput";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type AuthStep = "phone" | "otp";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleOTPSent = (phone: string) => {
    setPhone(phone);
    setStep("otp");
  };

  const handleOTPVerified = () => {
    navigate("/dashboard");
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Back Button */}
      <div className="safe-top px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-8">
        <div className="w-full max-w-md">
          {step === "phone" && <PhoneInput onOTPSent={handleOTPSent} />}
          {step === "otp" && (
            <OTPInput
              phone={phone}
              onVerified={handleOTPVerified}
              onResend={async () => {
                // Resend logic handled in OTPInput component
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
