import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const TransactionSchema = z.object({
  amount: z.number().positive().max(10000000),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  type: z.enum(['credit', 'debit', 'refund']),
  category: z.enum([
    'salary', 'food_dining', 'shopping', 'travel', 'utilities',
    'entertainment', 'investment', 'refund', 'emi', 'transfer',
    'other', 'p2a_transfer', 'p2m_payment', 'credit_card_bill'
  ]),
  merchant: z.string().max(200).trim().optional().nullable(),
  description: z.string().max(500).trim().optional().nullable(),
  payment_method: z.string().max(50).optional().nullable(),
  confidence_score: z.number().min(0).max(1).optional().nullable(),
  account_source: z.string().max(100).optional().nullable(),
});

export function sanitizeText(input: string | null | undefined): string | null {
  if (!input) return null;
  return input
    .replace(/[<>"']/g, '') // Remove HTML/script chars
    .trim()
    .substring(0, 500);
}

export function sanitizeMerchant(input: string | null | undefined): string | null {
  if (!input) return null;
  return input
    .replace(/[<>"']/g, '')
    .trim()
    .substring(0, 200);
}
