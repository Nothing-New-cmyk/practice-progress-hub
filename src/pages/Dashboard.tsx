
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { StatsCard } from '@/components/ui/stats-card';
import { StreakCounter } from '@/components/ui/streak-counter';
import { SummaryCard } from '@/components/ui/summary-card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { SparklineChart } from '@/components/ui/sparkline-chart';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { TopicProgress } from '@/components/features/TopicProgress';
import { Achievements } from '@/components/features/Achievements';
import { useDashboardData } from '@/hooks/useDashboardData';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Clock, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Code2,
  Award,
  Users,
  Zap,
  Bell,
  Play,
  RotateCcw,
  Settings,
  ChevronRight,
  Star,
  Flame,
  Brain,
  Timer,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const Dashboard = () => {
  const { summary, loading } = useDashboardData();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Generate sample data for charts and heatmap
  const generateSparklineData = (baseValue: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      value: Math.max(0, baseValue + Math.floor(Math.random() * 20) - 10)
    }));
  };

  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const level = Math.floor(Math.random() * 5);
      data.push({
        date: date.toISOString().split('T')[0],
        count: level * 2,
        level: level as 0 | 1 | 2 | 3 | 4
      });
    }
    return data;
  };

  const difficultyData = [
    { difficulty: 'Easy', count: 45, color: '#10B981' },
    { difficulty: 'Medium', count: 32, color: '#F59E0B' },
    { difficulty: 'Hard', count: 18, color: '#EF4444' }
  ];

  const weeklyGoals = [
    { id: 1, goal: 'Solve 20 Medium Problems', target: 20, current: 14, status: 'in_progress' },
    { id: 2, goal: 'Complete 5 Contest Problems', target: 5, current: 5, status: 'completed' },
    { id: 3, goal: 'Study Dynamic Programming', target: 1, current: 0, status: 'missed' }
  ];

  const reminders = [
    { id: 1, type: 'Daily Practice', time: '9:00 PM', status: 'pending', priority: 'high' },
    { id: 2, type: 'Weekly Review', time: 'Sunday 8:00 AM', status: 'overdue', priority: 'medium' },
    { id: 3, type: 'Contest Reminder', time: 'Tomorrow 6:00 PM', status: 'upcoming', priority: 'low' }
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8">
          <LoadingSkeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  const weeklyProgress = summary.totalGoals > 0 ? (summary.completedGoals / summary.totalGoals) * 100 : 0;
  const problemsSparklineData = generateSparklineData(summary.problemsThisWeek);
  const weeklySparklineData = generateSparklineData(summary.hoursThisWeek);
  const heatmapData = generateHeatmapData();

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Dashboard"
            subtitle="Track your progress and achieve your coding goals"
            icon={Trophy}
          />
        </motion.div>

        {/* 1️⃣ Top Section - Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Problems This Week */}
          <GlassmorphicCard className="p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Problems This Week</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">{summary.problemsThisWeek}</span>
                  <Badge variant="secondary" className="text-xs">
                    +{Math.round(Math.random() * 20)}% vs last week
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Code2 className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                <div className="w-16 h-5">
                  <SparklineChart data={problemsSparklineData} color="#3B82F6" height={20} />
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Hours This Week */}
          <StatsCard
            title="Hours This Week"
            value={summary.hoursThisWeek.toString()}
            change={15.2}
            changeLabel="from last week"
            icon={Clock}
            trend="up"
          />

          {/* Current Streak */}
          <StreakCounter
            currentStreak={summary.currentStreak}
            longestStreak={15}
            lastActivity={new Date()}
          />

          {/* Badges Earned */}
          <GlassmorphicCard className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Badges Earned</h3>
                <Award className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{summary.badgesEarned}</p>
                    <p className="text-xs text-muted-foreground">Latest: Problem Solver</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* 2️⃣ Middle Section - Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Heatmap Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ActivityHeatmap data={heatmapData} />
          </motion.div>

          {/* Right: Charts Stack */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Difficulty Mastery Chart */}
            <DifficultyChart data={difficultyData} />

            {/* Topic Progress */}
            <TopicProgress />
          </motion.div>
        </div>

        {/* Additional Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Bests */}
          <EnhancedCard
            title="Personal Bests"
            subtitle="Your record achievements"
            icon={Star}
            className="p-6"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Best Week Ever</span>
                <span className="font-bold text-green-600">47 problems</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Longest Streak</span>
                <span className="font-bold text-orange-600">15 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fastest Solve</span>
                <span className="font-bold text-blue-600">12 minutes</span>
              </div>
            </div>
          </EnhancedCard>

          {/* Skill Progression */}
          <EnhancedCard
            title="Skill Level"
            subtitle="XP progression system"
            icon={Brain}
            className="p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Level</span>
                <Badge variant="outline">Expert (Lvl 8)</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>XP Progress</span>
                  <span>2,840 / 3,200</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </EnhancedCard>

          {/* Study Timer */}
          <EnhancedCard
            title="Focus Timer"
            subtitle="Pomodoro sessions"
            icon={Timer}
            className="p-6"
          >
            <div className="text-center space-y-4">
              <div className="text-3xl font-mono font-bold">25:00</div>
              <div className="flex justify-center space-x-2">
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
                <Button size="sm" variant="ghost">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 3️⃣ Bottom Section - Goals & Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Goals Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SummaryCard
              title="Weekly Goals"
              subtitle="Track your weekly objectives"
              icon={Target}
              badges={[{ label: `${summary.completedGoals}/${summary.totalGoals} Completed`, variant: "default" }]}
            >
              <div className="space-y-4">
                {weeklyGoals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  const statusIcon = goal.status === 'completed' ? CheckCircle : goal.status === 'missed' ? XCircle : Clock;
                  const statusColor = goal.status === 'completed' ? 'text-green-500' : goal.status === 'missed' ? 'text-red-500' : 'text-yellow-500';
                  
                  return (
                    <div key={goal.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <statusIcon className={`h-5 w-5 ${statusColor}`} />
                        <div>
                          <p className="font-medium text-sm">{goal.goal}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${goal.status === 'completed' ? 'bg-green-500' : goal.status === 'missed' ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{goal.current}/{goal.target}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </SummaryCard>
          </motion.div>

          {/* Reminders Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <SummaryCard
              title="Reminders & Notifications"
              subtitle="Stay on track with smart alerts"
              icon={Bell}
            >
              <div className="space-y-4">
                {reminders.map((reminder) => {
                  const priorityColor = reminder.priority === 'high' ? 'border-red-200 bg-red-50' : 
                                       reminder.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' : 
                                       'border-blue-200 bg-blue-50';
                  
                  return (
                    <div key={reminder.id} className={`p-3 border rounded-lg ${priorityColor}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{reminder.type}</p>
                          <p className="text-xs text-muted-foreground">{reminder.time}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Send Now
                          </Button>
                          <Button variant="ghost" size="sm">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <Button variant="outline" className="w-full mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Notifications
                </Button>
              </div>
            </SummaryCard>
          </motion.div>
        </div>

        {/* 4️⃣ Additional Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Achievements />
          </motion.div>

          {/* Recent Activity */}
          <EnhancedCard
            title="Recent Activity"
            subtitle="Your latest coding sessions"
            icon={Activity}
            className="p-6"
          >
            <div className="space-y-3">
              {[
                { action: "Solved 'Two Sum'", time: "2 hours ago", platform: "LeetCode" },
                { action: "Completed contest", time: "Yesterday", platform: "Codeforces" },
                { action: "Weekly goal achieved", time: "2 days ago", platform: "System" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time} • {activity.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>

          {/* Quick Actions */}
          <EnhancedCard
            title="Quick Actions"
            subtitle="Fast access to common tasks"
            icon={Zap}
            className="p-6"
          >
            <div className="space-y-3">
              <Button variant="default" className="w-full justify-start" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Log Today's Practice
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                View Contest Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Weekly Review
              </Button>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </AppLayout>
  );
};
