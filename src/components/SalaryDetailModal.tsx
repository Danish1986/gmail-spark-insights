import { X, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  if (!isOpen) return null;

  const avgSalary = data.history.reduce((sum, r) => sum + r.total, 0) / data.history.length;
  const chartData = data.history.map(r => ({ name: r.month.split(' ')[0], value: r.total }));

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">Salary History</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">Current Month</div>
              <div className="text-xl font-bold">₹{Math.round(data.currentMonth).toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">6-Month Avg</div>
              <div className="text-xl font-bold">₹{Math.round(avgSalary).toLocaleString("en-IN")}</div>
            </div>
          </div>

          {/* 6-Month Trend Chart */}
          <div className="bg-card rounded-xl p-4 border">
            <div className="text-sm font-semibold mb-3">6-Month Trend</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Month-wise Breakdown */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Monthly Breakdown</h3>
            {data.history.map((record, idx) => (
              <div key={idx} className="bg-card rounded-xl p-3 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{record.month}</div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold">₹{Math.round(record.total).toLocaleString("en-IN")}</div>
                    <div className={`text-xs font-semibold flex items-center gap-1 ${record.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {record.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(record.change).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Base</div>
                    <div className="font-medium">₹{Math.round(record.base).toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Bonus</div>
                    <div className="font-medium">₹{Math.round(record.bonus).toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Incentive</div>
                    <div className="font-medium">₹{Math.round(record.incentive).toLocaleString("en-IN")}</div>
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
