
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { EnhancedProgress } from '@/components/ui/enhanced-progress';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { StreakCounter } from '@/components/ui/streak-counter';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { ProblemRecommendations } from '@/components/features/ProblemRecommendations';
import { StudyPlan } from '@/components/features/StudyPlan';
import { TopicProgress } from '@/components/features/TopicProgress';
import { StudyTimer } from '@/components/features/StudyTimer';
import { Achievements } from '@/components/features/Achievements';
import { QuickLogger } from '@/components/features/QuickLogger';
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  Target, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Zap, 
  Brain, 
  Trophy,
  BarChart3,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { summary, loading } = useDashboardData();

  // Mock sparkline data
  const generateSparklineData = (points: number) => {
    return Array.from({ length: points }, (_, i) => ({
      value: Math.floor(Math.random() * 10) + 1
    }));
  };

  const difficultyData = [
    { difficulty: 'Easy', count: Math.floor(summary.totalProblems * 0.5), color: '#10B981' },
    { difficulty: 'Medium', count: Math.floor(summary.totalProblems * 0.35), color: '#F59E0B' },
    { difficulty: 'Hard', count: Math.floor(summary.totalProblems * 0.15), color: '#EF4444' }
  ];

  const heatmapData = [
    { date: '2024-05-01', count: 3, level: 2 as const },
    { date: '2024-05-02', count: 5, level: 3 as const },
    { date: '2024-05-03', count: 1, level: 1 as const },
  ];

  if (loading) {
    return (
      <AppLayout showFAB={false}>
        <div className="p-4 md:p-6 space-y-8">
          <LoadingSkeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <GlassmorphicCard key={i} className="p-6">
                <LoadingSkeleton className="h-6 w-32 mb-4" />
                <LoadingSkeleton className="h-8 w-16" />
              </GlassmorphicCard>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  const weeklyGoalProgress = summary.totalGoals > 0 ? Math.round((summary.completedGoals / summary.totalGoals) * 100) : 0;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8">
        {/* Header with parallax effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Dashboard"
            subtitle="Track your DSA progress and achievements"
            icon={BarChart3}
          />
        </motion.div>

        {/* Key Metrics - Asymmetrical Grid */}
        <div className="asymmetric-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassmorphicCard variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-600">Problems This Week</h3>
                    <p className="text-sm text-muted-foreground">Weekly target: 20</p>
                  </div>
                </div>
                <div className="w-16 h-8">
                  {/* Sparkline placeholder */}
                  <div className="h-full bg-gradient-to-r from-blue-500/20 to-blue-600/30 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <AnimatedCounter 
                  value={summary.problemsThisWeek} 
                  className="text-3xl font-bold text-blue-600"
                />
                <EnhancedProgress
                  value={summary.problemsThisWeek}
                  max={20}
                  variant="default"
                  size="sm"
                  animated
                />
                <EnhancedBadge variant="success" size="sm" icon={TrendingUp}>
                  +12% vs last week
                </EnhancedBadge>
              </div>
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassmorphicCard variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600">Time This Week</h3>
                    <p className="text-sm text-muted-foreground">Focused practice</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <AnimatedCounter 
                  value={summary.hoursThisWeek} 
                  suffix="h" 
                  className="text-3xl font-bold text-green-600"
                />
                <EnhancedBadge variant="success" size="sm" icon={TrendingUp}>
                  +8% efficiency
                </EnhancedBadge>
              </div>
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassmorphicCard variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-600">Weekly Goals</h3>
                    <p className="text-sm text-muted-foreground">{summary.completedGoals}/{summary.totalGoals} completed</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <AnimatedCounter 
                  value={weeklyGoalProgress} 
                  suffix="%" 
                  className="text-3xl font-bold text-yellow-600"
                />
                <EnhancedProgress
                  value={weeklyGoalProgress}
                  variant="warning"
                  size="sm"
                  animated
                />
              </div>
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassmorphicCard variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-600">Total Solved</h3>
                    <p className="text-sm text-muted-foreground">All time record</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <AnimatedCounter 
                  value={summary.totalProblems} 
                  className="text-3xl font-bold text-purple-600"
                />
                <EnhancedBadge variant="success" size="sm" icon={Star}>
                  Personal best!
                </EnhancedBadge>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>

        {/* Rest of the dashboard content with existing functionality */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <StreakCounter 
              currentStreak={summary.currentStreak} 
              longestStreak={15}
            />
            <QuickLogger />
          </div>
          
          <div className="space-y-6">
            <StudyTimer />
            
            <EnhancedCard
              title="Quick Actions"
              icon={Zap}
              iconColor="bg-indigo-100 text-indigo-600"
              gradient
            >
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  asChild 
                  className="h-auto p-4 flex-col gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/daily-log">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-sm font-medium">Log Practice</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex-col gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/contest-log">
                    <Trophy className="h-5 w-5" />
                    <span className="text-sm font-medium">Log Contest</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex-col gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/weekly-goals">
                    <Target className="h-5 w-5" />
                    <span className="text-sm font-medium">Set Goals</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex-col gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/settings">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </Button>
              </div>
            </EnhancedCard>
          </div>
        </div>

        {/* Second Row - Analytics and Progress */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DifficultyChart data={difficultyData} />
            <TopicProgress />
          </div>
          
          <div className="space-y-6">
            <ProblemRecommendations />
            <Achievements />
          </div>
        </div>

        {/* Third Row - Study Plan and Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <StudyPlan />
          
          <EnhancedCard
            title="Performance Overview"
            icon={Brain}
            iconColor="bg-purple-100 text-purple-600"
            gradient
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                  <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <AnimatedCounter 
                    value={summary.totalContests} 
                    className="text-2xl font-bold text-blue-600"
                  />
                  <div className="text-sm text-blue-600 font-medium">Contests</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <AnimatedCounter 
                    value={summary.totalGoals} 
                    className="text-2xl font-bold text-green-600"
                  />
                  <div className="text-sm text-green-600 font-medium">Goals Set</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <AnimatedCounter 
                  value={summary.badgesEarned} 
                  className="text-2xl font-bold text-purple-600"
                />
                <div className="text-sm text-purple-600 font-medium">Badges Earned</div>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={heatmapData} />

        {/* Performance Insights */}
        <EnhancedCard
          title="Performance Insights"
          icon={BarChart3}
          iconColor="bg-indigo-100 text-indigo-600"
          gradient
        >
          {summary.totalProblems === 0 ? (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Begin by logging your first practice session or contest participation to see detailed insights
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/daily-log">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Log Practice Session
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contest-log">
                    <Trophy className="h-4 w-4 mr-2" />
                    Log Contest
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-blue-200/50 rounded-xl bg-gradient-to-br from-blue-50/50 to-transparent">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    This Week's Progress
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Problems Solved</span>
                      <span className="font-semibold">{summary.problemsThisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time Practiced</span>
                      <span className="font-semibold">{summary.hoursThisWeek}h</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border border-green-200/50 rounded-xl bg-gradient-to-br from-green-50/50 to-transparent">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-600" />
                    Overall Stats
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Problems</span>
                      <span className="font-semibold">{summary.totalProblems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Goals Completed</span>
                      <span className="font-semibold">{summary.completedGoals}/{summary.totalGoals}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button asChild>
                  <Link to="/weekly-goals">
                    <Target className="h-4 w-4 mr-2" />
                    Manage Goals
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </EnhancedCard>

        {/* Quick Actions with Animated Gradient Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlassmorphicCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 heading-gradient">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatedGradientButton asChild gradient="primary" className="ripple">
                <Link to="/daily-log" className="flex flex-col items-center gap-2 p-4">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm font-medium">Log Practice</span>
                </Link>
              </AnimatedGradientButton>
              
              <AnimatedGradientButton asChild gradient="secondary" className="ripple">
                <Link to="/contest-log" className="flex flex-col items-center gap-2 p-4">
                  <Trophy className="h-6 w-6" />
                  <span className="text-sm font-medium">Log Contest</span>
                </Link>
              </AnimatedGradientButton>
              
              <AnimatedGradientButton asChild gradient="success" className="ripple">
                <Link to="/weekly-goals" className="flex flex-col items-center gap-2 p-4">
                  <Target className="h-6 w-6" />
                  <span className="text-sm font-medium">Set Goals</span>
                </Link>
              </AnimatedGradientButton>
              
              <AnimatedGradientButton asChild gradient="rainbow" className="ripple">
                <Link to="/settings" className="flex flex-col items-center gap-2 p-4">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm font-medium">Analytics</span>
                </Link>
              </AnimatedGradientButton>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Empty state with friendly microcopy */}
        {summary.totalProblems === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <GlassmorphicCard className="text-center py-16">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"
              >
                <BookOpen className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold heading-gradient mb-3">Ready to start your coding journey?</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                No practice sessions yet—let's get started! Track your progress, set goals, and watch yourself grow.
              </p>
              <div className="flex gap-4 justify-center">
                <AnimatedGradientButton asChild gradient="primary" size="lg">
                  <Link to="/daily-log">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Start First Session
                  </Link>
                </AnimatedGradientButton>
                <AnimatedGradientButton asChild gradient="secondary" size="lg">
                  <Link to="/weekly-goals">
                    <Target className="h-5 w-5 mr-2" />
                    Set Weekly Goals
                  </Link>
                </AnimatedGradientButton>
              </div>
            </GlassmorphicCard>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};
