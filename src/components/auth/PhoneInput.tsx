import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PhoneInputProps {
  onOTPSent: (phone: string) => void;
}

export const PhoneInput = ({ onOTPSent }: PhoneInputProps) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast({
        title: "OTP sent successfully",
        description: "Please check your phone for the verification code",
      });
      
      onOTPSent(formattedPhone);
    } catch (error: any) {
      toast({
        title: "Error sending OTP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 bg-muted rounded-md border border-input">
            <span className="text-sm">+91</span>
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            maxLength={10}
            className="flex-1"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSendOTP} 
        disabled={loading || phone.length !== 10}
        className="w-full"
        size="lg"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </div>
  );
};
