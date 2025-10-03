import { useState } from "react";
import { BottomTabNav } from "@/components/BottomTabNav";
import { Hero } from "@/components/Hero";
import { ChartSection } from "@/components/ChartSection";
import { CreditCardFull } from "@/components/CreditCardFull";
import { DrillDownModal } from "@/components/DrillDownModal";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { CategoryDrillDownModal } from "@/components/CategoryDrillDownModal";
import { RECOMMENDED_CARDS } from "@/data/recommendedCards";
import { TrendingUp, Sparkles, Building2 } from "lucide-react";

// Mock data
const MOCK_DATA = {
  months: [
    { month: "Aug 2025", income: 570000, spends: 1620819, investments: 120000 },
    { month: "Sep 2025", income: 501489, spends: 375982, investments: 100794 },
  ],
  incomingSplit: [
    { name: "Salary", value: 423782, color: "#3b82f6" },
    { name: "Dividend", value: 11287, color: "#22c55e" },
    { name: "Interest", value: 25743, color: "#a78bfa" },
    { name: "Refunds", value: 1889, color: "#f59e0b" },
    { name: "Others", value: 20341, color: "#60a5fa" },
  ],
  categorySplit: [
    { name: "Food", value: 5080, color: "#f87171" },
    { name: "Groceries", value: 97000, color: "#34d399" },
    { name: "Shopping", value: 11273, color: "#60a5fa" },
    { name: "Travel", value: 449653, color: "#f59e0b" },
    { name: "Utilities", value: 63853, color: "#a78bfa" },
  ],
  // Historical optimization data (12 months)
  optimizationHistory: [
    { month: "Oct 2024", totalSpends: 320000, upiP2MSpends: 85000, missedRewards: 8500, creditCardSpends: 235000, earnedRewards: 11750, potentialRewards: 20250 },
    { month: "Nov 2024", totalSpends: 295000, upiP2MSpends: 78000, missedRewards: 7800, creditCardSpends: 217000, earnedRewards: 10850, potentialRewards: 18650 },
    { month: "Dec 2024", totalSpends: 450000, upiP2MSpends: 120000, missedRewards: 12000, creditCardSpends: 330000, earnedRewards: 16500, potentialRewards: 28500 },
    { month: "Jan 2025", totalSpends: 310000, upiP2MSpends: 82000, missedRewards: 8200, creditCardSpends: 228000, earnedRewards: 11400, potentialRewards: 19600 },
    { month: "Feb 2025", totalSpends: 285000, upiP2MSpends: 75000, missedRewards: 7500, creditCardSpends: 210000, earnedRewards: 10500, potentialRewards: 18000 },
    { month: "Mar 2025", totalSpends: 340000, upiP2MSpends: 90000, missedRewards: 9000, creditCardSpends: 250000, earnedRewards: 12500, potentialRewards: 21500 },
    { month: "Apr 2025", totalSpends: 315000, upiP2MSpends: 83000, missedRewards: 8300, creditCardSpends: 232000, earnedRewards: 11600, potentialRewards: 19900 },
    { month: "May 2025", totalSpends: 365000, upiP2MSpends: 96000, missedRewards: 9600, creditCardSpends: 269000, earnedRewards: 13450, potentialRewards: 23050 },
    { month: "Jun 2025", totalSpends: 330000, upiP2MSpends: 87000, missedRewards: 8700, creditCardSpends: 243000, earnedRewards: 12150, potentialRewards: 20850 },
    { month: "Jul 2025", totalSpends: 355000, upiP2MSpends: 93000, missedRewards: 9300, creditCardSpends: 262000, earnedRewards: 13100, potentialRewards: 22400 },
    { month: "Aug 2025", totalSpends: 380000, upiP2MSpends: 100000, missedRewards: 10000, creditCardSpends: 280000, earnedRewards: 14000, potentialRewards: 24000 },
    { month: "Sep 2025", totalSpends: 376000, upiP2MSpends: 98000, missedRewards: 9800, creditCardSpends: 278000, earnedRewards: 13900, potentialRewards: 23700 },
  ],
  categoryTransactions: {
    "Travel": [
      { id: "t1", date: "2025-09-03", merchant: "Booking.com", merchantLogo: "https://logo.clearbit.com/booking.com", amount: 125000, method: "Credit Card", category: "Travel" },
      { id: "t2", date: "2025-09-15", merchant: "MakeMyTrip", merchantLogo: "https://logo.clearbit.com/makemytrip.com", amount: 85000, method: "Credit Card", category: "Travel" },
      { id: "t3", date: "2025-09-20", merchant: "IndiGo Airlines", merchantLogo: "https://logo.clearbit.com/goindigo.in", amount: 45000, method: "UPI", category: "Travel", isP2M: true, missedRewards: 4500 },
      { id: "t4", date: "2025-09-12", merchant: "Uber", merchantLogo: "https://logo.clearbit.com/uber.com", amount: 2800, method: "Credit Card", category: "Travel" },
      { id: "t5", date: "2025-09-18", merchant: "Airbnb", merchantLogo: "https://logo.clearbit.com/airbnb.com", amount: 95000, method: "Credit Card", category: "Travel" },
      { id: "t6", date: "2025-09-25", merchant: "Ola Cabs", merchantLogo: "https://logo.clearbit.com/olacabs.com", amount: 1500, method: "UPI", category: "Travel", isP2M: true, missedRewards: 150 },
      { id: "t7", date: "2025-09-08", merchant: "IRCTC", merchantLogo: "https://logo.clearbit.com/irctc.co.in", amount: 8500, method: "Debit Card", category: "Travel" },
      { id: "t8", date: "2025-09-22", merchant: "Goibibo", merchantLogo: "https://logo.clearbit.com/goibibo.com", amount: 65000, method: "Credit Card", category: "Travel" },
      { id: "t9", date: "2025-09-11", merchant: "Rapido", merchantLogo: "https://logo.clearbit.com/rapido.bike", amount: 180, method: "UPI", category: "Travel", isP2M: true, missedRewards: 18 },
      { id: "t10", date: "2025-09-27", merchant: "Zoomcar", merchantLogo: "https://logo.clearbit.com/zoomcar.com", amount: 4500, method: "Credit Card", category: "Travel" },
    ],
    "Food": [
      { id: "f1", date: "2025-09-01", merchant: "Swiggy", merchantLogo: "https://logo.clearbit.com/swiggy.com", amount: 450, method: "UPI", category: "Food", isP2M: true, missedRewards: 45 },
      { id: "f2", date: "2025-09-05", merchant: "Zomato", merchantLogo: "https://logo.clearbit.com/zomato.com", amount: 680, method: "UPI", category: "Food", isP2M: true, missedRewards: 68 },
      { id: "f3", date: "2025-09-12", merchant: "Olive Bar & Kitchen", merchantLogo: "https://logo.clearbit.com/olivebarandkitchen.com", amount: 1200, method: "Credit Card", category: "Food" },
      { id: "f4", date: "2025-09-18", merchant: "Dominos", merchantLogo: "https://logo.clearbit.com/dominos.co.in", amount: 850, method: "UPI", category: "Food", isP2M: true, missedRewards: 85 },
      { id: "f5", date: "2025-09-03", merchant: "Starbucks", merchantLogo: "https://logo.clearbit.com/starbucks.com", amount: 420, method: "UPI", category: "Food", isP2M: true, missedRewards: 42 },
      { id: "f6", date: "2025-09-08", merchant: "KFC", merchantLogo: "https://logo.clearbit.com/kfc.com", amount: 650, method: "Credit Card", category: "Food" },
      { id: "f7", date: "2025-09-14", merchant: "McDonald's", merchantLogo: "https://logo.clearbit.com/mcdonalds.com", amount: 380, method: "UPI", category: "Food", isP2M: true, missedRewards: 38 },
      { id: "f8", date: "2025-09-19", merchant: "Burger King", merchantLogo: "https://logo.clearbit.com/burgerking.in", amount: 290, method: "UPI", category: "Food", isP2M: true, missedRewards: 29 },
      { id: "f9", date: "2025-09-22", merchant: "Pizza Hut", merchantLogo: "https://logo.clearbit.com/pizzahut.co.in", amount: 720, method: "Credit Card", category: "Food" },
      { id: "f10", date: "2025-09-25", merchant: "Faasos", merchantLogo: "https://logo.clearbit.com/faasos.com", amount: 340, method: "UPI", category: "Food", isP2M: true, missedRewards: 34 },
      { id: "f11", date: "2025-09-28", merchant: "Chaayos", merchantLogo: "https://logo.clearbit.com/chaayos.com", amount: 180, method: "UPI", category: "Food", isP2M: true, missedRewards: 18 },
    ],
    "Groceries": [
      { id: "g1", date: "2025-09-02", merchant: "BigBasket", merchantLogo: "https://logo.clearbit.com/bigbasket.com", amount: 4200, method: "UPI", category: "Groceries", isP2M: true, missedRewards: 420 },
      { id: "g2", date: "2025-09-10", merchant: "DMart", merchantLogo: "https://logo.clearbit.com/dmart.in", amount: 8500, method: "Debit Card", category: "Groceries" },
      { id: "g3", date: "2025-09-15", merchant: "Zepto", merchantLogo: "https://logo.clearbit.com/zeptonow.com", amount: 1800, method: "UPI", category: "Groceries", isP2M: true, missedRewards: 180 },
      { id: "g4", date: "2025-09-22", merchant: "Blinkit", merchantLogo: "https://logo.clearbit.com/blinkit.com", amount: 2400, method: "UPI", category: "Groceries", isP2M: true, missedRewards: 240 },
      { id: "g5", date: "2025-09-04", merchant: "Amazon Fresh", merchantLogo: "https://logo.clearbit.com/amazon.in", amount: 3600, method: "Credit Card", category: "Groceries" },
      { id: "g6", date: "2025-09-08", merchant: "Swiggy Instamart", merchantLogo: "https://logo.clearbit.com/swiggy.com", amount: 1250, method: "UPI", category: "Groceries", isP2M: true, missedRewards: 125 },
      { id: "g7", date: "2025-09-12", merchant: "Reliance Fresh", merchantLogo: "https://logo.clearbit.com/relianceretail.com", amount: 6800, method: "Debit Card", category: "Groceries" },
      { id: "g8", date: "2025-09-17", merchant: "More Supermarket", merchantLogo: "https://logo.clearbit.com/moreretail.in", amount: 4200, method: "Credit Card", category: "Groceries" },
      { id: "g9", date: "2025-09-20", merchant: "Spencer's", merchantLogo: "https://logo.clearbit.com/spencersretail.com", amount: 5400, method: "Debit Card", category: "Groceries" },
      { id: "g10", date: "2025-09-24", merchant: "Nature's Basket", merchantLogo: "https://logo.clearbit.com/naturesbasket.co.in", amount: 7200, method: "Credit Card", category: "Groceries" },
      { id: "g11", date: "2025-09-26", merchant: "Licious", merchantLogo: "https://logo.clearbit.com/licious.in", amount: 2800, method: "UPI", category: "Groceries", isP2M: true, missedRewards: 280 },
      { id: "g12", date: "2025-09-28", merchant: "Dunzo", merchantLogo: "https://logo.clearbit.com/dunzo.com", amount: 890, method: "UPI", category: "Groceries", isP2M: true, missedRewards: 89 },
      { id: "g13", date: "2025-09-30", merchant: "Country Delight", merchantLogo: "https://logo.clearbit.com/countrydelight.in", amount: 1560, method: "UPI", category: "Groceries", isP2M: true, missedRewards: 156 },
    ],
    "Shopping": [
      { id: "s1", date: "2025-09-08", merchant: "Amazon", merchantLogo: "https://logo.clearbit.com/amazon.in", amount: 5600, method: "Credit Card", category: "Shopping" },
      { id: "s2", date: "2025-09-14", merchant: "Flipkart", merchantLogo: "https://logo.clearbit.com/flipkart.com", amount: 3200, method: "UPI", category: "Shopping", isP2M: true, missedRewards: 320 },
      { id: "s3", date: "2025-09-20", merchant: "Myntra", merchantLogo: "https://logo.clearbit.com/myntra.com", amount: 2473, method: "Credit Card", category: "Shopping" },
      { id: "s4", date: "2025-09-05", merchant: "Ajio", merchantLogo: "https://logo.clearbit.com/ajio.com", amount: 4500, method: "UPI", category: "Shopping", isP2M: true, missedRewards: 450 },
      { id: "s5", date: "2025-09-11", merchant: "Nykaa", merchantLogo: "https://logo.clearbit.com/nykaa.com", amount: 1800, method: "Credit Card", category: "Shopping" },
      { id: "s6", date: "2025-09-16", merchant: "Zara", merchantLogo: "https://logo.clearbit.com/zara.com", amount: 8900, method: "Credit Card", category: "Shopping" },
      { id: "s7", date: "2025-09-22", merchant: "H&M", merchantLogo: "https://logo.clearbit.com/hm.com", amount: 3400, method: "UPI", category: "Shopping", isP2M: true, missedRewards: 340 },
      { id: "s8", date: "2025-09-25", merchant: "Uniqlo", merchantLogo: "https://logo.clearbit.com/uniqlo.com", amount: 5200, method: "Credit Card", category: "Shopping" },
      { id: "s9", date: "2025-09-02", merchant: "Croma", merchantLogo: "https://logo.clearbit.com/croma.com", amount: 15800, method: "Credit Card", category: "Shopping" },
      { id: "s10", date: "2025-09-07", merchant: "Decathlon", merchantLogo: "https://logo.clearbit.com/decathlon.in", amount: 6700, method: "Credit Card", category: "Shopping" },
      { id: "s11", date: "2025-09-18", merchant: "Westside", merchantLogo: "https://logo.clearbit.com/westside.com", amount: 4200, method: "Debit Card", category: "Shopping" },
      { id: "s12", date: "2025-09-28", merchant: "Titan", merchantLogo: "https://logo.clearbit.com/titan.co.in", amount: 12800, method: "Credit Card", category: "Shopping" },
    ],
    "Utilities": [
      { id: "u1", date: "2025-09-05", merchant: "BSES Delhi", merchantLogo: "https://logo.clearbit.com/bsesdelhi.com", amount: 2500, method: "UPI", category: "Utilities" },
      { id: "u2", date: "2025-09-10", merchant: "Airtel Fiber", merchantLogo: "https://logo.clearbit.com/airtel.in", amount: 1200, method: "Debit Card", category: "Utilities" },
      { id: "u3", date: "2025-09-15", merchant: "Airtel Mobile", merchantLogo: "https://logo.clearbit.com/airtel.in", amount: 599, method: "UPI", category: "Utilities" },
      { id: "u4", date: "2025-09-03", merchant: "Tata Power", merchantLogo: "https://logo.clearbit.com/tatapower.com", amount: 3200, method: "UPI", category: "Utilities" },
      { id: "u5", date: "2025-09-08", merchant: "Jio Fiber", merchantLogo: "https://logo.clearbit.com/jio.com", amount: 999, method: "Credit Card", category: "Utilities" },
      { id: "u6", date: "2025-09-12", merchant: "HP Gas", merchantLogo: "https://logo.clearbit.com/hindustanpetroleum.com", amount: 1150, method: "UPI", category: "Utilities" },
      { id: "u7", date: "2025-09-18", merchant: "Jio Mobile", merchantLogo: "https://logo.clearbit.com/jio.com", amount: 399, method: "UPI", category: "Utilities" },
      { id: "u8", date: "2025-09-20", merchant: "Netflix", merchantLogo: "https://logo.clearbit.com/netflix.com", amount: 649, method: "Credit Card", category: "Utilities" },
      { id: "u9", date: "2025-09-22", merchant: "Amazon Prime", merchantLogo: "https://logo.clearbit.com/amazon.in", amount: 1499, method: "Credit Card", category: "Utilities" },
      { id: "u10", date: "2025-09-24", merchant: "Tata Play DTH", merchantLogo: "https://logo.clearbit.com/tataplay.com", amount: 450, method: "UPI", category: "Utilities" },
      { id: "u11", date: "2025-09-26", merchant: "Disney+ Hotstar", merchantLogo: "https://logo.clearbit.com/hotstar.com", amount: 299, method: "Credit Card", category: "Utilities" },
      { id: "u12", date: "2025-09-28", merchant: "Spotify", merchantLogo: "https://logo.clearbit.com/spotify.com", amount: 119, method: "UPI", category: "Utilities" },
      { id: "u13", date: "2025-09-06", merchant: "Vi Mobile", merchantLogo: "https://logo.clearbit.com/myvi.in", amount: 299, method: "UPI", category: "Utilities" },
      { id: "u14", date: "2025-09-14", merchant: "ACT Fibernet", merchantLogo: "https://logo.clearbit.com/actcorp.in", amount: 799, method: "Debit Card", category: "Utilities" },
      { id: "u15", date: "2025-09-29", merchant: "YouTube Premium", merchantLogo: "https://logo.clearbit.com/youtube.com", amount: 129, method: "Credit Card", category: "Utilities" },
    ],
  },
  spendsByInstrument: [
    { name: "UPI", value: 456291, color: "#f59e0b" },
    { name: "Credit Card", value: 985465, color: "#3b82f6" },
    { name: "IMPS/NEFT", value: 275000, color: "#a78bfa" },
    { name: "P2A Transfer", value: 125000, color: "#22c55e" },
    { name: "Others", value: 417958, color: "#ef4444" },
  ],
  cards: [
    {
      id: "hdfc-diners",
      name: "HDFC Diners Black",
      bank: "HDFC Bank",
      last4: "4567",
      exp: "12/26",
      limit: 500000,
      utilizationPct: 14,
      rewardPoints: 142500,
      rewardValue: 71250,
      status: "redeem" as const,
      rewardRates: { dining: 10, shopping: 5, travel: 8, fuel: 3 },
      benefits: ["Airport Lounge", "Golf Privileges"],
      transactions: [
        { id: "1", date: "2025-09-12", merchant: "Olive Bar & Kitchen", merchantLogo: "https://logo.clearbit.com/olivebarandkitchen.com", amount: 4500, points: 450, category: "Dining" },
        { id: "2", date: "2025-09-03", merchant: "Booking.com", merchantLogo: "https://logo.clearbit.com/booking.com", amount: 12000, points: 960, category: "Travel" },
        { id: "3", date: "2025-09-20", merchant: "Zomato", merchantLogo: "https://logo.clearbit.com/zomato.com", amount: 800, points: 80, category: "Dining" },
      ],
    },
    {
      id: "axis-magnus",
      name: "Axis Magnus",
      bank: "Axis Bank",
      last4: "2345",
      exp: "09/27",
      limit: 300000,
      utilizationPct: 4,
      rewardPoints: 12800,
      rewardValue: 5120,
      status: "accumulate" as const,
      rewardRates: { dining: 6, shopping: 4, travel: 12, fuel: 2 },
      benefits: ["Travel Vouchers", "Lounge Access"],
      transactions: [
        { id: "4", date: "2025-09-10", merchant: "Starbucks", merchantLogo: "https://logo.clearbit.com/starbucks.com", amount: 800, points: 48, category: "Dining" },
        { id: "5", date: "2025-09-15", merchant: "MakeMyTrip", merchantLogo: "https://logo.clearbit.com/makemytrip.com", amount: 25000, points: 3000, category: "Travel" },
      ],
    },
  ],
  bankAccounts: [
    { id: "hdfc-savings", name: "HDFC Bank", logo: "https://logo.clearbit.com/hdfcbank.com", type: "Savings" },
    { id: "icici-salary", name: "ICICI Bank", logo: "https://logo.clearbit.com/icicibank.com", type: "Salary" },
    { id: "axis-current", name: "Axis Bank", logo: "https://logo.clearbit.com/axisbank.com", type: "Current" },
  ],
  paymentMethodTransactions: {
    "UPI": [
      { id: "u1", date: "2025-09-01", merchant: "Swiggy", merchantLogo: "https://logo.clearbit.com/swiggy.com", amount: 450, method: "UPI", isP2M: true, missedRewards: 45, category: "Food" },
      { id: "u2", date: "2025-09-05", merchant: "BigBasket", merchantLogo: "https://logo.clearbit.com/bigbasket.com", amount: 2800, method: "UPI", isP2M: true, missedRewards: 280, category: "Groceries" },
      { id: "u3", date: "2025-09-08", merchant: "Flipkart", merchantLogo: "https://logo.clearbit.com/flipkart.com", amount: 5600, method: "UPI", isP2M: true, missedRewards: 560, category: "Shopping" },
      { id: "u4", date: "2025-09-12", merchant: "Zepto", merchantLogo: "https://logo.clearbit.com/zeptonow.com", amount: 890, method: "UPI", isP2M: true, missedRewards: 89, category: "Groceries" },
      { id: "u5", date: "2025-09-18", merchant: "BookMyShow", merchantLogo: "https://logo.clearbit.com/bookmyshow.com", amount: 1200, method: "UPI", isP2M: true, missedRewards: 120, category: "Entertainment" },
      { id: "u6", date: "2025-09-02", merchant: "Zomato", merchantLogo: "https://logo.clearbit.com/zomato.com", amount: 680, method: "UPI", isP2M: true, missedRewards: 68, category: "Food" },
      { id: "u7", date: "2025-09-10", merchant: "Blinkit", merchantLogo: "https://logo.clearbit.com/blinkit.com", amount: 1450, method: "UPI", isP2M: true, missedRewards: 145, category: "Groceries" },
      { id: "u8", date: "2025-09-14", merchant: "Ajio", merchantLogo: "https://logo.clearbit.com/ajio.com", amount: 4500, method: "UPI", isP2M: true, missedRewards: 450, category: "Shopping" },
      { id: "u9", date: "2025-09-16", merchant: "Dunzo", merchantLogo: "https://logo.clearbit.com/dunzo.com", amount: 320, method: "UPI", isP2M: true, missedRewards: 32, category: "Groceries" },
      { id: "u10", date: "2025-09-19", merchant: "H&M", merchantLogo: "https://logo.clearbit.com/hm.com", amount: 3400, method: "UPI", isP2M: true, missedRewards: 340, category: "Shopping" },
      { id: "u11", date: "2025-09-21", merchant: "IndiGo Airlines", merchantLogo: "https://logo.clearbit.com/goindigo.in", amount: 45000, method: "UPI", isP2M: true, missedRewards: 4500, category: "Travel" },
      { id: "u12", date: "2025-09-23", merchant: "Ola Cabs", merchantLogo: "https://logo.clearbit.com/olacabs.com", amount: 350, method: "UPI", isP2M: true, missedRewards: 35, category: "Travel" },
      { id: "u13", date: "2025-09-25", merchant: "Dominos", merchantLogo: "https://logo.clearbit.com/dominos.co.in", amount: 850, method: "UPI", isP2M: true, missedRewards: 85, category: "Food" },
      { id: "u14", date: "2025-09-27", merchant: "Starbucks", merchantLogo: "https://logo.clearbit.com/starbucks.com", amount: 420, method: "UPI", isP2M: true, missedRewards: 42, category: "Food" },
      { id: "u15", date: "2025-09-28", merchant: "McDonald's", merchantLogo: "https://logo.clearbit.com/mcdonalds.com", amount: 380, method: "UPI", isP2M: true, missedRewards: 38, category: "Food" },
      { id: "u16", date: "2025-09-29", merchant: "Rapido", merchantLogo: "https://logo.clearbit.com/rapido.bike", amount: 180, method: "UPI", isP2M: true, missedRewards: 18, category: "Travel" },
      { id: "u17", date: "2025-09-30", merchant: "Licious", merchantLogo: "https://logo.clearbit.com/licious.in", amount: 2800, method: "UPI", isP2M: true, missedRewards: 280, category: "Groceries" },
      { id: "u18", date: "2025-09-04", merchant: "Swiggy Instamart", merchantLogo: "https://logo.clearbit.com/swiggy.com", amount: 1250, method: "UPI", isP2M: true, missedRewards: 125, category: "Groceries" },
      { id: "u19", date: "2025-09-06", merchant: "Faasos", merchantLogo: "https://logo.clearbit.com/faasos.com", amount: 340, method: "UPI", isP2M: true, missedRewards: 34, category: "Food" },
      { id: "u20", date: "2025-09-09", merchant: "Burger King", merchantLogo: "https://logo.clearbit.com/burgerking.in", amount: 290, method: "UPI", isP2M: true, missedRewards: 29, category: "Food" },
      { id: "u21", date: "2025-09-11", merchant: "Chaayos", merchantLogo: "https://logo.clearbit.com/chaayos.com", amount: 180, method: "UPI", isP2M: true, missedRewards: 18, category: "Food" },
      { id: "u22", date: "2025-09-13", merchant: "Country Delight", merchantLogo: "https://logo.clearbit.com/countrydelight.in", amount: 1560, method: "UPI", isP2M: true, missedRewards: 156, category: "Groceries" },
      { id: "u23", date: "2025-09-17", merchant: "Paytm Insider", merchantLogo: "https://logo.clearbit.com/insider.in", amount: 800, method: "UPI", isP2M: true, missedRewards: 80, category: "Entertainment" },
      { id: "u24", date: "2025-09-20", merchant: "Indian Oil Petrol", merchantLogo: "https://logo.clearbit.com/iocl.com", amount: 3500, method: "UPI", isP2M: true, missedRewards: 350, category: "Fuel" },
      { id: "u25", date: "2025-09-26", merchant: "Airtel Mobile", merchantLogo: "https://logo.clearbit.com/airtel.in", amount: 599, method: "UPI", category: "Utilities" },
    ],
    "Credit Card": [
      { id: "c1", date: "2025-09-03", merchant: "Booking.com", merchantLogo: "https://logo.clearbit.com/booking.com", amount: 125000, method: "Credit Card", category: "Travel" },
      { id: "c2", date: "2025-09-12", merchant: "Olive Bar & Kitchen", merchantLogo: "https://logo.clearbit.com/olivebarandkitchen.com", amount: 1200, method: "Credit Card", category: "Dining" },
      { id: "c3", date: "2025-09-15", merchant: "MakeMyTrip", merchantLogo: "https://logo.clearbit.com/makemytrip.com", amount: 85000, method: "Credit Card", category: "Travel" },
      { id: "c4", date: "2025-09-18", merchant: "Airbnb", merchantLogo: "https://logo.clearbit.com/airbnb.com", amount: 95000, method: "Credit Card", category: "Travel" },
      { id: "c5", date: "2025-09-22", merchant: "Goibibo", merchantLogo: "https://logo.clearbit.com/goibibo.com", amount: 65000, method: "Credit Card", category: "Travel" },
      { id: "c6", date: "2025-09-27", merchant: "Zoomcar", merchantLogo: "https://logo.clearbit.com/zoomcar.com", amount: 4500, method: "Credit Card", category: "Travel" },
      { id: "c7", date: "2025-09-12", merchant: "Uber", merchantLogo: "https://logo.clearbit.com/uber.com", amount: 2800, method: "Credit Card", category: "Travel" },
      { id: "c8", date: "2025-09-08", merchant: "Amazon", merchantLogo: "https://logo.clearbit.com/amazon.in", amount: 5600, method: "Credit Card", category: "Shopping" },
      { id: "c9", date: "2025-09-20", merchant: "Myntra", merchantLogo: "https://logo.clearbit.com/myntra.com", amount: 2473, method: "Credit Card", category: "Shopping" },
      { id: "c10", date: "2025-09-11", merchant: "Nykaa", merchantLogo: "https://logo.clearbit.com/nykaa.com", amount: 1800, method: "Credit Card", category: "Shopping" },
      { id: "c11", date: "2025-09-16", merchant: "Zara", merchantLogo: "https://logo.clearbit.com/zara.com", amount: 8900, method: "Credit Card", category: "Shopping" },
      { id: "c12", date: "2025-09-25", merchant: "Uniqlo", merchantLogo: "https://logo.clearbit.com/uniqlo.com", amount: 5200, method: "Credit Card", category: "Shopping" },
      { id: "c13", date: "2025-09-02", merchant: "Croma", merchantLogo: "https://logo.clearbit.com/croma.com", amount: 15800, method: "Credit Card", category: "Electronics" },
      { id: "c14", date: "2025-09-07", merchant: "Decathlon", merchantLogo: "https://logo.clearbit.com/decathlon.in", amount: 6700, method: "Credit Card", category: "Shopping" },
      { id: "c15", date: "2025-09-28", merchant: "Titan", merchantLogo: "https://logo.clearbit.com/titan.co.in", amount: 12800, method: "Credit Card", category: "Shopping" },
      { id: "c16", date: "2025-09-08", merchant: "KFC", merchantLogo: "https://logo.clearbit.com/kfc.com", amount: 650, method: "Credit Card", category: "Food" },
      { id: "c17", date: "2025-09-22", merchant: "Pizza Hut", merchantLogo: "https://logo.clearbit.com/pizzahut.co.in", amount: 720, method: "Credit Card", category: "Food" },
      { id: "c18", date: "2025-09-04", merchant: "Amazon Fresh", merchantLogo: "https://logo.clearbit.com/amazon.in", amount: 3600, method: "Credit Card", category: "Groceries" },
      { id: "c19", date: "2025-09-17", merchant: "More Supermarket", merchantLogo: "https://logo.clearbit.com/moreretail.in", amount: 4200, method: "Credit Card", category: "Groceries" },
      { id: "c20", date: "2025-09-24", merchant: "Nature's Basket", merchantLogo: "https://logo.clearbit.com/naturesbasket.co.in", amount: 7200, method: "Credit Card", category: "Groceries" },
      { id: "c21", date: "2025-09-08", merchant: "Jio Fiber", merchantLogo: "https://logo.clearbit.com/jio.com", amount: 999, method: "Credit Card", category: "Utilities" },
      { id: "c22", date: "2025-09-20", merchant: "Netflix", merchantLogo: "https://logo.clearbit.com/netflix.com", amount: 649, method: "Credit Card", category: "Utilities" },
      { id: "c23", date: "2025-09-22", merchant: "Amazon Prime", merchantLogo: "https://logo.clearbit.com/amazon.in", amount: 1499, method: "Credit Card", category: "Utilities" },
      { id: "c24", date: "2025-09-26", merchant: "Disney+ Hotstar", merchantLogo: "https://logo.clearbit.com/hotstar.com", amount: 299, method: "Credit Card", category: "Utilities" },
      { id: "c25", date: "2025-09-29", merchant: "YouTube Premium", merchantLogo: "https://logo.clearbit.com/youtube.com", amount: 129, method: "Credit Card", category: "Utilities" },
    ],
    "Debit Card": [
      { id: "d1", date: "2025-09-02", merchant: "ATM Withdrawal", amount: 10000, method: "Debit Card", category: "Cash" },
      { id: "d2", date: "2025-09-14", merchant: "PVR Cinemas", merchantLogo: "https://logo.clearbit.com/pvrcinemas.com", amount: 1400, method: "Debit Card", isP2M: true, missedRewards: 140, category: "Entertainment" },
      { id: "d3", date: "2025-09-10", merchant: "DMart", merchantLogo: "https://logo.clearbit.com/dmart.in", amount: 8500, method: "Debit Card", category: "Groceries" },
      { id: "d4", date: "2025-09-08", merchant: "IRCTC", merchantLogo: "https://logo.clearbit.com/irctc.co.in", amount: 8500, method: "Debit Card", category: "Travel" },
      { id: "d5", date: "2025-09-12", merchant: "Reliance Fresh", merchantLogo: "https://logo.clearbit.com/relianceretail.com", amount: 6800, method: "Debit Card", category: "Groceries" },
      { id: "d6", date: "2025-09-20", merchant: "Spencer's", merchantLogo: "https://logo.clearbit.com/spencersretail.com", amount: 5400, method: "Debit Card", category: "Groceries" },
      { id: "d7", date: "2025-09-18", merchant: "Westside", merchantLogo: "https://logo.clearbit.com/westside.com", amount: 4200, method: "Debit Card", category: "Shopping" },
      { id: "d8", date: "2025-09-10", merchant: "Airtel Fiber", merchantLogo: "https://logo.clearbit.com/airtel.in", amount: 1200, method: "Debit Card", category: "Utilities" },
      { id: "d9", date: "2025-09-14", merchant: "ACT Fibernet", merchantLogo: "https://logo.clearbit.com/actcorp.in", amount: 799, method: "Debit Card", category: "Utilities" },
      { id: "d10", date: "2025-09-05", merchant: "Shell Petrol", merchantLogo: "https://logo.clearbit.com/shell.com", amount: 4200, method: "Debit Card", isP2M: true, missedRewards: 420, category: "Fuel" },
      { id: "d11", date: "2025-09-23", merchant: "INOX Cinema", merchantLogo: "https://logo.clearbit.com/inoxmovies.com", amount: 950, method: "Debit Card", isP2M: true, missedRewards: 95, category: "Entertainment" },
      { id: "d12", date: "2025-09-28", merchant: "Local Mart", amount: 3200, method: "Debit Card", category: "Groceries" },
    ],
    "IMPS/NEFT": [
      { id: "i1", date: "2025-09-01", merchant: "Rent Payment", amount: 35000, method: "IMPS", category: "Rent" },
      { id: "i2", date: "2025-09-05", merchant: "Home Loan EMI", amount: 28000, method: "NEFT", category: "Loan" },
      { id: "i3", date: "2025-09-10", merchant: "Car Loan EMI", amount: 18000, method: "NEFT", category: "Loan" },
      { id: "i4", date: "2025-09-12", merchant: "Mutual Fund SIP", amount: 15000, method: "NEFT", category: "Investment" },
      { id: "i5", date: "2025-09-15", merchant: "Insurance Premium", amount: 25000, method: "NEFT", category: "Insurance" },
      { id: "i6", date: "2025-09-18", merchant: "School Fees", amount: 45000, method: "NEFT", category: "Education" },
      { id: "i7", date: "2025-09-20", merchant: "Contractor Payment", amount: 32000, method: "IMPS", category: "Services" },
      { id: "i8", date: "2025-09-22", merchant: "Freelancer Payment", amount: 22000, method: "IMPS", category: "Services" },
      { id: "i9", date: "2025-09-25", merchant: "RD Deposit", amount: 10000, method: "NEFT", category: "Investment" },
      { id: "i10", date: "2025-09-28", merchant: "Medical Insurance", amount: 18000, method: "NEFT", category: "Insurance" },
      { id: "i11", date: "2025-09-08", merchant: "Property Tax", amount: 12000, method: "NEFT", category: "Tax" },
      { id: "i12", date: "2025-09-14", merchant: "Vendor Payment", amount: 15000, method: "IMPS", category: "Services" },
    ],
    "P2A Transfer": [
      { id: "p1", date: "2025-09-03", merchant: "Transfer to Parents", amount: 30000, method: "P2A", category: "Family" },
      { id: "p2", date: "2025-09-07", merchant: "Transfer to Spouse", amount: 25000, method: "P2A", category: "Family" },
      { id: "p3", date: "2025-09-12", merchant: "Friend - Loan Repayment", amount: 15000, method: "P2A", category: "Personal" },
      { id: "p4", date: "2025-09-16", merchant: "Sibling", amount: 10000, method: "P2A", category: "Family" },
      { id: "p5", date: "2025-09-20", merchant: "Emergency Medical", amount: 20000, method: "P2A", category: "Emergency" },
      { id: "p6", date: "2025-09-24", merchant: "Transfer to Savings", amount: 50000, method: "P2A", category: "Savings" },
      { id: "p7", date: "2025-09-28", merchant: "Gift to Friend", amount: 5000, method: "P2A", category: "Personal" },
      { id: "p8", date: "2025-09-10", merchant: "Dinner Split", amount: 3000, method: "P2A", category: "Personal" },
      { id: "p9", date: "2025-09-18", merchant: "Travel Split", amount: 8000, method: "P2A", category: "Personal" },
    ],
    "Others": [
      { id: "o1", date: "2025-09-02", merchant: "Cash Payment", amount: 1500, method: "Cash", category: "Misc" },
      { id: "o2", date: "2025-09-06", merchant: "Paytm Wallet", merchantLogo: "https://logo.clearbit.com/paytm.com", amount: 2000, method: "Wallet", category: "Wallet" },
      { id: "o3", date: "2025-09-10", merchant: "Amazon Pay Balance", merchantLogo: "https://logo.clearbit.com/amazon.in", amount: 3500, method: "Wallet", category: "Wallet" },
      { id: "o4", date: "2025-09-14", merchant: "PhonePe Wallet", merchantLogo: "https://logo.clearbit.com/phonepe.com", amount: 1800, method: "Wallet", category: "Wallet" },
      { id: "o5", date: "2025-09-18", merchant: "Amazon Gift Card", merchantLogo: "https://logo.clearbit.com/amazon.in", amount: 5000, method: "Gift Card", category: "Gift Card" },
      { id: "o6", date: "2025-09-22", merchant: "Flipkart Gift Card", merchantLogo: "https://logo.clearbit.com/flipkart.com", amount: 3000, method: "Gift Card", category: "Gift Card" },
      { id: "o7", date: "2025-09-26", merchant: "WazirX Crypto", merchantLogo: "https://logo.clearbit.com/wazirx.com", amount: 25000, method: "Crypto", category: "Crypto" },
      { id: "o8", date: "2025-09-04", merchant: "Local Vendor", amount: 500, method: "Cash", category: "Misc" },
      { id: "o9", date: "2025-09-08", merchant: "Street Food", amount: 200, method: "Cash", category: "Food" },
      { id: "o10", merchant: "Auto Rickshaw", amount: 150, method: "Cash", category: "Travel", date: "2025-09-12" },
      { id: "o11", date: "2025-09-16", merchant: "Grocery Store", amount: 800, method: "Cash", category: "Groceries" },
      { id: "o12", date: "2025-09-20", merchant: "Uber Gift Card", merchantLogo: "https://logo.clearbit.com/uber.com", amount: 2000, method: "Gift Card", category: "Gift Card" },
    ],
  },
  p2mTransactions: [
    { range: "< ₹100", count: 45, percentage: 22, potentialRewards: 450 },
    { range: "₹100 - ₹200", count: 38, percentage: 19, potentialRewards: 760 },
    { range: "₹200 - ₹500", count: 52, percentage: 26, potentialRewards: 2600 },
    { range: "₹500 - ₹1000", count: 31, percentage: 15, potentialRewards: 3100 },
    { range: "₹1000 - ₹2000", count: 22, percentage: 11, potentialRewards: 4400 },
    { range: "> ₹2000", count: 14, percentage: 7, potentialRewards: 8400 },
  ],
  dailySpends: [
    { day: "1", amount: 2500 },
    { day: "2", amount: 3200 },
    { day: "3", amount: 1800 },
    { day: "4", amount: 4500 },
    { day: "5", amount: 3000 },
    { day: "6", amount: 5200 },
    { day: "7", amount: 2800 },
    { day: "8", amount: 3600 },
    { day: "9", amount: 4200 },
    { day: "10", amount: 3400 },
    { day: "11", amount: 2900 },
    { day: "12", amount: 3800 },
    { day: "13", amount: 4100 },
    { day: "14", amount: 3300 },
    { day: "15", amount: 5000 },
    { day: "16", amount: 3700 },
    { day: "17", amount: 2600 },
    { day: "18", amount: 4800 },
    { day: "19", amount: 3200 },
    { day: "20", amount: 4400 },
    { day: "21", amount: 2700 },
    { day: "22", amount: 3500 },
    { day: "23", amount: 4000 },
    { day: "24", amount: 3100 },
    { day: "25", amount: 4600 },
    { day: "26", amount: 3900 },
    { day: "27", amount: 2800 },
    { day: "28", amount: 4300 },
    { day: "29", amount: 3600 },
    { day: "30", amount: 4100 },
  ],
};

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [monthIndex, setMonthIndex] = useState(1); // Sep 2025
  const [selectedCardId, setSelectedCardId] = useState(MOCK_DATA.cards[0].id);
  const [optimizationPeriod, setOptimizationPeriod] = useState<"1m" | "3m" | "6m" | "12m">("12m");
  const [drillDownModal, setDrillDownModal] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
  }>({ isOpen: false, title: "", data: {} });
  const [paymentMethodModal, setPaymentMethodModal] = useState<{
    isOpen: boolean;
    method: string;
    color: string;
  }>({ isOpen: false, method: "", color: "" });
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    category: string;
    color: string;
  }>({ isOpen: false, category: "", color: "" });

  const handleMonthNavigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setMonthIndex((prev) => Math.max(0, prev - 1));
    } else {
      setMonthIndex((prev) => Math.min(MOCK_DATA.months.length - 1, prev + 1));
    }
  };

  const handleStatClick = (type: string) => {
    const currentMonth = MOCK_DATA.months[monthIndex];
    const first10DaysSpend = MOCK_DATA.dailySpends.slice(0, 10).reduce((sum, d) => sum + d.amount, 0);

    setDrillDownModal({
      isOpen: true,
      title: `${type} - ${currentMonth.month}`,
      data: {
        dailySpends: MOCK_DATA.dailySpends,
        transactionBreakdown: MOCK_DATA.p2mTransactions,
        summary: `In the first 10 days of ${currentMonth.month}, you spent ${formatINR(first10DaysSpend)}. Your highest spending was on day 6 (${formatINR(5200)}) and lowest on day 3 (${formatINR(1800)}).`,
      },
    });
  };

  const selectedCard = MOCK_DATA.cards.find((c) => c.id === selectedCardId) || MOCK_DATA.cards[0];
  const totalRewards = MOCK_DATA.cards.reduce((sum, c) => sum + c.rewardPoints, 0);
  const totalRewardValue = MOCK_DATA.cards.reduce((sum, c) => sum + c.rewardValue, 0);
  const totalLimit = MOCK_DATA.cards.reduce((sum, c) => sum + (c.limit || 0), 0);
  const avgUtilization = Math.round(MOCK_DATA.cards.reduce((sum, c) => sum + (c.utilizationPct || 0), 0) / MOCK_DATA.cards.length);
  const rewardableTransactions = MOCK_DATA.p2mTransactions.filter((t) => t.range.includes(">") || parseInt(t.range) >= 200);
  const totalRewardableValue = rewardableTransactions.reduce((sum, t) => sum + t.potentialRewards, 0);
  const totalRewardableCount = rewardableTransactions.reduce((sum, t) => sum + t.count, 0);

  // UPI P2M transactions for comparison
  const upiP2MTransactions = MOCK_DATA.paymentMethodTransactions["UPI"].filter((t) => t.isP2M);
  const upiMissedRewards = upiP2MTransactions.reduce((sum, t) => sum + (t.missedRewards || 0), 0);
  const ccTransactions = MOCK_DATA.paymentMethodTransactions["Credit Card"];
  const ccTotalSpend = ccTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="w-full max-w-[420px] min-h-screen bg-white shadow-2xl rounded-t-3xl flex flex-col">
        {/* Top bar */}
        <div className="h-3 safe-top" />
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Financial Life</h1>
        </div>

        {/* Main content */}
        <div className="flex-grow overflow-y-auto pb-20">
          {activeTab === "home" && (
            <div>
              <Hero data={MOCK_DATA.months} currentIndex={monthIndex} onNavigate={handleMonthNavigate} />

              {/* Bank Accounts */}
              <div className="mx-3 mt-5">
                <div className="text-xs text-muted-foreground mb-2">Accounts Considered</div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {MOCK_DATA.bankAccounts.map((bank) => (
                    <div key={bank.id} className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-200 min-w-fit">
                      <img src={bank.logo} alt={bank.name} className="h-6 w-6 rounded" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{bank.name}</div>
                        <div className="text-xs text-gray-500">{bank.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clickable stat cards for drill-down */}
              <div className="mx-3 mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStatClick("Expenses")}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-primary transition-all text-left"
                >
                  <div className="text-xs text-muted-foreground mb-1">Monthly Expenses</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatINR(MOCK_DATA.months[monthIndex].spends)}
                  </div>
                  <div className="text-xs text-primary mt-2 font-medium">View 30-day breakdown →</div>
                </button>

                <button
                  onClick={() => handleStatClick("Transactions")}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-primary transition-all text-left"
                >
                  <div className="text-xs text-muted-foreground mb-1">P2M Transactions</div>
                  <div className="text-xl font-bold text-foreground">
                    {MOCK_DATA.p2mTransactions.reduce((sum, t) => sum + t.count, 0)}
                  </div>
                  <div className="text-xs text-primary mt-2 font-medium">View analysis →</div>
                </button>
              </div>

              <ChartSection title="Incoming Split" data={MOCK_DATA.incomingSplit} type="bar" />
              
              {/* Spends by Category - with drill-down */}
              <div className="mx-3 mt-5">
                <div className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-900" /> Spends by Category
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                  {MOCK_DATA.categorySplit.map((c, i) => {
                    const total = MOCK_DATA.categorySplit.reduce((sum, cat) => sum + cat.value, 0);
                    const pctVal = ((c.value / total) * 100).toFixed(1);
                    return (
                      <button
                        key={i}
                        onClick={() => setCategoryModal({ isOpen: true, category: c.name, color: c.color })}
                        className="w-full mb-3 text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex justify-between font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: c.color }} />
                            {c.name}
                          </span>
                          <span>{formatINR(c.value)} • {pctVal}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${pctVal}%`, background: c.color }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods - with drill-down */}
              <div className="mx-3 mt-5">
                <div className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-900" /> Payment Methods
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                  {MOCK_DATA.spendsByInstrument.map((method, i) => {
                    const total = MOCK_DATA.spendsByInstrument.reduce((sum, m) => sum + m.value, 0);
                    const pctVal = ((method.value / total) * 100).toFixed(1);
                    return (
                      <button
                        key={i}
                        onClick={() => setPaymentMethodModal({ isOpen: true, method: method.name, color: method.color })}
                        className="w-full mb-3 text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex justify-between font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: method.color }} />
                            {method.name}
                          </span>
                          <span>{formatINR(method.value)} • {pctVal}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${pctVal}%`, background: method.color }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "optimize" && (
            <div className="p-4">
              {/* Credit Cards Overview */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground mb-3">Credit Cards</h2>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Cards</div>
                      <div className="font-bold text-lg">{MOCK_DATA.cards.length} active</div>
                      <div className="text-xs text-gray-400">
                        Total limit: {formatINR(totalLimit)} • Avg util: {avgUtilization}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total rewards</div>
                      <div className="font-bold text-right">{totalRewards.toLocaleString()} pts</div>
                      <div className="text-xs text-right text-success">{formatINR(totalRewardValue)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Credit Cards */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Quick view</div>
                <div className="overflow-x-auto no-scrollbar py-2">
                  <div className="flex gap-4">
                    {MOCK_DATA.cards.map((card) => (
                      <CreditCardFull 
                        key={card.id} 
                        card={card} 
                        isActive={selectedCardId === card.id}
                        onClick={() => setSelectedCardId(card.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Card Transactions */}
              <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Selected Card</div>
                    <div className="font-semibold text-base">{selectedCard.bank} • {selectedCard.name}</div>
                    <div className="text-xs text-gray-400">**** {selectedCard.last4} • Exp {selectedCard.exp}</div>
                  </div>
                  <div className="text-xs text-gray-500">Sep 2025 ▾</div>
                </div>

                {selectedCard.transactions && selectedCard.transactions.length > 0 ? (
                  <>
                    <div className="space-y-2 mb-4">
                      {selectedCard.transactions.map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            {txn.merchantLogo ? (
                              <img src={txn.merchantLogo} alt={txn.merchant} className="h-8 w-8 rounded-full object-cover bg-gray-100" />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                                {txn.merchant.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">{txn.merchant}</div>
                              <div className="text-xs text-gray-500">{txn.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">{formatINR(txn.amount)}</div>
                            <div className="text-xs text-gray-500">{txn.points} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <div className="text-xs text-gray-500">Total points (month)</div>
                        <div className="font-bold text-base">{selectedCard.transactions.reduce((sum, t) => sum + t.points, 0)}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <div className="text-xs text-gray-500">Card reward value</div>
                        <div className="font-bold text-base">{formatINR(selectedCard.rewardValue)}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">No transactions this month</div>
                )}
              </div>

              {/* Recommended Cards */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-foreground">Recommended for You</h2>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 mb-4">
                  <div className="text-sm font-semibold text-gray-900 mb-1">🎁 Get Offer Today (GOT)</div>
                  <div className="text-xs text-gray-700">
                    Based on your spending pattern, these cards can maximize your rewards by up to 3x! Apply today to unlock exclusive joining bonuses.
                  </div>
                </div>
                <div className="overflow-x-auto no-scrollbar py-2">
                  <div className="flex gap-4">
                    {RECOMMENDED_CARDS.map((card) => (
                      <CreditCardFull key={card.id} card={card} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Reward Optimization Analysis */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <h2 className="text-lg font-bold text-foreground">Reward Optimization Planner</h2>
                </div>
                
                {/* Time Period Selector */}
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                  {[
                    { key: "1m", label: "1 Month" },
                    { key: "3m", label: "3 Months" },
                    { key: "6m", label: "6 Months" },
                    { key: "12m", label: "12 Months" },
                  ].map((period) => (
                    <button
                      key={period.key}
                      onClick={() => setOptimizationPeriod(period.key as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        optimizationPeriod === period.key
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-primary"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>

                {/* Historical Optimization Data */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border mb-4">
                  {(() => {
                    const periodMap = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 };
                    const monthsToShow = periodMap[optimizationPeriod];
                    const historyData = MOCK_DATA.optimizationHistory.slice(-monthsToShow);
                    
                    const totalMissed = historyData.reduce((sum, m) => sum + m.missedRewards, 0);
                    const totalEarned = historyData.reduce((sum, m) => sum + m.earnedRewards, 0);
                    const totalPotential = historyData.reduce((sum, m) => sum + m.potentialRewards, 0);
                    const avgMissedPerMonth = Math.round(totalMissed / monthsToShow);
                    
                    return (
                      <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-xl">
                            <div className="text-xs text-gray-600 mb-1">Earned</div>
                            <div className="text-base font-bold text-success">{formatINR(totalEarned)}</div>
                            <div className="text-xs text-gray-500 mt-1">{monthsToShow}m avg</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-xl">
                            <div className="text-xs text-gray-600 mb-1">Missed</div>
                            <div className="text-base font-bold text-red-600">{formatINR(totalMissed)}</div>
                            <div className="text-xs text-gray-500 mt-1">{formatINR(avgMissedPerMonth)}/mo</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-xl">
                            <div className="text-xs text-gray-600 mb-1">Potential</div>
                            <div className="text-base font-bold text-purple-600">{formatINR(totalPotential)}</div>
                            <div className="text-xs text-gray-500 mt-1">max possible</div>
                          </div>
                        </div>

                        {/* Monthly Breakdown Chart */}
                        <div className="mb-4">
                          <div className="text-sm font-semibold text-gray-900 mb-3">Monthly Rewards Opportunity</div>
                          <div className="space-y-2">
                            {historyData.map((monthData, idx) => {
                              const missedPct = (monthData.missedRewards / monthData.potentialRewards) * 100;
                              const earnedPct = (monthData.earnedRewards / monthData.potentialRewards) * 100;
                              
                              return (
                                <div key={idx} className="border border-gray-200 rounded-xl p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="text-xs font-semibold text-gray-900">{monthData.month}</div>
                                    <div className="text-xs text-gray-500">
                                      Spend: {formatINR(monthData.totalSpends)}
                                    </div>
                                  </div>
                                  
                                  {/* Stacked Progress Bar */}
                                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex mb-2">
                                    <div 
                                      className="bg-success" 
                                      style={{ width: `${earnedPct}%` }}
                                      title={`Earned: ${formatINR(monthData.earnedRewards)}`}
                                    />
                                    <div 
                                      className="bg-red-500" 
                                      style={{ width: `${missedPct}%` }}
                                      title={`Missed: ${formatINR(monthData.missedRewards)}`}
                                    />
                                  </div>
                                  
                                  <div className="flex justify-between text-xs">
                                    <div className="flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-success" />
                                      <span className="text-gray-600">Earned: {formatINR(monthData.earnedRewards)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-red-500" />
                                      <span className="text-gray-600">Missed: {formatINR(monthData.missedRewards)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <div className="text-xs text-gray-600">
                                      <span className="font-semibold">UPI P2M:</span> {formatINR(monthData.upiP2MSpends)} • 
                                      <span className="font-semibold ml-2">CC:</span> {formatINR(monthData.creditCardSpends)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Insights */}
                        <div className="space-y-3">
                          <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
                            <div className="text-xs font-semibold text-gray-900 mb-1">💰 Optimization Opportunity</div>
                            <div className="text-xs text-gray-700">
                              In the last {monthsToShow} month{monthsToShow > 1 ? "s" : ""}, you missed{" "}
                              <span className="font-bold text-red-600">{formatINR(totalMissed)}</span> in rewards! 
                              Switch UPI P2M transactions to credit cards to earn more.
                            </div>
                          </div>

                          <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                            <div className="text-xs font-semibold text-gray-900 mb-1">✅ Good Progress</div>
                            <div className="text-xs text-gray-700">
                              You've earned <span className="font-bold text-success">{formatINR(totalEarned)}</span> in rewards. 
                              That's {Math.round((totalEarned / totalPotential) * 100)}% of your maximum potential!
                            </div>
                          </div>

                          <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                            <div className="text-xs font-semibold text-gray-900 mb-1">🎯 Monthly Goal</div>
                            <div className="text-xs text-gray-700">
                              Aim to reduce missed rewards to under {formatINR(avgMissedPerMonth / 2)} per month by using 
                              credit cards for all transactions above ₹200.
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                {/* Current Month Analysis */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border mb-4">
                  {/* Summary Cards */}
                  <div className="text-sm font-semibold text-gray-900 mb-3">Current Month (Sep 2025)</div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-1">Current Rewards</div>
                      <div className="text-base font-bold text-purple-600">{totalRewards.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatINR(totalRewardValue)}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-1">Missed (UPI)</div>
                      <div className="text-base font-bold text-red-600">{formatINR(upiMissedRewards)}</div>
                      <div className="text-xs text-gray-500 mt-1">{upiP2MTransactions.length} txns</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-1">Potential</div>
                      <div className="text-base font-bold text-success">{formatINR(totalRewardableValue)}</div>
                      <div className="text-xs text-gray-500 mt-1">with CC</div>
                    </div>
                  </div>

                  {/* P2M Transaction Breakdown */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-900 mb-2">P2M Transaction Analysis</div>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2 font-semibold text-gray-700">Amount Range</th>
                            <th className="text-right p-2 font-semibold text-gray-700">Count</th>
                            <th className="text-right p-2 font-semibold text-gray-700">%</th>
                            <th className="text-right p-2 font-semibold text-gray-700">Rewards</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MOCK_DATA.p2mTransactions.map((row, idx) => {
                            const isRewardable = row.range.includes(">") || parseInt(row.range) >= 200;
                            return (
                              <tr
                                key={idx}
                                className={`border-t border-gray-100 ${isRewardable ? "bg-green-50" : ""}`}
                              >
                                <td className="p-2 font-medium text-gray-900">{row.range}</td>
                                <td className="p-2 text-right text-gray-700">{row.count}</td>
                                <td className="p-2 text-right text-gray-600">{row.percentage}%</td>
                                <td className="p-2 text-right font-semibold text-success">
                                  {formatINR(row.potentialRewards)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Optimization Tips */}
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
                      <div className="text-xs font-semibold text-gray-900 mb-1">💡 Move to Credit Card</div>
                      <div className="text-xs text-gray-700">
                        <span className="font-bold text-red-600">{totalRewardableCount} transactions</span> (₹200+) should be moved to credit cards to earn up to{" "}
                        <span className="font-bold text-success">{formatINR(totalRewardableValue)}</span> more in rewards!
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                      <div className="text-xs font-semibold text-gray-900 mb-1">🔴 UPI P2M Lost Rewards</div>
                      <div className="text-xs text-gray-700">
                        You lost <span className="font-bold text-red-600">{formatINR(upiMissedRewards)}</span> in potential rewards by using UPI for{" "}
                        <span className="font-bold">{upiP2MTransactions.length} merchant transactions</span>. Switch to credit cards for these!
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <div className="text-xs font-semibold text-gray-900 mb-1">📊 Current CC Spend</div>
                      <div className="text-xs text-gray-700">
                        Current credit card spend: <span className="font-bold text-success">{formatINR(ccTotalSpend)}</span> earning good rewards. Keep it up!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "loans" && (
            <div className="p-4">
              <div className="text-lg font-bold mb-3 text-foreground">Loans</div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <p className="text-muted-foreground">No active loans</p>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="p-4">
              <div className="text-lg font-bold mb-3 text-foreground">Goals & Forecasts</div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <p className="text-muted-foreground">No goals configured yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Drill-down modal */}
        <DrillDownModal
          isOpen={drillDownModal.isOpen}
          onClose={() => setDrillDownModal({ isOpen: false, title: "", data: {} })}
          title={drillDownModal.title}
          data={drillDownModal.data}
        />

        {/* Payment Method Modal */}
        <PaymentMethodModal
          isOpen={paymentMethodModal.isOpen}
          onClose={() => setPaymentMethodModal({ isOpen: false, method: "", color: "" })}
          method={paymentMethodModal.method}
          transactions={MOCK_DATA.paymentMethodTransactions[paymentMethodModal.method as keyof typeof MOCK_DATA.paymentMethodTransactions] || []}
          color={paymentMethodModal.color}
        />

        {/* Category Drill-down Modal */}
        <CategoryDrillDownModal
          isOpen={categoryModal.isOpen}
          onClose={() => setCategoryModal({ isOpen: false, category: "", color: "" })}
          category={categoryModal.category}
          color={categoryModal.color}
          transactions={MOCK_DATA.categoryTransactions[categoryModal.category as keyof typeof MOCK_DATA.categoryTransactions] || []}
          monthlyData={[
            { month: "Jun", amount: 4200 },
            { month: "Jul", amount: 5100 },
            { month: "Aug", amount: 4800 },
            { month: "Sep", amount: MOCK_DATA.categorySplit.find(c => c.name === categoryModal.category)?.value || 0 },
          ]}
        />
      </div>
    </div>
  );
};

export default Index;
