import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "./PhoneInput";
import { OTPInput } from "./OTPInput";

type WizardStep = "phone" | "otp";

export const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>("phone");
  const [phone, setPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

  const handlePhoneSubmit = (phoneNumber: string, signUp: boolean) => {
    setPhone(phoneNumber);
    setIsSignUp(signUp);
    setStep("otp");
  };

  const handleOTPVerified = () => {
    navigate("/dashboard");
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

  return null;
};
