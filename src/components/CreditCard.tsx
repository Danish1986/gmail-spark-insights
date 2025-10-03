import { Button } from "@/components/ui/button";
import { CreditCard as CreditCardIcon } from "lucide-react";

interface CreditCardProps {
  name: string;
  bank: string;
  last4: string;
  expiry: string;
  rewardPoints: number;
  rewardValue: number;
  status: "redeem" | "accumulate" | "review";
  rewardRates: {
    dining: number;
    shopping: number;
    travel: number;
    fuel: number;
  };
  benefits: string[];
}

const statusConfig = {
  redeem: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "redeem" },
  accumulate: { bg: "bg-blue-500/10", text: "text-blue-600", label: "accumulate" },
  review: { bg: "bg-orange-500/10", text: "text-orange-600", label: "review" },
};

export const CreditCard = ({
  name,
  bank,
  last4,
  expiry,
  rewardPoints,
  rewardValue,
  status,
  rewardRates,
  benefits,
}: CreditCardProps) => {
  const config = statusConfig[status];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-medium)] transition-all duration-300 hover:shadow-[var(--shadow-strong)] hover:-translate-y-1">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{bank}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
          {config.label}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 text-sm text-muted-foreground">
        <CreditCardIcon className="h-4 w-4" />
        <span>•••• {last4}</span>
        <span className="text-muted-foreground/60">|</span>
        <span>Exp: {expiry}</span>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl p-6 mb-6">
        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
          {rewardPoints.toLocaleString("en-IN")}
        </div>
        <div className="text-sm text-muted-foreground mb-1">Reward Points</div>
        <div className="text-2xl font-bold text-success">₹{rewardValue.toLocaleString("en-IN")} value</div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Reward Rates (per ₹100)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span>🍽️</span>
            <span className="text-muted-foreground">Dining:</span>
            <span className="font-semibold text-foreground">{rewardRates.dining}x</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>🛍️</span>
            <span className="text-muted-foreground">Shopping:</span>
            <span className="font-semibold text-foreground">{rewardRates.shopping}x</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>✈️</span>
            <span className="text-muted-foreground">Travel:</span>
            <span className="font-semibold text-foreground">{rewardRates.travel}x</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>⛽</span>
            <span className="text-muted-foreground">Fuel:</span>
            <span className="font-semibold text-foreground">{rewardRates.fuel}x</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {benefits.map((benefit, idx) => (
          <span key={idx} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
            {benefit}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="premium" className="flex-1">
          Redeem Points
        </Button>
        <Button variant="outline" className="flex-1">
          View Details
        </Button>
      </div>
    </div>
  );
};
