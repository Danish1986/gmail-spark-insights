import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl capitalize">
            <Building2 className="h-6 w-6 text-primary" />
            {loanType} Loans
          </DialogTitle>
        </DialogHeader>

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
                <div key={loan.id} className="bg-muted/30 rounded-xl p-4 border border-border">
                  {/* Loan Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={loan.lenderLogo}
                        alt={loan.lender}
                        className="h-10 w-10 rounded-lg object-contain bg-white p-1"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${loan.lender}&background=random`;
                        }}
                      />
                      <div>
                        <div className="font-semibold text-foreground">{loan.lender}</div>
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
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-background rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Loan Amount</div>
                      <div className="text-lg font-bold text-foreground">{formatINR(loan.amount)}</div>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">ROI</div>
                      <div className="text-lg font-bold text-foreground">{loan.roi}% p.a.</div>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">EMI Amount</div>
                      <div className="text-lg font-bold text-foreground">{formatINR(loan.emi)}</div>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Tenure</div>
                      <div className="text-lg font-bold text-foreground">{loan.tenure} months</div>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Repayment Progress</span>
                      <span className="font-semibold text-foreground">
                        {loan.paidTenure}/{loan.tenure} months ({paymentProgress.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={paymentProgress} className="h-2" />
                  </div>

                  {/* Balance Transfer Offer */}
                  {loan.hasOffer && (
                    <div className="mt-4">
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
      </DialogContent>
    </Dialog>
  );
};
