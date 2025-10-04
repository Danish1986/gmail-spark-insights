import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MonthData {
  month: string;
  income: number;
  spends: number;
  investments: number;
  categories: Record<string, number>;
  transactions: any[];
}

export const useFinancialData = () => {
  return useQuery({
    queryKey: ['financial-data'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('aggregate-financials');
      
      if (error) throw error;
      
      return data.data as MonthData[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useSyncStatus = () => {
  return useQuery({
    queryKey: ['sync-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sync_status')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
      
      return data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};