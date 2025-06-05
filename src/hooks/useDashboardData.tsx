
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-utils';

interface WeeklySummary {
  problemsThisWeek: number;
  hoursThisWeek: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  badgesEarned: number;
  latestBadgeName: string;
  totalProblems: number;
  totalContests: number;
  totalGoals: number;
  completedGoals: number;
  bestWeek: number;
  fastestSolve: number;
  currentLevelLabel: string;
  currentXP: number;
  nextLevelXP: number;
  difficultyData: Array<{ name: string; value: number; color: string }>;
  topicProgress: Array<{ topic: string; solved: number; total: number; percentage: number }>;
  weeklyGoals: Array<{
    id: string;
    goal: string;
    current: number;
    target: number;
    status: 'active' | 'completed' | 'missed';
  }>;
  reminders: Array<{
    id: string;
    type: string;
    time: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earned: boolean;
    earnedDate?: string;
    icon: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    time: string;
    platform: string;
  }>;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    await fetchData();
  };

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    try {
      // Fetch problems and hours this week from daily logs
      const { data: weeklyLogs, error: weeklyError } = await supabaseClient
        .from('daily_logs')
        .select('problems_solved, time_spent_minutes')
        .eq('user_id', user.id)
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0]);

      if (weeklyError) throw weeklyError;

      // Fetch all daily logs for total problems
      const { data: allLogs, error: allError } = await supabaseClient
        .from('daily_logs')
        .select('problems_solved, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (allError) throw allError;

      // Fetch contest logs
      const { data: contests, error: contestError } = await supabaseClient
        .from('contest_logs')
        .select('id')
        .eq('user_id', user.id);

      if (contestError) throw contestError;

      // Fetch weekly goals
      const { data: goals, error: goalsError } = await supabaseClient
        .from('weekly_goals')
        .select('id, goal, target_value, current_value, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      // Calculate summary with proper data structure
      const problemsThisWeek = weeklyLogs?.reduce((sum: number, log: any) => sum + (log.problems_solved || 0), 0) || 0;
      const hoursThisWeek = Math.round((weeklyLogs?.reduce((sum: number, log: any) => sum + (log.time_spent_minutes || 0), 0) || 0) / 60);
      const totalProblems = allLogs?.reduce((sum: number, log: any) => sum + (log.problems_solved || 0), 0) || 0;
      const totalContests = contests?.length || 0;
      const totalGoals = goals?.length || 0;
      const completedGoals = goals?.filter((goal: any) => goal.status === 'completed').length || 0;

      // Mock data for features not yet implemented
      const mockSummary: WeeklySummary = {
        problemsThisWeek,
        hoursThisWeek,
        currentStreak: Math.floor(Math.random() * 15) + 1,
        longestStreak: Math.floor(Math.random() * 30) + 15,
        lastActivityDate: new Date().toISOString(),
        badgesEarned: Math.floor(Math.random() * 10) + 3,
        latestBadgeName: "Problem Solver",
        totalProblems,
        totalContests,
        totalGoals,
        completedGoals,
        bestWeek: Math.max(problemsThisWeek, Math.floor(Math.random() * 25) + 10),
        fastestSolve: Math.floor(Math.random() * 15) + 5,
        currentLevelLabel: "Intermediate",
        currentXP: Math.floor(Math.random() * 5000) + 2500,
        nextLevelXP: 8000,
        difficultyData: [
          { name: 'Easy', value: Math.floor(Math.random() * 50) + 20, color: '#10B981' },
          { name: 'Medium', value: Math.floor(Math.random() * 30) + 10, color: '#F59E0B' },
          { name: 'Hard', value: Math.floor(Math.random() * 15) + 5, color: '#EF4444' }
        ],
        topicProgress: [
          { topic: 'Arrays', solved: 45, total: 60, percentage: 75 },
          { topic: 'Trees', solved: 23, total: 40, percentage: 58 },
          { topic: 'Graphs', solved: 12, total: 35, percentage: 34 },
          { topic: 'Dynamic Programming', solved: 8, total: 25, percentage: 32 }
        ],
        weeklyGoals: goals?.map((goal: any) => ({
          id: goal.id,
          goal: goal.goal,
          current: goal.current_value || 0,
          target: goal.target_value || 10,
          status: goal.status || 'active'
        })) || [
          { id: '1', goal: 'Solve 15 problems', current: problemsThisWeek, target: 15, status: problemsThisWeek >= 15 ? 'completed' : 'active' },
          { id: '2', goal: 'Study 10 hours', current: hoursThisWeek, target: 10, status: hoursThisWeek >= 10 ? 'completed' : 'active' }
        ],
        reminders: [
          { id: '1', type: 'Daily Practice Reminder', time: '9:00 AM', priority: 'high' },
          { id: '2', type: 'Weekly Goal Check', time: 'Sunday 6:00 PM', priority: 'medium' },
          { id: '3', type: 'Contest Alert', time: '1 hour before', priority: 'high' }
        ],
        achievements: [
          { id: '1', title: 'First Steps', description: 'Completed your first problem', earned: true, earnedDate: '2024-01-15', icon: '🎯' },
          { id: '2', title: 'Streak Master', description: 'Maintained a 7-day streak', earned: true, earnedDate: '2024-02-01', icon: '🔥' },
          { id: '3', title: 'Speed Demon', description: 'Solved a problem in under 5 minutes', earned: false, icon: '⚡' }
        ],
        recentActivity: [
          { id: '1', action: 'Solved "Two Sum"', time: '2 hours ago', platform: 'LeetCode' },
          { id: '2', action: 'Completed contest', time: '1 day ago', platform: 'Codeforces' },
          { id: '3', action: 'Studied Trees', time: '2 days ago', platform: 'Study Session' }
        ]
      };

      setSummary(mockSummary);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return { summary, loading, error, refetch };
};
