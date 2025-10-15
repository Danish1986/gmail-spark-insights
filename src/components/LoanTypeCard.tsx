import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LoanTypeCardProps {
  type: string;
  count: number;
  totalAmount: number;
  icon: LucideIcon;
  onClick: () => void;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const LoanTypeCard = ({ type, count, totalAmount, icon: Icon, onClick }: LoanTypeCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md hover:scale-105 transition-all duration-200 text-left"
    >
      <div className="flex justify-between items-start mb-3">
        <Icon className="h-6 w-6 text-primary" />
        <Badge variant="secondary" className="font-semibold">
          {count}
        </Badge>
      </div>
      <div className="text-sm font-semibold text-foreground capitalize">{type} Loans</div>
      {totalAmount > 0 ? (
        <div className="text-xs text-muted-foreground mt-1">{formatINR(totalAmount)}</div>
      ) : (
        <div className="text-xs text-muted-foreground mt-1">No active loans</div>
      )}
    </button>
  );
};
