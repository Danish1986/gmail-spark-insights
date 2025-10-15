import { useState } from "react";
import { RefreshCw, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CreditScoreGaugeProps {
  score: number;
  status: string;
  lastUpdated: string;
  onRefresh: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 750) return "text-green-500";
  if (score >= 700) return "text-lime-500";
  if (score >= 650) return "text-yellow-500";
  if (score >= 600) return "text-orange-500";
  return "text-red-500";
};

const getScoreBgColor = (score: number) => {
  if (score >= 750) return "bg-green-500/10";
  if (score >= 700) return "bg-lime-500/10";
  if (score >= 650) return "bg-yellow-500/10";
  if (score >= 600) return "bg-orange-500/10";
  return "bg-red-500/10";
};

const getScoreStroke = (score: number) => {
  if (score >= 750) return "#22c55e";
  if (score >= 700) return "#84cc16";
  if (score >= 650) return "#eab308";
  if (score >= 600) return "#f97316";
  return "#ef4444";
};

export const CreditScoreGauge = ({ score, status, lastUpdated, onRefresh }: CreditScoreGaugeProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onRefresh();
    setIsRefreshing(false);
    toast({
      title: "Credit Score Refreshed",
      description: "Your latest credit score has been fetched successfully.",
    });
  };

  const percentage = ((score - 300) / 600) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Credit Score
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {lastUpdated}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col items-center py-6">
        {/* Speedometer Gauge */}
        <div className="relative w-64 h-32">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Colored segments */}
            <path d="M 20 90 A 80 80 0 0 1 52 35" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />
            <path d="M 52 35 A 80 80 0 0 1 84 15" fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" />
            <path d="M 84 15 A 80 80 0 0 1 116 15" fill="none" stroke="#eab308" strokeWidth="12" strokeLinecap="round" />
            <path d="M 116 15 A 80 80 0 0 1 148 35" fill="none" stroke="#84cc16" strokeWidth="12" strokeLinecap="round" />
            <path d="M 148 35 A 80 80 0 0 1 180 90" fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" />
            
            {/* Needle */}
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="30"
              stroke={getScoreStroke(score)}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${rotation} 100 90)`}
              className="transition-transform duration-1000 ease-out"
            />
            <circle cx="100" cy="90" r="6" fill={getScoreStroke(score)} />
          </svg>
        </div>

        {/* Score Display */}
        <div className={`mt-4 text-center ${getScoreBgColor(score)} rounded-2xl px-8 py-4`}>
          <div className={`text-5xl font-bold ${getScoreColor(score)} flex items-center justify-center gap-2`}>
            {score}
            <TrendingUp className="h-8 w-8" />
          </div>
          <div className="text-sm font-semibold text-foreground mt-2">{status}</div>
        </div>

        {/* Score Range Labels */}
        <div className="flex justify-between w-64 mt-4 text-xs text-muted-foreground">
          <span>300</span>
          <span className="text-foreground font-semibold">Credit Score Range</span>
          <span>900</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-muted/30 rounded-xl p-3">
          <div className="text-xs text-muted-foreground">Payment History</div>
          <div className="text-lg font-bold text-foreground">85%</div>
        </div>
        <div className="bg-muted/30 rounded-xl p-3">
          <div className="text-xs text-muted-foreground">Credit Utilization</div>
          <div className="text-lg font-bold text-foreground">65%</div>
        </div>
        <div className="bg-muted/30 rounded-xl p-3">
          <div className="text-xs text-muted-foreground">Credit Length</div>
          <div className="text-lg font-bold text-foreground">90%</div>
        </div>
        <div className="bg-muted/30 rounded-xl p-3">
          <div className="text-xs text-muted-foreground">Credit Mix</div>
          <div className="text-lg font-bold text-foreground">70%</div>
        </div>
      </div>
    </div>
  );
};
