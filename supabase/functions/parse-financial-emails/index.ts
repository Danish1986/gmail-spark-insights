import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

CRITICAL CATEGORIZATION RULES (check patterns in this exact order):

1. UPI PATTERN DETECTION (HIGHEST PRIORITY - check first!):
   - Pattern "UPI/P2A/" or "IMPS/P2A/" = Person-to-Account transfer → category: "p2a_transfer", payment_method: "UPI-P2A"
   - Pattern "UPI/P2M/" = Person-to-Merchant payment → Extract merchant name from: UPI/P2M/<transaction_id>/<MERCHANT_NAME>
   - After extracting merchant from P2M, continue to step 2-6 to categorize the merchant

2. INVESTMENT PLATFORMS (check before other categories):
   - Merchants: "Zerodha", "Upstox", "Groww", "Angel One", "Dhan", "Coin", "Paytm Money", "5paisa", "Kuvera"
   - Keywords in body: "SIP", "mutual fund", "stock purchase", "equity", "dividend", "redemption", "NAV"
   - → category: "investment", payment_method: extract from email

3. CREDIT CARD PAYMENTS (via any method including UPI):
   - Merchant names containing: "CRED", "SuperCard", "OneCard", "Card", "Credit"
   - Keywords: "credit card payment", "CC bill", "card bill payment", "payment towards credit card"
   - → category: "credit_card_bill"

4. LOAN EMI:
   - Keywords: "EMI", "loan payment", "loan installment", "equated monthly installment"
   - → category: "emi"

5. SALARY:
   - Keywords: "salary", "sal credit", "payroll", "monthly salary"
   - Usually large credits on 25th-5th of month
   - → category: "salary"

6. MERCHANT CATEGORIES (only if not matched above):
   - food_dining: Swiggy, Zomato, restaurants, food delivery
   - shopping: Amazon, Flipkart, Myntra, e-commerce
   - travel: Uber, Ola, IRCTC, flights (NOT P2A transfers!)
   - utilities: Airtel, Jio, Vodafone, electricity bill
   - groceries: BigBasket, Blinkit, Zepto, Instamart
   - entertainment: BookMyShow, Netflix, Prime Video

7. DEFAULT:
   - P2M payments not matching above → "p2m_payment"
   - Others → "other"

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
    
    // Extract JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = parsedText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : parsedText);
    } catch (e) {
      console.error('Failed to parse AI response:', parsedText);
      return new Response(JSON.stringify({ error: 'Invalid AI response format' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (parsed.is_transaction === false) {
      return new Response(JSON.stringify({ is_transaction: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
        description: parsed.description,
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