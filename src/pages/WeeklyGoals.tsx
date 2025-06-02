import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient, WeeklyGoal } from '@/lib/supabase-utils';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const WeeklyGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Form state
  const [weekStartDate, setWeekStartDate] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');

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
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabaseClient
        .from('weekly_goals')
        .insert({
          user_id: user.id,
          week_start_date: weekStartDate,
          goal_description: goalDescription,
          target_value: parseInt(targetValue) || 0,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Weekly goal created successfully!",
      });

      // Reset form and refresh goals
      setWeekStartDate('');
      setGoalDescription('');
      setTargetValue('');
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewUpdate = async (goalId: string) => {
    if (!user) return;

    try {
      const { error } = await supabaseClient
        .from('weekly_goals')
        .update({ review_notes: reviewNotes })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review notes updated successfully!",
      });

      setShowReviewModal(null);
      setReviewNotes('');
      fetchGoals();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'missed': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Weekly Goals</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Goal Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput
                    label="Week Start Date"
                    id="weekStartDate"
                    type="date"
                    value={weekStartDate}
                    onChange={setWeekStartDate}
                    required
                  />
                  <FormInput
                    label="Goal Description"
                    id="goalDescription"
                    value={goalDescription}
                    onChange={setGoalDescription}
                    placeholder="e.g., Solve 20 problems this week"
                    required
                  />
                  <FormInput
                    label="Target Value"
                    id="targetValue"
                    type="number"
                    value={targetValue}
                    onChange={setTargetValue}
                    placeholder="20"
                    required
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Goal"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Goals List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No goals created yet. Create your first goal!
                    </p>
                  ) : (
                    goals.map((goal) => (
                      <div key={goal.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{goal.goal_description}</h3>
                          <span className={`text-sm font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Week of {new Date(goal.week_start_date).toLocaleDateString()}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            Progress: {goal.current_value} / {goal.target_value}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowReviewModal(goal.id);
                              setReviewNotes(goal.review_notes || '');
                            }}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Modal */}
          {showReviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Review Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review notes..."
                    rows={4}
                    className="mb-4"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReviewUpdate(showReviewModal)}
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReviewModal(null);
                        setReviewNotes('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
