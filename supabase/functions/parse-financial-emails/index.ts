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

    // Use Lovable AI to parse the financial transaction
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
            content: `You are a financial transaction parser for Indian banking emails and SMS. Extract transaction details and return ONLY a JSON object with these fields:
- amount: number (extract INR amount)
- date: ISO timestamp (extract transaction date/time)
- merchant: string (payee/merchant name)
- type: "credit" | "debit" | "refund"
- category: "salary" | "food_dining" | "shopping" | "travel" | "utilities" | "entertainment" | "investment" | "refund" | "emi" | "transfer" | "other"
- account_last_4: string (last 4 digits of account/card)
- description: string (brief summary)
- confidence: number (0-1, how confident you are)

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
        raw_email_subject: emailSubject,
        raw_email_body: emailBody.substring(0, 1000), // Truncate to avoid huge storage
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