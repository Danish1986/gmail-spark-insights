-- Add new columns for tiered sync progress tracking
ALTER TABLE public.sync_status
ADD COLUMN IF NOT EXISTS sync_phase TEXT DEFAULT 'idle',
ADD COLUMN IF NOT EXISTS phase_1_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phase_2_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phase_3_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phase_4_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_emails_found INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_status TEXT DEFAULT 'idle',
ADD COLUMN IF NOT EXISTS estimated_completion_time TIMESTAMPTZ;

-- Add DELETE policy for bank_accounts (GDPR compliance)
CREATE POLICY "Users can delete own bank accounts"
ON public.bank_accounts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);