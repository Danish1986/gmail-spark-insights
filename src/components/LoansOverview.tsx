import { ChevronRight, Wallet } from "lucide-react";

interface Loan {
  id: string;
  lender: string;
  lenderLogo: string;
  amount: number;
  tenure: number;
  roi: number;
  emi: number;
  paidTenure: number;
  startDate: string;
  hasOffer?: boolean;
  proposedROI?: number;
  proposedEMI?: number;
  monthlySavings?: number;
  remainingTenure?: number;
}

interface LoansOverviewProps {
  loans: Loan[];
  onClick: () => void;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const LoansOverview = ({ loans, onClick }: LoansOverviewProps) => {
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.amount, 0);

  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-2xl p-3 shadow-sm border border-border mb-3 hover:shadow-md transition-all active:scale-[0.98] text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-purple-500" />
          <h2 className="text-sm font-bold text-foreground">Loans Overview</h2>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-xs text-muted-foreground">Total Outstanding</div>
        <div className="text-xl font-bold text-foreground">{formatINR(totalOutstanding)}</div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Wallet className="h-3 w-3" />
        <span>Personal Loans ({loans.length})</span>
      </div>
    </button>
  );
};
