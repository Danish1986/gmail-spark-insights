import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PaymentModal = ({ isOpen, onClose, amount, onSuccess }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: Smartphone, description: "Pay via Google Pay, PhonePe, Paytm" },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
    { id: "netbanking", name: "Net Banking", icon: Building2, description: "All major banks supported" },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast({
      title: "Payment Successful!",
      description: "Your Financial Health Report is being generated.",
    });
    
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        {/* Amount Display */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 mb-4">
          <div className="text-sm text-muted-foreground mb-1">Amount to Pay</div>
          <div className="text-3xl font-bold text-foreground">{formatINR(amount)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            For Financial Health Report
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-4">
          <div className="text-sm font-semibold text-foreground mb-2">Select Payment Method</div>
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedMethod === method.id ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      selectedMethod === method.id ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-sm">{method.name}</div>
                    <div className="text-xs text-muted-foreground">{method.description}</div>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Security Info */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
          <div className="text-xs font-semibold text-green-600 mb-1">🔒 Secure Payment</div>
          <div className="text-xs text-muted-foreground">
            Your payment is encrypted and secure. We never store your payment details.
          </div>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={!selectedMethod || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay ${formatINR(amount)}`
          )}
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          By proceeding, you agree to our Terms & Conditions
        </div>
      </DialogContent>
    </Dialog>
  );
};
