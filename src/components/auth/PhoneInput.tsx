import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhoneInputProps {
  onSuccess: (phone: string) => Promise<void>;
}

export const PhoneInput = ({ onSuccess }: PhoneInputProps) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true); // Pre-checked

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast.success("OTP sent successfully!");
      await onSuccess(formattedPhone);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          What's your mobile number?
        </h1>
        <p className="text-sm text-muted-foreground">
          Use your PAN linked mobile number
        </p>
      </div>

      {/* Phone Input */}
      <div className="space-y-6">
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-16 h-12 bg-secondary rounded-lg border border-border">
              <span className="text-sm font-medium text-foreground">+91</span>
            </div>
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
              className="flex-1 h-12 text-base"
              disabled={loading}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && phone.length === 10 && termsAccepted) {
                  handleSendOTP();
                }
              }}
            />
          </div>
        </div>

        {/* Terms & Conditions */}
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
            I agree to FinanceTracker's{" "}
            <span className="text-primary underline">Terms & Conditions</span> and{" "}
            <span className="text-primary underline">Privacy Policy</span>. I also agree to
            receive important updates and assistance via WhatsApp, SMS or call.
          </label>
        </div>

        {/* Send OTP Button */}
        <Button
          onClick={handleSendOTP}
          disabled={phone.length !== 10 || !termsAccepted || loading}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </div>
    </div>
  );
};
