
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface WeeklyGoal {
  id: string;
  week_start_date: string;
  goal_description: string;
  target_value: number;
  current_value: number;
  status: 'in_progress' | 'completed' | 'missed';
  review_notes: string | null;
}

export const WeeklyGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WeeklyGoal | null>(null);
  
  const [formData, setFormData] = useState({
    weekStartDate: '',
    goalDescription: '',
    targetValue: '',
  });

  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch weekly goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('weekly_goals')
        .insert({
          user_id: user!.id,
          week_start_date: formData.weekStartDate,
          goal_description: formData.goalDescription,
          target_value: parseInt(formData.targetValue),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Weekly goal created successfully!",
      });

      setFormData({ weekStartDate: '', goalDescription: '', targetValue: '' });
      setShowForm(false);
      fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create weekly goal",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateReview = async () => {
    if (!editingGoal) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('weekly_goals')
        .update({ review_notes: reviewNotes })
        .eq('id', editingGoal.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review notes updated successfully!",
      });

      setEditingGoal(null);
      setReviewNotes('');
      fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update review notes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: WeeklyGoal['status']) => {
    const variants = {
      in_progress: 'default',
      completed: 'success',
      missed: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status] || 'default'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="md:ml-64 p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Weekly Goals</h1>
            <p className="text-muted-foreground">Set and track your weekly objectives</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            Create New Goal
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Week Start Date"
                    id="weekStartDate"
                    type="date"
                    value={formData.weekStartDate}
                    onChange={(value) => setFormData({...formData, weekStartDate: value})}
                    required
                  />
                  <FormInput
                    label="Target Value"
                    id="targetValue"
                    type="number"
                    value={formData.targetValue}
                    onChange={(value) => setFormData({...formData, targetValue: value})}
                    placeholder="e.g., 20 problems"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="goalDescription" className="block text-sm font-medium mb-2">
                    Goal Description *
                  </label>
                  <Textarea
                    id="goalDescription"
                    value={formData.goalDescription}
                    onChange={(e) => setFormData({...formData, goalDescription: e.target.value})}
                    placeholder="e.g., Solve 20 medium difficulty problems focusing on dynamic programming"
                    required
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Creating..." : "Create Goal"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No weekly goals created yet. Create your first goal to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Week Start</th>
                      <th className="text-left py-2">Description</th>
                      <th className="text-left py-2">Target</th>
                      <th className="text-left py-2">Current</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map((goal) => (
                      <tr key={goal.id} className="border-b">
                        <td className="py-3">{goal.week_start_date}</td>
                        <td className="py-3 max-w-xs truncate">{goal.goal_description}</td>
                        <td className="py-3">{goal.target_value}</td>
                        <td className="py-3">{goal.current_value}</td>
                        <td className="py-3">{getStatusBadge(goal.status)}</td>
                        <td className="py-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingGoal(goal);
                                  setReviewNotes(goal.review_notes || '');
                                }}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Goal</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p><strong>Goal:</strong> {goal.goal_description}</p>
                                  <p><strong>Progress:</strong> {goal.current_value} / {goal.target_value}</p>
                                </div>
                                <div>
                                  <label htmlFor="reviewNotes" className="block text-sm font-medium mb-2">
                                    Review Notes
                                  </label>
                                  <Textarea
                                    id="reviewNotes"
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    placeholder="How did this week go? What did you learn?"
                                    rows={4}
                                  />
                                </div>
                                <Button onClick={handleUpdateReview} disabled={saving}>
                                  {saving ? "Saving..." : "Save Review"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
