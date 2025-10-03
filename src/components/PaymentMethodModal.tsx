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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-foreground">{method} Transactions</h2>
            <p className="text-xs text-muted-foreground">September 2025</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
              <div className="text-xs text-gray-600 mb-1">Total Spent</div>
              <div className="text-xl font-bold text-gray-900">{formatINR(totalAmount)}</div>
              <div className="text-xs text-gray-500 mt-1">{transactions.length} transactions</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4">
              <div className="text-xs text-gray-600 mb-1">Missed Rewards</div>
              <div className="text-xl font-bold text-red-600">{formatINR(totalMissedRewards)}</div>
              <div className="text-xs text-gray-500 mt-1">{p2mTransactions.length} P2M txns</div>
            </div>
          </div>

          {/* P2M Alert */}
          {p2mTransactions.length > 0 && (
            <div className="mb-4 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl">
              <div className="text-sm font-semibold text-gray-900 mb-1">💡 Reward Opportunity</div>
              <div className="text-sm text-gray-700">
                {p2mTransactions.length} merchant transactions via {method} could have earned{" "}
                <span className="font-bold text-success">{formatINR(totalMissedRewards)}</span> more if done via
                credit card!
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className={`flex items-center justify-between p-3 rounded-2xl border ${
                  txn.isP2M ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {txn.merchantLogo ? (
                    <img
                      src={txn.merchantLogo}
                      alt={txn.merchant}
                      className="h-10 w-10 rounded-full object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                      {txn.merchant.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{txn.merchant}</div>
                    <div className="text-xs text-gray-500">{txn.date}</div>
                    {txn.isP2M && (
                      <div className="text-xs text-red-600 font-semibold mt-1">
                        P2M • Missed: {formatINR(txn.missedRewards || 0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatINR(txn.amount)}</div>
                  {txn.category && <div className="text-xs text-gray-500">{txn.category}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
