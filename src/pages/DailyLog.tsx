
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
import { PlusCircle, Calendar, Clock, BookOpen } from 'lucide-react';

export const DailyLog = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    problemsSolved: '',
    platform: '',
    difficulty: '',
    timeSpent: '',
    notes: '',
    resources: '',
    nextSteps: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase integration
    toast({
      title: "Daily log saved",
      description: "Your practice session has been recorded successfully.",
    });
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      topic: '',
      problemsSolved: '',
      platform: '',
      difficulty: '',
      timeSpent: '',
      notes: '',
      resources: '',
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
          title="Daily Practice Log"
          subtitle="Record your daily coding practice and track your progress"
          icon={PlusCircle}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Log Today's Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Dynamic Programming, Arrays"
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="problems">Problems Solved</Label>
                  <Input
                    id="problems"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.problemsSolved}
                    onChange={(e) => handleInputChange('problemsSolved', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leetcode">LeetCode</SelectItem>
                      <SelectItem value="codeforces">Codeforces</SelectItem>
                      <SelectItem value="hackerrank">HackerRank</SelectItem>
                      <SelectItem value="codechef">CodeChef</SelectItem>
                      <SelectItem value="atcoder">AtCoder</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="timeSpent" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time Spent (minutes)
                </Label>
                <Input
                  id="timeSpent"
                  type="number"
                  min="0"
                  placeholder="60"
                  value={formData.timeSpent}
                  onChange={(e) => handleInputChange('timeSpent', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Notes & Reflections
                </Label>
                <Textarea
                  id="notes"
                  placeholder="What did you learn? Any challenges faced? Key insights..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="resources">Resources Used</Label>
                <Input
                  id="resources"
                  placeholder="URLs, books, tutorials used..."
                  value={formData.resources}
                  onChange={(e) => handleInputChange('resources', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="nextSteps">Next Steps</Label>
                <Textarea
                  id="nextSteps"
                  placeholder="What to focus on next? Areas for improvement..."
                  value={formData.nextSteps}
                  onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Daily Log
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
