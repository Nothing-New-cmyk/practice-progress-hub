
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-utils';

interface WeeklySummary {
  problemsThisWeek: number;
  hoursThisWeek: number;
  currentStreak: number;
  badgesEarned: number;
  totalProblems: number;
  totalContests: number;
  totalGoals: number;
  completedGoals: number;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<WeeklySummary>({
    problemsThisWeek: 0,
    hoursThisWeek: 0,
    currentStreak: 0,
    badgesEarned: 0,
    totalProblems: 0,
    totalContests: 0,
    totalGoals: 0,
    completedGoals: 0,
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
        // Fetch problems and hours this week from daily logs
        const { data: weeklyLogs } = await supabaseClient
          .from('daily_logs')
          .select('problems_solved, time_spent_minutes')
          .eq('user_id', user.id)
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0]);

        // Fetch all daily logs for total problems
        const { data: allLogs } = await supabaseClient
          .from('daily_logs')
          .select('problems_solved')
          .eq('user_id', user.id);

        // Fetch contest logs
        const { data: contests } = await supabaseClient
          .from('contest_logs')
          .select('id')
          .eq('user_id', user.id);

        // Fetch weekly goals
        const { data: goals } = await supabaseClient
          .from('weekly_goals')
          .select('id, status')
          .eq('user_id', user.id);

        // Fetch badges
        const { data: badges } = await supabaseClient
          .from('user_badges')
          .select('id')
          .eq('user_id', user.id);

        // Calculate summary
        const problemsThisWeek = weeklyLogs?.reduce((sum: number, log: any) => sum + (log.problems_solved || 0), 0) || 0;
        const hoursThisWeek = Math.round((weeklyLogs?.reduce((sum: number, log: any) => sum + (log.time_spent_minutes || 0), 0) || 0) / 60);
        const totalProblems = allLogs?.reduce((sum: number, log: any) => sum + (log.problems_solved || 0), 0) || 0;
        const badgesEarned = badges?.length || 0;
        const totalContests = contests?.length || 0;
        const totalGoals = goals?.length || 0;
        const completedGoals = goals?.filter((goal: any) => goal.status === 'completed').length || 0;

        setSummary({
          problemsThisWeek,
          hoursThisWeek,
          currentStreak: 0, // TODO: Calculate actual streak based on daily logs
          badgesEarned,
          totalProblems,
          totalContests,
          totalGoals,
          completedGoals,
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
