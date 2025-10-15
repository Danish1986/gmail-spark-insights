import { CreditCard, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Card {
  bank: string;
  name: string;
  limit: number;
  used: number;
  logo: string;
}

interface CreditCardsSummaryProps {
  cards: Card[];
  totalLimit: number;
  totalUsed: number;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getUtilizationColor = (percent: number) => {
  if (percent >= 90) return "text-red-500";
  if (percent >= 70) return "text-orange-500";
  if (percent >= 50) return "text-yellow-500";
  return "text-green-500";
};

const getUtilizationBg = (percent: number) => {
  if (percent >= 90) return "bg-red-500";
  if (percent >= 70) return "bg-orange-500";
  if (percent >= 50) return "bg-yellow-500";
  return "bg-green-500";
};

export const CreditCardsSummary = ({ cards, totalLimit, totalUsed }: CreditCardsSummaryProps) => {
  const utilizationPercent = (totalUsed / totalLimit) * 100;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="text-base font-bold text-foreground">Credit Cards</h2>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
            <div className="text-3xl font-bold text-foreground">{cards.length}</div>
          </div>
          <Wallet className="h-8 w-8 text-primary/60" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-muted-foreground">Total Limit</div>
            <div className="text-lg font-semibold text-foreground">{formatINR(totalLimit)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Used</div>
            <div className="text-lg font-semibold text-foreground">{formatINR(totalUsed)}</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Credit Utilization</span>
            <span className={`font-bold ${getUtilizationColor(utilizationPercent)}`}>
              {utilizationPercent.toFixed(1)}%
            </span>
          </div>
          <Progress value={utilizationPercent} className="h-2" />
          {utilizationPercent > 70 && (
            <p className="text-xs text-orange-500 mt-2">
              ⚠️ High utilization may impact your credit score
            </p>
          )}
        </div>
      </div>

      {/* Card-wise Breakdown */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-foreground">Card-wise Breakdown</div>
        {cards.map((card, index) => {
          const cardUtilization = (card.used / card.limit) * 100;
          return (
            <div key={index} className="bg-background rounded-xl p-3 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center p-1.5 border border-border shrink-0">
                  <img src={card.logo} alt={card.bank} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground text-sm">{card.bank}</div>
                  <div className="text-xs text-muted-foreground">{card.name}</div>
                </div>
                <div className={`text-xs font-bold ${getUtilizationColor(cardUtilization)}`}>
                  {cardUtilization.toFixed(1)}%
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{formatINR(card.used)}</span>
                <span>{formatINR(card.limit)}</span>
              </div>
              <Progress value={cardUtilization} className="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
