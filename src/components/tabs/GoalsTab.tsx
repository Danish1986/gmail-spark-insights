import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Target, TrendingUp } from "lucide-react";

interface GoalsTabProps {
  data: any[];
  currentIndex: number;
}

export const GoalsTab = ({ data, currentIndex }: GoalsTabProps) => {
  const currentMonth = data[currentIndex];
  const monthlySavings = currentMonth.income - currentMonth.spends - currentMonth.investments;

  // Mock goals data
  const goals = [
    {
      name: "Emergency Fund",
      target: 500000,
      current: 320000,
      deadline: "Dec 2025",
      icon: "🛡️",
      color: "from-red-500 to-orange-500",
      priority: "High",
    },
    {
      name: "Vacation to Europe",
      target: 200000,
      current: 85000,
      deadline: "Jun 2025",
      icon: "✈️",
      color: "from-blue-500 to-cyan-500",
      priority: "Medium",
    },
    {
      name: "New Car",
      target: 1200000,
      current: 450000,
      deadline: "Dec 2026",
      icon: "🚗",
      color: "from-purple-500 to-pink-500",
      priority: "Low",
    },
  ];

  const totalGoalsAmount = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overallProgress = (totalSaved / totalGoalsAmount) * 100;

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Financial Goals</h2>
        <p className="text-muted-foreground">Track your progress towards your dreams</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Overall Progress</h3>
            <p className="text-sm text-muted-foreground">Total saved towards all goals</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-500">{overallProgress.toFixed(1)}%</div>
          </div>
        </div>
        <Progress value={overallProgress} className="h-3 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{(totalSaved / 100000).toFixed(1)}L saved</span>
          <span>₹{(totalGoalsAmount / 100000).toFixed(1)}L target</span>
        </div>
      </Card>

      <div className="space-y-4">
        {goals.map((goal, idx) => {
          const progress = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const monthsToDeadline = 12; // Simplified
          const monthlySavingsNeeded = remaining / monthsToDeadline;
          
          return (
            <Card key={idx} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{goal.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{goal.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Target: {goal.deadline}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        goal.priority === 'High' ? 'bg-red-500/20 text-red-500' :
                        goal.priority === 'Medium' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {goal.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-xl font-bold">{progress.toFixed(0)}%</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Progress value={progress} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ₹{(goal.current / 100000).toFixed(1)}L saved
                    </span>
                    <span className="font-semibold">
                      ₹{(goal.target / 100000).toFixed(1)}L goal
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Need to save monthly:</span>
                    <span className="font-semibold">₹{monthlySavingsNeeded.toLocaleString()}</span>
                  </div>
                  {monthlySavingsNeeded <= monthlySavings && (
                    <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>On track! You're saving enough</span>
                    </div>
                  )}
                  {monthlySavingsNeeded > monthlySavings && (
                    <div className="flex items-center gap-1 text-xs text-orange-500 mt-1">
                      <Target className="h-3 w-3" />
                      <span>Need to save ₹{(monthlySavingsNeeded - monthlySavings).toLocaleString()} more/month</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Button className="w-full" size="lg">
        <Plus className="h-5 w-5 mr-2" />
        Add New Goal
      </Button>

      <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-bold text-lg mb-2">Smart Tip</h3>
            <p className="text-muted-foreground">
              Based on your current savings rate of ₹{monthlySavings.toLocaleString()}/month, 
              you're doing great! Consider setting up automatic transfers to reach your goals faster.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
