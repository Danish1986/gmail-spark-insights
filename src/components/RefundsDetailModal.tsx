import { X, RotateCcw } from "lucide-react";
import { useState } from "react";

interface RefundSource {
  merchant: string;
  amount: number;
  date: string;
  reason: string;
}

interface RefundsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    "1M": { total: number; sources: RefundSource[] };
    "3M": { total: number; sources: RefundSource[] };
    "6M": { total: number; sources: RefundSource[] };
    "12M": { total: number; sources: RefundSource[] };
  };
}

export const RefundsDetailModal = ({ isOpen, onClose, data }: RefundsDetailModalProps) => {
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "12M">("3M");

  if (!isOpen) return null;

  const currentData = data[period];
  const topMerchant = currentData.sources.reduce((max, s) => s.amount > max.amount ? s : max, currentData.sources[0]);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">Refunds & Credits</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Refunds ({period})</div>
            <div className="text-2xl font-bold">₹{Math.round(currentData.total).toLocaleString("en-IN")}</div>
            <div className="text-xs text-muted-foreground mt-1">From {currentData.sources.length} transactions</div>
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

          {/* Refund Sources - ALL SHOWN */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Refund Sources</h3>
            {currentData.sources.map((source, idx) => (
              <div key={idx} className="bg-card rounded-xl p-3 border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    <div className="font-semibold text-sm">{source.merchant}</div>
                  </div>
                  <div className="font-bold text-success">+₹{Math.round(source.amount).toLocaleString("en-IN")}</div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground ml-6">
                  <div>{source.reason}</div>
                  <div>{source.date}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="bg-muted/50 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <RotateCcw className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-xs">
                <div className="font-semibold mb-1">💡 INSIGHTS</div>
                <div className="text-muted-foreground">
                  You received ₹{Math.round(currentData.total).toLocaleString("en-IN")} in refunds this period from {currentData.sources.length} merchants. 
                  Largest refund from {topMerchant.merchant} (₹{Math.round(topMerchant.amount).toLocaleString("en-IN")}).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
