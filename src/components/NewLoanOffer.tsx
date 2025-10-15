import { useState } from "react";
import { Gift, Calculator, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface NewLoanOfferProps {
  maxAmount: number;
  roi: number;
  eligibility: {
    minIncome: number;
    minCreditScore: number;
    employmentType: string;
  };
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateEMI = (principal: number, rate: number, months: number) => {
  const monthlyRate = rate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
};

export const NewLoanOffer = ({ maxAmount, roi, eligibility }: NewLoanOfferProps) => {
  const [loanAmount, setLoanAmount] = useState(maxAmount / 2);
  const [tenure, setTenure] = useState("36");

  const emi = calculateEMI(loanAmount, roi, parseInt(tenure));

  const handleApply = () => {
    toast({
      title: "Loan Application Submitted!",
      description: `We'll process your application for ${formatINR(loanAmount)} and contact you shortly.`,
    });
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl p-6 shadow-lg border-2 border-amber-500/20">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-amber-500" />
          <h2 className="text-lg font-bold text-foreground">New Loan Offer</h2>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Pre-Approved
        </div>
      </div>

      {/* Eligible Amount */}
      <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 mb-4">
        <div className="text-sm text-muted-foreground mb-1">Maximum Eligible Amount</div>
        <div className="text-3xl font-bold text-foreground">{formatINR(maxAmount)}</div>
        <div className="text-sm text-amber-600 font-semibold mt-1">Special ROI: {roi}% p.a.</div>
      </div>

      {/* EMI Calculator */}
      <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Calculate Your EMI</span>
        </div>

        {/* Loan Amount Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Loan Amount</span>
            <span className="font-semibold text-foreground">{formatINR(loanAmount)}</span>
          </div>
          <Slider
            value={[loanAmount]}
            onValueChange={(value) => setLoanAmount(value[0])}
            min={50000}
            max={maxAmount}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>₹50k</span>
            <span>{formatINR(maxAmount)}</span>
          </div>
        </div>

        {/* Tenure Selector */}
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">Tenure</div>
          <Select value={tenure} onValueChange={setTenure}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
              <SelectItem value="36">36 months</SelectItem>
              <SelectItem value="48">48 months</SelectItem>
              <SelectItem value="60">60 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calculated EMI */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
          <div className="text-xs text-muted-foreground mb-1">Monthly EMI</div>
          <div className="text-2xl font-bold text-green-500">{formatINR(emi)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Total Payment: {formatINR(emi * parseInt(tenure))}
          </div>
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
        <div className="text-xs font-semibold text-blue-600 mb-2">✓ You're Eligible!</div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>• Minimum Income: {formatINR(eligibility.minIncome)}/month</div>
          <div>• Minimum Credit Score: {eligibility.minCreditScore}</div>
          <div>• Employment Type: {eligibility.employmentType}</div>
        </div>
      </div>

      {/* Apply Button */}
      <Button onClick={handleApply} className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
        <Sparkles className="h-4 w-4" />
        Apply Now at {roi}% ROI
      </Button>
    </div>
  );
};
