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

    // Group transactions by month - TABULAR FORMAT
    const monthlyData: Record<string, any> = {};
    const categoryTotals: Record<string, Record<string, number>> = {};
    const paymentMethodTotals: Record<string, Record<string, number>> = {};
    const merchantBreakdown: Record<string, Record<string, number>> = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          monthKey,
          income: 0,
          spends: 0,
          investments: 0,
          emi: 0,
          credit_card_bill: 0,
          p2a_transfers: 0,
          p2m_payments: 0,
          categories: {},
          payment_methods: {},
          merchants: {},
          transactions: [],
        };
        categoryTotals[monthKey] = {};
        paymentMethodTotals[monthKey] = {};
        merchantBreakdown[monthKey] = {};
      }

      const amount = parseFloat(tx.amount);

      // Income vs Expense categorization
      if (tx.type === 'credit') {
        monthlyData[monthKey].income += amount;
      } else if (tx.type === 'debit') {
        if (tx.category === 'investment') {
          monthlyData[monthKey].investments += amount;
        } else if (tx.category === 'emi') {
          monthlyData[monthKey].emi += amount;
        } else if (tx.category === 'credit_card_bill') {
          monthlyData[monthKey].credit_card_bill += amount;
        } else if (tx.category === 'p2a_transfer') {
          monthlyData[monthKey].p2a_transfers += amount;
        } else if (tx.category === 'p2m_payment') {
          monthlyData[monthKey].p2m_payments += amount;
        } else {
          monthlyData[monthKey].spends += amount;
        }
      }

      // Category breakdown
      if (!categoryTotals[monthKey][tx.category]) {
        categoryTotals[monthKey][tx.category] = 0;
      }
      categoryTotals[monthKey][tx.category] += amount;

      // Payment method breakdown
      const paymentMethod = tx.payment_method || 'Other';
      if (!paymentMethodTotals[monthKey][paymentMethod]) {
        paymentMethodTotals[monthKey][paymentMethod] = 0;
      }
      paymentMethodTotals[monthKey][paymentMethod] += amount;

      // Merchant breakdown (for P2M and P2A)
      if (tx.merchant && (tx.category === 'p2m_payment' || tx.category === 'p2a_transfer')) {
        if (!merchantBreakdown[monthKey][tx.merchant]) {
          merchantBreakdown[monthKey][tx.merchant] = 0;
        }
        merchantBreakdown[monthKey][tx.merchant] += amount;
      }

      monthlyData[monthKey].transactions.push(tx);
    });

    // Add aggregated data to monthly records
    Object.keys(monthlyData).forEach(monthKey => {
      monthlyData[monthKey].categories = categoryTotals[monthKey];
      monthlyData[monthKey].payment_methods = paymentMethodTotals[monthKey];
      monthlyData[monthKey].merchants = merchantBreakdown[monthKey];
    });

    // Convert to array and sort by month
    const aggregated = Object.entries(monthlyData)
      .map(([key, data]) => data)
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey));

    // Generate tabular summary report
    const tabularReport = {
      summary: aggregated.map(month => ({
        month: month.month,
        income: month.income,
        spends: month.spends,
        investments: month.investments,
        emi: month.emi,
        credit_card_bill: month.credit_card_bill,
        p2a_transfers: month.p2a_transfers,
        p2m_payments: month.p2m_payments,
        total_outflow: month.spends + month.investments + month.emi + month.credit_card_bill + month.p2a_transfers + month.p2m_payments,
        amount_left: month.income - (month.spends + month.investments + month.emi + month.credit_card_bill + month.p2a_transfers + month.p2m_payments),
      })),
      categoryBreakdown: aggregated.map(month => ({
        month: month.month,
        ...month.categories
      })),
      paymentMethodBreakdown: aggregated.map(month => ({
        month: month.month,
        ...month.payment_methods
      })),
      merchantBreakdown: aggregated.map(month => ({
        month: month.month,
        merchants: Object.entries(month.merchants)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 20) // Top 20 merchants per month
          .reduce((acc, [merchant, amount]) => ({ ...acc, [merchant]: amount }), {})
      }))
    };

    return new Response(JSON.stringify({ 
      success: true, 
      data: aggregated,
      tabular: tabularReport 
    }), {
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