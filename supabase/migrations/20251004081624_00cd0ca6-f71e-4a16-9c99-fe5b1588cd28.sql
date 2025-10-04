-- Create enum for transaction types
CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'refund');

-- Create enum for transaction categories
CREATE TYPE transaction_category AS ENUM (
  'salary',
  'food_dining',
  'shopping',
  'travel',
  'utilities',
  'entertainment',
  'investment',
  'refund',
  'emi',
  'transfer',
  'other'
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_id TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  type transaction_type NOT NULL,
  category transaction_category NOT NULL DEFAULT 'other',
  merchant TEXT,
  account_source TEXT,
  description TEXT,
  raw_email_subject TEXT,
  raw_email_body TEXT,
  confidence_score DECIMAL(3, 2),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bank_accounts table
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_type TEXT,
  last_4_digits TEXT,
  logo_url TEXT,
  primary_account BOOLEAN DEFAULT false,
  detected_from_email BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sync_status table
CREATE TABLE public.sync_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_in_progress BOOLEAN DEFAULT false,
  emails_processed INTEGER DEFAULT 0,
  transactions_found INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for bank_accounts
CREATE POLICY "Users can view own bank accounts"
  ON public.bank_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank accounts"
  ON public.bank_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank accounts"
  ON public.bank_accounts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for sync_status
CREATE POLICY "Users can view own sync status"
  ON public.sync_status FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync status"
  ON public.sync_status FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sync status"
  ON public.sync_status FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON public.transactions(category);
CREATE INDEX idx_bank_accounts_user ON public.bank_accounts(user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sync_status_updated_at
  BEFORE UPDATE ON public.sync_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();