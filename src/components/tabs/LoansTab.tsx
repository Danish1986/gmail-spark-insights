import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingDown } from "lucide-react";

interface LoansTabProps {
  data: any[];
  currentIndex: number;
}

export const LoansTab = ({ data, currentIndex }: LoansTabProps) => {
  // Mock loan data - in real app, this would come from transactions
  const loans = [
    {
      name: "Home Loan",
      bank: "HDFC Bank",
      principal: 5000000,
      outstanding: 4200000,
      emi: 45000,
      interestRate: 8.5,
      tenure: 240,
      tenureCompleted: 24,
      icon: "🏠",
    },
    {
      name: "Car Loan",
      bank: "ICICI Bank",
      principal: 800000,
      outstanding: 450000,
      emi: 18000,
      interestRate: 9.2,
      tenure: 60,
      tenureCompleted: 28,
      icon: "🚗",
    },
  ];

  const totalEMI = loans.reduce((sum, loan) => sum + loan.emi, 0);
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.outstanding, 0);

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Loans & EMIs</h2>
        <p className="text-muted-foreground">Track your loan repayments</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Monthly EMI</div>
          <div className="text-2xl font-bold">₹{totalEMI.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Outstanding</div>
          <div className="text-2xl font-bold">₹{(totalOutstanding / 100000).toFixed(1)}L</div>
        </Card>
      </div>

      <div className="space-y-4">
        {loans.map((loan, idx) => {
          const progress = ((loan.tenureCompleted / loan.tenure) * 100);
          const paidAmount = loan.principal - loan.outstanding;
          
          return (
            <Card key={idx} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{loan.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{loan.name}</h3>
                    <p className="text-sm text-muted-foreground">{loan.bank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Monthly EMI</div>
                  <div className="text-xl font-bold">₹{loan.emi.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Repayment Progress</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{loan.tenureCompleted} of {loan.tenure} months</span>
                    <span>{loan.tenure - loan.tenureCompleted} months left</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground">Principal</div>
                    <div className="font-semibold text-sm">₹{(loan.principal / 100000).toFixed(1)}L</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Paid</div>
                    <div className="font-semibold text-sm text-green-500">₹{(paidAmount / 100000).toFixed(1)}L</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Outstanding</div>
                    <div className="font-semibold text-sm text-orange-500">₹{(loan.outstanding / 100000).toFixed(1)}L</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="h-4 w-4" />
                  <span>Interest Rate: {loan.interestRate}% p.a.</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex items-start gap-4">
          <Calendar className="h-8 w-8 text-purple-500" />
          <div>
            <h3 className="font-bold text-lg mb-2">Next Payment Due</h3>
            <p className="text-muted-foreground mb-1">
              Your next EMI payment of ₹{totalEMI.toLocaleString()} is due on 5th of next month
            </p>
            <p className="text-sm text-muted-foreground">
              Make sure you have sufficient balance in your account
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
