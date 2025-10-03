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
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom max-w-md mx-auto left-0 right-0">
        <div className="sticky top-0 bg-background border-b px-3 py-2.5 flex items-center justify-between z-10">
          <h2 className="text-base font-bold">Fixed Expenses Breakdown</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Summary - More Compact */}
          <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl p-2.5">
            <div className="text-[10px] text-muted-foreground mb-1">
              Predicted Monthly Requirement
              <span className="text-[9px] ml-1">(Based on last {data.basedOnMonths} months)</span>
            </div>
            <div className="text-lg font-bold">₹{Math.round(data.predictedAmount).toLocaleString("en-IN")}</div>
          </div>

          {/* Categories - Compact List */}
          <div className="space-y-0">
            <h3 className="text-[10px] font-semibold text-muted-foreground mb-2 px-1">Expense Categories</h3>
            <div className="bg-card rounded-xl border divide-y divide-border">
              {data.categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category)}
                  className="w-full p-2.5 hover:bg-muted/50 transition-colors text-left flex items-center justify-between min-h-[40px]"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0`} style={{ backgroundColor: category.color }} />
                    <div className="font-semibold text-xs text-foreground">{category.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-bold text-xs">₹{Math.round(category.amount).toLocaleString("en-IN")}</div>
                      <div className="text-[9px] text-muted-foreground">
                        {((category.amount / totalAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <svg className="w-3 h-3 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
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
