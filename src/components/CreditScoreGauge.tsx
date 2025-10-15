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
    <div className="bg-card rounded-2xl p-3 shadow-sm border border-border">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-blue-500" />
          <h2 className="text-sm font-bold text-foreground">Credit Score</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-7 w-7 p-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <p className="text-[10px] text-muted-foreground mb-2">Last updated: {lastUpdated}</p>

      <div className="flex flex-col items-center py-2">
        {/* Compact Semicircular Gauge */}
        <svg viewBox="0 0 200 120" className="w-44 h-22">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="25%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="75%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Progress arc with gradient */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 220} ${220 - (percentage / 100) * 220}`}
            className="transition-all duration-1000"
          />
          
          {/* Needle */}
          <line
            x1="100" y1="100"
            x2="100" y2="50"
            stroke="#1F2937"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${rotation} 100 100)`}
            className="transition-transform duration-1000"
          />
          <circle cx="100" cy="100" r="6" fill="#1F2937" />
        </svg>

        {/* Score display - compact */}
        <div className="mt-2 text-center bg-green-50 rounded-xl px-4 py-2">
          <div className={`text-3xl font-bold ${getScoreColor(score)} flex items-center gap-1.5`}>
            {score}
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="text-xs font-semibold text-foreground mt-0.5">{status}</div>
        </div>

        {/* Range labels */}
        <div className="flex justify-between w-44 mt-2 text-[10px] text-muted-foreground">
          <span>300</span>
          <span className="text-foreground font-medium">Score Range</span>
          <span>900</span>
        </div>
      </div>

      {/* Score breakdown - 2x2 grid */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-white dark:bg-white/5 border border-border rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span>🕒</span> Payment History
          </div>
          <div className="text-base font-bold text-foreground">85%</div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-border rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span>💳</span> Utilization
          </div>
          <div className="text-base font-bold text-foreground">65%</div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-border rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span>📅</span> Credit Length
          </div>
          <div className="text-base font-bold text-foreground">90%</div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-border rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span>⚙️</span> Credit Mix
          </div>
          <div className="text-base font-bold text-foreground">70%</div>
        </div>
      </div>
    </div>
  );
};
