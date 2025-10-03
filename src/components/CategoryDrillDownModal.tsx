import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  merchantLogo?: string;
  amount: number;
  method: string;
  isP2M?: boolean;
  missedRewards?: number;
  category?: string;
}

interface CategoryDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  color: string;
  monthlyData: Array<{ month: string; amount: number }>;
  transactions?: Transaction[];
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
  transactions = [],
}: CategoryDrillDownModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState("Sep 2025");

  if (!isOpen) return null;

  const totalSpend = monthlyData.reduce((sum, d) => sum + d.amount, 0);
  const avgSpend = totalSpend / monthlyData.length;
  const totalTransactions = transactions.length;
  const p2mCount = transactions.filter((t) => t.isP2M).length;
  const missedRewards = transactions.reduce((sum, t) => sum + (t.missedRewards || 0), 0);

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

          {/* Transactions List */}
          {transactions.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Transactions ({totalTransactions})
              </div>
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border ${
                      txn.isP2M ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {txn.merchantLogo ? (
                        <img
                          src={txn.merchantLogo}
                          alt={txn.merchant}
                          className="h-10 w-10 rounded-full object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                          {txn.merchant.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{txn.merchant}</div>
                        <div className="text-xs text-gray-500">{txn.date} • {txn.method}</div>
                        {txn.isP2M && (
                          <div className="text-xs text-red-600 font-semibold mt-1">
                            P2M • Missed: {formatINR(txn.missedRewards || 0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{formatINR(txn.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <div className="text-xs font-semibold text-gray-700 mb-1">💡 Insight</div>
            <div className="text-sm text-gray-800">
              Your {category} spending peaked in September. 
              {p2mCount > 0 && missedRewards > 0 && (
                <span className="block mt-2 text-red-600 font-semibold">
                  You missed {formatINR(missedRewards)} in rewards by using UPI/Debit for {p2mCount} transactions. Switch to credit cards!
                </span>
              )}
              {p2mCount === 0 && (
                <span> Consider using reward credit cards for these purchases to maximize benefits.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
