
import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

interface WeeklyGoal {
  id: number;
  goal: string;
  target: number;
  current: number;
  status: 'in_progress' | 'completed' | 'missed';
}

export const WeeklyGoals = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<WeeklyGoal[]>([
    { id: 1, goal: 'Solve 20 Medium Problems', target: 20, current: 14, status: 'in_progress' },
    { id: 2, goal: 'Complete 5 Contest Problems', target: 5, current: 5, status: 'completed' },
    { id: 3, goal: 'Study Dynamic Programming', target: 1, current: 0, status: 'missed' }
  ]);

  const [newGoal, setNewGoal] = useState({
    goal: '',
    target: ''
  });

  const [weeklyReview, setWeeklyReview] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.goal || !newGoal.target) return;

    const goal: WeeklyGoal = {
      id: Date.now(),
      goal: newGoal.goal,
      target: parseInt(newGoal.target),
      current: 0,
      status: 'in_progress'
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ goal: '', target: '' });
    
    toast({
      title: "Goal added",
      description: "Your new weekly goal has been created successfully.",
    });
  };

  const updateGoalProgress = (id: number, newCurrent: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const updated = { ...goal, current: newCurrent };
        if (newCurrent >= goal.target) {
          updated.status = 'completed';
        } else {
          updated.status = 'in_progress';
        }
        return updated;
      }
      return goal;
    }));
  };

  const deleteGoal = (id: number) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    toast({
      title: "Goal deleted",
      description: "The goal has been removed successfully.",
    });
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
                    value={newGoal.goal}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, goal: e.target.value }))}
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
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Add Goal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Goals */}
        <Card>
          <CardHeader>
            <CardTitle>This Week's Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                const StatusIcon = getStatusIcon(goal.status);
                const statusColor = getStatusColor(goal.status);
                
                return (
                  <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{goal.goal}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${goal.status === 'completed' ? 'bg-green-500' : goal.status === 'missed' ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {goal.current}/{goal.target}
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
                        max={goal.target * 2}
                        value={goal.current}
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {goals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No goals set for this week. Add your first goal above!</p>
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
              <Button onClick={() => {
                toast({
                  title: "Review saved",
                  description: "Your weekly review has been saved successfully.",
                });
              }}>
                Save Weekly Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
