import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface BankAccount {
  id: string;
  bank_name: string;
  account_type: string | null;
  last_4_digits: string | null;
  logo_url: string | null;
  primary_account: boolean;
}

export const BankAccountsSection = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('primary_account', { ascending: false });

      if (!error && data) {
        setAccounts(data);
      }
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="mx-3 mt-5">
      <div className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-foreground" /> Linked Accounts
      </div>
      <div className="space-y-2">
        {accounts.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No bank accounts detected yet</p>
            <p className="text-xs mt-1">Connect Gmail to auto-detect your banks</p>
          </Card>
        ) : (
          accounts.map((account) => (
          <Card key={account.id} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {account.logo_url ? (
                <img src={account.logo_url} alt={account.bank_name} className="w-6 h-6" />
              ) : (
                <Building2 className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">{account.bank_name}</div>
              <div className="text-xs text-muted-foreground">
                {account.account_type || 'Account'}
                {account.last_4_digits && ` •••• ${account.last_4_digits}`}
              </div>
            </div>
            {account.primary_account && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                Primary
              </span>
            )}
          </Card>
          ))
        )}
      </div>
    </div>
  );
};
