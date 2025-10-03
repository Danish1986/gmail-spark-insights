import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";

interface CategoryDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  color: string;
  monthlyData: Array<{ month: string; amount: number }>;
}

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-xl text-xs shadow-2xl">
        <div className="opacity-70 mb-1">{payload[0].payload.month}</div>
        <div className="font-bold">{formatINR(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

export const CategoryDrillDownModal = ({
  isOpen,
  onClose,
  category,
  color,
  monthlyData,
}: CategoryDrillDownModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState("Sep 2025");

  if (!isOpen) return null;

  const totalSpend = monthlyData.reduce((sum, d) => sum + d.amount, 0);
  const avgSpend = totalSpend / monthlyData.length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-foreground capitalize">{category} Spending</h2>
            <p className="text-xs text-muted-foreground">Monthly breakdown</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Month Selector */}
          <div className="mb-4">
            <label className="text-xs text-gray-600 mb-2 block">Select Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium"
            >
              <option>Sep 2025</option>
              <option>Aug 2025</option>
              <option>Jul 2025</option>
              <option>Jun 2025</option>
            </select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
              <div className="text-xs text-gray-600 mb-1">Total Spent</div>
              <div className="text-xl font-bold text-gray-900">{formatINR(totalSpend)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
              <div className="text-xs text-gray-600 mb-1">Avg/Month</div>
              <div className="text-xl font-bold text-gray-900">{formatINR(avgSpend)}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-900 mb-3">Spending Pattern</div>
            <div className="h-64 bg-white rounded-2xl p-3 border border-gray-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <div className="text-xs font-semibold text-gray-700 mb-1">💡 Insight</div>
            <div className="text-sm text-gray-800">
              Your {category} spending peaked in September. Consider using reward credit cards for these purchases to
              maximize benefits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
