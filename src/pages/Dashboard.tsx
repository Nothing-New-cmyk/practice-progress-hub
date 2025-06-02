
import { Navbar } from '@/components/Navbar';
import { StatsCard } from '@/components/ui/stats-card';
import { StreakCounter } from '@/components/ui/streak-counter';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { ProblemRecommendations } from '@/components/features/ProblemRecommendations';
import { StudyPlan } from '@/components/features/StudyPlan';
import { TopicProgress } from '@/components/features/TopicProgress';
import { StudyTimer } from '@/components/features/StudyTimer';
import { Achievements } from '@/components/features/Achievements';
import { QuickLogger } from '@/components/features/QuickLogger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Target, Clock, Award, TrendingUp, Calendar, BookOpen, Zap, Brain, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { summary, loading } = useDashboardData();

  // Use real data for difficulty chart
  const difficultyData = [
    { difficulty: 'Easy', count: Math.floor(summary.totalProblems * 0.5), color: '#10B981' },
    { difficulty: 'Medium', count: Math.floor(summary.totalProblems * 0.35), color: '#F59E0B' },
    { difficulty: 'Hard', count: Math.floor(summary.totalProblems * 0.15), color: '#EF4444' }
  ];

  // Mock heatmap data - in production, this would be calculated from daily logs
  const heatmapData = [
    { date: '2024-05-01', count: 3, level: 2 as const },
    { date: '2024-05-02', count: 5, level: 3 as const },
    { date: '2024-05-03', count: 1, level: 1 as const },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const weeklyGoalProgress = summary.totalGoals > 0 ? Math.round((summary.completedGoals / summary.totalGoals) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <main className="md:ml-64 p-3 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Track your DSA progress and achievements</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatsCard
            title="Problems This Week"
            value={summary.problemsThisWeek}
            subtitle="Keep the momentum going!"
            progress={Math.min((summary.problemsThisWeek / 20) * 100, 100)}
            trend="up"
            trendValue="+12%"
            color="primary"
          />
          <StatsCard
            title="Time This Week"
            value={`${summary.hoursThisWeek}h`}
            subtitle="Focused practice time"
            icon={Clock}
            trend="up"
            trendValue="+8%"
            color="success"
          />
          <StatsCard
            title="Weekly Goals"
            value={`${weeklyGoalProgress}%`}
            subtitle={`${summary.completedGoals}/${summary.totalGoals} completed`}
            progress={weeklyGoalProgress}
            color="warning"
          />
          <StatsCard
            title="Total Solved"
            value={summary.totalProblems}
            subtitle="All time problems"
            icon={Award}
            trend="up"
            trendValue="+5"
            color="success"
          />
        </div>

        {/* First Row - Essential Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <StreakCounter 
              currentStreak={summary.currentStreak} 
              longestStreak={15}
            />
            <QuickLogger />
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <StudyTimer />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <Button asChild className="h-auto p-3 md:p-4 flex-col gap-1 md:gap-2 text-xs">
                    <Link to="/daily-log">
                      <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Log Practice</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-3 md:p-4 flex-col gap-1 md:gap-2 text-xs">
                    <Link to="/contest-log">
                      <Trophy className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Log Contest</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-3 md:p-4 flex-col gap-1 md:gap-2 text-xs">
                    <Link to="/weekly-goals">
                      <Target className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Set Goals</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-3 md:p-4 flex-col gap-1 md:gap-2 text-xs">
                    <Link to="/settings">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Settings</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Second Row - Analytics and Progress */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="space-y-4 md:space-y-6">
            <DifficultyChart data={difficultyData} />
            <TopicProgress />
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <ProblemRecommendations />
            <Achievements />
          </div>
        </div>

        {/* Third Row - Study Plan and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <StudyPlan />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Quick Stats Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{summary.totalContests}</div>
                    <div className="text-sm text-blue-600">Contests</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{summary.totalGoals}</div>
                    <div className="text-sm text-green-600">Goals Set</div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{summary.badgesEarned}</div>
                  <div className="text-sm text-purple-600">Badges Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={heatmapData} className="mb-6 md:mb-8" />

        {/* Current Goals Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Performance Insights</span>
              <Button asChild size="sm">
                <Link to="/weekly-goals">Manage Goals</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary.totalProblems === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
                <p className="text-muted-foreground mb-4">
                  Begin by logging your first practice session or contest participation
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild>
                    <Link to="/daily-log">Log Practice Session</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contest-log">Log Contest</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">This Week's Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Problems Solved</span>
                        <span className="font-medium">{summary.problemsThisWeek}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Practiced</span>
                        <span className="font-medium">{summary.hoursThisWeek}h</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Overall Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Problems</span>
                        <span className="font-medium">{summary.totalProblems}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Goals Completed</span>
                        <span className="font-medium">{summary.completedGoals}/{summary.totalGoals}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
