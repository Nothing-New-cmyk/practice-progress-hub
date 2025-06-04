
import { supabase } from '@/integrations/supabase/client';

// Utility function to bypass strict typing for database operations
export const supabaseClient = supabase as any;

// Type definitions for our database tables
export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  topic: string;
  platform: string;
  difficulty: string;
  problems_solved: number;
  time_spent_minutes: number;
  problem_url?: string;
  notes?: string;
  resources?: string[];
  next_steps?: string;
  created_at: string;
  updated_at: string;
}

export interface ContestLog {
  id: string;
  user_id: string;
  contest_name: string;
  date: string;
  platform: string;
  rank?: number;
  total_participants?: number;
  problems_solved: number;
  time_score?: string;
  contest_url?: string;
  notes?: string;
  next_steps?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyGoal {
  id: string;
  user_id: string;
  week_start_date: string;
  goal_description: string;
  target_value: number;
  current_value: number;
  status: 'in_progress' | 'completed' | 'missed';
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  time_zone: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  channel: 'email' | 'whatsapp';
  type: 'daily_practice' | 'weekly_checkin' | 'monthly_summary' | 'goal_reminder';
  enabled: boolean;
  delivery_time: string;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}
