import { X, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";

interface InterestSource {
  bank: string;
  accountType: string;
  avgBalance: number;
  interestRate: number;
  monthlyInterest: number;
  annualInterest: number;
}

interface RecommendedAccount {
  id: string;
  bank: string;
  accountType: string;
  interestRate: number;
  features: string[];
  incrementalGain: {
    "3M": number;
    "6M": number;
    "12M": number;
    "24M": number;
    "36M": number;
  };
}

interface InterestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    "1M": number;
    "3M": number;
    "6M": number;
    "12M": number;
    sources: InterestSource[];
    recommendedAccounts: RecommendedAccount[];
    totalParkedFunds: number;
  };
}

export const InterestDetailModal = ({ isOpen, onClose, data }: InterestDetailModalProps) => {
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "12M">("3M");
  const [calcPeriod, setCalcPeriod] = useState<"3M" | "6M" | "12M" | "24M" | "36M">("12M");

  if (!isOpen) return null;

  const currentInterest = data[period];
  const primaryAccount = data.sources[0];
  const bestAccount = data.recommendedAccounts[0];
  const secondBestAccount = data.recommendedAccounts[1];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">Interest Income + Optimizer</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Interest ({period})</div>
            <div className="text-2xl font-bold">₹{Math.round(currentInterest).toLocaleString("en-IN")}</div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["1M", "3M", "6M", "12M"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Current Interest Sources */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Interest Sources</h3>
            {data.sources.map((source, idx) => (
              <div key={idx} className="bg-card rounded-xl p-3 border">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <div className="font-semibold text-sm">{source.bank}</div>
                    <div className="text-xs text-muted-foreground">{source.accountType}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{Math.round(source.annualInterest).toLocaleString("en-IN")}/yr</div>
                    <div className="text-xs text-muted-foreground">{source.interestRate}% p.a.</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg Balance: ₹{Math.round(source.avgBalance).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          {/* Optimization Alert */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <div className="font-bold text-destructive">💡 You're Losing Money on Low-Interest Accounts!</div>
                <div className="text-sm">
                  <div className="mb-1">Your {primaryAccount.bank} has:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-background/50 rounded-lg p-2">
                    <div>
                      <div className="text-muted-foreground">Average Balance</div>
                      <div className="font-semibold">₹{Math.round(primaryAccount.avgBalance).toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Interest Rate</div>
                      <div className="font-semibold">{primaryAccount.interestRate}% p.a.</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Annual Interest</div>
                      <div className="font-semibold">₹{Math.round(primaryAccount.annualInterest).toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium">🎯 RECOMMENDED: Move to High-Interest Accounts</div>
              </div>
            </div>
          </div>

          {/* Recommended Accounts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Recommended High-Interest Accounts</h3>
            
            {/* Best Account */}
            <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-lg font-bold">🏆 {bestAccount.bank}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{bestAccount.accountType}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">{bestAccount.interestRate}%</div>
                  <div className="text-xs text-muted-foreground">p.a.</div>
                </div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <div className="text-muted-foreground">Potential Annual Interest</div>
                    <div className="font-bold text-success">₹{Math.round((primaryAccount.avgBalance * bestAccount.interestRate) / 100).toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Incremental Gain</div>
                    <div className="font-bold text-success">+₹{Math.round(bestAccount.incrementalGain["12M"]).toLocaleString("en-IN")}/year</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold mb-1">Features:</div>
                {bestAccount.features.map((feature, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Second Best Account */}
            <div className="bg-card border rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-lg font-bold">🏆 {secondBestAccount.bank}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{secondBestAccount.accountType}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{secondBestAccount.interestRate}%</div>
                  <div className="text-xs text-muted-foreground">p.a.</div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <div className="text-muted-foreground">Potential Annual Interest</div>
                    <div className="font-bold">₹{Math.round((primaryAccount.avgBalance * secondBestAccount.interestRate) / 100).toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Incremental Gain</div>
                    <div className="font-bold">+₹{Math.round(secondBestAccount.incrementalGain["12M"]).toLocaleString("en-IN")}/year</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold mb-1">Features:</div>
                {secondBestAccount.features.map((feature, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impact Calculator */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
            <div className="font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              💰 Opportunity Cost Calculator
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {(["3M", "6M", "12M", "24M", "36M"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setCalcPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    calcPeriod === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="bg-background rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold mb-2">In {calcPeriod}:</div>
              
              <div className="flex items-center justify-between py-1.5 border-b border-border">
                <div className="text-xs text-muted-foreground">You earned (Current):</div>
                <div className="font-semibold">₹{Math.round(primaryAccount.annualInterest * (parseInt(calcPeriod) / 12)).toLocaleString("en-IN")}</div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border">
                <div className="text-xs text-muted-foreground">With {bestAccount.bank} ({bestAccount.interestRate}%):</div>
                <div className="font-semibold text-success">
                  ₹{Math.round((primaryAccount.avgBalance * bestAccount.interestRate / 100) * (parseInt(calcPeriod) / 12)).toLocaleString("en-IN")}
                  <span className="text-xs ml-1">(+₹{Math.round(bestAccount.incrementalGain[calcPeriod]).toLocaleString("en-IN")})</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <div className="text-xs text-muted-foreground">With {secondBestAccount.bank} ({secondBestAccount.interestRate}%):</div>
                <div className="font-semibold text-primary">
                  ₹{Math.round((primaryAccount.avgBalance * secondBestAccount.interestRate / 100) * (parseInt(calcPeriod) / 12)).toLocaleString("en-IN")}
                  <span className="text-xs ml-1">(+₹{Math.round(secondBestAccount.incrementalGain[calcPeriod]).toLocaleString("en-IN")})</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold">💸 You missed out on:</div>
                  <div className="text-lg font-bold text-destructive">
                    ₹{Math.round(bestAccount.incrementalGain[calcPeriod]).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="bg-muted/50 rounded-xl p-3">
            <div className="text-xs font-semibold mb-2">💡 SMART RECOMMENDATIONS</div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div>• Keep ₹50,000 in {primaryAccount.bank} for daily expenses</div>
              <div>• Move ₹{Math.round((primaryAccount.avgBalance - 50000)).toLocaleString("en-IN")} to {bestAccount.bank} for better returns</div>
              <div>• Maintain emergency fund of ₹2L in liquid account</div>
              <div>• Consider sweeping excess to FD for even higher rates</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
