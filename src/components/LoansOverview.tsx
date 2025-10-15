import { ChevronRight, Wallet, Car, Home, User, Briefcase } from "lucide-react";

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
  loanType?: string;
  allLoans?: {
    personal: Loan[];
    auto: Loan[];
    home: Loan[];
    overdraft?: Loan[];
  };
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getLoanIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "auto": return <Car className="h-3.5 w-3.5" />;
    case "home": return <Home className="h-3.5 w-3.5" />;
    case "personal": return <User className="h-3.5 w-3.5" />;
    case "overdraft": return <Briefcase className="h-3.5 w-3.5" />;
    default: return <Wallet className="h-3.5 w-3.5" />;
  }
};

const getLoanEmoji = (type: string) => {
  switch (type.toLowerCase()) {
    case "auto": return "🚗";
    case "home": return "🏠";
    case "personal": return "👤";
    case "overdraft": return "💼";
    default: return "💰";
  }
};

export const LoansOverview = ({ loans, onClick, loanType = "personal", allLoans }: LoansOverviewProps) => {
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.amount, 0);
  
  // Calculate totals for all categories
  const categoryTotals = allLoans ? {
    personal: allLoans.personal.reduce((sum, loan) => sum + loan.amount, 0),
    auto: allLoans.auto.reduce((sum, loan) => sum + loan.amount, 0),
    home: allLoans.home.reduce((sum, loan) => sum + loan.amount, 0),
    overdraft: (allLoans.overdraft || []).reduce((sum, loan) => sum + loan.amount, 0),
  } : null;
  
  const grandTotal = categoryTotals 
    ? categoryTotals.personal + categoryTotals.auto + categoryTotals.home + categoryTotals.overdraft
    : totalOutstanding;
  
  const totalLoansCount = allLoans 
    ? allLoans.personal.length + allLoans.auto.length + allLoans.home.length + (allLoans.overdraft || []).length
    : loans.length;

  return (
    <div>
      <div className="w-full bg-card rounded-2xl p-3 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Loans Overview</h2>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <div className="text-xs text-muted-foreground">Total Outstanding</div>
          <div className="text-xl font-bold text-foreground">{formatINR(grandTotal)}</div>
        </div>

        <div className="text-xs text-muted-foreground">
          Total of {totalLoansCount} active {totalLoansCount === 1 ? 'loan' : 'loans'}
        </div>
      </div>

    </div>
  );
};
