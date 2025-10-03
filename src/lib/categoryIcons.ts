// Category and Payment Method Icons
export const categoryIcons: Record<string, string> = {
  // Income Categories
  "Salary": "💰",
  "Dividend": "📈",
  "Interest": "🏦",
  "Fund Transfer": "💸",
  "Refunds": "↩️",
  "Misc. Credit": "💵",
  
  // Spending Categories
  "Credit Card Bill": "💳",
  "Entertainment": "🎬",
  "Food": "🍔",
  "Fuel": "⛽",
  "Groceries": "🛒",
  "Investment": "📊",
  "Loan EMI": "🏠",
  "P2A Transfers": "👤",
  "Shopping": "🛍️",
  "Travel": "✈️",
  "Utilities": "💡",
  "Others": "📋",
  
  // Payment Methods
  "UPI": "📱",
  "Debit Card / Account": "💳",
  "Credit Card": "💳",
  "IMPS": "⚡",
  "NEFT": "🏦",
  "RTGS": "🏦",
  "ATM Withdrawal": "🏧",
};

export const getCategoryIcon = (name: string): string => {
  return categoryIcons[name] || "📊";
};
