import { useState } from "react";
import { BottomTabNav } from "@/components/BottomTabNav";
import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import { CreditCardTile } from "@/components/CreditCardTile";
import { TransactionList } from "@/components/TransactionList";

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
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/HDFC_Bank_Logo.svg",
      last4: "4567",
      exp: "12/26",
      limit: 500000,
      utilizationPct: 14,
      spends: 120000,
      rewardPoints: 142500,
      rewardValue: 71250,
      benefits: ["Airport Lounge", "Golf Privileges", "Dining 10x"],
      transactions: [
        {
          id: 1,
          date: "2025-09-12",
          merchant: "Olive Bar & Kitchen",
          merchantLogo: "https://logo.clearbit.com/olivebarandkitchen.com",
          amount: 4500,
          points: 450,
        },
        {
          id: 2,
          date: "2025-09-03",
          merchant: "Booking.com",
          merchantLogo: "https://logo.clearbit.com/booking.com",
          amount: 12000,
          points: 960,
        },
        {
          id: 3,
          date: "2025-09-20",
          merchant: "Zomato",
          merchantLogo: "https://logo.clearbit.com/zomato.com",
          amount: 800,
          points: 80,
        },
      ],
    },
    {
      id: "axis-magnus",
      name: "Axis Magnus",
      bank: "Axis Bank",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Axis_Bank_logo.svg",
      last4: "2345",
      exp: "09/27",
      limit: 300000,
      utilizationPct: 4,
      spends: 60000,
      rewardPoints: 12800,
      rewardValue: 5120,
      benefits: ["Travel Vouchers", "Lounge Access"],
      transactions: [
        {
          id: 4,
          date: "2025-09-10",
          merchant: "Starbucks",
          merchantLogo: "https://logo.clearbit.com/starbucks.com",
          amount: 800,
          points: 48,
        },
      ],
    },
  ],
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [monthIndex, setMonthIndex] = useState(1); // Sep 2025
  const [activeCardId, setActiveCardId] = useState(MOCK_DATA.cards[0].id);

  const handleMonthNavigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setMonthIndex((prev) => Math.max(0, prev - 1));
    } else {
      setMonthIndex((prev) => Math.min(MOCK_DATA.months.length - 1, prev + 1));
    }
  };

  const activeCard = MOCK_DATA.cards.find((c) => c.id === activeCardId) || MOCK_DATA.cards[0];
  const totalMonthPoints = activeCard.transactions.reduce((sum, t) => sum + t.points, 0);

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
              <ChartSection title="Incoming Split" data={MOCK_DATA.incomingSplit} type="bar" />
              <ChartSection title="Spends by Category" data={MOCK_DATA.categorySplit} type="progress" />
              <ChartSection title="Payment Methods" data={MOCK_DATA.spendsByInstrument} type="bar" />
            </div>
          )}

          {activeTab === "optimize" && (
            <div className="p-4">
              <div className="text-lg font-bold mb-3 text-foreground">Credit Cards</div>

              {/* Overview card */}
              <div className="mb-4 bg-card rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Cards</div>
                    <div className="font-bold text-lg text-foreground">{MOCK_DATA.cards.length} active</div>
                    <div className="text-xs text-muted-foreground">
                      Total limit: ₹
                      {MOCK_DATA.cards.reduce((a, b) => a + b.limit, 0).toLocaleString("en-IN")} • Avg util:{" "}
                      {Math.round(
                        MOCK_DATA.cards.reduce((a, b) => a + b.utilizationPct, 0) / MOCK_DATA.cards.length
                      )}
                      %
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total rewards</div>
                    <div className="font-bold text-right text-foreground">
                      {MOCK_DATA.cards.reduce((a, b) => a + b.rewardPoints, 0).toLocaleString()} pts
                    </div>
                    <div className="text-xs text-right text-success">
                      ₹{MOCK_DATA.cards.reduce((a, b) => a + b.rewardValue, 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card carousel */}
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">Quick view</div>
                <div className="overflow-x-auto no-scrollbar py-2">
                  <div className="flex gap-4">
                    {MOCK_DATA.cards.map((card) => (
                      <CreditCardTile
                        key={card.id}
                        card={card}
                        isActive={activeCardId === card.id}
                        onClick={() => setActiveCardId(card.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <TransactionList
                cardName={activeCard.name}
                cardBank={activeCard.bank}
                last4={activeCard.last4}
                exp={activeCard.exp}
                month="Sep 2025"
                transactions={activeCard.transactions}
                totalPoints={totalMonthPoints}
                rewardValue={activeCard.rewardValue}
              />
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
              <div className="text-lg font-bold mb-3 text-foreground">Goals</div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <p className="text-muted-foreground">No goals configured</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
