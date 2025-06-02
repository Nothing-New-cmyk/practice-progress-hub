
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient, WeeklyGoal } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';

export const useWeeklyGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabaseClient
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching weekly goals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch weekly goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<WeeklyGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    setCreating(true);
    try {
      const { data, error } = await supabaseClient
        .from('weekly_goals')
        .insert({
          ...goalData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Weekly goal created successfully!",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating weekly goal:', error);
      toast({
        title: "Error",
        description: "Failed to create weekly goal",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setCreating(false);
    }
  };

  const updateGoal = async (id: string, updates: Partial<WeeklyGoal>) => {
    try {
      const { data, error } = await supabaseClient
        .from('weekly_goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      toast({
        title: "Success",
        description: "Weekly goal updated successfully!",
      });
    } catch (error) {
      console.error('Error updating weekly goal:', error);
      toast({
        title: "Error",
        description: "Failed to update weekly goal",
        variant: "destructive",
      });
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from('weekly_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast({
        title: "Success",
        description: "Weekly goal deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting weekly goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete weekly goal",
        variant: "destructive",
      });
    }
  };

  return {
    goals,
    loading,
    creating,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: fetchGoals,
  };
};
