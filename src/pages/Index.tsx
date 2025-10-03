import { useState } from "react";
import { BottomTabNav } from "@/components/BottomTabNav";
import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import { CreditCardFull } from "@/components/CreditCardFull";
import { DrillDownModal } from "@/components/DrillDownModal";
import { RECOMMENDED_CARDS } from "@/data/recommendedCards";
import { TrendingUp, Sparkles } from "lucide-react";

// Mock data
const MOCK_DATA = {
  months: [
    { month: "Aug 2025", income: 570000, spends: 1620819, investments: 120000 },
    { month: "Sep 2025", income: 501489, spends: 375982, investments: 100794 },
  ],
  incomingSplit: [
    { name: "Salary", value: 423782, color: "#3b82f6" },
    { name: "Dividend", value: 11287, color: "#22c55e" },
    { name: "Interest", value: 25743, color: "#a78bfa" },
    { name: "Refunds", value: 1889, color: "#f59e0b" },
    { name: "Others", value: 20341, color: "#60a5fa" },
  ],
  categorySplit: [
    { name: "Food", value: 5080, color: "#f87171" },
    { name: "Groceries", value: 97000, color: "#34d399" },
    { name: "Shopping", value: 11273, color: "#60a5fa" },
    { name: "Travel", value: 449653, color: "#f59e0b" },
    { name: "Utilities", value: 63853, color: "#a78bfa" },
  ],
  spendsByInstrument: [
    { name: "UPI", value: 456291, color: "#f59e0b" },
    { name: "Credit Card", value: 985465, color: "#3b82f6" },
    { name: "IMPS/NEFT", value: 275000, color: "#a78bfa" },
    { name: "P2A Transfer", value: 125000, color: "#22c55e" },
    { name: "Others", value: 417958, color: "#ef4444" },
  ],
  cards: [
    {
      id: "hdfc-diners",
      name: "HDFC Diners Black",
      bank: "HDFC Bank",
      last4: "4567",
      exp: "12/26",
      rewardPoints: 142500,
      rewardValue: 71250,
      status: "redeem" as const,
      rewardRates: { dining: 10, shopping: 5, travel: 8, fuel: 3 },
      benefits: ["Airport Lounge Access", "Golf Privileges"],
    },
    {
      id: "icici-amazon",
      name: "ICICI Amazon Pay",
      bank: "ICICI Bank",
      last4: "8901",
      exp: "06/27",
      rewardPoints: 8750,
      rewardValue: 2187.5,
      status: "accumulate" as const,
      rewardRates: { dining: 2, shopping: 5, travel: 2, fuel: 2 },
      benefits: ["Amazon Prime", "No Annual Fee"],
    },
    {
      id: "axis-magnus",
      name: "Axis Magnus",
      bank: "Axis Bank",
      last4: "2345",
      exp: "09/27",
      rewardPoints: 12800,
      rewardValue: 5120,
      status: "review" as const,
      rewardRates: { dining: 6, shopping: 4, travel: 12, fuel: 2 },
      benefits: ["Travel Vouchers", "Unlimited Lounge Access"],
    },
  ],
  p2mTransactions: [
    { range: "< ₹100", count: 45, percentage: 22, potentialRewards: 450 },
    { range: "₹100 - ₹200", count: 38, percentage: 19, potentialRewards: 760 },
    { range: "₹200 - ₹500", count: 52, percentage: 26, potentialRewards: 2600 },
    { range: "₹500 - ₹1000", count: 31, percentage: 15, potentialRewards: 3100 },
    { range: "₹1000 - ₹2000", count: 22, percentage: 11, potentialRewards: 4400 },
    { range: "> ₹2000", count: 14, percentage: 7, potentialRewards: 8400 },
  ],
  dailySpends: [
    { day: "1", amount: 2500 },
    { day: "2", amount: 3200 },
    { day: "3", amount: 1800 },
    { day: "4", amount: 4500 },
    { day: "5", amount: 3000 },
    { day: "6", amount: 5200 },
    { day: "7", amount: 2800 },
    { day: "8", amount: 3600 },
    { day: "9", amount: 4200 },
    { day: "10", amount: 3400 },
    { day: "11", amount: 2900 },
    { day: "12", amount: 3800 },
    { day: "13", amount: 4100 },
    { day: "14", amount: 3300 },
    { day: "15", amount: 5000 },
    { day: "16", amount: 3700 },
    { day: "17", amount: 2600 },
    { day: "18", amount: 4800 },
    { day: "19", amount: 3200 },
    { day: "20", amount: 4400 },
    { day: "21", amount: 2700 },
    { day: "22", amount: 3500 },
    { day: "23", amount: 4000 },
    { day: "24", amount: 3100 },
    { day: "25", amount: 4600 },
    { day: "26", amount: 3900 },
    { day: "27", amount: 2800 },
    { day: "28", amount: 4300 },
    { day: "29", amount: 3600 },
    { day: "30", amount: 4100 },
  ],
};

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [monthIndex, setMonthIndex] = useState(1); // Sep 2025
  const [drillDownModal, setDrillDownModal] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
  }>({ isOpen: false, title: "", data: {} });

  const handleMonthNavigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setMonthIndex((prev) => Math.max(0, prev - 1));
    } else {
      setMonthIndex((prev) => Math.min(MOCK_DATA.months.length - 1, prev + 1));
    }
  };

  const handleStatClick = (type: string) => {
    const currentMonth = MOCK_DATA.months[monthIndex];
    const first10DaysSpend = MOCK_DATA.dailySpends.slice(0, 10).reduce((sum, d) => sum + d.amount, 0);

    setDrillDownModal({
      isOpen: true,
      title: `${type} - ${currentMonth.month}`,
      data: {
        dailySpends: MOCK_DATA.dailySpends,
        transactionBreakdown: MOCK_DATA.p2mTransactions,
        summary: `In the first 10 days of ${currentMonth.month}, you spent ${formatINR(first10DaysSpend)}. Your highest spending was on day 6 (${formatINR(5200)}) and lowest on day 3 (${formatINR(1800)}).`,
      },
    });
  };

  const totalRewards = MOCK_DATA.cards.reduce((sum, c) => sum + c.rewardPoints, 0);
  const totalRewardValue = MOCK_DATA.cards.reduce((sum, c) => sum + c.rewardValue, 0);
  const rewardableTransactions = MOCK_DATA.p2mTransactions.filter((t) => t.range.includes(">") || parseInt(t.range) >= 200);
  const totalRewardableValue = rewardableTransactions.reduce((sum, t) => sum + t.potentialRewards, 0);

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="w-full max-w-[420px] min-h-screen bg-white shadow-2xl rounded-t-3xl flex flex-col">
        {/* Top bar */}
        <div className="h-3 safe-top" />
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Financial Life</h1>
        </div>

        {/* Main content */}
        <div className="flex-grow overflow-y-auto pb-20">
          {activeTab === "home" && (
            <div>
              <Hero data={MOCK_DATA.months} currentIndex={monthIndex} onNavigate={handleMonthNavigate} />

              {/* Clickable stat cards for drill-down */}
              <div className="mx-3 mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStatClick("Expenses")}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-primary transition-all text-left"
                >
                  <div className="text-xs text-muted-foreground mb-1">Monthly Expenses</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatINR(MOCK_DATA.months[monthIndex].spends)}
                  </div>
                  <div className="text-xs text-primary mt-2 font-medium">View 30-day breakdown →</div>
                </button>

                <button
                  onClick={() => handleStatClick("Transactions")}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-primary transition-all text-left"
                >
                  <div className="text-xs text-muted-foreground mb-1">P2M Transactions</div>
                  <div className="text-xl font-bold text-foreground">
                    {MOCK_DATA.p2mTransactions.reduce((sum, t) => sum + t.count, 0)}
                  </div>
                  <div className="text-xs text-primary mt-2 font-medium">View analysis →</div>
                </button>
              </div>

              <ChartSection title="Incoming Split" data={MOCK_DATA.incomingSplit} type="bar" />
              <ChartSection title="Spends by Category" data={MOCK_DATA.categorySplit} type="progress" />
              <ChartSection title="Payment Methods" data={MOCK_DATA.spendsByInstrument} type="bar" />
            </div>
          )}

          {activeTab === "optimize" && (
            <div className="p-4">
              {/* My Credit Cards */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-foreground">My Credit Cards</h2>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                    {MOCK_DATA.cards.length}
                  </span>
                </div>
                <div className="overflow-x-auto no-scrollbar py-2">
                  <div className="flex gap-4">
                    {MOCK_DATA.cards.map((card) => (
                      <CreditCardFull key={card.id} card={card} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Cards */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-foreground">Recommended for You</h2>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 mb-4">
                  <div className="text-sm font-semibold text-gray-900 mb-1">🎁 Get Offer Today (GOT)</div>
                  <div className="text-xs text-gray-700">
                    Based on your spending pattern, these cards can maximize your rewards by up to 3x!
                  </div>
                </div>
                <div className="overflow-x-auto no-scrollbar py-2">
                  <div className="flex gap-4">
                    {RECOMMENDED_CARDS.map((card) => (
                      <CreditCardFull key={card.id} card={card} />
                    ))}
                  </div>
                </div>
              </div>

              {/* P2M Transaction Analysis */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <h2 className="text-lg font-bold text-foreground">Reward Optimization</h2>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border mb-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-1">Total Rewards</div>
                      <div className="text-lg font-bold text-purple-600">{totalRewards.toLocaleString()} pts</div>
                      <div className="text-xs text-success mt-1">{formatINR(totalRewardValue)}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-1">Potential Boost</div>
                      <div className="text-lg font-bold text-success">{formatINR(totalRewardableValue)}</div>
                      <div className="text-xs text-gray-500 mt-1">from optimized cards</div>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-gray-900 mb-3">P2M Transaction Analysis</div>
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2 font-semibold text-gray-700">Amount</th>
                          <th className="text-right p-2 font-semibold text-gray-700">Count</th>
                          <th className="text-right p-2 font-semibold text-gray-700">%</th>
                          <th className="text-right p-2 font-semibold text-gray-700">Rewards</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_DATA.p2mTransactions.map((row, idx) => {
                          const isRewardable = row.range.includes(">") || parseInt(row.range) >= 200;
                          return (
                            <tr
                              key={idx}
                              className={`border-t border-gray-100 ${isRewardable ? "bg-green-50" : ""}`}
                            >
                              <td className="p-2 font-medium text-gray-900">{row.range}</td>
                              <td className="p-2 text-right text-gray-700">{row.count}</td>
                              <td className="p-2 text-right text-gray-600">{row.percentage}%</td>
                              <td className="p-2 text-right font-semibold text-success">
                                {formatINR(row.potentialRewards)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
                    <div className="text-xs font-semibold text-gray-900 mb-1">💡 Optimization Tip</div>
                    <div className="text-xs text-gray-700">
                      {rewardableTransactions.reduce((sum, t) => sum + t.count, 0)} transactions (₹200+) can earn you
                      up to {formatINR(totalRewardableValue)} more in rewards! Use reward-optimized credit cards for
                      these purchases.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "loans" && (
            <div className="p-4">
              <div className="text-lg font-bold mb-3 text-foreground">Loans</div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <p className="text-muted-foreground">No active loans</p>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="p-4">
              <div className="text-lg font-bold mb-3 text-foreground">Goals & Forecasts</div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <p className="text-muted-foreground">No goals configured yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Drill-down modal */}
        <DrillDownModal
          isOpen={drillDownModal.isOpen}
          onClose={() => setDrillDownModal({ isOpen: false, title: "", data: {} })}
          title={drillDownModal.title}
          data={drillDownModal.data}
        />
      </div>
    </div>
  );
};

export default Index;
