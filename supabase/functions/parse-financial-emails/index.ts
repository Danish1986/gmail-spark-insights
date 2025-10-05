import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ====== RULE-BASED PARSING HELPERS ======

// Regex patterns for amount and transaction type detection
const CURRENCY_RE = /(?:rs\.?\s*|inr\s*|₹\s*)([0-9\.,]+)/gi;
const DEBIT_INDICATORS = /\b(debited|spent|purchase|payment|withdrawal|dr\b)\b/i;
const CREDIT_INDICATORS = /\b(credited|received|deposited|refund|cr\b)\b/i;
const FAILED_TX = /\b(failed|declined|reversed)\b/i;

// Bank domains for validation
const BANK_DOMAINS = [
  "hdfcbank.com", "hdfcbank.net", "email.hdfcbank.com",
  "icicibank.com", "email.icicibank.com", "kotak.com", "kotakmail.com",
  "axisbank.com", "email.axisbank.com", "sbi.co.in", "sbicard.com",
  "americanexpress.com", "aexp.com", "hsbc.co.in", "hsbc.com",
  "citi.com", "citibank.com", "indusind.com", "yesbank.in",
  "dcbbank.com", "jupiter.money", "dbs.com", "paytm.com", "phonepe.com"
];

// Merchant category mappings
const MERCHANT_CATEGORIES: Record<string, string[]> = {
  investment: ["zerodha", "upstox", "groww", "angelone", "angel one", "dhan", "sip debit", "mutual fund", "coin", "paytm money", "5paisa", "kuvera"],
  emi: ["emi", "loan payment", "loan repayment", "loan installment", "equated monthly installment"],
  credit_card_bill: ["payment towards credit card", "cred", "creditcard payment", "credit card bill", "supercard", "onecard"],
  shopping: ["amazon", "flipkart", "myntra", "ajio", "meesho", "croma", "reliance digital", "decathlon", "nykaa"],
  food_dining: ["zomato", "swiggy", "eatsure", "domino", "pizza hut", "mcdonald", "kfc", "starbucks", "restaurant", "cafe"],
  travel: ["ola", "uber", "rapido", "irctc", "makemytrip", "goibibo", "cleartrip", "indigo", "vistara", "air india", "yatra", "redbus"],
  fuel: ["petrol", "hpcl", "bpcl", "iocl", "shell", "diesel"],
  utilities: ["electricity", "airtel", "jio", "vodafone", "vi", "broadband", "postpaid", "dth", "water bill", "gas bill"],
  groceries: ["bigbasket", "blinkit", "instamart", "zepto", "dmart", "dunzo"],
  entertainment: ["bookmyshow", "pvr", "inox", "netflix", "prime video", "hotstar", "spotify", "youtube premium"]
};

// Income category mappings
const INCOME_CATEGORIES: Record<string, string[]> = {
  salary: ["salary", "sal deposit", "payroll", "monthly salary"],
  interest: ["interest credited", "interest paid"],
  refund: ["refund", "cashback"],
  investment_returns: ["dividend", "redemption"],
  transfers_received: ["neft credit", "rtgs credit", "imps credit", "upi credit"]
};

// Rule-based amount and type extractor
function extractAmountAndType(text: string): { amount: number | null; type: string | null } {
  if (!text) return { amount: null, type: null };
  
  const textLower = text.toLowerCase();
  
  // Check for failed transactions first
  if (FAILED_TX.test(textLower)) {
    return { amount: null, type: null };
  }
  
  // Check for credits first (to avoid misclassifying refunds)
  if (CREDIT_INDICATORS.test(textLower)) {
    const match = CURRENCY_RE.exec(text);
    if (match) {
      try {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        return { amount, type: 'credit' };
      } catch (e) {
        // Continue to debit check
      }
    }
  }
  
  // Check for debits
  if (DEBIT_INDICATORS.test(textLower)) {
    const match = CURRENCY_RE.exec(text);
    if (match) {
      try {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        return { amount, type: 'debit' };
      } catch (e) {
        return { amount: null, type: null };
      }
    }
  }
  
  return { amount: null, type: null };
}

