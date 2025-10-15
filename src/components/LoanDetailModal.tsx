import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Building2, TrendingDown, Sparkles } from "lucide-react";
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

export const LoanDetailModal = ({ isOpen, onClose, loanType, loans }: LoanDetailModalProps) => {
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);

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
            <div className="space-y-3">
            {loans.map((loan) => {
              const paymentProgress = (loan.paidTenure / loan.tenure) * 100;
              const isExpanded = expandedLoan === loan.id;

              return (
                <div key={loan.id} className="bg-muted/20 rounded-lg p-3 border border-border/50">
                  {/* Loan Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={loan.lenderLogo}
                        alt={loan.lender}
                        className="h-10 w-10 rounded-lg object-contain bg-white p-1"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${loan.lender}&background=random`;
                        }}
                      />
                      <div>
                        <div className="font-bold text-base">{loan.lender}</div>
                        <div className="text-xs text-muted-foreground">
                          Started {new Date(loan.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {loan.hasOffer && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white gap-1">
                        <Sparkles className="h-3 w-3" />
                        Better Offer
                      </Badge>
                    )}
                  </div>

                  {/* Loan Details Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Loan Amount</div>
                      <div className="text-base font-semibold">{formatINR(loan.amount)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">ROI</div>
                      <div className="text-base font-semibold">{loan.roi}% p.a.</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">EMI Amount</div>
                      <div className="text-base font-semibold">{formatINR(loan.emi)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Tenure</div>
                      <div className="text-base font-semibold">{loan.tenure} months</div>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Repayment Progress</span>
                      <span className="font-semibold text-foreground">
                        {loan.paidTenure}/{loan.tenure} months ({paymentProgress.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={paymentProgress} className="h-2" />
                  </div>

                  {/* Balance Transfer Offer */}
                  {loan.hasOffer && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setExpandedLoan(isExpanded ? null : loan.id)}
                      >
                        <TrendingDown className="h-4 w-4" />
                        {isExpanded ? "Hide" : "View"} Balance Transfer Offer
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
