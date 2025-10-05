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
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent safe-bottom">
      <div className="grid grid-cols-4 bg-card border-2 border-border rounded-3xl shadow-2xl overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isTabActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`relative p-4 font-semibold flex flex-col text-xs items-center justify-center gap-2 transition-all duration-300 min-h-[72px] ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm" />
              )}
              <Icon className={`h-6 w-6 relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
