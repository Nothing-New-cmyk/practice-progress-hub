
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface WeeklySummary {
  problemsThisWeek: number;
  hoursThisWeek: number;
  currentStreak: number;
  badgesEarned: number;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<WeeklySummary>({
    problemsThisWeek: 0,
    hoursThisWeek: 0,
    currentStreak: 0,
    badgesEarned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      try {
        // Fetch problems and hours this week
        const { data: weeklyLogs } = await supabase
          .from('daily_logs' as any)
          .select('problems_solved, time_spent_minutes')
          .eq('user_id', user.id)
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0]);

        // Fetch badges
        const { data: badges } = await supabase
          .from('user_badges' as any)
          .select('id')
          .eq('user_id', user.id);

        // Calculate summary
        const problemsThisWeek = weeklyLogs?.reduce((sum: number, log: any) => sum + (log.problems_solved || 0), 0) || 0;
        const hoursThisWeek = Math.round((weeklyLogs?.reduce((sum: number, log: any) => sum + (log.time_spent_minutes || 0), 0) || 0) / 60);
        const badgesEarned = badges?.length || 0;

        setSummary({
          problemsThisWeek,
          hoursThisWeek,
          currentStreak: 0, // TODO: Calculate actual streak
          badgesEarned,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { summary, loading };
};
