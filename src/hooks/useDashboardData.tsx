
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';

interface DashboardData {
  weeklyStats: {
    problemsSolved: number;
    timeSpent: number;
  };
  recentLogs: Array<{
    date: string;
    problems_solved: number;
  }>;
  contestsParticipated: number;
  currentStreak: number;
  weeklyGoals: Array<{
    id: string;
    goal_description: string;
    target_value: number;
    current_value: number;
    status: string;
  }>;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData>({
    weeklyStats: { problemsSolved: 0, timeSpent: 0 },
    recentLogs: [],
    contestsParticipated: 0,
    currentStreak: 0,
    weeklyGoals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get current week's start and end dates
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));

      // Fetch weekly stats
      const { data: weeklyData, error: weeklyError } = await supabaseClient
        .from('daily_logs')
        .select('problems_solved, time_spent_minutes')
        .eq('user_id', user.id)
        .gte('date', weekStart.toISOString().split('T')[0])
        .lte('date', weekEnd.toISOString().split('T')[0]);

      if (weeklyError) throw weeklyError;

      const weeklyStats = weeklyData?.reduce(
        (acc, log) => ({
          problemsSolved: acc.problemsSolved + log.problems_solved,
          timeSpent: acc.timeSpent + log.time_spent_minutes
        }),
        { problemsSolved: 0, timeSpent: 0 }
      ) || { problemsSolved: 0, timeSpent: 0 };

      // Fetch recent logs
      const { data: recentData, error: recentError } = await supabaseClient
        .from('daily_logs')
        .select('problems_solved, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7);

      if (recentError) throw recentError;

      // Fetch contest count
      const { data: contestData, error: contestError } = await supabaseClient
        .from('contest_logs')
        .select('id')
        .eq('user_id', user.id);

      if (contestError) throw contestError;

      // Calculate current streak
      const currentStreak = calculateStreak(recentData || []);

      // Fetch weekly goals with correct column name
      const { data: goalsData, error: goalsError } = await supabaseClient
        .from('weekly_goals')
        .select('id, goal_description, target_value, current_value, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (goalsError) throw goalsError;

      setData({
        weeklyStats,
        recentLogs: recentData || [],
        contestsParticipated: contestData?.length || 0,
        currentStreak,
        weeklyGoals: goalsData || []
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (logs: Array<{ date: string; problems_solved: number }>) => {
    if (!logs.length) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < logs.length; i++) {
      const logDate = new Date(logs[i].date);
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak && logs[i].problems_solved > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return { data, loading, refreshData: fetchDashboardData };
};
