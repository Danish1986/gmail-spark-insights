import { CreditCard, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Card {
  bank: string;
  name: string;
  limit: number;
  used: number;
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
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Credit Cards</h2>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 mb-4">
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
      <div className="space-y-3">
        <div className="text-sm font-semibold text-foreground">Card-wise Breakdown</div>
        {cards.map((card, index) => {
          const cardUtilization = (card.used / card.limit) * 100;
          return (
            <div key={index} className="bg-muted/30 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-foreground text-sm">{card.bank}</div>
                  <div className="text-xs text-muted-foreground">{card.name}</div>
                </div>
                <div className={`text-xs font-semibold ${getUtilizationColor(cardUtilization)}`}>
                  {cardUtilization.toFixed(1)}%
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{formatINR(card.used)}</span>
                <span>{formatINR(card.limit)}</span>
              </div>
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full ${getUtilizationBg(cardUtilization)} transition-all duration-500`}
                  style={{ width: `${cardUtilization}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
