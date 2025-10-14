import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import { BankAccountsSection } from "@/components/BankAccountsSection";
import { CategoryDrillDownModal } from "@/components/CategoryDrillDownModal";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { Card } from "@/components/ui/card";

interface MonthData {
  month: string;
  income: number;
  spends: number;
  investments: number;
  categories: Record<string, number>;
  payment_methods: Record<string, number>;
  merchants: Record<string, number>;
  transactions: any[];
}

interface HomeTabProps {
  data: MonthData[];
  currentIndex: number;
  onNavigate: (direction: "prev" | "next") => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "#10b981",
  shopping: "#f59e0b",
  travel: "#3b82f6",
  entertainment: "#8b5cf6",
  utilities: "#ec4899",
  healthcare: "#ef4444",
  education: "#6366f1",
  investment: "#14b8a6",
  emi: "#f97316",
  other: "#6b7280",
};

const PAYMENT_COLORS: Record<string, string> = {
  "Credit Card": "#8b5cf6",
  "UPI": "#10b981",
  "Netbanking": "#3b82f6",
  "Debit Card": "#f59e0b",
  "Cash": "#6b7280",
  "Other": "#9ca3af",
};

export const HomeTab = ({ data, currentIndex, onNavigate }: HomeTabProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  const currentMonth = data[currentIndex];

  // Transform category data for ChartSection
  const categoryData = Object.entries(currentMonth.categories || {})
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: CATEGORY_COLORS[name.toLowerCase()] || "#6b7280",
    }))
    .sort((a, b) => b.value - a.value);

  // Transform payment method data
  const paymentData = Object.entries(currentMonth.payment_methods || {})
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: PAYMENT_COLORS[name] || "#9ca3af",
    }))
    .sort((a, b) => b.value - a.value);

  // Transform merchant data (top 5)
  const merchantData = Object.entries(currentMonth.merchants || {})
    .filter(([_, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value], idx) => ({
      name,
      value,
      color: `hsl(${(idx * 360) / 5}, 70%, 50%)`,
    }));

  // Recent transactions (last 10)
  const recentTransactions = (currentMonth.transactions || [])
    .slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Hero Summary Card */}
      <Hero data={data} currentIndex={currentIndex} onNavigate={onNavigate} />

      {/* Bank Accounts */}
      <BankAccountsSection />

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <ChartSection
          title="Spending by Category"
          data={categoryData}
          type="bar"
          onItemClick={(category) => setSelectedCategory(category)}
        />
      )}

      {/* Payment Method Breakdown */}
      {paymentData.length > 0 && (
        <ChartSection
          title="Payment Methods"
          data={paymentData}
          type="bar"
          onItemClick={(method) => setSelectedPaymentMethod(method)}
        />
      )}

      {/* Top Merchants */}
      {merchantData.length > 0 && (
        <ChartSection
          title="Top Merchants"
          data={merchantData}
          type="progress"
        />
      )}

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="mx-3 mt-5">
          <div className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-foreground" /> Recent Transactions
          </div>
          <Card className="p-4">
            <div className="space-y-3">
              {recentTransactions.map((tx: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {tx.merchant || tx.description || 'Transaction'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                      {tx.category && ` • ${tx.category}`}
                    </div>
                  </div>
                  <div className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{Math.round(tx.amount).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Modals for drill-down */}
      {selectedCategory && (
        <CategoryDrillDownModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory}
          color={categoryData.find(c => c.name === selectedCategory)?.color || "#6b7280"}
          monthlyData={data.map(month => ({
            month: month.month,
            amount: month.categories?.[selectedCategory.toLowerCase()] || 0
          }))}
          transactions={currentMonth.transactions.filter(
            (tx: any) => tx.category?.toLowerCase() === selectedCategory.toLowerCase()
          )}
        />
      )}

      {selectedPaymentMethod && (
        <PaymentMethodModal
          isOpen={!!selectedPaymentMethod}
          onClose={() => setSelectedPaymentMethod(null)}
          method={selectedPaymentMethod}
          color={paymentData.find(p => p.name === selectedPaymentMethod)?.color || "#9ca3af"}
          transactions={currentMonth.transactions.filter(
            (tx: any) => tx.payment_method === selectedPaymentMethod
          )}
        />
      )}
    </div>
  );
};
