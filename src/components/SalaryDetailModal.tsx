import { X, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface SalaryRecord {
  month: string;
  base: number;
  bonus: number;
  incentive: number;
  total: number;
  change: number;
}

interface SalaryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    currentMonth: number;
    history: SalaryRecord[];
  };
}

export const SalaryDetailModal = ({ isOpen, onClose, data }: SalaryDetailModalProps) => {
  const [period, setPeriod] = useState<"1M" | "3M" | "6M">("6M");
  
  if (!isOpen) return null;

  // Filter history based on period
  const monthsToShow = period === "1M" ? 1 : period === "3M" ? 3 : 6;
  const filteredHistory = data.history.slice(-monthsToShow);
  const avgSalary = filteredHistory.reduce((sum, r) => sum + r.total, 0) / filteredHistory.length;
  const chartData = filteredHistory.map(r => ({ name: r.month.split(' ')[0], value: r.total }));

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom max-w-md mx-auto left-0 right-0">
        <div className="sticky top-0 bg-background border-b px-3 py-2.5 flex items-center justify-between z-10">
          <h2 className="text-base font-bold">Salary History</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-0.5">Current Month</div>
              <div className="text-lg font-bold">₹{Math.round(data.currentMonth).toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-0.5">{period} Avg</div>
              <div className="text-lg font-bold">₹{Math.round(avgSalary).toLocaleString("en-IN")}</div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {(["1M", "3M", "6M"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Trend Chart */}
          <div className="bg-card rounded-lg p-3 border">
            <div className="text-xs font-semibold mb-2">{period} Trend</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly List */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-muted-foreground">Monthly Breakdown</h3>
            {filteredHistory.map((record, idx) => (
              <div key={idx} className="bg-card rounded-lg p-2.5 border">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{record.month}</div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-sm">₹{Math.round(record.total).toLocaleString("en-IN")}</div>
                    <div className={`text-xs font-semibold flex items-center gap-0.5 ${record.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {record.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(record.change).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
