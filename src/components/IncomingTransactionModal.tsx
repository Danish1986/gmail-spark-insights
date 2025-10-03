import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  source: string;
  canRetag: boolean;
}

interface IncomingTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  color: string;
  transactions: Transaction[];
  onTagChange: (txnId: string, newCategory: string) => void;
}

const formatINR = (amount: number) => {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    Salary: "💰",
    Dividend: "📊",
    Interest: "💡",
    Refunds: "🔄",
    Others: "📁",
  };
  return icons[category] || "📁";
};

const PERIODS = [
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "12M", months: 12 },
];

export const IncomingTransactionModal = ({
  isOpen,
  onClose,
  category,
  color,
  transactions,
  onTagChange,
}: IncomingTransactionModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("3M");

  if (!isOpen) return null;

  const periodMonths = PERIODS.find((p) => p.label === selectedPeriod)?.months || 3;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - periodMonths);

  const filteredTransactions = transactions.filter(
    (txn) => new Date(txn.date) >= cutoffDate
  );

  const total = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  const handleTagChange = (txnId: string, newCategory: string, oldCategory: string) => {
    if (newCategory === oldCategory) return;
    
    onTagChange(txnId, newCategory);
    toast({
      title: "Transaction re-tagged",
      description: `Moved to ${newCategory}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl border border-border">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(category)}</span>
            <h2 className="text-lg font-bold text-foreground">{category} Transactions</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Summary & Period Filter */}
        <div className="p-4 bg-accent/30 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-foreground">{formatINR(total)}</div>
              <div className="text-xs text-muted-foreground">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="flex gap-1">
              {PERIODS.map((period) => (
                <button
                  key={period.label}
                  onClick={() => setSelectedPeriod(period.label)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedPeriod === period.label
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions in this period
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="bg-background rounded-lg p-3 border-l-4 hover:bg-accent/30 transition-colors"
                  style={{ borderLeftColor: color }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getCategoryIcon(txn.category)}</span>
                        <div className="font-medium text-foreground text-sm truncate">
                          {txn.description}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(txn.date)} • {txn.source}
                      </div>
                      <div className="text-base font-semibold text-foreground mt-1">
                        {formatINR(txn.amount)}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Select
                        value={txn.category}
                        onValueChange={(value) => handleTagChange(txn.id, value, txn.category)}
                        disabled={!txn.canRetag}
                      >
                        <SelectTrigger className="h-8 w-[110px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Salary">💰 Salary</SelectItem>
                          <SelectItem value="Dividend">📊 Dividend</SelectItem>
                          <SelectItem value="Interest">💡 Interest</SelectItem>
                          <SelectItem value="Refunds">🔄 Refunds</SelectItem>
                          <SelectItem value="Others">📁 Others</SelectItem>
                        </SelectContent>
                      </Select>
                      {!txn.canRetag && (
                        <div className="text-[10px] text-muted-foreground mt-1 text-center">
                          Locked
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card">
          <Button onClick={onClose} className="w-full" variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
