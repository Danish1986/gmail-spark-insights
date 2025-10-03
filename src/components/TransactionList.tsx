interface Transaction {
  id: number;
  date: string;
  merchant: string;
  merchantLogo: string;
  amount: number;
  points: number;
}

interface TransactionListProps {
  cardName: string;
  cardBank: string;
  last4: string;
  exp: string;
  month: string;
  transactions: Transaction[];
  totalPoints: number;
  rewardValue: number;
}

const formatINR = (amount: number) => {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

export const TransactionList = ({
  cardName,
  cardBank,
  last4,
  exp,
  month,
  transactions,
  totalPoints,
  rewardValue,
}: TransactionListProps) => {
  return (
    <div className="mt-6 bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-muted-foreground">Selected Card</div>
          <div className="font-semibold text-lg text-foreground">
            {cardBank} • {cardName}
          </div>
          <div className="text-xs text-muted-foreground">
            **** {last4} • Exp {exp}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{month} ▾</div>
      </div>

      <div className="mt-3 space-y-2">
        {transactions.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <img
                src={txn.merchantLogo}
                alt={txn.merchant}
                className="h-8 w-8 rounded-full object-cover bg-secondary"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/32?text=" + txn.merchant[0];
                }}
              />
              <div>
                <div className="font-medium text-foreground">{txn.merchant}</div>
                <div className="text-xs text-muted-foreground">{txn.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-foreground">{formatINR(txn.amount)}</div>
              <div className="text-xs text-muted-foreground">{txn.points} pts</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-secondary p-3 rounded-xl text-center">
          <div className="text-xs text-muted-foreground">Total points (month)</div>
          <div className="font-bold text-lg text-foreground">{totalPoints}</div>
        </div>
        <div className="bg-secondary p-3 rounded-xl text-center">
          <div className="text-xs text-muted-foreground">Card reward value</div>
          <div className="font-bold text-lg text-foreground">{formatINR(rewardValue)}</div>
        </div>
      </div>
    </div>
  );
};