// Rule-based categorizer
function categorizeByRules(text: string, txType: string): string {
  const textLower = text.toLowerCase();
  
  if (txType === 'debit') {
    // Check EMI first (highest priority for debits)
    for (const keyword of MERCHANT_CATEGORIES.emi) {
      if (textLower.includes(keyword)) return 'emi';
    }
    
    // Check other categories
    for (const [category, keywords] of Object.entries(MERCHANT_CATEGORIES)) {
      for (const keyword of keywords) {
        if (textLower.includes(keyword)) return category;
      }
    }
    
    return 'other';
  }
  
  if (txType === 'credit') {
    for (const [category, keywords] of Object.entries(INCOME_CATEGORIES)) {
      for (const keyword of keywords) {
        if (textLower.includes(keyword)) return category;
      }
    }
    
    return 'other';
  }
  
  return 'other';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { emailSubject, emailBody, emailId } = await req.json();

    console.log('Parsing email:', emailId, 'for user:', user.id);

    // PRE-PROCESSING: Extract amount and type using regex rules
    const fullText = `${emailSubject} ${emailBody}`;
    const ruleBasedResult = extractAmountAndType(fullText);

    console.log('Rule-based extraction:', ruleBasedResult);

    // If rules can't extract transaction, skip AI call
    if (!ruleBasedResult.amount || !ruleBasedResult.type) {
      console.log('Not a financial transaction (rule-based check)');
      return new Response(JSON.stringify({ is_transaction: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use Lovable AI to parse the financial transaction with improved categorization
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a financial transaction parser for Indian banking emails and SMS. Extract transaction details and return ONLY a JSON object.

BANK DOMAINS TO RECOGNIZE:
${BANK_DOMAINS.join(', ')}

CRITICAL CATEGORIZATION RULES (check patterns in this exact order):

1. UPI PATTERN DETECTION (HIGHEST PRIORITY - check first!):
   - Pattern "UPI/P2A/" or "IMPS/P2A/" = Person-to-Account transfer → category: "p2a_transfer", payment_method: "UPI-P2A"
   - Pattern "UPI/P2M/" = Person-to-Merchant payment → Extract merchant name from: UPI/P2M/<transaction_id>/<MERCHANT_NAME>
   - After extracting merchant from P2M, continue to step 2-6 to categorize the merchant

2. INVESTMENT PLATFORMS (check before other categories):
   - Merchants: ${MERCHANT_CATEGORIES.investment.join(', ')}
   - Keywords in body: "SIP", "mutual fund", "stock purchase", "equity", "dividend", "redemption", "NAV"
   - → category: "investment", payment_method: extract from email

3. CREDIT CARD PAYMENTS (via any method including UPI):
   - Keywords: ${MERCHANT_CATEGORIES.credit_card_bill.join(', ')}
   - → category: "credit_card_bill"

4. LOAN EMI:
   - Keywords: ${MERCHANT_CATEGORIES.emi.join(', ')}
   - → category: "emi"

5. SALARY (for credits):
   - Keywords: ${INCOME_CATEGORIES.salary.join(', ')}
   - Usually large credits on 25th-5th of month
   - → category: "salary"

6. INCOME CATEGORIES (for credits):
   - interest: ${INCOME_CATEGORIES.interest.join(', ')}
   - refund: ${INCOME_CATEGORIES.refund.join(', ')}
   - investment_returns: ${INCOME_CATEGORIES.investment_returns.join(', ')}
   - transfers_received: ${INCOME_CATEGORIES.transfers_received.join(', ')}

7. MERCHANT CATEGORIES (only if not matched above):
   - shopping: ${MERCHANT_CATEGORIES.shopping.slice(0, 5).join(', ')}...
   - food_dining: ${MERCHANT_CATEGORIES.food_dining.slice(0, 5).join(', ')}...
   - travel: ${MERCHANT_CATEGORIES.travel.slice(0, 5).join(', ')}...
   - utilities: ${MERCHANT_CATEGORIES.utilities.slice(0, 5).join(', ')}...
   - groceries: ${MERCHANT_CATEGORIES.groceries.slice(0, 5).join(', ')}...
   - entertainment: ${MERCHANT_CATEGORIES.entertainment.slice(0, 5).join(', ')}...

8. DEFAULT:
   - P2M payments not matching above → "p2m_payment"
   - Others → "other"

HINT: Based on regex analysis, this appears to be a ${ruleBasedResult.type} transaction of amount ${ruleBasedResult.amount}.

PAYMENT METHOD DETECTION:
- "UPI/P2A" or "IMPS/P2A" → "UPI-P2A"
- "UPI/P2M" → "UPI-P2M"
- "UPI" (general) → "UPI"
- "Credit Card" transaction → "Credit Card"
- "Debit Card" or account debit → "Debit Card"
- "NEFT", "RTGS", "IMPS" → respective value
- Default → "Other"

REQUIRED JSON FIELDS:
{
  "amount": number,
  "date": "ISO timestamp",
  "merchant": "extracted merchant name",
  "type": "credit" | "debit" | "refund",
  "category": "salary" | "food_dining" | "shopping" | "travel" | "utilities" | "entertainment" | "investment" | "refund" | "emi" | "p2a_transfer" | "p2m_payment" | "credit_card_bill" | "groceries" | "other",
  "account_last_4": "last 4 digits",
  "description": "brief summary",
  "confidence": 0.0-1.0,
  "payment_method": "UPI-P2A" | "UPI-P2M" | "UPI" | "Credit Card" | "Debit Card" | "NEFT" | "IMPS" | "RTGS" | "Other"
}

EXAMPLE PARSING:
Input: "IMPS/P2A/527352542774/SUHAILA/"
Output: {category: "p2a_transfer", merchant: "SUHAILA", payment_method: "UPI-P2A"}

Input: "UPI/P2M/408359412488/Utkarsh SuperCard R"
Output: {category: "credit_card_bill", merchant: "Utkarsh SuperCard", payment_method: "UPI-P2M"}

Input: "UPI/P2M/171142254626/Angel One Limited"
Output: {category: "investment", merchant: "Angel One", payment_method: "UPI-P2M"}

Input: "UPI/P2M/12345/Swiggy"
Output: {category: "food_dining", merchant: "Swiggy", payment_method: "UPI-P2M"}

If not a financial transaction, return {"is_transaction": false}`
          },
          {
            role: 'user',
            content: `Subject: ${emailSubject}\n\nBody: ${emailBody}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      return new Response(JSON.stringify({ error: 'AI parsing failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const parsedText = aiData.choices[0].message.content;
    
    // Extract JSON from AI response with fallback to rule-based parsing
    let parsed;
    let parsingMethod = 'ai-only';
    
    try {
      const jsonMatch = parsedText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : parsedText);
      parsingMethod = 'hybrid';
    } catch (e) {
      console.error('Failed to parse AI response, using rule-based fallback');
      
      // FALLBACK TO RULE-BASED PARSING
      const category = categorizeByRules(fullText, ruleBasedResult.type || 'debit');
      
      parsed = {
        amount: ruleBasedResult.amount,
        type: ruleBasedResult.type,
        category: category,
        merchant: emailSubject.substring(0, 50),
        date: new Date().toISOString(),
        account_last_4: null,
        description: emailBody.substring(0, 100),
        confidence: 0.6,
        payment_method: 'Other'
      };
      
      console.log('Using rule-based fallback:', parsed);
    }

    // VALIDATION: Cross-check AI output with regex results
    if (parsed.is_transaction !== false && ruleBasedResult.amount && ruleBasedResult.type) {
      // Validate amount
      if (Math.abs(parsed.amount - ruleBasedResult.amount) > 1) {
        console.warn('AI amount mismatch, using regex amount:', ruleBasedResult.amount);
        parsed.amount = ruleBasedResult.amount;
        parsed.confidence = Math.max(0.5, (parsed.confidence || 0.8) - 0.2);
      }
      
      // Validate transaction type
      if (parsed.type !== ruleBasedResult.type) {
        console.warn('AI type mismatch, using regex type:', ruleBasedResult.type);
        parsed.type = ruleBasedResult.type;
        parsed.confidence = Math.max(0.5, (parsed.confidence || 0.8) - 0.2);
      }
      
      // If AI confidence is low, double-check with rules
      if ((parsed.confidence || 0) < 0.7) {
        const ruleCategory = categorizeByRules(fullText, parsed.type);
        if (ruleCategory !== 'other' && ruleCategory !== parsed.category) {
          console.log('Low AI confidence, using rule-based category:', ruleCategory);
          parsed.category = ruleCategory;
        }
      }
    }

    if (parsed.is_transaction === false) {
      return new Response(JSON.stringify({ is_transaction: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log parsing result
    console.log(`Transaction parsed via ${parsingMethod}, confidence: ${parsed.confidence || 0.5}`);

    // Insert transaction into database
    const { data: transaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        email_id: emailId,
        date: parsed.date || new Date().toISOString(),
        amount: parsed.amount,
        type: parsed.type,
        category: parsed.category || 'other',
        merchant: parsed.merchant,
        account_source: parsed.account_last_4,
        description: `[${parsingMethod}] ${parsed.description || ''}`,
        payment_method: parsed.payment_method || 'Other',
        raw_email_subject: emailSubject,
        raw_email_body: emailBody.substring(0, 1000),
        confidence_score: parsed.confidence || 0.5,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Transaction created:', transaction.id);

    return new Response(JSON.stringify({ success: true, transaction }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});