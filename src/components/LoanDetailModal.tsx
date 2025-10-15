import { Building2, Lightbulb, ArrowRight, User, Car, Home, Briefcase, LucideIcon, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { BalanceTransferToggles } from "./BalanceTransferToggles";

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
  proposedLender?: string;
  proposedLenderLogo?: string;
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
  const [personalLoanEnabled, setPersonalLoanEnabled] = useState(true);
  const [creditCardsEnabled, setCreditCardsEnabled] = useState(false);
  const [extraCashEnabled, setExtraCashEnabled] = useState(false);
  const [extraCashAmount, setExtraCashAmount] = useState(0);
  
  const iconInfo = getLoanIcon(loanType);
  
  const loansWithOffers = loans.filter(loan => loan.hasOffer);
  const totalCurrentEMI = loansWithOffers.reduce((sum, loan) => sum + loan.emi, 0);
  
  // Calculate dynamic loan amount based on toggles
  const baseLoanAmount = loansWithOffers.reduce((sum, loan) => sum + loan.amount, 0);
  const creditCardAmount = creditCardsEnabled ? 50000 : 0; // Mock credit card amount
  const totalLoanAmount = (personalLoanEnabled ? baseLoanAmount : 0) + creditCardAmount + (extraCashEnabled ? extraCashAmount : 0);
  
  // Recalculate EMI based on total amount (simplified calculation)
  const baseConsolidatedEMI = loansWithOffers.length > 0 && loansWithOffers[0].proposedEMI ? loansWithOffers[0].proposedEMI : 0;
  const consolidatedEMI = personalLoanEnabled ? baseConsolidatedEMI : 0;
  const adjustedConsolidatedEMI = consolidatedEMI + (creditCardAmount + (extraCashEnabled ? extraCashAmount : 0)) * 0.015; // ~1.5% of additional amount
  
  const consolidatedROI = loansWithOffers.length > 0 && loansWithOffers[0].proposedROI ? loansWithOffers[0].proposedROI : 0;
  const totalMonthlySavings = totalCurrentEMI - adjustedConsolidatedEMI;
  const maxRemainingTenure = Math.max(...loansWithOffers.map(loan => loan.remainingTenure || 12));

  // Initialize selected period for each loan (default to max remaining tenure)
  useState(() => {
    const initial = loans.reduce((acc, loan) => ({
      ...acc,
      [loan.id]: loan.remainingTenure || 12
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
            {loansWithOffers.length > 0 && (
              <div className="relative group">
                <Lightbulb className="h-4 w-4 text-amber-500 animate-pulse" />
              </div>
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
            {/* Balance Transfer Toggles - only show if there are loans with offers */}
            {loansWithOffers.length > 0 && (
              <BalanceTransferToggles
                onTogglePersonalLoan={setPersonalLoanEnabled}
                onToggleCreditCards={setCreditCardsEnabled}
                onToggleExtraCash={(enabled, amount) => {
                  setExtraCashEnabled(enabled);
                  setExtraCashAmount(amount);
                }}
                personalLoanEnabled={personalLoanEnabled}
                creditCardsEnabled={creditCardsEnabled}
                extraCashEnabled={extraCashEnabled}
              />
            )}
            
            {/* Show consolidation message if multiple loans */}
            {loansWithOffers.length > 1 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="text-xs font-semibold">
                    Consolidating {loansWithOffers.length} loans into 1 single loan with better terms
                  </div>
                </div>
              </div>
            )}

            {loans.map((loan, index) => {
              const paymentProgress = (loan.paidTenure / loan.tenure) * 100;
              const totalSavings = loansWithOffers.length > 1 
                ? totalMonthlySavings * maxRemainingTenure
                : (loan.monthlySavings! * loan.remainingTenure!);
              const period = loansWithOffers.length > 1 
                ? (selectedPeriod['consolidated'] || maxRemainingTenure)
                : (selectedPeriod[loan.id] || loan.remainingTenure || 12);

              return (
                <div key={loan.id} className="space-y-3">
                  {loan.hasOffer ? (
                    // Loans WITH offers - Interest Optimizer pattern
                    <>
                      {/* 1. Top Savings Banner - only show for first loan or single loan */}
                      {(loansWithOffers.length === 1 || loans.indexOf(loan) === 0) && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-destructive flex-shrink-0" />
                            <div className="text-xs font-semibold">
                              Switch to save <span className="text-destructive">{formatINR(totalSavings)}</span> over {loansWithOffers.length > 1 ? maxRemainingTenure : loan.remainingTenure} months
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. CURRENT Loan Card */}
                      <div className="bg-card border rounded-lg p-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {loan.lenderLogo && (
                              <img src={loan.lenderLogo} alt={loan.lender} className="h-6 w-6 rounded object-contain" />
                            )}
                            <div>
                              <div className="text-[10px] text-muted-foreground">CURRENT</div>
                              <div className="text-sm font-bold">{loan.lender}</div>
                              <div className="text-[10px] text-muted-foreground capitalize">{loanType} Loan</div>
                            </div>
                          </div>
                          <div className="text-center px-2 py-1 bg-destructive/10 rounded">
                            <div className="text-lg font-bold text-destructive">{loan.roi}%</div>
                            <div className="text-[9px] text-muted-foreground">p.a.</div>
                          </div>
                        </div>
                      <div className="space-y-1.5 mt-2">
                        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 text-[11px]">
                          <div className="text-muted-foreground">Amount:</div>
                          <div className="font-semibold text-foreground">{formatINR(loan.amount)}</div>
                          
                          <div className="text-muted-foreground">EMI:</div>
                          <div className="font-semibold text-foreground">{formatINR(loan.emi)}/mo</div>
                          
                          <div className="text-muted-foreground">Tenure left:</div>
                          <div className="font-semibold text-foreground">{loan.remainingTenure || loan.tenure - loan.paidTenure} of {loan.tenure} months</div>
                        </div>
                      </div>
                      </div>

                      {/* Visual "+" connector between loans */}
                      {loan.hasOffer && loansWithOffers.length > 1 && index < loansWithOffers.length - 1 && (
                        <div className="flex items-center justify-center py-1">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-medium text-primary">+</span>
                          </div>
                        </div>
                      )}

                      {/* Show transfer indicator only for last loan with offer or single loan */}
                      {(loansWithOffers.length === 1 || loans.indexOf(loan) === loansWithOffers.length - 1) && (
                        <>
                          {/* 3. Transfer Indicator */}
                          <div className="flex items-center justify-center gap-2 py-1">
                            <div className="flex-1 h-px bg-border" />
                            <div className="flex items-center gap-1 text-xs font-medium text-primary">
                              <ArrowRight className="h-3 w-3" />
                              {loansWithOffers.length > 1 ? 'Consolidate & Transfer 100%' : 'Transfer 100%'}
                            </div>
                            <div className="flex-1 h-px bg-border" />
                          </div>

                          {/* 4. RECOMMENDED Offer Card */}
                          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/30 rounded-lg p-2.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                {(loan.proposedLenderLogo || loan.lenderLogo) && (
                                  <img 
                                    src={loan.proposedLenderLogo || loan.lenderLogo} 
                                    alt={loan.proposedLender || 'Better Finance'} 
                                    className="h-6 w-6 rounded object-contain" 
                                  />
                                )}
                                <div>
                                  <div className="text-[10px] text-green-600 font-semibold">RECOMMENDED</div>
                                  <div className="text-sm font-bold">{loan.proposedLender || 'Better Finance'}</div>
                                  <div className="text-[10px] text-muted-foreground capitalize">
                                    {loansWithOffers.length > 1 ? 'Consolidated Loan' : `${loanType} Loan`}
                                  </div>
                                </div>
                              </div>
                              <div className="text-center px-2 py-1 bg-green-500/20 rounded">
                                <div className="text-lg font-bold text-green-600">
                                  {loansWithOffers.length > 1 ? consolidatedROI : loan.proposedROI}%
                                </div>
                                <div className="text-[9px] text-muted-foreground">p.a.</div>
                              </div>
                            </div>
                          <div className="mt-2">
                            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 text-[11px]">
                              <div className="text-muted-foreground">Total amount:</div>
                              <div className="font-semibold text-green-600">{formatINR(totalLoanAmount)}</div>
                              
                              <div className="font-medium text-green-600">New EMI:</div>
                              <div className="font-semibold text-green-600">
                                {formatINR(Math.round(loansWithOffers.length > 1 ? adjustedConsolidatedEMI : loan.proposedEMI!))}/mo
                              </div>
                              
                              <div className="font-medium text-green-600">You save:</div>
                              <div className="font-semibold text-green-600">
                                +{formatINR(Math.round(loansWithOffers.length > 1 ? totalMonthlySavings : loan.monthlySavings!))}/mo
                              </div>
                            </div>
                          </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="text-[9px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">
                                ✓ Lower EMI
                              </span>
                              {loansWithOffers.length > 1 && (
                                <span className="text-[9px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">
                                  ✓ Single loan
                                </span>
                              )}
                              <span className="text-[9px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">
                                ✓ Better rate
                              </span>
                            </div>
                          </div>

                          {/* 5. Impact Over Time Section */}
                          <div className="bg-muted/50 rounded-lg p-2.5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs font-semibold">Impact Over Time</div>
                              <div className="text-xs font-bold text-primary">{period}M</div>
                            </div>
                            
                            {/* Enhanced Tenure Slider */}
                            <div className="mb-3 px-1">
                              <div className="relative">
                                <Slider
                                  value={[period]}
                                  onValueChange={(value) => {
                                    if (loansWithOffers.length > 1) {
                                      setSelectedPeriod({ ...selectedPeriod, 'consolidated': value[0] });
                                    } else {
                                      setSelectedPeriod({ ...selectedPeriod, [loan.id]: value[0] });
                                    }
                                  }}
                                  min={1}
                                  max={loansWithOffers.length > 1 ? maxRemainingTenure : (loan.remainingTenure || 12)}
                                  step={1}
                                  className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-md [&_.relative]:h-2"
                                />
                              </div>
                              <div className="flex justify-between mt-1.5">
                                <span className="text-[9px] text-muted-foreground font-medium">1M</span>
                                <span className="text-[9px] text-muted-foreground font-medium">
                                  {loansWithOffers.length > 1 ? maxRemainingTenure : (loan.remainingTenure || 12)}M (Max)
                                </span>
                              </div>
                            </div>

                            {/* Savings Projection */}
                            <div className="space-y-1.5 text-[11px]">
                              <div className="flex items-center justify-between py-1 border-b border-border">
                                <div className="text-muted-foreground">Current EMI total:</div>
                                <div className="font-semibold transition-all duration-300">
                                  {formatINR(Math.round((loansWithOffers.length > 1 ? totalCurrentEMI : loan.emi) * period))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-1 border-b border-border">
                                <div className="text-muted-foreground">With balance transfer:</div>
                                <div className="font-semibold text-green-600 transition-all duration-300">
                                  {formatINR(Math.round((loansWithOffers.length > 1 ? adjustedConsolidatedEMI : loan.proposedEMI!) * period))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-1.5 bg-green-500/10 rounded px-2 -mx-2">
                                <div className="font-semibold">Extra you'll save:</div>
                                <div className="font-bold text-green-600 transition-all duration-300">
                                  +{formatINR(Math.round((loansWithOffers.length > 1 ? totalMonthlySavings : loan.monthlySavings!) * period))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-[9px] text-muted-foreground text-center">
                              Savings shown are based on the selected remaining tenure
                            </div>
                          </div>

                          {/* Apply Button - only show once */}
                          <Button onClick={handleApply} className="w-full text-sm py-2">
                            Apply for Balance Transfer
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    // Loans WITHOUT offers - Simple card view
                    <div className="bg-card border rounded-lg p-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {loan.lenderLogo && (
                            <img src={loan.lenderLogo} alt={loan.lender} className="h-6 w-6 rounded object-contain" />
                          )}
                          <div>
                            <div className="text-sm font-bold">{loan.lender}</div>
                            <div className="text-[10px] text-muted-foreground capitalize">{loanType} Loan</div>
                          </div>
                        </div>
                        <div className="text-center px-2 py-1 bg-primary/10 rounded">
                          <div className="text-lg font-bold text-primary">{loan.roi}%</div>
                          <div className="text-[9px] text-muted-foreground">p.a.</div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 text-[11px]">
                          <div className="text-muted-foreground">Loan Amount:</div>
                          <div className="font-semibold">{formatINR(loan.amount)}</div>
                          
                          <div className="text-muted-foreground">EMI:</div>
                          <div className="font-semibold">{formatINR(loan.emi)}/mo</div>
                          
                          <div className="text-muted-foreground">Tenure:</div>
                          <div className="font-semibold">{loan.tenure} months</div>
                          
                          <div className="text-muted-foreground">Tenure left:</div>
                          <div className="font-semibold">{loan.remainingTenure || loan.tenure - loan.paidTenure} months</div>
                          
                          <div className="text-muted-foreground">Progress:</div>
                          <div className="font-semibold">{loan.paidTenure}/{loan.tenure} months</div>
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
