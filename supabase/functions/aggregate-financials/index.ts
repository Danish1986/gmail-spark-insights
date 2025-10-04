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

    console.log('Aggregating financials for user:', user.id);

    // Fetch all transactions for the user
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (txError) {
      return new Response(JSON.stringify({ error: txError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Group transactions by month
    const monthlyData: Record<string, any> = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          income: 0,
          spends: 0,
          investments: 0,
          categories: {},
          transactions: [],
        };
      }

      const amount = parseFloat(tx.amount);

      // Add to appropriate bucket
      if (tx.type === 'credit') {
        if (tx.category === 'salary' || tx.category === 'refund') {
          monthlyData[monthKey].income += amount;
        } else if (tx.category === 'investment') {
          monthlyData[monthKey].income += amount; // Investment returns
        }
      } else if (tx.type === 'debit') {
        if (tx.category === 'investment') {
          monthlyData[monthKey].investments += amount;
        } else {
          monthlyData[monthKey].spends += amount;
        }
      }

      // Category breakdown
      if (!monthlyData[monthKey].categories[tx.category]) {
        monthlyData[monthKey].categories[tx.category] = 0;
      }
      monthlyData[monthKey].categories[tx.category] += amount;

      monthlyData[monthKey].transactions.push(tx);
    });

    // Convert to array and sort by month
    const aggregated = Object.entries(monthlyData)
      .map(([key, data]) => ({
        monthKey: key,
        ...data,
      }))
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey));

    return new Response(JSON.stringify({ success: true, data: aggregated }), {
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