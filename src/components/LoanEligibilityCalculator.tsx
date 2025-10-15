import { useState, useEffect } from "react";
import { Calculator, Briefcase, CreditCard, TrendingUp, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface LoanEligibilityCalculatorProps {
  existingEMI: number;
  balanceTransferEnabled: boolean;
  transferredEMI?: number;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const LoanEligibilityCalculator = ({ 
  existingEMI, 
  balanceTransferEnabled,
  transferredEMI = 0 
}: LoanEligibilityCalculatorProps) => {
  const [salary, setSalary] = useState(80000);
  const EMI_PER_LAKH = 2124; // EMI per ₹1,00,000 for 5-year tenure
  
  // Calculate based on balance transfer status
  const effectiveEMI = balanceTransferEnabled ? (existingEMI - transferredEMI) : existingEMI;
  const maxEMICapacity = salary * 0.7; // 70% of salary
  const availableEMICapacity = maxEMICapacity - effectiveEMI;
  const maxLoanPossible = (availableEMICapacity / EMI_PER_LAKH) * 100000;

  return (
    <div className="bg-card rounded-2xl p-3 shadow-sm border border-border mb-3">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="h-4 w-4 text-blue-500" />
        <h2 className="text-sm font-bold text-foreground">Loan Eligibility Calculator</h2>
      </div>

      {/* Salary Input */}
      <div className="mb-3">
        <Label htmlFor="salary" className="text-xs text-muted-foreground mb-1 block">
          Monthly Salary
        </Label>
        <Input
          id="salary"
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="h-9 text-sm"
        />
      </div>

      {/* Calculated Values Display */}
      <div className="space-y-2">
        <div className="bg-white dark:bg-white/5 border border-border rounded-lg p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Salary</span>
            </div>
            <div className="text-sm font-bold text-foreground">{formatINR(salary)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-border rounded-lg p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Existing EMI</span>
            </div>
            <div className="text-sm font-bold text-foreground">{formatINR(effectiveEMI)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-border rounded-lg p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Available EMI Capacity</span>
            </div>
            <div className="text-sm font-bold text-foreground">{formatINR(availableEMICapacity)}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="font-semibold">Max Loan Possible</span>
            </div>
            <div className="text-base font-bold text-green-600 dark:text-green-400">{formatINR(maxLoanPossible)}</div>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-2 text-xs text-muted-foreground">
        <p>Based on 70% of salary as max EMI capacity and 5-year tenure @ market rates.</p>
      </div>
    </div>
  );
};
