
import { useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { StreakCounter } from '@/components/ui/streak-counter';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { SummaryCard } from '@/components/ui/summary-card';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { SparklineChart } from '@/components/ui/sparkline-chart';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { TopicProgress } from '@/components/features/TopicProgress';
import { Progress } from '@/components/ui/progress';

import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import {
  Code2,
  Clock,
  Trophy,
  ChevronRight,
  CheckCircle,
  XCircle,
  Settings,
  Activity,
  Calendar,
  FileText,
  Zap,
  Target,
  TrendingUp,
  Star,
  Award,
  Timer,
  Brain,
  BarChart3,
  Flame,
  BookOpen,
  Users,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data, loading, refreshData } = useDashboardData();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { toast } = useToast();

  useEffect(() => {
    // Welcome toast for first-time users
    if (!loading && data.recentLogs.length === 0) {
      toast({
        title: "Welcome to NoobsterDSA! 🎉",
        description: "Start logging your daily practice to track your progress and unlock achievements.",
      });
    }
  }, [loading, data.recentLogs.length, toast]);

  // Loading & Error Handling
  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
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

  // Generate sparkline data based on recent activity
  const generateSparklineData = (baseValue: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      value: Math.max(0, baseValue + Math.floor(Math.random() * 3) - 1)
    }));
  };

  const problemsSparklineData = generateSparklineData(data.weeklyStats.problemsSolved);
  const hoursSparklineData = generateSparklineData(Math.floor(data.weeklyStats.timeSpent / 60));

  // Calculate additional metrics
  const averageProblemsPerDay = data.weeklyStats.problemsSolved / 7;
  const averageTimePerProblem = data.weeklyStats.problemsSolved > 0 ? data.weeklyStats.timeSpent / data.weeklyStats.problemsSolved : 0;
  const weeklyGoalProgress = data.weeklyGoals.length > 0 ?
    (data.weeklyGoals.filter(g => g.status === 'completed').length / data.weeklyGoals.length) * 100 : 0;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto bg-background">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Dashboard"
            subtitle="Track your progress and achieve your coding goals"
            icon={Trophy}
          />
        </motion.div>

        {/* Primary Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Problems This Week */}
          <GlassmorphicCard
            as="button"
            onClick={() => {
              navigate('/daily-log');
              toast({
                title: "Daily Log",
                description: "Log your coding practice here",
              });
            }}
            className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Problems This Week</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    {data.weeklyStats.problemsSolved}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({averageProblemsPerDay.toFixed(1)}/day)
                  </span>
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
          <GlassmorphicCard className="p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours This Week</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    {Math.floor(data.weeklyStats.timeSpent / 60)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({averageTimePerProblem.toFixed(0)}m/problem)
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Clock className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform" />
                <div className="w-16 h-5">
                  <SparklineChart data={hoursSparklineData} color="#10B981" height={20} />
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Current Streak */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StreakCounter
              currentStreak={data.currentStreak}
              longestStreak={data.currentStreak}
              lastActivity={new Date()}
              className="p-6 rounded-lg shadow-sm"
            />
          </motion.div>

          {/* Weekly Goal Progress */}
          <GlassmorphicCard className="p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Weekly Progress</h3>
                <Target className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{weeklyGoalProgress.toFixed(0)}%</span>
                    <Badge variant="outline">{data.weeklyGoals.filter(g => g.status === 'completed').length}/{data.weeklyGoals.length} goals</Badge>
                  </div>
                  <Progress value={weeklyGoalProgress} className="h-2" />
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Secondary Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Badges Earned */}
          <GlassmorphicCard
            as="button"
            onClick={() => navigate('/achievements')}
            className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Achievements</h3>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{data.badgesCount}</p>
                    <p className="text-xs text-muted-foreground">badges earned</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </GlassmorphicCard>

          {/* Contest Performance */}
          <GlassmorphicCard
            as="button"
            onClick={() => navigate('/contest-log')}
            className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Contests</h3>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{data.contestsParticipated}</p>
                    <p className="text-xs text-muted-foreground">participated</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </GlassmorphicCard>

          {/* Learning Rate */}
          <GlassmorphicCard className="p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Learning Rate</h3>
                <Brain className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{data.topicsData.length}</p>
                    <p className="text-xs text-muted-foreground">topics active</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Quick Analytics */}
          <GlassmorphicCard
            as="button"
            onClick={() => navigate('/analytics')}
            className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Analytics</h3>
                <BarChart3 className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-indigo-500" />
                  <div>
                    <p className="text-2xl font-bold">View</p>
                    <p className="text-xs text-muted-foreground">detailed stats</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-background rounded-xl shadow p-4 sm:p-6">
            <ActivityHeatmap />
          </div>
        </motion.div>


        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Heatmap + Quick Actions stacked */}
          <motion.section
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col space-y-6 h-full"
          >


            {/* Quick Actions */}
            <EnhancedCard
              title="Quick Actions"
              subtitle="Fast access to common tasks"
              icon={Zap}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                <Button
                  variant="default"
                  className="w-full h-12 text-base gap-2"
                  onClick={() => {
                    navigate('/daily-log');
                    toast({
                      title: "Daily Log",
                      description: "Log your coding practice here",
                    });
                  }}
                >
                  <Calendar className="h-5 w-5" />
                  Log Practice
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 text-base gap-2"
                  onClick={() => {
                    navigate('/contest-log');
                    toast({
                      title: "Contest Log",
                      description: "Track your contest participation",
                    });
                  }}
                >
                  <Trophy className="h-5 w-5" />
                  Contest Schedule
                </Button>

                <Button
                  variant="secondary"
                  className="w-full h-12 text-base gap-2"
                  onClick={() => {
                    navigate('/weekly-goals');
                    toast({
                      title: "Weekly Goals",
                      description: "Review and set your goals",
                    });
                  }}
                >
                  <FileText className="h-5 w-5" />
                  Weekly Review
                </Button>
              </div>
            </EnhancedCard>

            {/* Recent Activity */}
            <EnhancedCard
              title="Recent Activity"
              subtitle="Your latest coding sessions"
              icon={Activity}
            >
              <div className="space-y-3">
                {data.recentLogs.slice(0, 5).map((log, index) => (
                  <div
                    key={`activity-${index}`}
                    className="flex items-center space-x-3 p-2 hover:bg-accent rounded transition-colors cursor-pointer"
                    onClick={() => navigate(`/daily-log`)}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Solved {log.problems_solved} problems on {log.platform}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.topic} • {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {log.problems_solved}
                    </Badge>
                  </div>
                ))}
                {data.recentLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-xs">Start logging your practice!</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        navigate('/daily-log');
                        toast({
                          title: "Daily Log",
                          description: "Log your first practice session!",
                        });
                      }}
                    >
                      Start Logging
                    </Button>
                  </div>
                )}
              </div>
            </EnhancedCard>

            {/* Weekly Goals */}
            <SummaryCard
              title="Weekly Goals"
              subtitle="Track your weekly objectives"
              icon={Calendar}
              badges={[
                {
                  label: `${data.weeklyGoals.filter(g => g.status === 'completed').length}/${data.weeklyGoals.length} Completed`,
                  variant: 'default',
                },
              ]}
            >
              <div className="space-y-4">
                {data.weeklyGoals.slice(0, 3).map((goal) => {
                  const progressPercent = (goal.current_value / goal.target_value) * 100;
                  const StatusIcon =
                    goal.status === 'completed'
                      ? CheckCircle
                      : goal.status === 'missed'
                        ? XCircle
                        : Clock;
                  const statusColor =
                    goal.status === 'completed'
                      ? 'text-green-500'
                      : goal.status === 'missed'
                        ? 'text-red-500'
                        : 'text-yellow-500';

                  return (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => navigate(`/weekly-goals`)}
                    >
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                        <div>
                          <p className="font-medium text-sm">
                            {goal.goal_description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-24 bg-secondary rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${goal.status === 'completed'
                                  ? 'bg-green-500'
                                  : goal.status === 'missed'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                                  }`}
                                style={{ width: `${Math.min(progressPercent, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {goal.current_value}/{goal.target_value}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
                {data.weeklyGoals.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No weekly goals set</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        navigate('/weekly-goals');
                        toast({
                          title: "Weekly Goals",
                          description: "Set up your first weekly goal!",
                        });
                      }}
                    >
                      Create Goal
                    </Button>
                  </div>
                )}
              </div>
            </SummaryCard>
          </motion.section>

          {/* Right Column: Difficulty & Topic Progress */}
          <motion.div
            className="space-y-6"
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <DifficultyChart data={data.difficultyData} />
            <TopicProgress topics={data.topicsData} />
          </motion.div>
        </div>



      </div>
    </AppLayout>
  );
};
