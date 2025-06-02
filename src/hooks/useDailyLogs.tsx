
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient, DailyLog } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';

export const useDailyLogs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching daily logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch daily logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (logData: Omit<DailyLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    setCreating(true);
    try {
      const { data, error } = await supabaseClient
        .from('daily_logs')
        .insert({
          ...logData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Daily log created successfully!",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating daily log:', error);
      toast({
        title: "Error",
        description: "Failed to create daily log",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setCreating(false);
    }
  };

  const updateLog = async (id: string, updates: Partial<DailyLog>) => {
    try {
      const { data, error } = await supabaseClient
        .from('daily_logs')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => prev.map(log => log.id === id ? data : log));
      toast({
        title: "Success",
        description: "Daily log updated successfully!",
      });
    } catch (error) {
      console.error('Error updating daily log:', error);
      toast({
        title: "Error",
        description: "Failed to update daily log",
        variant: "destructive",
      });
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from('daily_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setLogs(prev => prev.filter(log => log.id !== id));
      toast({
        title: "Success",
        description: "Daily log deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting daily log:', error);
      toast({
        title: "Error",
        description: "Failed to delete daily log",
        variant: "destructive",
      });
    }
  };

  return {
    logs,
    loading,
    creating,
    createLog,
    updateLog,
    deleteLog,
    refreshLogs: fetchLogs,
  };
};
