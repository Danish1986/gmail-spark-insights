import { Home, TrendingUp, FileText, Target, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BottomTabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/dashboard" },
  { id: "optimize", label: "Optimize", icon: TrendingUp, path: null },
  { id: "loans", label: "Loans", icon: FileText, path: null },
  { id: "goals", label: "Goals", icon: Target, path: null },
];

export const BottomTabNav = ({ activeTab, onTabChange }: BottomTabNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleTabClick = (item: typeof navItems[0]) => {
    if (item.path) {
      navigate(item.path);
    } else {
      onTabChange(item.id);
    }
  };

  const isTabActive = (item: typeof navItems[0]) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    return activeTab === item.id;
  };

  return (
    <div className="sticky bottom-0 p-2 bg-white/50 backdrop-blur-lg safe-bottom">
      <div className="grid grid-cols-5 border border-border bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isTabActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
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
