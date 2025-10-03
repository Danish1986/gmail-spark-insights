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
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">Investment Portfolio</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">Total Invested</div>
              <div className="text-xl font-bold">₹{Math.round(data.totalInvested).toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">Current Value</div>
              <div className="text-xl font-bold">₹{Math.round(data.currentValue).toLocaleString("en-IN")}</div>
              <div className="text-xs text-success font-semibold">▲ {totalReturn.toFixed(2)}%</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">YTD Invested</div>
              <div className="text-xl font-bold">₹{Math.round(data.ytdInvested).toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">This Month</div>
              <div className="text-xl font-bold">₹{Math.round(data.thisMonth).toLocaleString("en-IN")}</div>
              <div className={`text-xs font-semibold ${monthChange >= 0 ? "text-success" : "text-destructive"}`}>
                {monthChange >= 0 ? "▲" : "▼"} {Math.abs(monthChange).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["1M", "3M", "6M", "12M", "Till Date"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Period Investment Amount */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-1">Invested in {period}</div>
            <div className="text-2xl font-bold">₹{Math.round(periodAmount).toLocaleString("en-IN")}</div>
          </div>

          {/* Investment Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Portfolio Breakdown</h3>
            {data.categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category)}
                className="w-full bg-card rounded-xl p-4 border hover:border-primary/50 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: category.color }} />
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-xs text-muted-foreground">• {category.count}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{Math.round(category.amount).toLocaleString("en-IN")}</div>
                    <div className="text-xs text-success font-semibold">+{category.monthReturn}% 1M</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xs text-muted-foreground">{category.portfolioPercent}% of portfolio</div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
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
