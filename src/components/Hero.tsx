import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthData {
  month: string;
  income: number;
  spends: number;
  investments: number;
}

interface HeroProps {
  data: MonthData[];
  currentIndex: number;
  onNavigate: (direction: "prev" | "next") => void;
}

const formatINR = (amount: number) => {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

const KPICard = ({ title, value, delta }: { title: string; value: string; delta?: number }) => (
  <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
    <div className="text-xs text-gray-500 mb-1">{title}</div>
    <div className="text-lg font-extrabold text-gray-900 truncate">{value}</div>
    {delta != null && (
      <div className={`mt-1 text-xs font-semibold ${delta >= 0 ? "text-success" : "text-destructive"}`}>
        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
      </div>
    )}
  </div>
);

export const Hero = ({ data, currentIndex, onNavigate }: HeroProps) => {
  const current = data[currentIndex];
  const previous = data[currentIndex - 1];

  const incomeDelta = previous ? ((current.income - previous.income) / previous.income) * 100 : 0;
  const spendsDelta = previous ? ((current.spends - previous.spends) / previous.spends) * 100 : 0;
  const savings = current.income - current.spends;
  const prevSavings = previous ? previous.income - previous.spends : 0;
  const savingsDelta = prevSavings ? ((savings - prevSavings) / Math.abs(prevSavings)) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 text-white p-5 rounded-3xl shadow-xl mx-3 mt-3">
      <div className="text-xs opacity-90 uppercase tracking-wide">
        {current.month.toUpperCase()} INCOMING
      </div>
      <div className="text-3xl font-black tracking-tight mt-1">{formatINR(current.income)}</div>

      <div className="mt-4 flex gap-3 flex-wrap items-center">
        <button className="px-4 py-2 rounded-2xl bg-white/20 text-xs font-medium backdrop-blur-sm">
          All accounts
        </button>
        <button className="px-4 py-2 rounded-2xl bg-white/20 text-xs font-medium backdrop-blur-sm">
          {current.month}
        </button>
        <div className="ml-auto flex gap-2">
          <button
            className="w-8 h-8 rounded-xl bg-white/20 text-sm font-bold backdrop-blur-sm disabled:opacity-50"
            disabled={currentIndex === 0}
            onClick={() => onNavigate("prev")}
          >
            <ChevronLeft className="h-4 w-4 mx-auto" />
          </button>
          <button
            className="w-8 h-8 rounded-xl bg-white/20 text-sm font-bold backdrop-blur-sm disabled:opacity-50"
            disabled={currentIndex === data.length - 1}
            onClick={() => onNavigate("next")}
          >
            <ChevronRight className="h-4 w-4 mx-auto" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <KPICard title="Income" value={formatINR(current.income)} delta={incomeDelta} />
        <KPICard title="Expenses" value={formatINR(current.spends)} delta={spendsDelta} />
        <KPICard title="Savings" value={formatINR(savings)} delta={savingsDelta} />
      </div>
    </div>
  );
};
