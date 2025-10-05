export interface FinancialInsight {
  title: string;
  description: string;
  stat: string;
  icon: string;
  gradient: string;
}

export const financialInsights: FinancialInsight[] = [
  {
    title: "Millennial Spending Trends",
    description: "Indians aged 25-35 spend 40% of their income on rent and EMIs",
    stat: "40%",
    icon: "🏠",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Food Delivery Habits",
    description: "Average Bangalore professional spends ₹8,000/month on food delivery",
    stat: "₹8K",
    icon: "🍔",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Smart Saving Goals",
    description: "Financial experts recommend investing at least 20% of monthly income",
    stat: "20%",
    icon: "💰",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Credit Card Usage",
    description: "Credit card bills are the #1 spending category for urban millennials",
    stat: "#1",
    icon: "💳",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Entertainment Spending",
    description: "Indians spend 15% of disposable income on entertainment and subscriptions",
    stat: "15%",
    icon: "🎬",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Travel Trends",
    description: "Post-pandemic, travel spending has increased by 35% among young professionals",
    stat: "+35%",
    icon: "✈️",
    gradient: "from-indigo-500 to-purple-500",
  },
];
