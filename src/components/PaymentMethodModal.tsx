import { X } from "lucide-react";

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

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: string;
  transactions: Transaction[];
  color: string;
}

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

export const PaymentMethodModal = ({ isOpen, onClose, method, transactions, color }: PaymentMethodModalProps) => {
  if (!isOpen) return null;

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalMissedRewards = transactions.reduce((sum, t) => sum + (t.missedRewards || 0), 0);
  const p2mTransactions = transactions.filter((t) => t.isP2M);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom max-w-md mx-auto left-0 right-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-3 py-2.5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-base font-bold">{method} Transactions</h2>
            <p className="text-[10px] text-muted-foreground">September 2025</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">Total Spent</div>
              <div className="text-base font-bold">{formatINR(totalAmount)}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{transactions.length} transactions</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">Missed Rewards</div>
              <div className="text-base font-bold text-destructive">{formatINR(totalMissedRewards)}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{p2mTransactions.length} P2M txns</div>
            </div>
          </div>

          {/* P2M Alert */}
          {p2mTransactions.length > 0 && (
            <div className="mb-3 p-2.5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
              <div className="text-xs font-semibold mb-1">💡 Reward Opportunity</div>
              <div className="text-xs text-muted-foreground">
                {p2mTransactions.length} merchant transactions via {method} could have earned{" "}
                <span className="font-bold text-success">{formatINR(totalMissedRewards)}</span> more if done via
                credit card!
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className="space-y-2">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border ${
                  txn.isP2M ? "bg-destructive/5 border-destructive/20" : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  {txn.merchantLogo ? (
                    <img
                      src={txn.merchantLogo}
                      alt={txn.merchant}
                      className="h-8 w-8 rounded-full object-cover bg-muted"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {txn.merchant.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-xs">{txn.merchant}</div>
                    <div className="text-[10px] text-muted-foreground">{txn.date}</div>
                    {txn.isP2M && (
                      <div className="text-[10px] text-destructive font-semibold mt-0.5">
                        P2M • Missed: {formatINR(txn.missedRewards || 0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-xs">{formatINR(txn.amount)}</div>
                  {txn.category && <div className="text-[10px] text-muted-foreground">{txn.category}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
