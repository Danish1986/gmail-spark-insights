import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Building2, Lightbulb, ArrowDown, User, Car, Home, Briefcase, LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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
  const [selectedPeriod, setSelectedPeriod] = useState<{[key: string]: number}>({});
  const iconInfo = getLoanIcon(loanType);

  // Initialize selected period for each loan (default to min of remaining tenure or 12)
  useState(() => {
    const initial = loans.reduce((acc, loan) => ({
      ...acc,
      [loan.id]: Math.min(loan.remainingTenure || 12, 12)
    }), {});
    setSelectedPeriod(initial);
  });

  const handleApply = () => {
    toast({
      title: "Application Submitted!",
      description: "We'll contact you shortly to complete the balance transfer process.",
    });
  };

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
              const totalSavings = loan.monthlySavings! * loan.remainingTenure!;
              const period = selectedPeriod[loan.id] || 12;

              return (
                <div key={loan.id} className="space-y-3">
                  {loan.hasOffer ? (
                    // Loans WITH offers - Interest Optimizer pattern
                    <>
                      {/* 1. Top Savings Banner */}
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                        <Lightbulb className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <div className="text-sm">
                          <span className="font-semibold text-foreground">Switch to save </span>
                          <span className="text-red-500 font-bold">{formatINR(totalSavings)}</span>
                          <span className="font-semibold text-foreground"> over {loan.remainingTenure} months</span>
                        </div>
                      </div>

                      {/* 2. CURRENT Loan Card */}
                      <div className="bg-background rounded-2xl p-4 border border-border">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase mb-1">CURRENT</div>
                            <div className="font-bold text-lg text-foreground">{loan.lender}</div>
                            <div className="text-sm text-muted-foreground capitalize">{loanType} Loan</div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-red-500">{loan.roi}%</div>
                            <div className="text-xs text-muted-foreground">p.a.</div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Amount: {formatINR(loan.amount)} • EMI: {formatINR(loan.emi)}/mo
                        </div>
                      </div>

                      {/* 3. Transfer Indicator */}
                      <div className="flex items-center justify-center py-2">
                        <div className="flex items-center gap-2 text-blue-500 font-semibold text-sm">
                          <ArrowDown className="h-5 w-5" />
                          <span>Transfer for Better Rate</span>
                        </div>
                      </div>

                      {/* 4. RECOMMENDED Offer Card */}
                      <div className="bg-background rounded-2xl p-4 border border-green-500/30">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase mb-1">RECOMMENDED</div>
                            <div className="font-bold text-lg text-foreground">Better Finance</div>
                            <div className="text-sm text-muted-foreground capitalize">{loanType} Loan</div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-500">{loan.proposedROI}%</div>
                            <div className="text-xs text-muted-foreground">p.a.</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-foreground mb-2">
                          Will pay: {formatINR(loan.proposedEMI!)}/mo • 
                          <span className="text-green-500"> +{formatINR(loan.monthlySavings!)} saved/mo</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">✓ Lower EMI</Badge>
                          <Badge variant="secondary" className="text-xs">✓ Same tenure</Badge>
                        </div>
                      </div>

                      {/* 5. Impact Over Time Section */}
                      <div className="bg-gray-100 rounded-2xl p-4">
                        <h4 className="font-semibold text-foreground mb-3 text-sm">Impact Over Time</h4>
                        
                        {/* Period Selector */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[3, 6, 12].map((months) => (
                            <button
                              key={months}
                              onClick={() => setSelectedPeriod({ ...selectedPeriod, [loan.id]: months })}
                              className={`py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                                period === months
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-foreground border border-border'
                              }`}
                            >
                              {months}M
                            </button>
                          ))}
                        </div>

                        {/* Savings Projection */}
                        <div className="space-y-2">
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-muted-foreground">Current EMI total:</span>
                            <span className="font-semibold text-foreground">{formatINR(loan.emi * period)}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-muted-foreground">With balance transfer:</span>
                            <span className="font-semibold text-foreground">{formatINR(loan.proposedEMI! * period)}</span>
                          </div>
                          <div className="flex justify-between py-3 bg-green-50 rounded-lg px-3 border border-green-200">
                            <span className="text-sm font-semibold text-foreground">Extra you'll save:</span>
                            <span className="font-bold text-green-600">+{formatINR(loan.monthlySavings! * period)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <Button onClick={handleApply} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        Apply for Balance Transfer
                      </Button>
                    </>
                  ) : (
                    // Loans WITHOUT offers - Simple card view
                    <div className="bg-background rounded-2xl p-4 border border-border shadow-sm">
                      {/* Loan Header */}
                      <div className="flex items-start justify-between mb-4">
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
                      </div>

                      {/* Loan Details Grid */}
                      <div className="space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Loan Amount</div>
                            <div className="text-xl font-bold text-foreground">{formatINR(loan.amount)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">ROI</div>
                            <div className="text-xl font-bold text-foreground">{loan.roi}% <span className="text-sm font-normal text-muted-foreground">p.a.</span></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">EMI Amount</div>
                            <div className="text-xl font-bold text-foreground">{formatINR(loan.emi)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Tenure</div>
                            <div className="text-xl font-bold text-foreground">{loan.tenure} <span className="text-sm font-normal text-muted-foreground">months</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Progress */}
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-sm text-muted-foreground">Repayment Progress</span>
                          <span className="text-sm font-bold text-foreground">
                            {loan.paidTenure}/{loan.tenure} months ({paymentProgress.toFixed(0)}%)
                          </span>
                        </div>
                        <Progress value={paymentProgress} className="h-2.5" />
                      </div>
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
