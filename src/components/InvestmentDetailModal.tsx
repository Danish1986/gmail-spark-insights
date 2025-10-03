import { X } from "lucide-react";

interface Platform {
  name: string;
  logo: string;
  amount: number;
  type: string;
  transactions: {
    date: string;
    amount: number;
    type: string;
    isRecurring?: boolean;
  }[];
}

interface InvestmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    name: string;
    color: string;
    platforms: Platform[];
    amount: number;
  };
}

export const InvestmentDetailModal = ({ isOpen, onClose, category }: InvestmentDetailModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-[60] bg-background rounded-t-xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom max-w-md mx-auto left-0 right-0">
        <div className="sticky top-0 bg-background border-b px-3 py-2.5 flex items-center justify-between z-10">
          <h2 className="text-base font-bold">{category.name} Breakdown</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Total */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-0.5">Total in {category.name}</div>
            <div className="text-xl font-bold">₹{Math.round(category.amount).toLocaleString("en-IN")}</div>
          </div>

          {/* Platform Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground">Platforms</h3>
            {category.platforms.map((platform, idx) => (
              <div key={idx} className="bg-card rounded-lg p-2.5 border">
                <div className="flex items-start gap-2 mb-2">
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="w-8 h-8 rounded-lg object-cover bg-muted"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        platform.name
                      )}&background=random`;
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{platform.name}</div>
                    <div className="text-[10px] text-muted-foreground">{platform.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">₹{Math.round(platform.amount).toLocaleString("en-IN")}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {((platform.amount / category.amount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-muted-foreground">Recent Transactions</div>
                  {platform.transactions.slice(0, 3).map((txn, txnIdx) => (
                    <div key={txnIdx} className="flex items-center justify-between text-xs py-1.5 border-t">
                      <div>
                        <div className="font-medium text-xs">{txn.type}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          {txn.date}
                          {txn.isRecurring && (
                            <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] rounded-full font-medium">
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-semibold text-xs">₹{Math.round(txn.amount).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
