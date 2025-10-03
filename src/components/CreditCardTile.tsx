interface CreditCard {
  id: string;
  name: string;
  bank: string;
  logo: string;
  last4: string;
  exp: string;
  limit: number;
  utilizationPct: number;
  rewardPoints: number;
  rewardValue: number;
  benefits: string[];
}

interface CreditCardTileProps {
  card: CreditCard;
  isActive: boolean;
  onClick: () => void;
}

const formatINR = (amount: number) => {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

export const CreditCardTile = ({ card, isActive, onClick }: CreditCardTileProps) => {
  return (
    <div
      onClick={onClick}
      className={`min-w-[260px] p-4 rounded-2xl cursor-pointer transition-all ${
        isActive
          ? "scale-105 border-2 border-primary bg-gradient-to-br from-sky-50 to-indigo-50"
          : "bg-card shadow-sm border border-border"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <img src={card.logo} alt={card.bank} className="h-6 object-contain" />
          </div>
          <div className="font-bold text-lg leading-tight text-foreground">{card.name}</div>
          <div className="text-xs text-muted-foreground mt-1">**** {card.last4} • Exp {card.exp}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-primary">{card.rewardPoints.toLocaleString()} pts</div>
          <div className="text-xs text-muted-foreground">{formatINR(card.rewardValue)}</div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-3">
        Limit: {formatINR(card.limit)} • Util: {card.utilizationPct}%
      </div>

      <div className="flex gap-2 flex-wrap">
        {card.benefits.map((benefit, idx) => (
          <div key={idx} className="px-3 py-1 bg-secondary text-xs rounded-full text-foreground">
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
};
