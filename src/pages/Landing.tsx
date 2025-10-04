import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  IndianRupee, 
  Shield, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Sparkles,
  CreditCard,
  Receipt,
  Wallet
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Landing = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Sign-in error:', error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Rupee Symbols */}
        <IndianRupee className="absolute top-20 left-[10%] w-8 h-8 text-primary/20 animate-[float_6s_ease-in-out_infinite]" />
        <IndianRupee className="absolute top-40 right-[15%] w-12 h-12 text-success/20 animate-[float_8s_ease-in-out_infinite_1s]" />
        <IndianRupee className="absolute bottom-32 left-[20%] w-6 h-6 text-primary/30 animate-[float_7s_ease-in-out_infinite_2s]" />
        <IndianRupee className="absolute top-60 right-[25%] w-10 h-10 text-primary/15 animate-[float_9s_ease-in-out_infinite_1.5s]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb,0,0,0),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb,0,0,0),0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between px-6 py-12 safe-top safe-bottom">
        {/* Hero Section */}
        <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center space-y-12 animate-fade-in">
          {/* Hero Illustration */}
          <div className="relative">
            {/* Main Circle with Glass Effect */}
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary via-primary to-success shadow-2xl backdrop-blur-sm flex items-center justify-center animate-scale-in">
              {/* Inner Circle */}
              <div className="absolute inset-4 rounded-full bg-background/10 backdrop-blur-md border border-white/20" />
              
              {/* Center Icon */}
              <div className="relative z-10 flex items-center justify-center">
                <TrendingUp className="w-24 h-24 text-primary-foreground drop-shadow-lg" strokeWidth={2.5} />
              </div>
              
              {/* Floating Icons */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-success/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-[bounce_3s_ease-in-out_infinite]">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-[bounce_3s_ease-in-out_infinite_0.5s]">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <div className="absolute top-1/2 -left-8 w-12 h-12 rounded-xl bg-chart-2/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-[bounce_3s_ease-in-out_infinite_1s]">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-success bg-clip-text text-transparent tracking-tight animate-fade-in">
              FinanceTracker
            </h1>
            <div className="flex items-center justify-center gap-2">
              <IndianRupee className="w-6 h-6 text-primary animate-pulse" />
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Your money. Your expertise.
              </p>
            </div>
            <p className="text-sm text-muted-foreground/80 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-powered insights for Indian finances
            </p>
          </div>

          {/* Feature Cards */}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Track Expenses</h3>
                <p className="text-xs text-muted-foreground">Monitor every rupee with precision</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-success/20 hover:border-success/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Smart Insights</h3>
                <p className="text-xs text-muted-foreground">AI-powered recommendations</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-chart-2/20 hover:border-chart-2/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Card Rewards</h3>
                <p className="text-xs text-muted-foreground">Maximize cashback & benefits</p>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            size="lg"
            className="w-full h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Redirecting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </div>
            )}
          </Button>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-success" />
            <p>Bank-grade encryption • Your data is secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;