import { useState } from "react";
import { BottomTabNav } from "@/components/BottomTabNav";
import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import { CreditCardFull } from "@/components/CreditCardFull";
import { DrillDownModal } from "@/components/DrillDownModal";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { CategoryDrillDownModal } from "@/components/CategoryDrillDownModal";
import { RECOMMENDED_CARDS } from "@/data/recommendedCards";
import { TrendingUp, Sparkles, Building2 } from "lucide-react";

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
      limit: 500000,
      utilizationPct: 14,
      rewardPoints: 142500,
      rewardValue: 71250,
      status: "redeem" as const,
      rewardRates: { dining: 10, shopping: 5, travel: 8, fuel: 3 },
      benefits: ["Airport Lounge", "Golf Privileges"],
      transactions: [
        { id: "1", date: "2025-09-12", merchant: "Olive Bar & Kitchen", merchantLogo: "https://logo.clearbit.com/olivebarandkitchen.com", amount: 4500, points: 450, category: "Dining" },
        { id: "2", date: "2025-09-03", merchant: "Booking.com", merchantLogo: "https://logo.clearbit.com/booking.com", amount: 12000, points: 960, category: "Travel" },
        { id: "3", date: "2025-09-20", merchant: "Zomato", merchantLogo: "https://logo.clearbit.com/zomato.com", amount: 800, points: 80, category: "Dining" },
      ],
    },
    {
      id: "axis-magnus",
      name: "Axis Magnus",
      bank: "Axis Bank",
      last4: "2345",
      exp: "09/27",
      limit: 300000,
      utilizationPct: 4,
      rewardPoints: 12800,
      rewardValue: 5120,
      status: "accumulate" as const,
      rewardRates: { dining: 6, shopping: 4, travel: 12, fuel: 2 },
      benefits: ["Travel Vouchers", "Lounge Access"],
      transactions: [
        { id: "4", date: "2025-09-10", merchant: "Starbucks", merchantLogo: "https://logo.clearbit.com/starbucks.com", amount: 800, points: 48, category: "Dining" },
        { id: "5", date: "2025-09-15", merchant: "MakeMyTrip", merchantLogo: "https://logo.clearbit.com/makemytrip.com", amount: 25000, points: 3000, category: "Travel" },
      ],
    },
  ],
  bankAccounts: [
    { id: "hdfc-savings", name: "HDFC Bank", logo: "https://logo.clearbit.com/hdfcbank.com", type: "Savings" },
    { id: "icici-salary", name: "ICICI Bank", logo: "https://logo.clearbit.com/icicibank.com", type: "Salary" },
    { id: "axis-current", name: "Axis Bank", logo: "https://logo.clearbit.com/axisbank.com", type: "Current" },
  ],
  paymentMethodTransactions: {
    "UPI": [
      { id: "u1", date: "2025-09-01", merchant: "Swiggy", merchantLogo: "https://logo.clearbit.com/swiggy.com", amount: 450, method: "UPI", isP2M: true, missedRewards: 45, category: "Food" },
      { id: "u2", date: "2025-09-05", merchant: "BigBasket", merchantLogo: "https://logo.clearbit.com/bigbasket.com", amount: 2800, method: "UPI", isP2M: true, missedRewards: 280, category: "Groceries" },
      { id: "u3", date: "2025-09-08", merchant: "Flipkart", merchantLogo: "https://logo.clearbit.com/flipkart.com", amount: 5600, method: "UPI", isP2M: true, missedRewards: 560, category: "Shopping" },
      { id: "u4", date: "2025-09-12", merchant: "Zepto", merchantLogo: "https://logo.clearbit.com/zeptonow.com", amount: 890, method: "UPI", isP2M: true, missedRewards: 89, category: "Groceries" },
      { id: "u5", date: "2025-09-18", merchant: "BookMyShow", merchantLogo: "https://logo.clearbit.com/bookmyshow.com", amount: 1200, method: "UPI", isP2M: true, missedRewards: 120, category: "Entertainment" },
    ],
    "Credit Card": [
      { id: "c1", date: "2025-09-03", merchant: "Booking.com", merchantLogo: "https://logo.clearbit.com/booking.com", amount: 12000, method: "Credit Card", category: "Travel" },
      { id: "c2", date: "2025-09-12", merchant: "Olive Bar", merchantLogo: "https://logo.clearbit.com/olivebarandkitchen.com", amount: 4500, method: "Credit Card", category: "Dining" },
    ],
    "Debit Card": [
      { id: "d1", date: "2025-09-02", merchant: "ATM Withdrawal", amount: 10000, method: "Debit Card", category: "Cash" },
      { id: "d2", date: "2025-09-14", merchant: "PVR Cinemas", merchantLogo: "https://logo.clearbit.com/pvrcinemas.com", amount: 1400, method: "Debit Card", isP2M: true, missedRewards: 140, category: "Entertainment" },
    ],
  },
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
  const [selectedCardId, setSelectedCardId] = useState(MOCK_DATA.cards[0].id);
  const [drillDownModal, setDrillDownModal] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
  }>({ isOpen: false, title: "", data: {} });
  const [paymentMethodModal, setPaymentMethodModal] = useState<{
    isOpen: boolean;
    method: string;
    color: string;
  }>({ isOpen: false, method: "", color: "" });
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    category: string;
    color: string;
  }>({ isOpen: false, category: "", color: "" });

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

  const selectedCard = MOCK_DATA.cards.find((c) => c.id === selectedCardId) || MOCK_DATA.cards[0];
  const totalRewards = MOCK_DATA.cards.reduce((sum, c) => sum + c.rewardPoints, 0);
  const totalRewardValue = MOCK_DATA.cards.reduce((sum, c) => sum + c.rewardValue, 0);
  const totalLimit = MOCK_DATA.cards.reduce((sum, c) => sum + (c.limit || 0), 0);
  const avgUtilization = Math.round(MOCK_DATA.cards.reduce((sum, c) => sum + (c.utilizationPct || 0), 0) / MOCK_DATA.cards.length);
  const rewardableTransactions = MOCK_DATA.p2mTransactions.filter((t) => t.range.includes(">") || parseInt(t.range) >= 200);
  const totalRewardableValue = rewardableTransactions.reduce((sum, t) => sum + t.potentialRewards, 0);
  const totalRewardableCount = rewardableTransactions.reduce((sum, t) => sum + t.count, 0);

  // UPI P2M transactions for comparison
  const upiP2MTransactions = MOCK_DATA.paymentMethodTransactions["UPI"].filter((t) => t.isP2M);
  const upiMissedRewards = upiP2MTransactions.reduce((sum, t) => sum + (t.missedRewards || 0), 0);
  const ccTransactions = MOCK_DATA.paymentMethodTransactions["Credit Card"];
  const ccTotalSpend = ccTransactions.reduce((sum, t) => sum + t.amount, 0);

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

              {/* Bank Accounts */}
              <div className="mx-3 mt-5">
                <div className="text-xs text-muted-foreground mb-2">Accounts Considered</div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {MOCK_DATA.bankAccounts.map((bank) => (
                    <div key={bank.id} className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-200 min-w-fit">
                      <img src={bank.logo} alt={bank.name} className="h-6 w-6 rounded" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{bank.name}</div>
                        <div className="text-xs text-gray-500">{bank.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
              
              {/* Spends by Category - with drill-down */}
              <div className="mx-3 mt-5">
                <div className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-900" /> Spends by Category
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                  {MOCK_DATA.categorySplit.map((c, i) => {
                    const total = MOCK_DATA.categorySplit.reduce((sum, cat) => sum + cat.value, 0);
                    const pctVal = ((c.value / total) * 100).toFixed(1);
                    return (
                      <button
                        key={i}
                        onClick={() => setCategoryModal({ isOpen: true, category: c.name, color: c.color })}
                        className="w-full mb-3 text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex justify-between font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: c.color }} />
                            {c.name}
                          </span>
                          <span>{formatINR(c.value)} • {pctVal}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${pctVal}%`, background: c.color }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods - with drill-down */}
              <div className="mx-3 mt-5">
                <div className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-900" /> Payment Methods
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                  {MOCK_DATA.spendsByInstrument.map((method, i) => {
                    const total = MOCK_DATA.spendsByInstrument.reduce((sum, m) => sum + m.value, 0);
                    const pctVal = ((method.value / total) * 100).toFixed(1);
                    return (
                      <button
                        key={i}
                        onClick={() => setPaymentMethodModal({ isOpen: true, method: method.name, color: method.color })}
                        className="w-full mb-3 text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex justify-between font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: method.color }} />
                            {method.name}
                          </span>
                          <span>{formatINR(method.value)} • {pctVal}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${pctVal}%`, background: method.color }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "optimize" && (
            <div className="p-4">
              {/* Credit Cards Overview */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground mb-3">Credit Cards</h2>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Cards</div>
                      <div className="font-bold text-lg">{MOCK_DATA.cards.length} active</div>
                      <div className="text-xs text-gray-400">
                        Total limit: {formatINR(totalLimit)} • Avg util: {avgUtilization}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total rewards</div>
                      <div className="font-bold text-right">{totalRewards.toLocaleString()} pts</div>
                      <div className="text-xs text-right text-success">{formatINR(totalRewardValue)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Credit Cards */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Quick view</div>
                <div className="overflow-x-auto no-scrollbar py-2">
                  <div className="flex gap-4">
                    {MOCK_DATA.cards.map((card) => (
                      <CreditCardFull 
                        key={card.id} 
                        card={card} 
                        isActive={selectedCardId === card.id}
                        onClick={() => setSelectedCardId(card.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Card Transactions */}
              <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Selected Card</div>
                    <div className="font-semibold text-base">{selectedCard.bank} • {selectedCard.name}</div>
                    <div className="text-xs text-gray-400">**** {selectedCard.last4} • Exp {selectedCard.exp}</div>
                  </div>
                  <div className="text-xs text-gray-500">Sep 2025 ▾</div>
                </div>

                {selectedCard.transactions && selectedCard.transactions.length > 0 ? (
                  <>
                    <div className="space-y-2 mb-4">
                      {selectedCard.transactions.map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            {txn.merchantLogo ? (
                              <img src={txn.merchantLogo} alt={txn.merchant} className="h-8 w-8 rounded-full object-cover bg-gray-100" />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                                {txn.merchant.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">{txn.merchant}</div>
                              <div className="text-xs text-gray-500">{txn.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">{formatINR(txn.amount)}</div>
                            <div className="text-xs text-gray-500">{txn.points} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <div className="text-xs text-gray-500">Total points (month)</div>
                        <div className="font-bold text-base">{selectedCard.transactions.reduce((sum, t) => sum + t.points, 0)}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <div className="text-xs text-gray-500">Card reward value</div>
                        <div className="font-bold text-base">{formatINR(selectedCard.rewardValue)}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">No transactions this month</div>
                )}
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
                    Based on your spending pattern, these cards can maximize your rewards by up to 3x! Apply today to unlock exclusive joining bonuses.
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

              {/* Reward Optimization Analysis */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <h2 className="text-lg font-bold text-foreground">Reward Optimization</h2>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border mb-4">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-1">Current Rewards</div>
                      <div className="text-base font-bold text-purple-600">{totalRewards.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatINR(totalRewardValue)}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-1">Missed (UPI)</div>
                      <div className="text-base font-bold text-red-600">{formatINR(upiMissedRewards)}</div>
                      <div className="text-xs text-gray-500 mt-1">{upiP2MTransactions.length} txns</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-1">Potential</div>
                      <div className="text-base font-bold text-success">{formatINR(totalRewardableValue)}</div>
                      <div className="text-xs text-gray-500 mt-1">with CC</div>
                    </div>
                  </div>

                  {/* P2M Transaction Breakdown */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-900 mb-2">P2M Transaction Analysis</div>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2 font-semibold text-gray-700">Amount Range</th>
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
                  </div>

                  {/* Optimization Tips */}
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
                      <div className="text-xs font-semibold text-gray-900 mb-1">💡 Move to Credit Card</div>
                      <div className="text-xs text-gray-700">
                        <span className="font-bold text-red-600">{totalRewardableCount} transactions</span> (₹200+) should be moved to credit cards to earn up to{" "}
                        <span className="font-bold text-success">{formatINR(totalRewardableValue)}</span> more in rewards!
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                      <div className="text-xs font-semibold text-gray-900 mb-1">🔴 UPI P2M Lost Rewards</div>
                      <div className="text-xs text-gray-700">
                        You lost <span className="font-bold text-red-600">{formatINR(upiMissedRewards)}</span> in potential rewards by using UPI for{" "}
                        <span className="font-bold">{upiP2MTransactions.length} merchant transactions</span>. Switch to credit cards for these!
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <div className="text-xs font-semibold text-gray-900 mb-1">📊 Current CC Spend</div>
                      <div className="text-xs text-gray-700">
                        Current credit card spend: <span className="font-bold text-success">{formatINR(ccTotalSpend)}</span> earning good rewards. Keep it up!
                      </div>
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

        {/* Payment Method Modal */}
        <PaymentMethodModal
          isOpen={paymentMethodModal.isOpen}
          onClose={() => setPaymentMethodModal({ isOpen: false, method: "", color: "" })}
          method={paymentMethodModal.method}
          transactions={MOCK_DATA.paymentMethodTransactions[paymentMethodModal.method as keyof typeof MOCK_DATA.paymentMethodTransactions] || []}
          color={paymentMethodModal.color}
        />

        {/* Category Drill-down Modal */}
        <CategoryDrillDownModal
          isOpen={categoryModal.isOpen}
          onClose={() => setCategoryModal({ isOpen: false, category: "", color: "" })}
          category={categoryModal.category}
          color={categoryModal.color}
          monthlyData={[
            { month: "Jun", amount: 4200 },
            { month: "Jul", amount: 5100 },
            { month: "Aug", amount: 4800 },
            { month: "Sep", amount: MOCK_DATA.categorySplit.find(c => c.name === categoryModal.category)?.value || 0 },
          ]}
        />
      </div>
    </div>
  );
};

export default Index;
