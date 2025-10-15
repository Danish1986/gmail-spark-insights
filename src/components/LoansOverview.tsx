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

  return (
    <div>
      <button
        onClick={onClick}
        className="w-full bg-card rounded-2xl p-3 shadow-sm border border-border hover:shadow-md transition-all active:scale-[0.98] text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Loans Overview</h2>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div className="text-xs text-muted-foreground">Total Outstanding</div>
          <div className="text-xl font-bold text-foreground">{formatINR(grandTotal)}</div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          {getLoanIcon(loanType)}
          <span className="capitalize">{loanType} Loans ({loans.length})</span>
        </div>
      </button>

      {/* 4-Block Category Summary */}
      {categoryTotals && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-background rounded-xl p-2.5 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{getLoanEmoji("personal")}</span>
              <span className="text-xs font-semibold text-foreground">Personal</span>
            </div>
            <div className="text-sm font-bold text-foreground">{formatINR(categoryTotals.personal)}</div>
            <div className="text-xs text-muted-foreground">{allLoans?.personal.length || 0} loans</div>
          </div>

          <div className="bg-background rounded-xl p-2.5 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{getLoanEmoji("auto")}</span>
              <span className="text-xs font-semibold text-foreground">Auto</span>
            </div>
            <div className="text-sm font-bold text-foreground">{formatINR(categoryTotals.auto)}</div>
            <div className="text-xs text-muted-foreground">{allLoans?.auto.length || 0} loans</div>
          </div>

          <div className="bg-background rounded-xl p-2.5 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{getLoanEmoji("home")}</span>
              <span className="text-xs font-semibold text-foreground">Home</span>
            </div>
            <div className="text-sm font-bold text-foreground">{formatINR(categoryTotals.home)}</div>
            <div className="text-xs text-muted-foreground">{allLoans?.home.length || 0} loans</div>
          </div>

          <div className="bg-background rounded-xl p-2.5 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{getLoanEmoji("overdraft")}</span>
              <span className="text-xs font-semibold text-foreground">Others</span>
            </div>
            <div className="text-sm font-bold text-foreground">{formatINR(categoryTotals.overdraft)}</div>
            <div className="text-xs text-muted-foreground">{allLoans?.overdraft.length || 0} items</div>
          </div>
        </div>
      )}
    </div>
  );
};
