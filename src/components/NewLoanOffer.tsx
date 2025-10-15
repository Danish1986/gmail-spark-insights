import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [isLoading] = useState(false);
  
  // Default values from backend
  const recommendedAmount = maxAmount / 2;
  const defaultTenure = 36;
  const displayEMI = calculateEMI(recommendedAmount, roi, defaultTenure);

  const handleApply = () => {
    toast({
      title: "Loan Application Submitted!",
      description: `We'll process your pre-approved offer for ${formatINR(maxAmount)} and contact you shortly.`,
    });
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl p-4 shadow-lg border-2 border-amber-500/20">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-bold text-foreground">New Loan Offer</h2>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Pre-Approved
        </div>
      </div>

      {/* Eligible Amount */}
      <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 mb-3">
        <div className="text-xs text-muted-foreground">Maximum Eligible</div>
        <div className="text-2xl font-bold text-foreground">{formatINR(maxAmount)}</div>
        <div className="text-xs text-amber-600 font-semibold">ROI: {roi}% p.a.</div>
      </div>

      {/* Display EMI - Backend calculated */}
      <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 mb-3">
        <div className="text-xs text-muted-foreground mb-2">Recommended Loan Details</div>
        
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <div className="text-xs text-muted-foreground">Amount</div>
            <div className="text-sm font-bold text-foreground">{formatINR(recommendedAmount)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Tenure</div>
            <div className="text-sm font-bold text-foreground">{defaultTenure} months</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-2.5 border border-green-500/20">
          <div className="text-xs text-muted-foreground">Estimated Monthly EMI</div>
          <div className="text-xl font-bold text-green-600">{formatINR(displayEMI)}</div>
          <div className="text-xs text-muted-foreground">Total: {formatINR(displayEMI * defaultTenure)}</div>
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 mb-3">
        <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">✓ You're Eligible!</div>
        <div className="space-y-0.5 text-xs text-gray-600 dark:text-gray-400">
          <div>• Min Income: {formatINR(eligibility.minIncome)}/mo</div>
          <div>• Min Score: {eligibility.minCreditScore}</div>
          <div>• Type: {eligibility.employmentType}</div>
        </div>
      </div>

      {/* Apply Button */}
      <Button 
        onClick={handleApply} 
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 py-2.5"
      >
        <Sparkles className="h-4 w-4 mr-1.5" />
        {isLoading ? "Processing..." : `Apply Now at ${roi}% ROI`}
      </Button>
      
      <div className="mt-2 text-center text-xs text-muted-foreground">
        Actual terms may vary based on verification
      </div>
    </div>
  );
};