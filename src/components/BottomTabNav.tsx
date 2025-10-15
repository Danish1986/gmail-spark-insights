import { Home, TrendingUp, FileText, Target } from "lucide-react";

interface BottomTabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "optimize", label: "Optimize", icon: TrendingUp },
  { id: "credit", label: "Credit", icon: FileText },
  { id: "goals", label: "Goals", icon: Target },
];

export const BottomTabNav = ({ activeTab, onTabChange }: BottomTabNavProps) => {
  return (
    <div className="sticky bottom-0 p-2 bg-white/50 backdrop-blur-lg safe-bottom">
      <div className="grid grid-cols-4 border border-border bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-3 font-semibold flex flex-col text-xs items-center justify-center gap-1 rounded-xl transition-all duration-200 min-h-[60px] ${
                isActive ? "bg-gray-900 text-white scale-105" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-6 w-6" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
