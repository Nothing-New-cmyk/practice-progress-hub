
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
    platform: string;
    topic: string;
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
  heatmapData: Array<{
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }>;
  difficultyData: Array<{
    difficulty: string;
    count: number;
    color: string;
  }>;
  topicsData: Array<{
    topic: string;
    solved: number;
    total: number;
    percentage: number;
  }>;
  badgesCount: number;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData>({
    weeklyStats: { problemsSolved: 0, timeSpent: 0 },
    recentLogs: [],
    contestsParticipated: 0,
    currentStreak: 0,
    weeklyGoals: [],
    heatmapData: [],
    difficultyData: [],
    topicsData: [],
    badgesCount: 0
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
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // Fetch all daily logs for comprehensive analysis
      const { data: allLogs, error: logsError } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (logsError) {
        console.error('Error fetching daily logs:', logsError);
        throw logsError;
      }

      // Process weekly stats
      const weeklyStats = (allLogs || [])
        .filter(log => {
          const logDate = new Date(log.date + 'T00:00:00');
          return logDate >= weekStart && logDate <= weekEnd;
        })
        .reduce(
          (acc, log) => ({
            problemsSolved: acc.problemsSolved + (log.problems_solved || 0),
            timeSpent: acc.timeSpent + (log.time_spent_minutes || 0)
          }),
          { problemsSolved: 0, timeSpent: 0 }
        );

      // Process heatmap data
      const heatmapData = generateHeatmapData(allLogs || []);

      // Process difficulty data
      const difficultyData = processDifficultyData(allLogs || []);

      // Process topics data
      const topicsData = processTopicsData(allLogs || []);

      // Fetch contest count
      const { data: contestData, error: contestError } = await supabaseClient
        .from('contest_logs')
        .select('id')
        .eq('user_id', user.id);

      if (contestError) {
        console.error('Error fetching contest logs:', contestError);
      }

      // Calculate current streak
      const currentStreak = calculateStreak(allLogs || []);

      // Fetch weekly goals
      const { data: goalsData, error: goalsError } = await supabaseClient
        .from('weekly_goals')
        .select('id, goal_description, target_value, current_value, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (goalsError) {
        console.error('Error fetching weekly goals:', goalsError);
      }

      // Fetch badges count
      const { data: badgesData, error: badgesError } = await supabaseClient
        .from('user_badges')
        .select('id')
        .eq('user_id', user.id);

      if (badgesError) {
        console.error('Error fetching badges:', badgesError);
      }

      setData({
        weeklyStats,
        recentLogs: (allLogs || []).slice(0, 7).map(log => ({
          date: log.date,
          problems_solved: log.problems_solved || 0,
          platform: log.platform || 'Unknown',
          topic: log.topic || 'General'
        })),
        contestsParticipated: contestData?.length || 0,
        currentStreak,
        weeklyGoals: goalsData || [],
        heatmapData,
        difficultyData,
        topicsData,
        badgesCount: badgesData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateHeatmapData = (logs: any[]) => {
    const heatmapData = [];
    const logMap = new Map();
    
    // Create a map of date -> problems solved
    logs.forEach(log => {
      const date = log.date;
      const existing = logMap.get(date) || 0;
      logMap.set(date, existing + (log.problems_solved || 0));
    });

    // Generate data for the last 365 days
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = logMap.get(dateStr) || 0;
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 1) level = 1;
      if (count >= 3) level = 2;
      if (count >= 5) level = 3;
      if (count >= 8) level = 4;

      heatmapData.push({ date: dateStr, count, level });
    }

    return heatmapData;
  };

  const processDifficultyData = (logs: any[]) => {
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    
    logs.forEach(log => {
      const difficulty = log.difficulty?.toLowerCase();
      if (difficulty && difficultyCounts.hasOwnProperty(difficulty)) {
        difficultyCounts[difficulty as keyof typeof difficultyCounts] += log.problems_solved || 0;
      }
    });

    return [
      { difficulty: 'Easy', count: difficultyCounts.easy, color: '#10B981' },
      { difficulty: 'Medium', count: difficultyCounts.medium, color: '#F59E0B' },
      { difficulty: 'Hard', count: difficultyCounts.hard, color: '#EF4444' }
    ].filter(item => item.count > 0); // Only show difficulties with data
  };

  const processTopicsData = (logs: any[]) => {
    const topicCounts = new Map();
    
    logs.forEach(log => {
      if (log.topic) {
        const current = topicCounts.get(log.topic) || 0;
        topicCounts.set(log.topic, current + (log.problems_solved || 0));
      }
    });

    return Array.from(topicCounts.entries())
      .map(([topic, solved]) => ({
        topic,
        solved: solved as number,
        total: (solved as number) + Math.max(5, Math.floor((solved as number) * 0.2)),
        percentage: Math.min(100, ((solved as number) / ((solved as number) + Math.max(5, Math.floor((solved as number) * 0.2)))) * 100)
      }))
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 5);
  };

  const calculateStreak = (logs: any[]) => {
    if (!logs.length) return 0;

    const today = new Date();
    let streak = 0;
    
    // Check each day going backwards from today
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const logForDate = logs.find(log => log.date === dateStr);
      if (logForDate && logForDate.problems_solved > 0) {
        streak++;
      } else if (i > 0) {
        // Only break if we've moved past today and found a gap
        break;
      }
    }
    
    return streak;
  };

  return { data, loading, refreshData: fetchDashboardData };
};
