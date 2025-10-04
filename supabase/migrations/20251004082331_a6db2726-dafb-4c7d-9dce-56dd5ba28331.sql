-- Update transaction categories to include P2A and P2M
ALTER TYPE transaction_category ADD VALUE IF NOT EXISTS 'p2a_transfer';
ALTER TYPE transaction_category ADD VALUE IF NOT EXISTS 'p2m_payment';
ALTER TYPE transaction_category ADD VALUE IF NOT EXISTS 'credit_card_bill';

-- Add payment_method column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS payment_method TEXT;