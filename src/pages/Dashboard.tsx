
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
import { Target, Clock, Award, TrendingUp, Calendar, BookOpen, Zap, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { summary, loading } = useDashboardData();

  const difficultyData = [
    { difficulty: 'Easy', count: 45, color: '#10B981' },
    { difficulty: 'Medium', count: 32, color: '#F59E0B' },
    { difficulty: 'Hard', count: 18, color: '#EF4444' }
  ];

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
                      <Target className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Log Contest</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-3 md:p-4 flex-col gap-1 md:gap-2 text-xs">
                    <Link to="/weekly-goals">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Set Goals</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-3 md:p-4 flex-col gap-1 md:gap-2 text-xs">
                    <Link to="/settings">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Analytics</span>
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

        {/* Third Row - Study Plan and Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <StudyPlan />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800 text-sm md:text-base">Two Pointers</p>
                    <p className="text-xs md:text-sm text-green-600">5 problems • 89% accuracy</p>
                  </div>
                  <div className="text-green-600 font-bold text-sm md:text-base">+15%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800 text-sm md:text-base">Dynamic Programming</p>
                    <p className="text-xs md:text-sm text-yellow-600">3 problems • 67% accuracy</p>
                  </div>
                  <div className="text-yellow-600 font-bold text-sm md:text-base">-5%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800 text-sm md:text-base">Binary Search</p>
                    <p className="text-xs md:text-sm text-blue-600">7 problems • 94% accuracy</p>
                  </div>
                  <div className="text-blue-600 font-bold text-sm md:text-base">+22%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={heatmapData} className="mb-6 md:mb-8" />

        {/* Current Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Active Goals</span>
              <Button asChild size="sm">
                <Link to="/weekly-goals">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm md:text-base">Solve 20 problems this week</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Progress: 17/20 completed</p>
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
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm md:text-base">Complete 5 hard problems</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Progress: 2/5 completed</p>
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
