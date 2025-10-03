import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  onAccept: () => void;
}

export const TermsModal = ({ onAccept }: TermsModalProps) => {
  const [accepted, setAccepted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Terms and Conditions</h3>
        <p className="text-sm text-muted-foreground">
          Please read and accept our terms and conditions to continue
        </p>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
            I have read and agree to the{" "}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button className="text-primary underline hover:text-primary/80">
                  Terms and Conditions
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Terms and Conditions</DialogTitle>
                  <DialogDescription>
                    Last updated: {new Date().toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4 text-sm">
                    <section>
                      <h4 className="font-semibold mb-2">1. Acceptance of Terms</h4>
                      <p className="text-muted-foreground">
                        By accessing and using this financial management application, you accept and agree to be bound by the terms and provision of this agreement.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">2. Use of Service</h4>
                      <p className="text-muted-foreground">
                        You agree to use this service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the service.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">3. Privacy and Data Protection</h4>
                      <p className="text-muted-foreground">
                        We are committed to protecting your privacy. Your personal information will be collected, used and stored in accordance with our Privacy Policy. We use industry-standard encryption to protect your financial data.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">4. Email Access</h4>
                      <p className="text-muted-foreground">
                        By connecting your email account, you grant us permission to read transaction-related emails for the purpose of tracking your finances. We will never access personal conversations or share your email data with third parties.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">5. Financial Information</h4>
                      <p className="text-muted-foreground">
                        The financial information and insights provided by this application are for informational purposes only and should not be considered as financial advice.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">6. Account Security</h4>
                      <p className="text-muted-foreground">
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">7. Modifications to Service</h4>
                      <p className="text-muted-foreground">
                        We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">8. Limitation of Liability</h4>
                      <p className="text-muted-foreground">
                        We shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">9. Contact</h4>
                      <p className="text-muted-foreground">
                        If you have any questions about these Terms and Conditions, please contact us.
                      </p>
                    </section>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </label>
        </div>
      </div>

      <Button 
        onClick={handleAccept} 
        disabled={!accepted}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
};
