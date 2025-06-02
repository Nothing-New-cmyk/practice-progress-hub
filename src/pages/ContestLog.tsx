
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useContestLogs } from '@/hooks/useContestLogs';
import { Trophy, Users, Target, Clock, Plus, ExternalLink, Trash2, Medal } from 'lucide-react';
import { format } from 'date-fns';

const platformOptions = [
  { value: 'LeetCode', label: 'LeetCode' },
  { value: 'Codeforces', label: 'Codeforces' },
  { value: 'HackerRank', label: 'HackerRank' },
  { value: 'AtCoder', label: 'AtCoder' },
  { value: 'CodeChef', label: 'CodeChef' },
  { value: 'Other', label: 'Other' },
];

export const ContestLog = () => {
  const { logs, loading, creating, createLog, deleteLog } = useContestLogs();
  const [showForm, setShowForm] = useState(false);

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

  const resetForm = () => {
    setContestName('');
    setPlatform('');
    setRank('');
    setTotalParticipants('');
    setProblemsSolved('');
    setTimeScore('');
    setContestUrl('');
    setNotes('');
    setNextSteps('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createLog({
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

    if (result?.success) {
      resetForm();
      setShowForm(false);
    }
  };

  const getRankBadge = (rank: number | null, total: number | null) => {
    if (!rank || !total) return null;
    
    const percentage = (rank / total) * 100;
    
    if (percentage <= 10) {
      return <Badge className="bg-yellow-100 text-yellow-800">Top 10%</Badge>;
    } else if (percentage <= 25) {
      return <Badge className="bg-green-100 text-green-800">Top 25%</Badge>;
    } else if (percentage <= 50) {
      return <Badge className="bg-blue-100 text-blue-800">Top 50%</Badge>;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <div className="md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Contest Log
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                Track your competitive programming contest performance
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Contest Log
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Trophy className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contests</p>
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <Medal className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Rank</p>
                    <p className="text-2xl font-bold">
                      {logs.filter(log => log.rank).length > 0 
                        ? Math.min(...logs.filter(log => log.rank).map(log => log.rank!))
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Problems</p>
                    <p className="text-2xl font-bold">
                      {logs.length > 0 
                        ? Math.round(logs.reduce((sum, log) => sum + log.problems_solved, 0) / logs.length)
                        : 0
                      }
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
                    <CardTitle>Record Contest Participation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                      <FormSelect
                        label="Platform"
                        id="platform"
                        value={platform}
                        onChange={setPlatform}
                        options={platformOptions}
                        required
                      />

                      <div className="grid grid-cols-2 gap-3">
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
                          label="Time/Score"
                          id="timeScore"
                          value={timeScore}
                          onChange={setTimeScore}
                          placeholder="e.g., 1:30:45 or 3250 points"
                        />
                      </div>

                      <FormInput
                        label="Contest URL"
                        id="contestUrl"
                        type="url"
                        value={contestUrl}
                        onChange={setContestUrl}
                        placeholder="https://..."
                      />

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium mb-2">
                          Notes
                        </label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Performance analysis, problems faced, strategies used..."
                          rows={3}
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
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={creating} className="flex-1">
                          {creating ? "Saving..." : "Save Contest Log"}
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

            {/* Contest Logs List */}
            <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-purple-500" />
                    Contest History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 border rounded-lg">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No contest logs yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start logging your contest participation to track your competitive programming progress
                      </p>
                      <Button onClick={() => setShowForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Contest Log
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-semibold text-sm md:text-base">{log.contest_name}</h4>
                                <Badge variant="outline">{log.platform}</Badge>
                                {getRankBadge(log.rank, log.total_participants)}
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(log.date), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                                {log.rank && log.total_participants && (
                                  <span className="flex items-center gap-1">
                                    <Medal className="h-3 w-3" />
                                    Rank {log.rank}/{log.total_participants}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  {log.problems_solved} problems
                                </span>
                                {log.time_score && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {log.time_score}
                                  </span>
                                )}
                              </div>

                              {log.notes && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {log.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {log.contest_url && (
                                <Button asChild size="sm" variant="outline">
                                  <a href={log.contest_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" />
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
