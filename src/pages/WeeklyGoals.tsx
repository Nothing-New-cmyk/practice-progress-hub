
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient, WeeklyGoal } from '@/lib/supabase-utils';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'missed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default' as const;
      case 'missed':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <div className="md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Weekly Goals
              </h1>
            </div>
            <p className="text-muted-foreground">Set and track your weekly learning objectives</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Create Goal Form */}
            <Card className="xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Goal
                </CardTitle>
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
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.length === 0 ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No goals created yet</p>
                      <p className="text-sm text-gray-400">Create your first goal to start tracking your progress!</p>
                    </div>
                  ) : (
                    goals.map((goal) => {
                      const progressPercentage = Math.min((goal.current_value / goal.target_value) * 100, 100);
                      
                      return (
                        <Card key={goal.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{goal.goal_description}</h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="h-3 w-3" />
                                    Week of {new Date(goal.week_start_date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant={getStatusVariant(goal.status)} className="flex items-center gap-1">
                                  {getStatusIcon(goal.status)}
                                  {goal.status.replace('_', ' ')}
                                </Badge>
                              </div>

                              {/* Progress */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span className="font-medium">
                                    {goal.current_value} / {goal.target_value}
                                  </span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                  {progressPercentage.toFixed(0)}% complete
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setShowReviewModal(goal.id);
                                    setReviewNotes(goal.review_notes || '');
                                  }}
                                >
                                  {goal.review_notes ? 'Edit Review' : 'Add Review'}
                                </Button>
                              </div>

                              {/* Review Notes */}
                              {goal.review_notes && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium mb-1">Review Notes:</p>
                                  <p className="text-sm text-gray-600">{goal.review_notes}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
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
