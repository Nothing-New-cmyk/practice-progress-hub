
import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Calendar, Users, Target } from 'lucide-react';

export const ContestLog = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contestName: '',
    date: new Date().toISOString().split('T')[0],
    rank: '',
    totalParticipants: '',
    problemsSolved: '',
    score: '',
    platform: '',
    notes: '',
    nextSteps: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase integration
    toast({
      title: "Contest log saved",
      description: "Your contest performance has been recorded successfully.",
    });
    
    // Reset form
    setFormData({
      contestName: '',
      date: new Date().toISOString().split('T')[0],
      rank: '',
      totalParticipants: '',
      problemsSolved: '',
      score: '',
      platform: '',
      notes: '',
      nextSteps: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
        <SectionHeader
          title="Contest Performance Log"
          subtitle="Track your competitive programming contest results and learnings"
          icon={Trophy}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Log Contest Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contestName">Contest Name</Label>
                  <Input
                    id="contestName"
                    placeholder="e.g., Codeforces Round #850"
                    value={formData.contestName}
                    onChange={(e) => handleInputChange('contestName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rank" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Your Rank
                  </Label>
                  <Input
                    id="rank"
                    type="number"
                    min="1"
                    placeholder="156"
                    value={formData.rank}
                    onChange={(e) => handleInputChange('rank', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="totalParticipants" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Participants
                  </Label>
                  <Input
                    id="totalParticipants"
                    type="number"
                    min="1"
                    placeholder="5000"
                    value={formData.totalParticipants}
                    onChange={(e) => handleInputChange('totalParticipants', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="problemsSolved">Problems Solved</Label>
                  <Input
                    id="problemsSolved"
                    type="number"
                    min="0"
                    placeholder="3"
                    value={formData.problemsSolved}
                    onChange={(e) => handleInputChange('problemsSolved', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="score">Score/Points</Label>
                  <Input
                    id="score"
                    placeholder="1250"
                    value={formData.score}
                    onChange={(e) => handleInputChange('score', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="codeforces">Codeforces</SelectItem>
                      <SelectItem value="leetcode">LeetCode Contest</SelectItem>
                      <SelectItem value="codechef">CodeChef</SelectItem>
                      <SelectItem value="atcoder">AtCoder</SelectItem>
                      <SelectItem value="hackerrank">HackerRank</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Contest Review & Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="How did the contest go? What problems did you struggle with? What went well?"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="nextSteps">Next Steps & Improvement Areas</Label>
                <Textarea
                  id="nextSteps"
                  placeholder="What topics to practice more? Strategies to improve for next contest..."
                  value={formData.nextSteps}
                  onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Contest Log
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
