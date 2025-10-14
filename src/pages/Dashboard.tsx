import { useState, useEffect, useRef } from "react";
import { BottomTabNav } from "@/components/BottomTabNav";
import { GmailConnectionStatus } from "@/components/GmailConnectionStatus";
import { FinancialInsightsCarousel } from "@/components/FinancialInsightsCarousel";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { HomeTab } from "@/components/tabs/HomeTab";
import { OptimizeTab } from "@/components/tabs/OptimizeTab";
import { LoansTab } from "@/components/tabs/LoansTab";
import { GoalsTab } from "@/components/tabs/GoalsTab";
import { useFinancialData, useSyncStatus } from "@/hooks/useFinancialData";
import { SyncStatusBanner } from "@/components/SyncStatusBanner";
import { SyncProgressBar } from "@/components/SyncProgressBar";
import { Loader2, Sparkles } from "lucide-react";



const Dashboard = () => {
  const { data: financialData, isLoading, refetch } = useFinancialData();
  const { data: syncStatus } = useSyncStatus();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("home");
  const prevPhase1Complete = useRef(false);

  // Auto-refetch financial data when Phase 1 completes
  useEffect(() => {
    if (syncStatus?.phase_1_complete && !prevPhase1Complete.current) {
      prevPhase1Complete.current = true;
      refetch(); // Show recent data immediately
    }
  }, [syncStatus?.phase_1_complete, refetch]);

  const handleNavigate = (direction: "prev" | "next") => {
    if (!financialData) return;
    
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "next" && currentIndex < financialData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (isLoading) {
    console.log("Dashboard: Loading state - fetching financial data...");
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-6 space-y-8">
          <GmailConnectionStatus />
          
          <div className="text-center space-y-4 mt-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <h2 className="text-3xl font-bold">Curating Your Insights</h2>
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg">
              We're analyzing your financial data to create personalized insights...
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">This may take a moment</span>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-center text-lg font-semibold mb-6 text-muted-foreground">
              While you wait, explore how Indians are managing their money
            </h3>
            <FinancialInsightsCarousel />
          </div>
        </div>
        <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  if (!financialData || financialData.length === 0) {
    console.log("Dashboard: Empty state - no financial data available");
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-6 space-y-8">
          <GmailConnectionStatus />
          
          <div className="text-center space-y-4 mt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Your Financial Journey Starts Here</h2>
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              Connect your Gmail to unlock personalized financial insights and start your journey to smarter money management
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-center text-lg font-semibold mb-6 text-muted-foreground">
              Discover how Indians are spending their money
            </h3>
            <FinancialInsightsCarousel />
          </div>
        </div>
        <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "optimize":
        return <OptimizeTab data={financialData} currentIndex={currentIndex} />;
      case "loans":
        return <LoansTab data={financialData} currentIndex={currentIndex} />;
      case "goals":
        return <GoalsTab data={financialData} currentIndex={currentIndex} />;
      case "home":
      default:
        return <HomeTab data={financialData} currentIndex={currentIndex} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 overflow-y-auto">
      <div className="p-3">
        <GmailConnectionStatus />
        <div className="flex justify-end items-center">
          <ProfileDrawer />
        </div>
        <SyncProgressBar />
        <SyncStatusBanner />
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {renderTabContent()}
      </div>
      <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Dashboard;
