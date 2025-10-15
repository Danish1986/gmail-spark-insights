import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Wallet } from "lucide-react";

interface BalanceTransferTogglesProps {
  onTogglePersonalLoan: (enabled: boolean) => void;
  onToggleCreditCards: (enabled: boolean) => void;
  onToggleExtraCash: (enabled: boolean, amount: number) => void;
  personalLoanEnabled?: boolean;
  creditCardsEnabled?: boolean;
  extraCashEnabled?: boolean;
}

export const BalanceTransferToggles = ({
  onTogglePersonalLoan,
  onToggleCreditCards,
  onToggleExtraCash,
  personalLoanEnabled = true,
  creditCardsEnabled = false,
  extraCashEnabled = false,
}: BalanceTransferTogglesProps) => {
  const [showCashInput, setShowCashInput] = useState(false);
  const [cashAmount, setCashAmount] = useState(0);

  const handleExtraCashToggle = (checked: boolean) => {
    setShowCashInput(checked);
    if (!checked) {
      setCashAmount(0);
      onToggleExtraCash(false, 0);
    }
  };

  const handleCashAmountChange = (value: string) => {
    const amount = parseInt(value) || 0;
    setCashAmount(amount);
    onToggleExtraCash(true, amount);
  };

  return (
    <div className="bg-card border rounded-xl p-3 space-y-2.5 mb-3">
      <div className="text-xs font-semibold text-foreground mb-2">Balance Transfer Options</div>
      
      {/* Personal Loan Toggle */}
      <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
        <Label htmlFor="personal-loan" className="text-xs font-medium cursor-pointer flex items-center gap-2">
          <Wallet className="h-3.5 w-3.5 text-blue-500" />
          Include Personal Loan
        </Label>
        <Switch
          id="personal-loan"
          checked={personalLoanEnabled}
          onCheckedChange={onTogglePersonalLoan}
        />
      </div>

      {/* Credit Cards Toggle */}
      <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
        <Label htmlFor="credit-cards" className="text-xs font-medium cursor-pointer flex items-center gap-2">
          <CreditCard className="h-3.5 w-3.5 text-purple-500" />
          Include Credit Cards
        </Label>
        <Switch
          id="credit-cards"
          checked={creditCardsEnabled}
          onCheckedChange={onToggleCreditCards}
        />
      </div>

      {/* Extra Cash Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
          <Label htmlFor="extra-cash" className="text-xs font-medium cursor-pointer flex items-center gap-2">
            <Wallet className="h-3.5 w-3.5 text-green-500" />
            Add Extra Cash in Hand
          </Label>
          <Switch
            id="extra-cash"
            checked={extraCashEnabled}
            onCheckedChange={handleExtraCashToggle}
          />
        </div>
        
        {showCashInput && (
          <div className="pl-6 animate-in slide-in-from-top-2">
            <Input
              type="number"
              placeholder="Enter amount"
              value={cashAmount || ""}
              onChange={(e) => handleCashAmountChange(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};
