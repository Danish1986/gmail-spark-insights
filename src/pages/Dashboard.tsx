import { getCategoryIcon } from "@/lib/categoryIcons";
import { useState } from "react";
import { BottomTabNav } from "@/components/BottomTabNav";
import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import { SyncButton } from "@/components/SyncButton";
import { useFinancialData } from "@/hooks/useFinancialData";
import { Loader2 } from "lucide-react";

const MOCK_DATA = [
  {
    month: "Dec 2024",
    income: 50000,
    spends: 25000,
    investments: 10000,
    categories: {
      food_dining: 5000,
      shopping: 8000,
      travel: 3000,
      utilities: 4000,
      entertainment: 5000,
    },
    transactions: [
      {
        date: "2024-12-25T10:00:00.000Z",
        amount: 2000,
        type: "debit",
        category: "food_dining",
        merchant: "Zomato",
        account_source: "SBI ****1234",
        description: "Dinner with friends",
      },
      {
        date: "2024-12-24T15:30:00.000Z",
        amount: 1500,
        type: "debit",
        category: "shopping",
        merchant: "Amazon",
        account_source: "HDFC ****5678",
        description: "Christmas gifts",
      },
      {
        date: "2024-12-20T09:00:00.000Z",
        amount: 50000,
        type: "credit",
        category: "salary",
        merchant: "Tata Consultancy Services",
        account_source: "ICICI ****9012",
        description: "Salary deposit",
      },
    ],
  },
  {
    month: "Nov 2024",
    income: 45000,
    spends: 20000,
    investments: 8000,
    categories: {
      food_dining: 4500,
      shopping: 7000,
      travel: 2500,
      utilities: 3500,
      entertainment: 4500,
    },
    transactions: [
      {
        date: "2024-11-25T10:00:00.000Z",
        amount: 1800,
        type: "debit",
        category: "food_dining",
        merchant: "Swiggy",
        account_source: "SBI ****1234",
        description: "Lunch with colleagues",
      },
      {
        date: "2024-11-24T15:30:00.000Z",
        amount: 1200,
        type: "debit",
        category: "shopping",
        merchant: "Myntra",
        account_source: "HDFC ****5678",
        description: "Diwali gifts",
      },
      {
        date: "2024-11-20T09:00:00.000Z",
        amount: 45000,
        type: "credit",
        category: "salary",
        merchant: "Tata Consultancy Services",
        account_source: "ICICI ****9012",
        description: "Salary deposit",
      },
    ],
  },
];

const categoryIcons = {
  food_dining: getCategoryIcon("food_dining"),
  shopping: getCategoryIcon("shopping"),
  travel: getCategoryIcon("travel"),
  utilities: getCategoryIcon("utilities"),
  entertainment: getCategoryIcon("entertainment"),
  salary: getCategoryIcon("salary"),
  investment: getCategoryIcon("investment"),
  other: getCategoryIcon("other"),
};

const Dashboard = () => {
  const { data: financialData, isLoading } = useFinancialData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("home");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const openModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (!financialData) return;
    
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "next" && currentIndex < financialData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!financialData || financialData.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">No financial data yet</h2>
          <p className="text-muted-foreground mb-6">
            Sync your Gmail to start tracking your finances
          </p>
          <SyncButton />
        </div>
        <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-3 flex justify-end">
        <SyncButton />
      </div>
      <Hero data={financialData} currentIndex={currentIndex} onNavigate={handleNavigate} />
      <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Dashboard;
