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
      
      // Handle both nested data.data and direct data responses
      const result = data?.data || data || [];
      return result as MonthData[];
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 1, // Only retry once on failure
    staleTime: 30000, // Consider data fresh for 30 seconds
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