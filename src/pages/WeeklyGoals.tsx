
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useWeeklyGoals } from '@/hooks/useWeeklyGoals';
import { Target, Plus, CheckCircle, Clock, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';

const statusOptions = [
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'missed', label: 'Missed' },
  { value: 'paused', label: 'Paused' },
];

export const WeeklyGoals = () => {
  const { goals, loading, creating, createGoal, updateGoal, deleteGoal } = useWeeklyGoals();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  // Form state
  const [goalDescription, setGoalDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [reviewNotes, setReviewNotes] = useState('');
  const [weekStartDate, setWeekStartDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );

  const resetForm = () => {
    setGoalDescription('');
    setTargetValue('');
    setCurrentValue('');
    setStatus('in_progress');
    setReviewNotes('');
    setWeekStartDate(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
    setEditingGoal(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingGoal) {
      await updateGoal(editingGoal, {
        goal_description: goalDescription,
        target_value: parseInt(targetValue) || 0,
        current_value: parseInt(currentValue) || 0,
        status: status as any,
        review_notes: reviewNotes || null,
        week_start_date: weekStartDate,
      });
    } else {
      const result = await createGoal({
        goal_description: goalDescription,
        target_value: parseInt(targetValue) || 0,
        current_value: parseInt(currentValue) || 0,
        status: status as any,
        review_notes: reviewNotes || null,
        week_start_date: weekStartDate,
      });

      if (result?.success) {
        resetForm();
        setShowForm(false);
      }
    }

    if (editingGoal) {
      resetForm();
      setShowForm(false);
    }
  };

  const handleEdit = (goal: any) => {
    setGoalDescription(goal.goal_description);
    setTargetValue(goal.target_value.toString());
    setCurrentValue(goal.current_value.toString());
    setStatus(goal.status);
    setReviewNotes(goal.review_notes || '');
    setWeekStartDate(goal.week_start_date);
    setEditingGoal(goal.id);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'missed': return <Target className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const inProgressGoals = goals.filter(goal => goal.status === 'in_progress').length;
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.current_value / goal.target_value * 100), 0) / goals.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <div className="md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Weekly Goals
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                Set and track your weekly learning objectives
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {editingGoal ? 'Cancel Edit' : 'New Goal'}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Goals</p>
                    <p className="text-2xl font-bold">{goals.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedGoals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{inProgressGoals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                    <p className="text-2xl font-bold">{totalProgress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            {/* Form Section */}
            {showForm && (
              <div className="xl:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingGoal ? 'Edit Goal' : 'Create New Goal'}
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

                      <div>
                        <label htmlFor="goalDescription" className="block text-sm font-medium mb-2">
                          Goal Description
                        </label>
                        <Textarea
                          id="goalDescription"
                          value={goalDescription}
                          onChange={(e) => setGoalDescription(e.target.value)}
                          placeholder="e.g., Solve 20 LeetCode problems, Complete Binary Search chapter..."
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <FormInput
                          label="Target Value"
                          id="targetValue"
                          type="number"
                          value={targetValue}
                          onChange={setTargetValue}
                          placeholder="20"
                          required
                        />
                        <FormInput
                          label="Current Value"
                          id="currentValue"
                          type="number"
                          value={currentValue}
                          onChange={setCurrentValue}
                          placeholder="0"
                          required
                        />
                      </div>

                      <FormSelect
                        label="Status"
                        id="status"
                        value={status}
                        onChange={setStatus}
                        options={statusOptions}
                        required
                      />

                      <div>
                        <label htmlFor="reviewNotes" className="block text-sm font-medium mb-2">
                          Review Notes
                        </label>
                        <Textarea
                          id="reviewNotes"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Reflections, challenges, adjustments needed..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={creating} className="flex-1">
                          {creating ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            resetForm();
                            setShowForm(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Goals List */}
            <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Goals Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 border rounded-lg">
                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : goals.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No goals set yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start setting weekly goals to track your learning progress
                      </p>
                      <Button onClick={() => setShowForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Goal
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {goals.map((goal) => {
                        const progress = Math.round((goal.current_value / goal.target_value) * 100);
                        const weekEnd = addDays(new Date(goal.week_start_date), 6);
                        
                        return (
                          <div key={goal.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <Badge className={getStatusColor(goal.status)}>
                                    {getStatusIcon(goal.status)}
                                    <span className="ml-1 capitalize">{goal.status.replace('_', ' ')}</span>
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(goal.week_start_date), 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
                                  </span>
                                </div>
                                
                                <h4 className="font-semibold text-sm md:text-base mb-2">
                                  {goal.goal_description}
                                </h4>
                                
                                <div className="flex items-center gap-4 mb-3">
                                  <span className="text-sm text-muted-foreground">
                                    Progress: {goal.current_value}/{goal.target_value}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {progress}%
                                  </span>
                                </div>
                                
                                <Progress value={progress} className="h-2 mb-2" />

                                {goal.review_notes && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {goal.review_notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEdit(goal)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => deleteGoal(goal.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
