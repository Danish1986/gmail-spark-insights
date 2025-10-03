import { X, ArrowRight, Lightbulb } from "lucide-react";
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
  const [calcPeriod, setCalcPeriod] = useState<"3M" | "6M" | "12M">("12M");

  if (!isOpen) return null;

  const primaryAccount = data.sources[0];
  const bestAccount = data.recommendedAccounts[0];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom max-w-md mx-auto left-0 right-0">
        <div className="sticky top-0 bg-background border-b px-3 py-2.5 flex items-center justify-between z-10">
          <h2 className="text-base font-bold">Interest Optimizer</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Alert Banner */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-destructive flex-shrink-0" />
              <div className="text-xs font-semibold">
                Switch to earn <span className="text-destructive">₹{Math.round(bestAccount.incrementalGain["12M"]).toLocaleString("en-IN")}</span> more/year
              </div>
            </div>
          </div>

          {/* Current vs Recommended */}
          <div className="space-y-2">
            {/* Current Account */}
            <div className="bg-card border rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <div className="text-[10px] text-muted-foreground">CURRENT</div>
                  <div className="text-sm font-bold">{primaryAccount.bank}</div>
                  <div className="text-[10px] text-muted-foreground">{primaryAccount.accountType}</div>
                </div>
                <div className="text-center px-2 py-1 bg-destructive/10 rounded">
                  <div className="text-lg font-bold text-destructive">{primaryAccount.interestRate}%</div>
                  <div className="text-[9px] text-muted-foreground">p.a.</div>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground">
                Balance: ₹{Math.round(primaryAccount.avgBalance).toLocaleString("en-IN")} • Earning: ₹{Math.round(primaryAccount.annualInterest).toLocaleString("en-IN")}/yr
              </div>
            </div>

            {/* Transfer Arrow */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="flex-1 h-px bg-border" />
              <div className="flex items-center gap-1 text-xs font-medium text-primary">
                <ArrowRight className="h-3 w-3" />
                Transfer 100%
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Recommended Account */}
            <div className="bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <div className="text-[10px] text-success font-semibold">RECOMMENDED</div>
                  <div className="text-sm font-bold">{bestAccount.bank}</div>
                  <div className="text-[10px] text-muted-foreground">{bestAccount.accountType}</div>
                </div>
                <div className="text-center px-2 py-1 bg-success/20 rounded">
                  <div className="text-lg font-bold text-success">{bestAccount.interestRate}%</div>
                  <div className="text-[9px] text-muted-foreground">p.a.</div>
                </div>
              </div>
              <div className="text-[10px] font-medium text-success">
                Will earn: ₹{Math.round((primaryAccount.avgBalance * bestAccount.interestRate) / 100).toLocaleString("en-IN")}/yr • +₹{Math.round(bestAccount.incrementalGain["12M"]).toLocaleString("en-IN")} extra
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {bestAccount.features.slice(0, 2).map((feature, idx) => (
                  <span key={idx} className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Impact Calculator */}
          <div className="bg-muted/50 rounded-lg p-2.5">
            <div className="text-xs font-semibold mb-2">Impact Over Time</div>
            
            {/* Period Selector */}
            <div className="flex gap-1.5 mb-2">
              {(["3M", "6M", "12M"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setCalcPeriod(p)}
                  className={`flex-1 px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                    calcPeriod === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-border">
                <div className="text-muted-foreground">Current earning:</div>
                <div className="font-semibold">₹{Math.round(primaryAccount.annualInterest * (parseInt(calcPeriod) / 12)).toLocaleString("en-IN")}</div>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border">
                <div className="text-muted-foreground">With {bestAccount.bank}:</div>
                <div className="font-semibold text-success">
                  ₹{Math.round((primaryAccount.avgBalance * bestAccount.interestRate / 100) * (parseInt(calcPeriod) / 12)).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="flex items-center justify-between py-1.5 bg-success/10 rounded px-2 -mx-2">
                <div className="font-semibold">Extra you'll earn:</div>
                <div className="font-bold text-success">
                  +₹{Math.round(bestAccount.incrementalGain[calcPeriod]).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
