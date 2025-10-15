import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface BalanceTransferCalculatorProps {
  currentROI: number;
  currentEMI: number;
  proposedROI: number;
  proposedEMI: number;
  monthlySavings: number;
  remainingMonths: number;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateFDReturns = (monthlyAmount: number, months: number, rate: number = 0.07) => {
  const monthlyRate = rate / 12;
  const futureValue = monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(futureValue);
};

const calculateMFReturns = (monthlyAmount: number, months: number, rate: number = 0.10) => {
  const monthlyRate = rate / 12;
  const futureValue = monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(futureValue);
};

export const BalanceTransferCalculator = ({
  currentROI,
  currentEMI,
  proposedROI,
  proposedEMI,
  monthlySavings,
  remainingMonths,
}: BalanceTransferCalculatorProps) => {
  const totalSavings = monthlySavings * remainingMonths;
  const fdReturns = calculateFDReturns(monthlySavings, remainingMonths);
  const mfReturns = calculateMFReturns(monthlySavings, remainingMonths);

  const handleApply = () => {
    toast({
      title: "Application Submitted!",
      description: "We'll contact you shortly to complete the balance transfer process.",
    });
  };

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
      {/* Comparison Table */}
      <div className="bg-background rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Rate Comparison
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Current ROI</div>
            <div className="text-2xl font-bold text-red-500">{currentROI}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Proposed ROI</div>
            <div className="text-2xl font-bold text-green-500">{proposedROI}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Current EMI</div>
            <div className="text-lg font-semibold text-foreground">{formatINR(currentEMI)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Proposed EMI</div>
            <div className="text-lg font-semibold text-green-500">{formatINR(proposedEMI)}</div>
          </div>
        </div>
        
        <div className="bg-green-500/10 rounded-lg p-3 mt-3">
          <div className="text-xs text-muted-foreground mb-1">Monthly Savings</div>
          <div className="text-2xl font-bold text-green-500">{formatINR(monthlySavings)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Total savings over {remainingMonths} months: {formatINR(totalSavings)}
          </div>
        </div>
      </div>

      {/* Investment Projection */}
      <div className="bg-background rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-500" />
          Invest Your Savings
        </h4>
        
        <Tabs defaultValue="fd" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fd">Fixed Deposit (7%)</TabsTrigger>
            <TabsTrigger value="mf">Mutual Funds (10%)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fd" className="space-y-3">
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
              <div className="text-sm text-muted-foreground mb-2">
                Monthly Investment: {formatINR(monthlySavings)} × {remainingMonths} months
              </div>
              <div className="text-xs text-muted-foreground mb-1">Future Value @ 7% p.a.</div>
              <div className="text-3xl font-bold text-blue-500">{formatINR(fdReturns)}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Total Invested: {formatINR(totalSavings)}
              </div>
              <div className="text-xs font-semibold text-green-500 mt-1">
                Returns: {formatINR(fdReturns - totalSavings)}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mf" className="space-y-3">
            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
              <div className="text-sm text-muted-foreground mb-2">
                Monthly Investment: {formatINR(monthlySavings)} × {remainingMonths} months
              </div>
              <div className="text-xs text-muted-foreground mb-1">Future Value @ 10% p.a.</div>
              <div className="text-3xl font-bold text-purple-500">{formatINR(mfReturns)}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Total Invested: {formatINR(totalSavings)}
              </div>
              <div className="text-xs font-semibold text-green-500 mt-1">
                Returns: {formatINR(mfReturns - totalSavings)}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-amber-500/10 rounded-lg p-3 mt-3 border border-amber-500/20">
          <div className="text-xs font-semibold text-amber-600">💡 Smart Tip</div>
          <div className="text-xs text-muted-foreground mt-1">
            By investing your monthly savings of {formatINR(monthlySavings)}, you could earn an additional{" "}
            {formatINR(mfReturns - totalSavings)} through mutual funds!
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <Button onClick={handleApply} className="w-full gap-2">
        <Sparkles className="h-4 w-4" />
        Apply for Balance Transfer
      </Button>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);
