import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 safe-top safe-bottom">
        <div className="w-full max-w-md space-y-12 animate-fade-in">
          
          {/* Branding Section */}
          <div className="text-center space-y-6">
            {/* Logo/Icon - Removed for cleaner look */}
            
            {/* Main Title */}
            <div className="space-y-3">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Growi
                </span>
              </h1>
              <p className="text-lg text-muted-foreground font-light tracking-wide">
                Smart Money Management
              </p>
            </div>

            {/* Feature Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-powered insights for Indian finances</span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            {/* Get Started Button */}
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="w-full h-14 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <p>Bank-grade encryption • Your data is secure</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Landing;