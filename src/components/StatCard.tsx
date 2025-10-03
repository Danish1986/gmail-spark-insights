import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, onClick, className = "" }: StatCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-medium)] ${
        onClick ? "cursor-pointer hover:-translate-y-0.5" : ""
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
};
