
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Maximize2, Minimize2 } from 'lucide-react';

const platformOptions = [
  { value: 'LeetCode', label: 'LeetCode' },
  { value: 'Codeforces', label: 'Codeforces' },
  { value: 'HackerRank', label: 'HackerRank' },
  { value: 'AtCoder', label: 'AtCoder' },
  { value: 'CodeChef', label: 'CodeChef' },
  { value: 'Other', label: 'Other' },
];

const difficultyOptions = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

export const DailyLog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [zenMode, setZenMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    platform: '',
    difficulty: '',
    problemsSolved: '',
    timeSpent: '',
    problemUrl: '',
    notes: '',
    resources: '',
    nextSteps: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.topic) newErrors.topic = 'Topic is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!formData.problemsSolved) newErrors.problemsSolved = 'Problems solved is required';
    else if (parseInt(formData.problemsSolved) < 0) newErrors.problemsSolved = 'Must be non-negative';
    if (!formData.timeSpent) newErrors.timeSpent = 'Time spent is required';
    else if (parseInt(formData.timeSpent) < 0) newErrors.timeSpent = 'Must be non-negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('daily_logs')
        .insert({
          user_id: user!.id,
          date: formData.date,
          topic: formData.topic,
          platform: formData.platform as any,
          difficulty: formData.difficulty as any,
          problems_solved: parseInt(formData.problemsSolved),
          time_spent_minutes: parseInt(formData.timeSpent),
          problem_url: formData.problemUrl || null,
          notes: formData.notes || null,
          resources: formData.resources ? formData.resources.split(',').map(r => r.trim()) : null,
          next_steps: formData.nextSteps || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Daily log saved successfully!",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save daily log",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const ContentWrapper = zenMode ? 'div' : Card;
  const contentProps = zenMode ? { className: "min-h-screen bg-background p-6" } : {};

  return (
    <div className={zenMode ? "min-h-screen" : "min-h-screen bg-gray-50"}>
      {!zenMode && <Navbar />}
      <main className={zenMode ? "" : "md:ml-64 p-6"}>
        {!zenMode && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Daily Log</h1>
            <p className="text-muted-foreground">Record your daily practice session</p>
          </div>
        )}

        <ContentWrapper {...contentProps}>
          {zenMode && (
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Daily Log - Zen Mode</h1>
              <Button variant="outline" onClick={() => setZenMode(false)}>
                <Minimize2 className="h-4 w-4 mr-2" />
                Exit Zen Mode
              </Button>
            </div>
          )}

          {!zenMode && (
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Log Practice Session</CardTitle>
                <Button variant="outline" onClick={() => setZenMode(true)}>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Zen Mode
                </Button>
              </div>
            </CardHeader>
          )}

          <CardContent className={zenMode ? "max-w-2xl mx-auto" : ""}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Date"
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(value) => setFormData({...formData, date: value})}
                  required
                  error={errors.date}
                />
                <FormInput
                  label="Topic"
                  id="topic"
                  value={formData.topic}
                  onChange={(value) => setFormData({...formData, topic: value})}
                  placeholder="e.g., Binary Trees, Dynamic Programming"
                  required
                  error={errors.topic}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Platform"
                  id="platform"
                  value={formData.platform}
                  onChange={(value) => setFormData({...formData, platform: value})}
                  options={platformOptions}
                  required
                  error={errors.platform}
                />
                <FormSelect
                  label="Difficulty"
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(value) => setFormData({...formData, difficulty: value})}
                  options={difficultyOptions}
                  required
                  error={errors.difficulty}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Problems Solved"
                  id="problemsSolved"
                  type="number"
                  value={formData.problemsSolved}
                  onChange={(value) => setFormData({...formData, problemsSolved: value})}
                  placeholder="0"
                  required
                  error={errors.problemsSolved}
                />
                <FormInput
                  label="Time Spent (minutes)"
                  id="timeSpent"
                  type="number"
                  value={formData.timeSpent}
                  onChange={(value) => setFormData({...formData, timeSpent: value})}
                  placeholder="60"
                  required
                  error={errors.timeSpent}
                />
              </div>

              <FormInput
                label="Problem URL"
                id="problemUrl"
                type="url"
                value={formData.problemUrl}
                onChange={(value) => setFormData({...formData, problemUrl: value})}
                placeholder="https://leetcode.com/problems/..."
              />

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                  Notes (Markdown supported)
                </label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="What did you learn? What challenges did you face?"
                  rows={4}
                />
              </div>

              <FormInput
                label="Resources"
                id="resources"
                value={formData.resources}
                onChange={(value) => setFormData({...formData, resources: value})}
                placeholder="https://example.com, https://tutorial.com (comma-separated)"
              />

              <div>
                <label htmlFor="nextSteps" className="block text-sm font-medium mb-2">
                  Next Steps
                </label>
                <Textarea
                  id="nextSteps"
                  value={formData.nextSteps}
                  onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
                  placeholder="What will you work on next?"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : "Save Log"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </ContentWrapper>
      </main>
    </div>
  );
};
