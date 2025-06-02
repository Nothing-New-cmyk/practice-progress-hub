
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { Eye, Edit, Trash2, Plus, Calendar, Clock, Target, BookOpen, Zap } from 'lucide-react';
import { format } from 'date-fns';

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
  const { logs, loading, creating, createLog, deleteLog } = useDailyLogs();
  const [showForm, setShowForm] = useState(false);
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

  const resetForm = () => {
    setTopic('');
    setPlatform('');
    setDifficulty('');
    setProblemsSolved('');
    setTimeSpent('');
    setProblemUrl('');
    setNotes('');
    setResources('');
    setNextSteps('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createLog({
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

    if (result?.success) {
      resetForm();
      setShowForm(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const containerClass = zenMode 
    ? "fixed inset-0 z-50 bg-background overflow-auto" 
    : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50";

  return (
    <div className={containerClass}>
      {!zenMode && <Navbar />}
      <div className={zenMode ? "p-4 md:p-8" : "md:ml-64 p-4 md:p-8"}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Daily Practice Log
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                Track your daily coding practice and progress
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setZenMode(!zenMode)}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {zenMode ? "Exit Zen Mode" : "Zen Mode"}
              </Button>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Log
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Logs</p>
                    <p className="text-2xl font-bold">{logs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Problems Solved</p>
                    <p className="text-2xl font-bold">
                      {logs.reduce((sum, log) => sum + log.problems_solved, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hours Practiced</p>
                    <p className="text-2xl font-bold">
                      {Math.round(logs.reduce((sum, log) => sum + log.time_spent_minutes, 0) / 60)}h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold">
                      {logs.filter(log => {
                        const logDate = new Date(log.date);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return logDate >= weekAgo;
                      }).length}
                    </p>
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
                    <CardTitle>Record Practice Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                      <div className="grid grid-cols-2 gap-3">
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

                      <div className="grid grid-cols-2 gap-3">
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
                          label="Time (minutes)"
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
                          rows={3}
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
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={creating} className="flex-1">
                          {creating ? "Saving..." : "Save Log"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Logs List */}
            <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Practice History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 border rounded-lg">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No practice logs yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start logging your daily practice sessions to track your progress
                      </p>
                      <Button onClick={() => setShowForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Log
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-semibold text-sm md:text-base">{log.topic}</h4>
                                <Badge className={getDifficultyColor(log.difficulty)}>
                                  {log.difficulty}
                                </Badge>
                                <Badge variant="outline">{log.platform}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(log.date), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  {log.problems_solved} problems
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {log.time_spent_minutes}min
                                </span>
                              </div>

                              {log.notes && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {log.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {log.problem_url && (
                                <Button asChild size="sm" variant="outline">
                                  <a href={log.problem_url} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteLog(log.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
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
