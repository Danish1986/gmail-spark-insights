import { X } from "lucide-react";
import { useState } from "react";
import { InvestmentDetailModal } from "./InvestmentDetailModal";

interface InvestmentCategory {
  name: string;
  color: string;
  count: number;
  amount: number;
  currentValue: number;
  portfolioPercent: number;
  monthReturn: number;
  platforms: {
    name: string;
    logo: string;
    amount: number;
    type: string;
    transactions: {
      date: string;
      amount: number;
      type: string;
      isRecurring?: boolean;
    }[];
  }[];
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    totalInvested: number;
    currentValue: number;
    ytdInvested: number;
    thisMonth: number;
    last3M: number;
    last6M: number;
    last12M: number;
    tillDate: number;
    previousMonthInvested: number;
    categories: InvestmentCategory[];
  };
}

export const InvestmentModal = ({ isOpen, onClose, data }: InvestmentModalProps) => {
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "12M" | "Till Date">("1M");
  const [selectedCategory, setSelectedCategory] = useState<InvestmentCategory | null>(null);

  if (!isOpen) return null;

  const periodAmount = {
    "1M": data.thisMonth,
    "3M": data.last3M,
    "6M": data.last6M,
    "12M": data.last12M,
    "Till Date": data.tillDate,
  }[period];

  const monthChange = ((data.thisMonth - data.previousMonthInvested) / data.previousMonthInvested) * 100;
  const totalReturn = ((data.currentValue - data.totalInvested) / data.totalInvested) * 100;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom max-w-md mx-auto left-0 right-0">
        <div className="sticky top-0 bg-background border-b px-3 py-2.5 flex items-center justify-between z-10">
          <h2 className="text-base font-bold">Investment Portfolio</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Compact Summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">Total Invested</div>
              <div className="text-base font-bold">₹{Math.round(data.totalInvested).toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">Current Value</div>
              <div className="text-base font-bold">₹{Math.round(data.currentValue).toLocaleString("en-IN")}</div>
              <div className="text-[10px] text-success font-semibold">▲ {totalReturn.toFixed(2)}%</div>
            </div>
          </div>

          {/* Period Selector + Amount Inline */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(["1M", "3M", "6M", "12M", "Till Date"] as const).map((p) => (
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

          <div className="bg-muted/30 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
            <div className="text-[10px] text-muted-foreground">Invested in {period}</div>
            <div className="text-sm font-bold">₹{Math.round(periodAmount).toLocaleString("en-IN")}</div>
          </div>

          {/* Investment Categories - Compact List */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-semibold text-muted-foreground px-1">Portfolio Breakdown</h3>
            {data.categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category)}
                className="w-full bg-card rounded-xl p-2.5 border hover:border-primary/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: category.color }} />
                    <div className="font-semibold text-xs">{category.name}</div>
                    <div className="text-[10px] text-muted-foreground">• {category.count}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs">₹{Math.round(category.amount).toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="text-muted-foreground">{category.portfolioPercent}% of portfolio</div>
                  <div className="text-success font-semibold">+{category.monthReturn}% 1M</div>
                </div>
                <div className="w-full bg-muted rounded-full h-1 mt-1.5">
                  <div
                    className="h-1 rounded-full"
                    style={{ width: `${category.portfolioPercent}%`, backgroundColor: category.color }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCategory && (
        <InvestmentDetailModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory}
        />
      )}
    </>
  );
};
