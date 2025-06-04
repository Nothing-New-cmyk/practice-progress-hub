
import { supabase } from '@/integrations/supabase/client';

export interface DashboardData {
  problemsThisWeek: number;
  hoursThisWeek: number;
  currentStreak: number;
  badgesEarned: number;
  completedGoals: number;
  totalGoals: number;
}

export interface DailyLogEntry {
  id: string;
  date: string;
  topic: string;
  problemsSolved: number;
  platform: string;
  difficulty: string;
  timeSpent: number;
  notes?: string;
  resources?: string[];
  nextSteps?: string;
}

export interface ContestLogEntry {
  id: string;
  contestName: string;
  date: string;
  rank?: number;
  totalParticipants?: number;
  problemsSolved: number;
  score?: string;
  platform: string;
  notes?: string;
  nextSteps?: string;
}

export interface WeeklyGoal {
  id: string;
  goal: string;
  target: number;
  current: number;
  status: 'in_progress' | 'completed' | 'missed';
  weekStartDate: string;
}

export class ApiService {
  // Dashboard Data
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current week's data
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const { data: dailyLogs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startOfWeek.toISOString().split('T')[0]);

      const { data: goals } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', startOfWeek.toISOString().split('T')[0]);

      const { data: badges } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      return {
        problemsThisWeek: dailyLogs?.reduce((sum, log) => sum + log.problems_solved, 0) || 0,
        hoursThisWeek: dailyLogs?.reduce((sum, log) => sum + Math.floor(log.time_spent_minutes / 60), 0) || 0,
        currentStreak: await this.calculateStreak(user.id),
        badgesEarned: badges?.length || 0,
        completedGoals: goals?.filter(g => g.status === 'completed').length || 0,
        totalGoals: goals?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data for development
      return {
        problemsThisWeek: 12,
        hoursThisWeek: 8,
        currentStreak: 5,
        badgesEarned: 3,
        completedGoals: 2,
        totalGoals: 4,
      };
    }
  }

  // Daily Logs
  static async getDailyLogs(): Promise<DailyLogEntry[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      return data?.map(log => ({
        id: log.id,
        date: log.date,
        topic: log.topic,
        problemsSolved: log.problems_solved,
        platform: log.platform,
        difficulty: log.difficulty,
        timeSpent: log.time_spent_minutes,
        notes: log.notes,
        resources: log.resources,
        nextSteps: log.next_steps,
      })) || [];
    } catch (error) {
      console.error('Error fetching daily logs:', error);
      return [];
    }
  }

  static async createDailyLog(log: Omit<DailyLogEntry, 'id'>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('daily_logs')
      .insert({
        user_id: user.id,
        date: log.date,
        topic: log.topic,
        problems_solved: log.problemsSolved,
        platform: log.platform,
        difficulty: log.difficulty,
        time_spent_minutes: log.timeSpent,
        notes: log.notes,
        resources: log.resources,
        next_steps: log.nextSteps,
      });

    if (error) throw error;
  }

  // Contest Logs
  static async getContestLogs(): Promise<ContestLogEntry[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('contest_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      return data?.map(log => ({
        id: log.id,
        contestName: log.contest_name,
        date: log.date,
        rank: log.rank,
        totalParticipants: log.total_participants,
        problemsSolved: log.problems_solved,
        score: log.time_score,
        platform: log.platform,
        notes: log.notes,
        nextSteps: log.next_steps,
      })) || [];
    } catch (error) {
      console.error('Error fetching contest logs:', error);
      return [];
    }
  }

  static async createContestLog(log: Omit<ContestLogEntry, 'id'>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('contest_logs')
      .insert({
        user_id: user.id,
        contest_name: log.contestName,
        date: log.date,
        rank: log.rank,
        total_participants: log.totalParticipants,
        problems_solved: log.problemsSolved,
        time_score: log.score,
        platform: log.platform,
        notes: log.notes,
        next_steps: log.nextSteps,
      });

    if (error) throw error;
  }

  // Weekly Goals
  static async getWeeklyGoals(): Promise<WeeklyGoal[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false });

      if (error) throw error;

      return data?.map(goal => ({
        id: goal.id,
        goal: goal.goal_description,
        target: goal.target_value,
        current: goal.current_value,
        status: goal.status as 'in_progress' | 'completed' | 'missed',
        weekStartDate: goal.week_start_date,
      })) || [];
    } catch (error) {
      console.error('Error fetching weekly goals:', error);
      return [];
    }
  }

  // Helper method to calculate streak
  static async calculateStreak(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('date')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error || !data) return 0;

      let streak = 0;
      const today = new Date();
      const dates = data.map(log => new Date(log.date));

      for (let i = 0; i < dates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        expectedDate.setHours(0, 0, 0, 0);

        const logDate = new Date(dates[i]);
        logDate.setHours(0, 0, 0, 0);

        if (logDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }
}
