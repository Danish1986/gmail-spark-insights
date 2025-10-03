import { Utensils, ShoppingBag, Plane, Fuel } from "lucide-react";

interface CreditCard {
  id: string;
  name: string;
  bank: string;
  logo?: string;
  last4: string;
  exp: string;
  limit?: number;
  utilizationPct?: number;
  rewardPoints: number;
  rewardValue: number;
  status: "redeem" | "accumulate" | "review";
  rewardRates: {
    dining: number;
    shopping: number;
    travel: number;
    fuel: number;
  };
  benefits: string[];
}

interface CreditCardFullProps {
  card: CreditCard;
  onRedeemClick?: () => void;
  onViewDetailsClick?: () => void;
}

const formatINR = (amount: number) => {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

const statusColors = {
  redeem: "bg-success text-white",
  accumulate: "bg-primary text-white",
  review: "bg-status-orange text-white",
};

const rewardIcons = {
  dining: Utensils,
  shopping: ShoppingBag,
  travel: Plane,
  fuel: Fuel,
};

export const CreditCardFull = ({ card, onRedeemClick, onViewDetailsClick }: CreditCardFullProps) => {
  return (
    <div className="min-w-[340px] bg-white rounded-3xl p-6 shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{card.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{card.bank}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[card.status]}`}>
          {card.status}
        </span>
      </div>

      {/* Card Number */}
      <div className="text-right text-sm text-gray-600 mb-4">
        <div>**** {card.last4}</div>
        <div className="text-xs">Exp: {card.exp}</div>
      </div>

      {/* Reward Points Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 mb-4 text-center">
        <div className="text-4xl font-black text-purple-600 mb-1">
          {card.rewardPoints.toLocaleString()}
        </div>
        <div className="text-xs text-gray-600 mb-2">Reward Points</div>
        <div className="text-xl font-bold text-success">{formatINR(card.rewardValue)} value</div>
      </div>

      {/* Reward Rates */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-900 mb-3">Reward Rates (per ₹100)</div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(card.rewardRates).map(([category, rate]) => {
            const Icon = rewardIcons[category as keyof typeof rewardIcons];
            return (
              <div key={category} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700 capitalize">{category}:</span>
                <span className="font-semibold text-gray-900">{rate}x</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="flex flex-wrap gap-2 mb-4">
        {card.benefits.map((benefit, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {benefit}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRedeemClick}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Redeem Points
        </button>
        <button
          onClick={onViewDetailsClick}
          className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
