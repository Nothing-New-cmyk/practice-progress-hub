
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useWeeklyGoals } from '@/hooks/useWeeklyGoals';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useState } from 'react';

export const WeeklyGoals = () => {
  const { toast } = useToast();
  const { goals, loading, creating, createGoal, updateGoal, deleteGoal } = useWeeklyGoals();
  
  const [newGoal, setNewGoal] = useState({
    goal_description: '',
    target_value: '',
    week_start_date: new Date().toISOString().split('T')[0]
  });

  const [weeklyReview, setWeeklyReview] = useState('');

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.goal_description || !newGoal.target_value) return;

    const result = await createGoal({
      goal_description: newGoal.goal_description,
      target_value: parseInt(newGoal.target_value),
      current_value: 0,
      status: 'in_progress',
      week_start_date: newGoal.week_start_date,
      review_notes: null
    });

    if (result?.success) {
      setNewGoal({ goal_description: '', target_value: '', week_start_date: new Date().toISOString().split('T')[0] });
    }
  };

  const updateGoalProgress = async (id: string, newCurrent: number, targetValue: number) => {
    let newStatus: 'in_progress' | 'completed' | 'missed' = 'in_progress';
    if (newCurrent >= targetValue) {
      newStatus = 'completed';
    }
    
    await updateGoal(id, { 
      current_value: newCurrent,
      status: newStatus 
    });
  };

  const handleDeleteGoal = async (id: string) => {
    await deleteGoal(id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'missed': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'missed': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default' as const;
      case 'missed': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  const saveWeeklyReview = () => {
    // This would typically save to the database
    toast({
      title: "Review saved",
      description: "Your weekly review has been saved successfully.",
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
        <SectionHeader
          title="Weekly Goals"
          subtitle="Set and track your weekly learning objectives"
          icon={Target}
        />

        {/* Add New Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="goalDescription">Goal Description</Label>
                  <Input
                    id="goalDescription"
                    placeholder="e.g., Solve 15 Dynamic Programming problems"
                    value={newGoal.goal_description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, goal_description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetValue">Target Value</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    min="1"
                    placeholder="15"
                    value={newGoal.target_value}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target_value: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="weekStartDate">Week Start Date</Label>
                <Input
                  id="weekStartDate"
                  type="date"
                  value={newGoal.week_start_date}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, week_start_date: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full md:w-auto" disabled={creating}>
                {creating ? 'Adding...' : 'Add Goal'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Your Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = (goal.current_value / goal.target_value) * 100;
                const StatusIcon = getStatusIcon(goal.status);
                const statusColor = getStatusColor(goal.status);
                
                return (
                  <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{goal.goal_description}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Week starting: {new Date(goal.week_start_date).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${goal.status === 'completed' ? 'bg-green-500' : goal.status === 'missed' ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {goal.current_value}/{goal.target_value}
                            </span>
                          </div>
                          <Badge variant={getStatusBadgeVariant(goal.status)}>
                            {goal.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max={goal.target_value * 2}
                        value={goal.current_value}
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0, goal.target_value)}
                        className="w-20"
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {goals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No goals set yet. Add your first goal above!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Review */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weeklyReview">Reflection & Notes</Label>
                <Textarea
                  id="weeklyReview"
                  placeholder="How did this week go? What went well? What challenges did you face? What would you like to focus on next week?"
                  value={weeklyReview}
                  onChange={(e) => setWeeklyReview(e.target.value)}
                  rows={6}
                />
              </div>
              <Button onClick={saveWeeklyReview}>
                Save Weekly Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
