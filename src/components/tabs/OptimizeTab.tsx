import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Lightbulb } from "lucide-react";

interface OptimizeTabProps {
  data: any[];
  currentIndex: number;
}

export const OptimizeTab = ({ data, currentIndex }: OptimizeTabProps) => {
  const currentMonth = data[currentIndex];
  
  // Calculate spending insights
  const totalSpending = currentMonth.spends;
  const categories = currentMonth.categories;
  const sortedCategories = Object.entries(categories).sort(([, a], [, b]) => (b as number) - (a as number));
  
  const topSpendingCategory = sortedCategories[0];
  const averageSpending = {
    food_dining: 6000,
    shopping: 7000,
    travel: 4000,
    utilities: 3500,
    entertainment: 4500,
  };

  const optimizationTips = [
    {
      category: "Food & Dining",
      current: categories.food_dining || 0,
      average: averageSpending.food_dining,
      tip: "Consider meal prepping to save on food delivery costs",
      icon: "🍔",
    },
    {
      category: "Shopping",
      current: categories.shopping || 0,
      average: averageSpending.shopping,
      tip: "Set a monthly shopping budget and stick to it",
      icon: "🛍️",
    },
    {
      category: "Entertainment",
      current: categories.entertainment || 0,
      average: averageSpending.entertainment,
      tip: "Review your subscriptions - cancel unused ones",
      icon: "🎬",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Optimize Your Spending</h2>
        <p className="text-muted-foreground">Smart insights to help you save more</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-bold text-lg mb-2">Quick Win</h3>
            <p className="text-muted-foreground">
              Your top spending category is <span className="font-semibold text-foreground">{topSpendingCategory[0]}</span> at ₹{topSpendingCategory[1].toLocaleString()}. 
              Reducing this by just 10% could save you ₹{((topSpendingCategory[1] as number) * 0.1).toLocaleString()} this month!
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {optimizationTips.map((tip, idx) => {
          const difference = tip.current - tip.average;
          const isOverspending = difference > 0;
          
          return (
            <Card key={idx} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-3xl">{tip.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{tip.category}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{tip.tip}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Your spending:</span>
                      <span className="font-semibold">₹{tip.current.toLocaleString()}</span>
                      {isOverspending ? (
                        <div className="flex items-center gap-1 text-orange-500">
                          <TrendingUp className="h-4 w-4" />
                          <span>₹{Math.abs(difference).toLocaleString()} above average</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-500">
                          <TrendingDown className="h-4 w-4" />
                          <span>₹{Math.abs(difference).toLocaleString()} below average</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <div className="flex items-start gap-4">
          <Lightbulb className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="font-bold text-lg mb-2">Savings Potential</h3>
            <p className="text-muted-foreground mb-3">
              Based on your spending patterns, you could save up to ₹{(totalSpending * 0.15).toLocaleString()} per month by optimizing these categories.
            </p>
            <div className="text-2xl font-bold text-blue-500">
              ₹{((totalSpending * 0.15) * 12).toLocaleString()}/year
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
