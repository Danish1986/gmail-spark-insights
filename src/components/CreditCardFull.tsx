import { Utensils, ShoppingBag, Plane, Fuel } from "lucide-react";

interface CreditCard {
  id: string;
  name: string;
  bank: string;
  logo?: string;
  last4?: string;
  exp?: string;
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
  isRecommended?: boolean;
  annualFee?: number;
  joiningBonus?: number;
  transactions?: Array<{
    id: string;
    date: string;
    merchant: string;
    merchantLogo?: string;
    amount: number;
    points: number;
    category?: string;
  }>;
}

interface CreditCardFullProps {
  card: CreditCard;
  onRedeemClick?: () => void;
  onViewDetailsClick?: () => void;
  isActive?: boolean;
  onClick?: () => void;
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

export const CreditCardFull = ({ card, onRedeemClick, onViewDetailsClick, isActive, onClick }: CreditCardFullProps) => {
  return (
    <div 
      className={`min-w-[300px] bg-white rounded-3xl p-5 shadow-sm border transition-all cursor-pointer ${
        isActive ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 leading-tight">{card.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{card.bank}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${statusColors[card.status]}`}>
          {card.status}
        </span>
      </div>

      {/* Card Number - Only for active cards */}
      {card.last4 && card.exp && !card.isRecommended && (
        <div className="text-right text-xs text-gray-600 mb-3">
          <div>**** {card.last4}</div>
          <div className="text-xs opacity-75">Exp: {card.exp}</div>
        </div>
      )}

      {/* Reward Points Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 mb-3 text-center">
        <div className="text-3xl font-black text-indigo-600 mb-1">
          {card.rewardPoints.toLocaleString()}
        </div>
        <div className="text-xs text-gray-600 mb-1">Reward Points</div>
        <div className="text-lg font-bold text-success">{formatINR(card.rewardValue)}</div>
      </div>

      {/* Recommended Card Info */}
      {card.isRecommended && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-amber-50 rounded-xl p-2 text-center">
            <div className="text-xs text-gray-600">Annual Fee</div>
            <div className="text-sm font-bold text-gray-900">{formatINR(card.annualFee || 0)}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-2 text-center">
            <div className="text-xs text-gray-600">Joining Bonus</div>
            <div className="text-sm font-bold text-success">{formatINR(card.joiningBonus || 0)}</div>
          </div>
        </div>
      )}

      {/* Limit & Utilization - Only for active cards */}
      {card.limit && card.utilizationPct !== undefined && !card.isRecommended && (
        <div className="mb-3 p-2 bg-gray-50 rounded-xl">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Limit: {formatINR(card.limit)}</span>
            <span className="text-gray-900 font-semibold">Util: {card.utilizationPct}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full" 
              style={{ width: `${card.utilizationPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Reward Rates */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">Reward Rates (per ₹100)</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(card.rewardRates).map(([category, rate]) => {
            const Icon = rewardIcons[category as keyof typeof rewardIcons];
            return (
              <div key={category} className="flex items-center gap-1.5 text-xs">
                <Icon className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-gray-600 capitalize">{category}:</span>
                <span className="font-bold text-gray-900">{rate}x</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {card.benefits.map((benefit, idx) => (
          <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {benefit}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {card.isRecommended ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open('#', '_blank');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Apply Now
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetailsClick?.();
              }}
              className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Know More
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRedeemClick?.();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Redeem
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetailsClick?.();
              }}
              className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Details
            </button>
          </>
        )}
      </div>
    </div>
  );
};
