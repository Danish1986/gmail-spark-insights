import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Zap, Mail } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Simplify Your Finances
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Connect your email and let AI automatically track your transactions, investments, and financial goals
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Your data is encrypted and secure
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Email Integration</h3>
            <p className="text-muted-foreground">
              Automatically fetch transaction emails from Gmail, Outlook, or Yahoo
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Smart Insights</h3>
            <p className="text-muted-foreground">
              Get AI-powered analysis of your spending patterns and investments
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your finances in real-time with automatic updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
