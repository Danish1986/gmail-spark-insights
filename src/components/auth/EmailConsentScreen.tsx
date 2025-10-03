import { Button } from "@/components/ui/button";
import { Mail, Lock, Sparkles } from "lucide-react";

interface EmailConsentScreenProps {
  onConsent: (skipConsent: boolean) => void;
}

export const EmailConsentScreen = ({ onConsent }: EmailConsentScreenProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Connect Your Email</h3>
        <p className="text-muted-foreground">
          We'll fetch information from your email account to make your finances simpler
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Smart Transaction Detection</p>
            <p className="text-sm text-muted-foreground">
              Automatically identifies purchase confirmations, bills, and receipts
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Privacy Protected</p>
            <p className="text-sm text-muted-foreground">
              We only read transaction emails. Your personal conversations remain private
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-center text-muted-foreground">
          We support Gmail, Outlook, and Yahoo
        </p>
        
        <Button 
          onClick={() => onConsent(false)} 
          className="w-full"
          size="lg"
        >
          Connect Email Account
        </Button>

        <Button 
          onClick={() => onConsent(true)} 
          variant="ghost"
          className="w-full"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};
