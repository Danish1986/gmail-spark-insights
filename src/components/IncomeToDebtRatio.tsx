import { TrendingDown, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface IncomeToDebtRatioProps {
  monthlyIncome: number;
  totalEMI: number;
  ccPayment: number;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusInfo = (percentage: number) => {
  if (percentage < 30) {
    return {
      status: "Healthy",
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: CheckCircle,
      message: "Your debt levels are well managed",
    };
  }
  if (percentage < 50) {
    return {
      status: "Monitor",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500",
      icon: AlertTriangle,
      message: "Keep an eye on your debt levels",
    };
  }
  if (percentage < 70) {
    return {
      status: "At Risk",
      color: "text-orange-500",
      bgColor: "bg-orange-500",
      icon: AlertCircle,
      message: "Consider reducing debt obligations",
    };
  }
  return {
    status: "Critical",
    color: "text-red-500",
    bgColor: "bg-red-500",
    icon: AlertCircle,
    message: "Urgent: Seek debt management help",
  };
};

export const IncomeToDebtRatio = ({ monthlyIncome, totalEMI, ccPayment }: IncomeToDebtRatioProps) => {
  const totalDebtService = totalEMI + ccPayment;
  const percentage = (totalDebtService / monthlyIncome) * 100;
  const statusInfo = getStatusInfo(percentage);
  const StatusIcon = statusInfo.icon;

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Income to Debt Ratio</h2>
      </div>

      <div className="flex flex-col items-center py-6">
        {/* Circular Progress */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${statusInfo.color} transition-all duration-1000 ease-out`}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-bold ${statusInfo.color}`}>
              {percentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">of income</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`mt-4 px-4 py-2 rounded-full ${statusInfo.bgColor}/10 flex items-center gap-2`}>
          <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
          <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.status}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center max-w-xs">
          {statusInfo.message}
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 mt-4">
        <div className="text-sm font-semibold text-foreground mb-2">Debt Breakdown</div>
        
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Monthly Income</span>
            <span className="font-semibold text-foreground">{formatINR(monthlyIncome)}</span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">EMI Payments</span>
            <span className="font-semibold text-foreground">{formatINR(totalEMI)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {((totalEMI / monthlyIncome) * 100).toFixed(1)}% of income
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Credit Card Payments</span>
            <span className="font-semibold text-foreground">{formatINR(ccPayment)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {((ccPayment / monthlyIncome) * 100).toFixed(1)}% of income
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-foreground">Total Debt Service</span>
            <span className="font-bold text-foreground">{formatINR(totalDebtService)}</span>
          </div>
          <div className={`text-xs font-semibold ${statusInfo.color}`}>
            {percentage.toFixed(1)}% of income
          </div>
        </div>
      </div>
    </div>
  );
};
