import { X, TrendingUp } from "lucide-react";
import { useState } from "react";

interface DividendSource {
  company: string;
  amount: number;
  percentage: number;
  date: string;
}

interface DividendDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    "1M": { total: number; sources: DividendSource[] };
    "3M": { total: number; sources: DividendSource[] };
    "6M": { total: number; sources: DividendSource[] };
    "12M": { total: number; sources: DividendSource[] };
  };
}

export const DividendDetailModal = ({ isOpen, onClose, data }: DividendDetailModalProps) => {
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "12M">("3M");

  if (!isOpen) return null;

  const currentData = data[period];
  const topContributors = currentData.sources.slice(0, 4);
  const topContribution = topContributors.reduce((sum, s) => sum + s.percentage, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom max-w-md mx-auto left-0 right-0">
        <div className="sticky top-0 bg-background border-b px-3 py-2.5 flex items-center justify-between z-10">
          <h2 className="text-base font-bold">Dividend Income</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Summary */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-0.5">Total Dividends ({period})</div>
            <div className="text-xl font-bold">₹{Math.round(currentData.total).toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">From {currentData.sources.length} sources</div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(["1M", "3M", "6M", "12M"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Dividend Sources - ALL SHOWN, NO "OTHERS" */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-muted-foreground">Dividend Sources</h3>
            {currentData.sources.map((source, idx) => (
              <div key={idx} className="bg-card rounded-lg p-2 border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                    📊
                  </div>
                  <div>
                    <div className="font-semibold text-xs">{source.company}</div>
                    <div className="text-[10px] text-muted-foreground">{source.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs">₹{Math.round(source.amount).toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-muted-foreground">{source.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="bg-muted/50 rounded-lg p-2.5">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-success mt-0.5" />
              <div className="text-[10px]">
                <div className="font-semibold mb-0.5">💡 INSIGHTS</div>
                <div className="text-muted-foreground">
                  Your top {topContributors.length} holdings contributed {topContribution.toFixed(0)}% of dividend income.
                  {topContribution < 80 && " Your portfolio is well-diversified!"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
