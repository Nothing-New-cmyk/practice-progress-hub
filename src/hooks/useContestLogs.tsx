
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient, ContestLog } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';

export const useContestLogs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<ContestLog[]>([]);
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
        .from('contest_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching contest logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contest logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (logData: Omit<ContestLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    setCreating(true);
    try {
      const { data, error } = await supabaseClient
        .from('contest_logs')
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
        description: "Contest log created successfully!",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating contest log:', error);
      toast({
        title: "Error",
        description: "Failed to create contest log",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setCreating(false);
    }
  };

  const updateLog = async (id: string, updates: Partial<ContestLog>) => {
    try {
      const { data, error } = await supabaseClient
        .from('contest_logs')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => prev.map(log => log.id === id ? data : log));
      toast({
        title: "Success",
        description: "Contest log updated successfully!",
      });
    } catch (error) {
      console.error('Error updating contest log:', error);
      toast({
        title: "Error",
        description: "Failed to update contest log",
        variant: "destructive",
      });
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from('contest_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setLogs(prev => prev.filter(log => log.id !== id));
      toast({
        title: "Success",
        description: "Contest log deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting contest log:', error);
      toast({
        title: "Error",
        description: "Failed to delete contest log",
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
