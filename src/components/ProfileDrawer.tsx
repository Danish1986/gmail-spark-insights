import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User, Menu, CheckCircle2, MessageSquare, UserX, Share2, LogOut, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProfileDrawer = () => {
  const { profile, user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate("/auth");
  };

  const menuItems = [
    {
      icon: MessageSquare,
      label: "Contact Support",
      onClick: () => {
        window.open("mailto:support@growi.app", "_blank");
      },
    },
    {
      icon: Share2,
      label: "Share Feedback",
      onClick: () => {
        window.open("mailto:feedback@growi.app?subject=App Feedback", "_blank");
      },
    },
    {
      icon: UserX,
      label: "Deactivate Account",
      onClick: () => {
        // TODO: Implement deactivation flow
        alert("Account deactivation will be implemented soon");
      },
      variant: "destructive" as const,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
          <Menu className="h-6 w-6 text-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 border-0">
        <div className="flex flex-col h-full">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* User Profile Section */}
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-0.5">
                  {profile?.full_name || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.email || user?.email}
                </p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            </div>

            {/* App Version */}
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-0.5">
                  You are on the latest app version
                </h3>
                <p className="text-sm text-muted-foreground">
                  App version 1.0.0
                </p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            </div>

            {/* Menu Items */}
            <div className="space-y-3">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className={`w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-accent transition-colors ${
                      item.variant === "destructive" ? "text-destructive" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleSignOut}
                className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </div>
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Close Button */}
          <div className="p-6 pt-4 border-t bg-background">
            <Button
              onClick={() => setOpen(false)}
              className="w-full h-14 text-base font-semibold rounded-2xl bg-foreground text-background hover:bg-foreground/90"
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
