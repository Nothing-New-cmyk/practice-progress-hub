
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

const platformOptions = [
  { value: 'LeetCode', label: 'LeetCode' },
  { value: 'Codeforces', label: 'Codeforces' },
  { value: 'HackerRank', label: 'HackerRank' },
  { value: 'AtCoder', label: 'AtCoder' },
  { value: 'CodeChef', label: 'CodeChef' },
  { value: 'Other', label: 'Other' },
];

export const ContestLog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contestName: '',
    date: new Date().toISOString().split('T')[0],
    platform: '',
    rank: '',
    totalParticipants: '',
    problemsSolved: '',
    timeScore: '',
    contestUrl: '',
    notes: '',
    nextSteps: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contestName) newErrors.contestName = 'Contest name is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.problemsSolved) newErrors.problemsSolved = 'Problems solved is required';
    else if (parseInt(formData.problemsSolved) < 0) newErrors.problemsSolved = 'Must be non-negative';
    
    if (formData.rank && parseInt(formData.rank) <= 0) newErrors.rank = 'Rank must be positive';
    if (formData.totalParticipants && parseInt(formData.totalParticipants) <= 0) newErrors.totalParticipants = 'Total participants must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('contest_logs')
        .insert({
          user_id: user!.id,
          contest_name: formData.contestName,
          date: formData.date,
          platform: formData.platform as any,
          rank: formData.rank ? parseInt(formData.rank) : null,
          total_participants: formData.totalParticipants ? parseInt(formData.totalParticipants) : null,
          problems_solved: parseInt(formData.problemsSolved),
          time_score: formData.timeScore || null,
          contest_url: formData.contestUrl || null,
          notes: formData.notes || null,
          next_steps: formData.nextSteps || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contest log saved successfully!",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save contest log",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="md:ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Contest Log</h1>
          <p className="text-muted-foreground">Record your contest participation</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Log Contest Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Contest Name"
                  id="contestName"
                  value={formData.contestName}
                  onChange={(value) => setFormData({...formData, contestName: value})}
                  placeholder="e.g., LeetCode Weekly Contest 123"
                  required
                  error={errors.contestName}
                />
                <FormInput
                  label="Date"
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(value) => setFormData({...formData, date: value})}
                  required
                />
              </div>

              <FormSelect
                label="Platform"
                id="platform"
                value={formData.platform}
                onChange={(value) => setFormData({...formData, platform: value})}
                options={platformOptions}
                required
                error={errors.platform}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Rank"
                  id="rank"
                  type="number"
                  value={formData.rank}
                  onChange={(value) => setFormData({...formData, rank: value})}
                  placeholder="Your rank in the contest"
                  error={errors.rank}
                />
                <FormInput
                  label="Total Participants"
                  id="totalParticipants"
                  type="number"
                  value={formData.totalParticipants}
                  onChange={(value) => setFormData({...formData, totalParticipants: value})}
                  placeholder="Total number of participants"
                  error={errors.totalParticipants}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Problems Solved"
                  id="problemsSolved"
                  type="number"
                  value={formData.problemsSolved}
                  onChange={(value) => setFormData({...formData, problemsSolved: value})}
                  placeholder="Number of problems solved"
                  required
                  error={errors.problemsSolved}
                />
                <FormInput
                  label="Time/Score"
                  id="timeScore"
                  value={formData.timeScore}
                  onChange={(value) => setFormData({...formData, timeScore: value})}
                  placeholder="e.g., 1:23:45 or 2500 points"
                />
              </div>

              <FormInput
                label="Contest URL"
                id="contestUrl"
                type="url"
                value={formData.contestUrl}
                onChange={(value) => setFormData({...formData, contestUrl: value})}
                placeholder="https://leetcode.com/contest/..."
              />

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                  Notes (Markdown supported)
                </label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="How did the contest go? What problems did you struggle with?"
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="nextSteps" className="block text-sm font-medium mb-2">
                  Next Steps
                </label>
                <Textarea
                  id="nextSteps"
                  value={formData.nextSteps}
                  onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
                  placeholder="What topics will you focus on before the next contest?"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : "Save Contest Log"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
