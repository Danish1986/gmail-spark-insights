import { X } from "lucide-react";
import { useState } from "react";
import { FixedExpenseDetailModal } from "./FixedExpenseDetailModal";

interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
  platforms: {
    name: string;
    logo: string;
    amount: number;
    type: string;
    transactions: {
      date: string;
      amount: number;
      description: string;
      isRecurring?: boolean;
      recurringPattern?: string;
    }[];
  }[];
}

interface FixedExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    predictedAmount: number;
    categories: ExpenseCategory[];
    basedOnMonths: number;
  };
}

export const FixedExpensesModal = ({ isOpen, onClose, data }: FixedExpensesModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);

  if (!isOpen) return null;

  const totalAmount = data.categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">Fixed Expenses Breakdown</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Predicted Monthly Requirement
              <span className="text-xs ml-2">(Based on last {data.basedOnMonths} months)</span>
            </div>
            <div className="text-2xl font-bold">₹{Math.round(data.predictedAmount).toLocaleString("en-IN")}</div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Expense Categories</h3>
            {data.categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category)}
                className="w-full bg-card rounded-xl p-4 border hover:border-primary/50 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: category.color }} />
                    <div className="font-semibold">{category.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{Math.round(category.amount).toLocaleString("en-IN")}</div>
                    <div className="text-xs text-muted-foreground">
                      {((category.amount / totalAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(category.amount / totalAmount) * 100}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCategory && (
        <FixedExpenseDetailModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory}
        />
      )}
    </>
  );
};
