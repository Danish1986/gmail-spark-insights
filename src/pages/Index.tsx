import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard } from "@/components/CreditCard";
import { StatCard } from "@/components/StatCard";
import { SpendingChart } from "@/components/SpendingChart";
import { TransactionTable } from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  ShoppingBag,
  Zap,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Target,
  Sparkles,
} from "lucide-react";

const mockCreditCards = [
  {
    name: "HDFC Diners Black",
    bank: "HDFC Bank",
    last4: "4567",
    expiry: "12/26",
    rewardPoints: 142500,
    rewardValue: 71250,
    status: "redeem" as const,
    rewardRates: { dining: 10, shopping: 5, travel: 8, fuel: 3 },
    benefits: ["Airport Lounge Access", "Golf Privileges"],
  },
  {
    name: "ICICI Amazon Pay",
    bank: "ICICI Bank",
    last4: "8901",
    expiry: "06/27",
    rewardPoints: 8750,
    rewardValue: 2187.5,
    status: "accumulate" as const,
    rewardRates: { dining: 2, shopping: 5, travel: 2, fuel: 2 },
    benefits: ["Amazon Prime", "No Annual Fee"],
  },
  {
    name: "Axis Magnus",
    bank: "Axis Bank",
    last4: "2345",
    expiry: "09/27",
    rewardPoints: 12800,
    rewardValue: 5120,
    status: "review" as const,
    rewardRates: { dining: 6, shopping: 4, travel: 12, fuel: 2 },
    benefits: ["Travel Vouchers", "Unlimited Lounge Access"],
  },
];

const spendingData = [
  { day: "1-5", amount: 15000 },
  { day: "6-10", amount: 28000 },
  { day: "11-15", amount: 22000 },
  { day: "16-20", amount: 31000 },
  { day: "21-25", amount: 19000 },
  { day: "26-30", amount: 25000 },
];

const transactionBreakdown = [
  { range: "< ₹100", count: 45, percentage: 22, potentialRewards: 450 },
  { range: "₹100 - ₹200", count: 38, percentage: 19, potentialRewards: 760 },
  { range: "₹200 - ₹500", count: 52, percentage: 26, potentialRewards: 2600 },
  { range: "₹500 - ₹1000", count: 31, percentage: 15, potentialRewards: 3100 },
  { range: "₹1000 - ₹2000", count: 22, percentage: 11, potentialRewards: 4400 },
  { range: "> ₹2000", count: 14, percentage: 7, potentialRewards: 8400 },
];

const Index = () => {
  const [selectedMonth, setSelectedMonth] = useState("current");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">CardIQ</h1>
                <p className="text-xs text-muted-foreground">Smart Rewards Optimizer</p>
              </div>
            </div>
            <Button variant="premium" size="sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Connect Gmail
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="home" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-12 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger value="home" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Home
            </TabsTrigger>
            <TabsTrigger value="cards" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Credit Cards
            </TabsTrigger>
            <TabsTrigger value="goals" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Goals & Forecasts
            </TabsTrigger>
            <TabsTrigger
              value="optimize"
              className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Optimization
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Spends This Month"
                value="₹1,40,000"
                icon={Wallet}
                trend={{ value: "12%", positive: false }}
              />
              <StatCard
                title="Rewards Earned"
                value="₹8,450"
                icon={TrendingUp}
                trend={{ value: "8%", positive: true }}
              />
              <StatCard title="Active Cards" value="3" icon={ShoppingBag} />
              <StatCard title="Optimization Score" value="87/100" icon={Zap} trend={{ value: "5 pts", positive: true }} />
            </div>

            {/* Spending Pattern */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-medium)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Spending Pattern</h2>
                  <p className="text-sm text-muted-foreground">30-day journey breakdown</p>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  This Month
                </Button>
              </div>
              <SpendingChart data={spendingData} />
              <div className="mt-6 p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">First 10 days insight:</span> Your spending was 23% higher than usual,
                  primarily driven by travel (₹28,450) and shopping (₹14,320) categories. Consider using your Axis Magnus
                  for travel to maximize rewards.
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-medium)]">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Top Categories
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Travel", amount: 44965, percent: 32 },
                    { name: "Groceries", amount: 28420, percent: 20 },
                    { name: "Shopping", amount: 19850, percent: 14 },
                    { name: "Food & Dining", amount: 15680, percent: 11 },
                    { name: "Utilities", amount: 12340, percent: 9 },
                  ].map((cat) => (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{cat.name}</span>
                        <span className="text-muted-foreground">₹{cat.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-medium)]">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Payment Methods
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Credit Cards", amount: 98546, icon: "💳" },
                    { name: "UPI", amount: 45629, icon: "📱" },
                    { name: "P2M Transfers", amount: 27500, icon: "🔄" },
                    { name: "P2A Transfers", amount: 12500, icon: "👤" },
                    { name: "IMPS/NEFT", amount: 8650, icon: "🏦" },
                  ].map((method) => (
                    <div key={method.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium text-foreground">{method.name}</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        ₹{method.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Credit Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Your Credit Cards</h2>
              <p className="text-muted-foreground">Manage and optimize your card rewards</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockCreditCards.map((card) => (
                <CreditCard key={card.last4} {...card} />
              ))}
            </div>
          </TabsContent>

          {/* Goals & Forecasts Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-medium)] text-center">
              <Target className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Goals & Forecasts Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                Set financial goals and get AI-powered forecasts for your spending patterns
              </p>
              <Button variant="premium">Connect Gmail to Get Started</Button>
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimize" className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-medium)]">
              <h2 className="text-2xl font-bold text-foreground mb-4">Transaction Analysis & Optimization</h2>
              <p className="text-muted-foreground mb-6">
                Analyzing your P2M transactions to maximize reward potential
              </p>
              <TransactionTable data={transactionBreakdown} />
              <div className="mt-6 p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20">
                <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-success" />
                  Optimization Insight
                </h4>
                <p className="text-sm text-foreground mb-4">
                  You have <span className="font-bold">90 transactions above ₹200</span> (45% of total). By using your{" "}
                  <span className="font-bold text-primary">HDFC Diners Black</span> card for these transactions, you
                  could earn an additional:
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-success">₹19,310</span>
                  <span className="text-muted-foreground">in rewards per month</span>
                </div>
              </div>
            </div>

            {/* Recommended Cards */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-medium)]">
              <h3 className="text-xl font-bold text-foreground mb-4">Recommended Card Strategy</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Use HDFC Diners Black for Dining</h4>
                      <p className="text-sm text-muted-foreground">
                        With 10x rewards on dining, you can earn up to ₹4,500 extra monthly on your food expenses
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-blue-500/10">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Use ICICI Amazon Pay for Online Shopping</h4>
                      <p className="text-sm text-muted-foreground">
                        5% cashback on Amazon and 5x rewards on other online shopping platforms
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
