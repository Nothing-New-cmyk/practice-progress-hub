
import { Navbar } from '@/components/Navbar';
import { StatsCard } from '@/components/ui/stats-card';
import { StreakCounter } from '@/components/ui/streak-counter';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Target, Clock, Award, TrendingUp, Calendar, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { summary, loading } = useDashboardData();

  // Mock data for enhanced features
  const difficultyData = [
    { difficulty: 'Easy', count: 45, color: '#10B981' },
    { difficulty: 'Medium', count: 32, color: '#F59E0B' },
    { difficulty: 'Hard', count: 18, color: '#EF4444' }
  ];

  const heatmapData = [
    { date: '2024-05-01', count: 3, level: 2 as const },
    { date: '2024-05-02', count: 5, level: 3 as const },
    { date: '2024-05-03', count: 1, level: 1 as const },
    // Add more mock data as needed
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <main className="md:ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Track your DSA progress and achievements</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            title="Weekly Goal"
            value="85%"
            subtitle="17/20 problems"
            progress={85}
            color="warning"
          />
          <StatsCard
            title="Total Solved"
            value="247"
            subtitle="All time problems"
            icon={Award}
            trend="up"
            trendValue="+5"
            color="success"
          />
        </div>

        {/* Streak and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StreakCounter 
            currentStreak={summary.currentStreak} 
            longestStreak={15}
            className="lg:col-span-1"
          />
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button asChild className="h-auto p-4 flex-col gap-2">
                  <Link to="/daily-log">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-xs">Log Practice</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link to="/contest-log">
                    <Target className="h-5 w-5" />
                    <span className="text-xs">Log Contest</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link to="/weekly-goals">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs">Set Goals</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link to="/settings">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-xs">Analytics</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DifficultyChart data={difficultyData} />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Two Pointers</p>
                    <p className="text-sm text-green-600">5 problems • 89% accuracy</p>
                  </div>
                  <div className="text-green-600 font-bold">+15%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">Dynamic Programming</p>
                    <p className="text-sm text-yellow-600">3 problems • 67% accuracy</p>
                  </div>
                  <div className="text-yellow-600 font-bold">-5%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Binary Search</p>
                    <p className="text-sm text-blue-600">7 problems • 94% accuracy</p>
                  </div>
                  <div className="text-blue-600 font-bold">+22%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={heatmapData} className="mb-8" />

        {/* Current Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Goals
              <Button asChild size="sm">
                <Link to="/weekly-goals">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Solve 20 problems this week</h4>
                  <p className="text-sm text-muted-foreground">Progress: 17/20 completed</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">85%</div>
                    <div className="text-xs text-muted-foreground">3 remaining</div>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Complete 5 hard problems</h4>
                  <p className="text-sm text-muted-foreground">Progress: 2/5 completed</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-orange-600">40%</div>
                    <div className="text-xs text-muted-foreground">3 remaining</div>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[40%] h-full bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
