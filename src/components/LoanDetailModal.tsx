import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Building2, TrendingDown, Sparkles, User, Car, Home, Briefcase, LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BalanceTransferCalculator } from "./BalanceTransferCalculator";
import { useState } from "react";

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
  hasOffer: boolean;
  proposedROI?: number;
  proposedEMI?: number;
  monthlySavings?: number;
  remainingTenure?: number;
}

interface LoanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanType: string;
  loans: Loan[];
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getLoanIcon = (loanType: string): { Icon: LucideIcon; color: string; bgColor: string } => {
  switch(loanType.toLowerCase()) {
    case 'personal': return { Icon: User, color: 'text-blue-500', bgColor: 'bg-blue-500' };
    case 'auto': return { Icon: Car, color: 'text-purple-500', bgColor: 'bg-purple-500' };
    case 'home': return { Icon: Home, color: 'text-green-500', bgColor: 'bg-green-500' };
    case 'business': return { Icon: Briefcase, color: 'text-orange-500', bgColor: 'bg-orange-500' };
    default: return { Icon: Building2, color: 'text-gray-500', bgColor: 'bg-gray-500' };
  }
};

export const LoanDetailModal = ({ isOpen, onClose, loanType, loans }: LoanDetailModalProps) => {
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
  const iconInfo = getLoanIcon(loanType);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full h-full sm:w-[90%] sm:max-w-2xl p-0 flex flex-col"
      >
        <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
          <SheetTitle className="flex items-center gap-3 text-xl font-bold">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="capitalize">{loanType} Loans</span>
            {loans.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {loans.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {loans.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No active {loanType} loans
            </div>
          ) : (
            <div className="space-y-4">
            {loans.map((loan) => {
              const paymentProgress = (loan.paidTenure / loan.tenure) * 100;
              const isExpanded = expandedLoan === loan.id;

              return (
                <div key={loan.id} className="bg-background rounded-xl p-5 border border-border shadow-sm">
                  {/* Loan Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl ${iconInfo.bgColor} flex items-center justify-center`}>
                        <iconInfo.Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-foreground">{loan.lender}</div>
                        <div className="text-xs text-muted-foreground">
                          Started {new Date(loan.startDate).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    {loan.hasOffer && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white gap-1 px-3 py-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        Better Offer
                      </Badge>
                    )}
                  </div>

                  {/* Loan Details Grid */}
                  <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1.5">Loan Amount</div>
                        <div className="text-xl font-bold text-foreground">{formatINR(loan.amount)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1.5">ROI</div>
                        <div className="text-xl font-bold text-foreground">{loan.roi}% p.a.</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1.5">EMI Amount</div>
                        <div className="text-xl font-bold text-foreground">{formatINR(loan.emi)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1.5">Tenure</div>
                        <div className="text-xl font-bold text-foreground">{loan.tenure} months</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-muted-foreground">Repayment Progress</span>
                      <span className="text-sm font-bold text-foreground">
                        {loan.paidTenure}/{loan.tenure} months ({paymentProgress.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={paymentProgress} className="h-2.5" />
                  </div>

                  {/* Balance Transfer Offer */}
                  {loan.hasOffer && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-6 rounded-xl"
                        onClick={() => setExpandedLoan(isExpanded ? null : loan.id)}
                      >
                        <TrendingDown className="h-5 w-5" />
                        View Balance Transfer Offer
                      </Button>

                      {isExpanded && (
                        <div className="mt-4">
                          <BalanceTransferCalculator
                            currentROI={loan.roi}
                            currentEMI={loan.emi}
                            proposedROI={loan.proposedROI!}
                            proposedEMI={loan.proposedEMI!}
                            monthlySavings={loan.monthlySavings!}
                            remainingMonths={loan.remainingTenure!}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
