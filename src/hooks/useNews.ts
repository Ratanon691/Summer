import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewsItem {
  id: number;
  title: string | null;
  content: string | null;
  timestamp: string | null;
  symbol: string | null;
  sentiment: string | null;
  tag: string | null;
  links: string | null;
}

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as NewsItem[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};