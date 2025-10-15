// Category and Payment Method Icons
export const categoryIcons: Record<string, string> = {
  // Spending Categories
  "Food": "🍔",
  "Groceries": "🛒",
  "Shopping": "🛍️",
  "Travel": "✈️",
  "Utilities": "💡",
  
  // Payment Methods
  "UPI": "📱",
  "Credit Card": "💳",
  "Debit Card": "💳",
  "IMPS/NEFT": "🏦",
  "P2A Transfer": "💸",
  "Others": "📊",
};

export const getCategoryIcon = (name: string): string => {
  return categoryIcons[name] || "📊";
};
