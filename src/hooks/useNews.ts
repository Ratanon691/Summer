
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  sentiment: string;
  symbol: string;
  tag: string;
  links: string;
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

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }

      return data as NewsItem[];
    },
  });
};
