
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [problemsSolved, setProblemsSolved] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [problemUrl, setProblemUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [resources, setResources] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('daily_logs' as any)
        .insert({
          user_id: user.id,
          date,
          topic,
          platform,
          difficulty,
          problems_solved: parseInt(problemsSolved) || 0,
          time_spent_minutes: parseInt(timeSpent) || 0,
          problem_url: problemUrl || null,
          notes: notes || null,
          resources: resources ? resources.split(',').map(r => r.trim()) : [],
          next_steps: nextSteps || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Daily log saved successfully!",
      });

      // Reset form
      setTopic('');
      setPlatform('');
      setDifficulty('');
      setProblemsSolved('');
      setTimeSpent('');
      setProblemUrl('');
      setNotes('');
      setResources('');
      setNextSteps('');
    } catch (error) {
      console.error('Error saving daily log:', error);
      toast({
        title: "Error",
        description: "Failed to save daily log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const containerClass = zenMode 
    ? "fixed inset-0 z-50 bg-background overflow-auto" 
    : "min-h-screen bg-gray-50";

  return (
    <div className={containerClass}>
      {!zenMode && <Navbar />}
      <div className={zenMode ? "p-8" : "md:ml-64 p-8"}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Daily Log</h1>
            <Button
              variant="outline"
              onClick={() => setZenMode(!zenMode)}
            >
              {zenMode ? "Exit Zen Mode" : "Zen Mode"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Record Your Practice Session</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Date"
                    id="date"
                    type="date"
                    value={date}
                    onChange={setDate}
                    required
                  />
                  <FormInput
                    label="Topic"
                    id="topic"
                    value={topic}
                    onChange={setTopic}
                    placeholder="e.g., Binary Search, Dynamic Programming"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    label="Platform"
                    id="platform"
                    value={platform}
                    onChange={setPlatform}
                    options={platformOptions}
                    required
                  />
                  <FormSelect
                    label="Difficulty"
                    id="difficulty"
                    value={difficulty}
                    onChange={setDifficulty}
                    options={difficultyOptions}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Problems Solved"
                    id="problemsSolved"
                    type="number"
                    value={problemsSolved}
                    onChange={setProblemsSolved}
                    placeholder="0"
                    required
                  />
                  <FormInput
                    label="Time Spent (minutes)"
                    id="timeSpent"
                    type="number"
                    value={timeSpent}
                    onChange={setTimeSpent}
                    placeholder="0"
                    required
                  />
                </div>

                <FormInput
                  label="Problem URL"
                  id="problemUrl"
                  type="url"
                  value={problemUrl}
                  onChange={setProblemUrl}
                  placeholder="https://leetcode.com/problems/..."
                />

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reflections, insights, challenges faced..."
                    rows={4}
                  />
                </div>

                <FormInput
                  label="Resources"
                  id="resources"
                  value={resources}
                  onChange={setResources}
                  placeholder="Comma-separated URLs or references"
                />

                <div>
                  <label htmlFor="nextSteps" className="block text-sm font-medium mb-2">
                    Next Steps
                  </label>
                  <Textarea
                    id="nextSteps"
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    placeholder="What to focus on next session..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Daily Log"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
