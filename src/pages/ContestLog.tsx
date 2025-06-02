
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

export const ContestLog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state
  const [contestName, setContestName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [platform, setPlatform] = useState('');
  const [rank, setRank] = useState('');
  const [totalParticipants, setTotalParticipants] = useState('');
  const [problemsSolved, setProblemsSolved] = useState('');
  const [timeScore, setTimeScore] = useState('');
  const [contestUrl, setContestUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('contest_logs' as any)
        .insert({
          user_id: user.id,
          contest_name: contestName,
          date,
          platform,
          rank: parseInt(rank) || null,
          total_participants: parseInt(totalParticipants) || null,
          problems_solved: parseInt(problemsSolved) || 0,
          time_score: timeScore || null,
          contest_url: contestUrl || null,
          notes: notes || null,
          next_steps: nextSteps || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contest log saved successfully!",
      });

      // Reset form
      setContestName('');
      setPlatform('');
      setRank('');
      setTotalParticipants('');
      setProblemsSolved('');
      setTimeScore('');
      setContestUrl('');
      setNotes('');
      setNextSteps('');
    } catch (error) {
      console.error('Error saving contest log:', error);
      toast({
        title: "Error",
        description: "Failed to save contest log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="md:ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Contest Log</h1>

          <Card>
            <CardHeader>
              <CardTitle>Record Contest Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Contest Name"
                    id="contestName"
                    value={contestName}
                    onChange={setContestName}
                    placeholder="e.g., Weekly Contest 123"
                    required
                  />
                  <FormInput
                    label="Date"
                    id="date"
                    type="date"
                    value={date}
                    onChange={setDate}
                    required
                  />
                </div>

                <FormSelect
                  label="Platform"
                  id="platform"
                  value={platform}
                  onChange={setPlatform}
                  options={platformOptions}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Rank"
                    id="rank"
                    type="number"
                    value={rank}
                    onChange={setRank}
                    placeholder="Your rank"
                  />
                  <FormInput
                    label="Total Participants"
                    id="totalParticipants"
                    type="number"
                    value={totalParticipants}
                    onChange={setTotalParticipants}
                    placeholder="Total participants"
                  />
                  <FormInput
                    label="Problems Solved"
                    id="problemsSolved"
                    type="number"
                    value={problemsSolved}
                    onChange={setProblemsSolved}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Time/Score"
                    id="timeScore"
                    value={timeScore}
                    onChange={setTimeScore}
                    placeholder="e.g., 1:30:45 or 3250 points"
                  />
                  <FormInput
                    label="Contest URL"
                    id="contestUrl"
                    type="url"
                    value={contestUrl}
                    onChange={setContestUrl}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Performance analysis, problems faced, strategies used..."
                    rows={4}
                  />
                </div>

                <div>
                  <label htmlFor="nextSteps" className="block text-sm font-medium mb-2">
                    Next Steps
                  </label>
                  <Textarea
                    id="nextSteps"
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    placeholder="Areas to improve for next contest..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Contest Log"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
