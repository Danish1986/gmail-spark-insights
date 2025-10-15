import { Lightbulb, ArrowRight } from "lucide-react";

interface OfferBannerProps {
  savingsAmount: string;
  tenure: number;
  onClick: () => void;
}

export const OfferBanner = ({ savingsAmount, tenure, onClick }: OfferBannerProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-xl p-3 mb-3 hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-2">
        <div className="bg-orange-500 rounded-full p-1.5">
          <Lightbulb className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs font-semibold text-orange-900">
            Switch to save <span className="text-orange-600">{savingsAmount}</span> over {tenure} months
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-orange-600" />
      </div>
    </button>
  );
};
