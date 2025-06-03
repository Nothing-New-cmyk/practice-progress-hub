
import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { EnhancedProgress } from '@/components/ui/enhanced-progress';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Textarea } from '@/components/ui/textarea';
import { useWeeklyGoals } from '@/hooks/useWeeklyGoals';
import { Target, Plus, CheckCircle, Clock, TrendingUp, Edit, Trash2, Calendar } from 'lucide-react';
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'default';
      case 'missed': return 'destructive';
      case 'paused': return 'warning';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'missed': return Target;
      default: return Clock;
    }
  };

  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const inProgressGoals = goals.filter(goal => goal.status === 'in_progress').length;
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.current_value / goal.target_value * 100), 0) / goals.length)
    : 0;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8">
        <SectionHeader
          title="Weekly Goals"
          subtitle="Set and track your weekly learning objectives"
          icon={Target}
          action={{
            label: editingGoal ? 'Cancel Edit' : showForm ? 'Cancel' : 'New Goal',
            onClick: () => {
              if (editingGoal || showForm) {
                resetForm();
                setShowForm(false);
              } else {
                setShowForm(true);
              }
            },
            variant: showForm || editingGoal ? 'outline' : 'default'
          }}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <EnhancedCard
            title="Total Goals"
            icon={Target}
            iconColor="bg-blue-100 text-blue-600"
            gradient
          >
            <AnimatedCounter 
              value={goals.length} 
              className="text-3xl font-bold text-blue-600"
            />
          </EnhancedCard>
          
          <EnhancedCard
            title="Completed"
            icon={CheckCircle}
            iconColor="bg-green-100 text-green-600"
            gradient
          >
            <AnimatedCounter 
              value={completedGoals} 
              className="text-3xl font-bold text-green-600"
            />
          </EnhancedCard>

          <EnhancedCard
            title="In Progress"
            icon={Clock}
            iconColor="bg-orange-100 text-orange-600"
            gradient
          >
            <AnimatedCounter 
              value={inProgressGoals} 
              className="text-3xl font-bold text-orange-600"
            />
          </EnhancedCard>

          <EnhancedCard
            title="Avg Progress"
            icon={TrendingUp}
            iconColor="bg-purple-100 text-purple-600"
            gradient
          >
            <AnimatedCounter 
              value={totalProgress} 
              suffix="%" 
              className="text-3xl font-bold text-purple-600"
            />
          </EnhancedCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form Section */}
          {showForm && (
            <div className="xl:col-span-1">
              <EnhancedCard
                title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
                icon={editingGoal ? Edit : Plus}
                iconColor="bg-indigo-100 text-indigo-600"
                gradient
              >
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
              </EnhancedCard>
            </div>
          )}

          {/* Goals List */}
          <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
            <EnhancedCard
              title="Goals Overview"
              icon={Target}
              iconColor="bg-blue-100 text-blue-600"
              gradient
            >
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No goals set yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start setting weekly goals to track your learning progress
                  </p>
                  <Button onClick={() => setShowForm(true)} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => {
                    const progress = Math.round((goal.current_value / goal.target_value) * 100);
                    const weekEnd = addDays(new Date(goal.week_start_date), 6);
                    const StatusIcon = getStatusIcon(goal.status);
                    
                    return (
                      <div key={goal.id} className="p-6 border border-gray-200/50 rounded-xl hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <EnhancedBadge 
                                variant={getStatusVariant(goal.status)}
                                icon={StatusIcon}
                                size="md"
                              >
                                {goal.status.replace('_', ' ')}
                              </EnhancedBadge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(goal.week_start_date), 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
                              </div>
                            </div>
                            
                            <h4 className="font-semibold text-lg mb-3">
                              {goal.goal_description}
                            </h4>
                            
                            <div className="space-y-3 mb-4">
                              <EnhancedProgress
                                value={goal.current_value}
                                max={goal.target_value}
                                variant={getStatusVariant(goal.status) === 'success' ? 'success' : 'default'}
                                showLabel
                                label={`Progress: ${goal.current_value}/${goal.target_value}`}
                                animated
                              />
                            </div>

                            {goal.review_notes && (
                              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                                {goal.review_notes}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEdit(goal)}
                              className="transition-all duration-200 hover:scale-105"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteGoal(goal.id)}
                              className="transition-all duration-200 hover:scale-105 hover:border-red-300 hover:text-red-600"
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
            </EnhancedCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
