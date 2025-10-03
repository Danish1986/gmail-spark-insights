import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Shield, Info } from "lucide-react";
import { toast } from "sonner";

const Landing = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    // Navigate to auth page with phone number
    setTimeout(() => {
      navigate("/auth", { state: { phone: `+91${phone}` } });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* App Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            FinanceTracker
          </h1>
          <p className="text-muted-foreground">
            AI-powered financial insights
          </p>
        </div>

        {/* Phone Input Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-center">
              Enter your mobile number
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              We'll send you an OTP to verify
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex items-center justify-center px-3 py-2 bg-muted rounded-md border border-input">
                <span className="text-sm font-medium">+91</span>
              </div>
              <Input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                className="flex-1 text-lg"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && phone.length === 10) {
                    handleSendOTP();
                  }
                }}
              />
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={phone.length !== 10 || loading}
              className="w-full text-base py-6"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            <button className="underline hover:text-foreground transition-colors">
              Why do we need your number?
            </button>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <p>Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
