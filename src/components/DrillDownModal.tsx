import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: {
    dailySpends?: Array<{ day: string; amount: number }>;
    transactionBreakdown?: Array<{ range: string; count: number; percentage: number; potentialRewards: number }>;
    summary?: string;
  };
}

const formatINR = (amount: number) => {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-xl text-xs shadow-2xl">
        <div className="opacity-70 mb-1">{payload[0].payload.day}</div>
        <div className="font-bold">{formatINR(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

export const DrillDownModal = ({ isOpen, onClose, title, data }: DrillDownModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Summary */}
          {data.summary && (
            <div className="mb-4 p-4 bg-blue-50 rounded-2xl">
              <div className="text-sm font-semibold text-gray-900 mb-1">Quick Insight</div>
              <div className="text-sm text-gray-700">{data.summary}</div>
            </div>
          )}

          {/* Daily Spends Chart */}
          {data.dailySpends && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-900 mb-3">30-Day Spending Pattern</div>
              <div className="h-64 bg-white rounded-2xl p-3 border border-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.dailySpends}>
                    <XAxis
                      dataKey="day"
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
                      {data.dailySpends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#3b82f6" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Transaction Breakdown */}
          {data.transactionBreakdown && (
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">Transaction Analysis by Amount</div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 mb-4">
                <div className="text-xs font-semibold text-gray-700 mb-1">💡 Reward Opportunity</div>
                <div className="text-sm text-gray-800">
                  Transactions above ₹200 can earn you higher rewards! Consider using reward-optimized cards for
                  these purchases.
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-700">Amount Range</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Count</th>
                      <th className="text-right p-3 font-semibold text-gray-700">%</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Rewards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactionBreakdown.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{row.range}</td>
                        <td className="p-3 text-right text-gray-700">{row.count}</td>
                        <td className="p-3 text-right text-gray-600">{row.percentage}%</td>
                        <td className="p-3 text-right font-semibold text-success">{formatINR(row.potentialRewards)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
