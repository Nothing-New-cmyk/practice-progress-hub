
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useContestLogs } from '@/hooks/useContestLogs';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Calendar, Users, Target, PlusCircle, Trash2, Edit, Eye } from 'lucide-react';
import { format } from 'date-fns';

export const ContestLog = () => {
  const { toast } = useToast();
  const { logs, loading, creating, createLog, deleteLog } = useContestLogs();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contestName: '',
    date: new Date().toISOString().split('T')[0],
    rank: '',
    totalParticipants: '',
    problemsSolved: '',
    timeScore: '',
    platform: '',
    contestUrl: '',
    notes: '',
    nextSteps: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createLog({
      contest_name: formData.contestName,
      date: formData.date,
      platform: formData.platform,
      rank: parseInt(formData.rank) || null,
      total_participants: parseInt(formData.totalParticipants) || null,
      problems_solved: parseInt(formData.problemsSolved) || 0,
      time_score: formData.timeScore || null,
      contest_url: formData.contestUrl || null,
      notes: formData.notes || null,
      next_steps: formData.nextSteps || null
    });

    if (result?.success) {
      // Reset form
      setFormData({
        contestName: '',
        date: new Date().toISOString().split('T')[0],
        rank: '',
        totalParticipants: '',
        problemsSolved: '',
        timeScore: '',
        platform: '',
        contestUrl: '',
        notes: '',
        nextSteps: ''
      });
      setShowForm(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contest log?')) {
      await deleteLog(id);
    }
  };

  const getRankColor = (rank: number | null, total: number | null) => {
    if (!rank || !total) return 'bg-gray-100 text-gray-800';
    const percentage = (rank / total) * 100;
    if (percentage <= 10) return 'bg-green-100 text-green-800';
    if (percentage <= 25) return 'bg-blue-100 text-blue-800';
    if (percentage <= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Contest Performance Log"
            subtitle="Track your competitive programming contest results and learnings"
            icon={Trophy}
          />
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            {showForm ? 'Cancel' : 'New Contest'}
          </Button>
        </div>

        {/* New Contest Form */}
        {showForm && (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem value="hackerearth">HackerEarth</SelectItem>
                        <SelectItem value="topcoder">TopCoder</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeScore">Score/Points</Label>
                    <Input
                      id="timeScore"
                      placeholder="1250"
                      value={formData.timeScore}
                      onChange={(e) => handleInputChange('timeScore', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contestUrl">Contest URL (Optional)</Label>
                  <Input
                    id="contestUrl"
                    placeholder="https://codeforces.com/contest/..."
                    value={formData.contestUrl}
                    onChange={(e) => handleInputChange('contestUrl', e.target.value)}
                  />
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

                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Saving...' : 'Save Contest Log'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contest History */}
        <Card>
          <CardHeader>
            <CardTitle>Contest History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No contests logged yet. Start by adding your first contest performance!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Contest</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Problems</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{log.contest_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{log.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        {log.rank && log.total_participants ? (
                          <Badge className={getRankColor(log.rank, log.total_participants)}>
                            {log.rank}/{log.total_participants}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{log.problems_solved}</TableCell>
                      <TableCell>{log.time_score || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {log.contest_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(log.contest_url!, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(log.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
