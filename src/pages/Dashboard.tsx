
import { Navbar } from '@/components/Navbar';
import { SummaryCard } from '@/components/ui/summary-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Target, Clock, Flame, Award } from 'lucide-react';

export const Dashboard = () => {
  const { summary, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="md:ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your DSA progress and achievements</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Problems This Week"
            value={summary.problemsThisWeek}
            icon={Target}
            description="Problems solved this week"
          />
          <SummaryCard
            title="Hours This Week"
            value={`${summary.hoursThisWeek}h`}
            icon={Clock}
            description="Time spent practicing"
          />
          <SummaryCard
            title="Current Streak"
            value={`${summary.currentStreak} days`}
            icon={Flame}
            description="Consecutive days of practice"
          />
          <SummaryCard
            title="Badges Earned"
            value={summary.badgesEarned}
            icon={Award}
            description="Achievements unlocked"
          />
        </div>

        {/* Charts and Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-muted-foreground">
                Heatmap Calendar (Coming Soon)
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-muted-foreground">
                Time Distribution Chart (Coming Soon)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goals Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              No weekly goals set yet. <a href="/weekly-goals" className="text-primary hover:underline">Create your first goal</a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
