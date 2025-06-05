
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
import { useToast } from '@/hooks/use-toast';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { PlusCircle, Calendar, Clock, BookOpen, Trash2, Edit, Eye, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

export const DailyLog = () => {
  const { toast } = useToast();
  const { logs, loading, creating, createLog, deleteLog } = useDailyLogs();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    problemsSolved: '',
    platform: '',
    difficulty: '',
    timeSpent: '',
    problem_url: '',
    notes: '',
    resources: '',
    next_steps: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createLog({
      date: formData.date,
      topic: formData.topic,
      problems_solved: parseInt(formData.problemsSolved) || 0,
      platform: formData.platform,
      difficulty: formData.difficulty,
      time_spent_minutes: parseInt(formData.timeSpent) || 0,
      problem_url: formData.problem_url || null,
      notes: formData.notes || null,
      resources: formData.resources ? [formData.resources] : null,
      next_steps: formData.next_steps || null
    });

    if (result?.success) {
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        topic: '',
        problemsSolved: '',
        platform: '',
        difficulty: '',
        timeSpent: '',
        problem_url: '',
        notes: '',
        resources: '',
        next_steps: ''
      });
      setShowForm(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      await deleteLog(id);
    }
  };

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.platform.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = filterPlatform === 'all' || log.platform === filterPlatform;
    const matchesDifficulty = filterDifficulty === 'all' || log.difficulty === filterDifficulty;
    
    return matchesSearch && matchesPlatform && matchesDifficulty;
  });

  // Get unique platforms and difficulties for filters
  const uniquePlatforms = [...new Set(logs.map(log => log.platform))];
  const uniqueDifficulties = [...new Set(logs.map(log => log.difficulty))];

  // Calculate summary stats
  const totalProblems = logs.reduce((sum, log) => sum + log.problems_solved, 0);
  const totalTime = logs.reduce((sum, log) => sum + log.time_spent_minutes, 0);
  const totalSessions = logs.length;
  const avgProblemsPerSession = totalSessions > 0 ? (totalProblems / totalSessions).toFixed(1) : '0';

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Daily Practice Log"
            subtitle="Record your daily coding practice and track your progress"
            icon={PlusCircle}
          />
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            {showForm ? 'Cancel' : 'New Entry'}
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalProblems}</div>
              <div className="text-sm text-muted-foreground">Total Problems</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{Math.floor(totalTime / 60)}h {totalTime % 60}m</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{totalSessions}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{avgProblemsPerSession}</div>
              <div className="text-sm text-muted-foreground">Avg Problems</div>
            </CardContent>
          </Card>
        </div>

        {/* New Entry Form */}
        {showForm && (
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <SelectItem value="hackerearth">HackerEarth</SelectItem>
                        <SelectItem value="geeksforgeeks">GeeksforGeeks</SelectItem>
                        <SelectItem value="interviewbit">InterviewBit</SelectItem>
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
                  <div>
                    <Label htmlFor="timeSpent" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time (minutes)
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
                </div>

                <div>
                  <Label htmlFor="problemUrl">Problem URL (Optional)</Label>
                  <Input
                    id="problemUrl"
                    placeholder="https://leetcode.com/problems/..."
                    value={formData.problem_url}
                    onChange={(e) => handleInputChange('problem_url', e.target.value)}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input
                      id="nextSteps"
                      placeholder="What to focus on next..."
                      value={formData.next_steps}
                      onChange={(e) => handleInputChange('next_steps', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Saving...' : 'Save Daily Log'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search topics, notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="filterPlatform">Platform</Label>
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {uniquePlatforms.map(platform => (
                      <SelectItem key={platform} value={platform} className="capitalize">
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filterDifficulty">Difficulty</Label>
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    {uniqueDifficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty} className="capitalize">
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterPlatform('all');
                    setFilterDifficulty('all');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Sessions ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {logs.length === 0 
                    ? "No practice sessions logged yet. Start by adding your first entry!"
                    : "No sessions match your current filters. Try adjusting the search criteria."
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Problems</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{log.topic}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{log.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(log.difficulty)}>
                          {log.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.problems_solved}</TableCell>
                      <TableCell>{log.time_spent_minutes}m</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {log.problem_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(log.problem_url!, '_blank')}
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
