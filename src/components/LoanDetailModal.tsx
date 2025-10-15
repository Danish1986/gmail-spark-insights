import { Building2, Lightbulb, ArrowRight, User, Car, Home, Briefcase, LucideIcon, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" 
        onClick={onClose} 
      />
      
      {/* Bottom Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom max-w-md mx-auto left-0 right-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-3 py-2.5 flex items-center justify-between z-10 rounded-t-xl">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="capitalize">{loanType} Loans</span>
            {loans.length > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                {loans.length}
              </Badge>
            )}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {loans.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              No active {loanType} loans
            </div>
          ) : (
            <>
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
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-destructive flex-shrink-0" />
                          <div className="text-xs font-semibold">
                            Switch to save <span className="text-destructive">{formatINR(totalSavings)}</span> over {loan.remainingTenure} months
                          </div>
                        </div>
                      </div>

                      {/* 2. CURRENT Loan Card */}
                      <div className="bg-card border rounded-lg p-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <div className="text-[10px] text-muted-foreground">CURRENT</div>
                            <div className="text-sm font-bold">{loan.lender}</div>
                            <div className="text-[10px] text-muted-foreground capitalize">{loanType} Loan</div>
                          </div>
                          <div className="text-center px-2 py-1 bg-destructive/10 rounded">
                            <div className="text-lg font-bold text-destructive">{loan.roi}%</div>
                            <div className="text-[9px] text-muted-foreground">p.a.</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Amount: {formatINR(loan.amount)} • EMI: {formatINR(loan.emi)}/mo
                        </div>
                      </div>

                      {/* 3. Transfer Indicator */}
                      <div className="flex items-center justify-center gap-2 py-1">
                        <div className="flex-1 h-px bg-border" />
                        <div className="flex items-center gap-1 text-xs font-medium text-primary">
                          <ArrowRight className="h-3 w-3" />
                          Transfer 100%
                        </div>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      {/* 4. RECOMMENDED Offer Card */}
                      <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/30 rounded-lg p-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <div className="text-[10px] text-green-600 font-semibold">RECOMMENDED</div>
                            <div className="text-sm font-bold">Better Finance</div>
                            <div className="text-[10px] text-muted-foreground capitalize">{loanType} Loan</div>
                          </div>
                          <div className="text-center px-2 py-1 bg-green-500/20 rounded">
                            <div className="text-lg font-bold text-green-600">{loan.proposedROI}%</div>
                            <div className="text-[9px] text-muted-foreground">p.a.</div>
                          </div>
                        </div>
                        <div className="text-[10px] font-medium text-green-600">
                          Will pay: {formatINR(loan.proposedEMI!)}/mo • +{formatINR(loan.monthlySavings!)} saved/mo
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-[9px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">
                            ✓ Lower EMI
                          </span>
                          <span className="text-[9px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">
                            ✓ Same tenure
                          </span>
                        </div>
                      </div>

                      {/* 5. Impact Over Time Section */}
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-semibold">Impact Over Time</div>
                          <div className="text-xs font-bold text-primary">{period}M</div>
                        </div>
                        
                        {/* Tenure Slider */}
                        <div className="mb-3 px-1">
                          <Slider
                            value={[period]}
                            onValueChange={(value) => setSelectedPeriod({ ...selectedPeriod, [loan.id]: value[0] })}
                            min={1}
                            max={loan.remainingTenure || 12}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-[9px] text-muted-foreground">1M</span>
                            <span className="text-[9px] text-muted-foreground">{loan.remainingTenure || 12}M</span>
                          </div>
                        </div>

                        {/* Savings Projection */}
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between py-1 border-b border-border">
                            <div className="text-muted-foreground">Current EMI total:</div>
                            <div className="font-semibold transition-all duration-300">{formatINR(loan.emi * period)}</div>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-border">
                            <div className="text-muted-foreground">With balance transfer:</div>
                            <div className="font-semibold text-green-600 transition-all duration-300">{formatINR(loan.proposedEMI! * period)}</div>
                          </div>
                          <div className="flex items-center justify-between py-1.5 bg-green-500/10 rounded px-2 -mx-2">
                            <div className="font-semibold">Extra you'll save:</div>
                            <div className="font-bold text-green-600 transition-all duration-300">+{formatINR(loan.monthlySavings! * period)}</div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-[9px] text-muted-foreground text-center">
                          Savings shown are based on the selected remaining tenure
                        </div>
                      </div>

                      {/* Apply Button */}
                      <Button onClick={handleApply} className="w-full text-sm py-2">
                        Apply for Balance Transfer
                      </Button>
                    </>
                  ) : (
                    // Loans WITHOUT offers - Simple card view
                    <div className="bg-card border rounded-lg p-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <div className="text-sm font-bold">{loan.lender}</div>
                          <div className="text-[10px] text-muted-foreground capitalize">{loanType} Loan</div>
                        </div>
                        <div className="text-center px-2 py-1 bg-primary/10 rounded">
                          <div className="text-lg font-bold text-primary">{loan.roi}%</div>
                          <div className="text-[9px] text-muted-foreground">p.a.</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">Loan Amount:</span>
                          <span className="font-semibold">{formatINR(loan.amount)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">EMI:</span>
                          <span className="font-semibold">{formatINR(loan.emi)}/mo</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">Tenure:</span>
                          <span className="font-semibold">{loan.tenure} months</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Progress:</span>
                          <span className="font-semibold">{loan.paidTenure}/{loan.tenure} months</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </>
          )}
        </div>
      </div>
    </>
  );
};
