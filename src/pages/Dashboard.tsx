import { useEffect, useMemo } from 'react';
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
import { Achievements } from '@/components/features/Achievements';

import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  Code2,
  Clock,
  Trophy,
  ChevronRight,
  CheckCircle,
  XCircle,
  Settings,
  Bell,
  Star,
  Brain,
  Timer,
  Play,
  RotateCcw,
  Activity,
  Calendar,
  FileText,
  Zap,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { summary, loading, error, refetch } = useDashboardData();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // 1️⃣ Loading & Error Handling
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

  if (error || !summary) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 max-w-7xl mx-auto text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data.</p>
          <Button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Retry loading dashboard"
          >
            Retry
          </Button>
        </div>
      </AppLayout>
    );
  }

  // 2️⃣ Memoize Sparkline Data
  const problemsSparklineData = useMemo(
    () =>
      Array.from({ length: 7 }, () => ({
        value: Math.max(0, summary.problemsThisWeek + Math.floor(Math.random() * 20) - 10),
      })),
    [summary.problemsThisWeek]
  );

  const hoursSparklineData = useMemo(
    () =>
      Array.from({ length: 7 }, () => ({
        value: Math.max(0, summary.hoursThisWeek + Math.floor(Math.random() * 10) - 5),
      })),
    [summary.hoursThisWeek]
  );

  // 3️⃣ Generate 1‐Year Heatmap Data (placeholder; replace with real data)
  const heatmapData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 365 }, (_, idx) => {
      const d = new Date(today);
      d.setDate(d.getDate() - idx);
      const level = (Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4);
      return {
        date: d.toISOString().split('T')[0],
        count: level * 2,
        level,
      };
    });
  }, []);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto bg-white dark:bg-gray-900">
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
            className="text-gray-900 dark:text-gray-100"
          />
        </motion.div>

        {/* 1️⃣ Top Section – Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Problems This Week */}
          <GlassmorphicCard
            as="button"
            onClick={() => navigate('/problems')}
            role="button"
            tabIndex={0}
            className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            aria-label="View problems this week details"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Problems This Week</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {summary.problemsThisWeek}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    +{Math.round(Math.random() * 20)}% vs last week
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Code2 className="h-8 w-8 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="w-16 h-5">
                  <SparklineChart data={problemsSparklineData} color="#3B82F6" height={20} />
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Hours This Week */}
          <GlassmorphicCard className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hours This Week</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {summary.hoursThisWeek}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    +{Math.round(Math.random() * 15)}% vs last week
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Clock className="h-8 w-8 text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform" />
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
              currentStreak={summary.currentStreak}
              longestStreak={summary.longestStreak}
              lastActivity={new Date(summary.lastActivityDate)}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          {/* Badges Earned */}
          <GlassmorphicCard
            as="button"
            onClick={() => navigate('/badges')}
            role="button"
            tabIndex={0}
            className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            aria-label="View all earned badges"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Badges Earned</h3>
                <Trophy className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {summary.badgesEarned}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Latest: {summary.latestBadgeName}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* 2️⃣ Middle Section – Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Heatmap */}
          <motion.section
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4"
            role="region"
            aria-labelledby="heatmap-heading"
          >
            <h2 id="heatmap-heading" className="sr-only">
              Activity Heatmap
            </h2>
            <ActivityHeatmap data={heatmapData} />
          </motion.section>

          {/* Difficulty & Topic Progress */}
          <motion.div
            className="space-y-6"
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <section
              role="region"
              aria-labelledby="difficulty-chart-heading"
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <h2 id="difficulty-chart-heading" className="sr-only">
                Difficulty Mastery Chart
              </h2>
              <DifficultyChart
                data={summary.difficultyData}
                aria-label="Bar chart showing count of Easy, Medium, Hard problems solved"
              />
            </section>

            <section
              role="region"
              aria-labelledby="topic-progress-heading"
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <h2 id="topic-progress-heading" className="sr-only">
                Topic Progress
              </h2>
              <TopicProgress data={summary.topicProgress} />
            </section>
          </motion.div>
        </div>

        {/* 3️⃣ Additional Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Bests */}
          <EnhancedCard
            title="Personal Bests"
            subtitle="Your record achievements"
            icon={Star}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Best Week Ever</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {summary.bestWeek} problems
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Longest Streak</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {summary.longestStreak} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Fastest Solve</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {summary.fastestSolve} minutes
                </span>
              </div>
            </div>
          </EnhancedCard>

          {/* Skill Progression */}
          <EnhancedCard
            title="Skill Level"
            subtitle="XP progression system"
            icon={Brain}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Current Level</span>
                <Badge variant="outline">{summary.currentLevelLabel}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>XP Progress</span>
                  <span>
                    {summary.currentXP.toLocaleString()} / {summary.nextLevelXP.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${(summary.currentXP / summary.nextLevelXP) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </EnhancedCard>

          {/* Focus Timer */}
          <EnhancedCard
            title="Focus Timer"
            subtitle="Pomodoro sessions"
            icon={Timer}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="text-center space-y-4">
              <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
                25:00
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="justify-center"
                  aria-label="Start timer"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
                <Button size="sm" variant="ghost" aria-label="Reset timer">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 4️⃣ Bottom Section – Goals & Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Goals Table */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SummaryCard
              title="Weekly Goals"
              subtitle="Track your weekly objectives"
              icon={Calendar}
              badges={[
                {
                  label: `${summary.completedGoals}/${summary.totalGoals} Completed`,
                  variant: 'default',
                },
              ]}
            >
              <div className="space-y-4">
                {summary.weeklyGoals.map((goal) => {
                  const progressPercent = (goal.current / goal.target) * 100;
                  const StatusIcon =
                    goal.status === 'completed'
                      ? CheckCircle
                      : goal.status === 'missed'
                      ? XCircle
                      : Clock;
                  const statusColor =
                    goal.status === 'completed'
                      ? 'text-green-500 dark:text-green-400'
                      : goal.status === 'missed'
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-yellow-500 dark:text-yellow-400';

                  return (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/goals/${goal.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(`/goals/${goal.id}`);
                        }
                      }}
                      aria-label={`View goal: ${goal.goal}`}
                    >
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`h-5 w-5 ${statusColor}`} aria-hidden="true" />
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {goal.goal}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div
                              role="progressbar"
                              aria-valuenow={Math.min(progressPercent, 100)}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${goal.current} of ${goal.target} completed`}
                              className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"
                            >
                              <div
                                className={`h-1.5 rounded-full ${
                                  goal.status === 'completed'
                                    ? 'bg-green-500 dark:bg-green-400'
                                    : goal.status === 'missed'
                                    ? 'bg-red-500 dark:bg-red-400'
                                    : 'bg-blue-500 dark:bg-blue-400'
                                }`}
                                style={{ width: `${Math.min(progressPercent, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {goal.current}/{goal.target}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Edit goal: ${goal.goal}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/goals/${goal.id}/edit`);
                        }}
                      >
                        <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </SummaryCard>
          </motion.div>

          {/* Reminders Panel */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <SummaryCard
              title="Reminders & Notifications"
              subtitle="Stay on track with smart alerts"
              icon={Bell}
            >
              <div className="space-y-4">
                {summary.reminders.map((reminder) => {
                  const priorityClasses =
                    reminder.priority === 'high'
                      ? 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900'
                      : reminder.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900';

                  return (
                    <div
                      key={reminder.id}
                      className={`p-3 border rounded-lg ${priorityClasses}`}
                      role="region"
                      aria-label={`Reminder: ${reminder.type} at ${reminder.time}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {reminder.type}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {reminder.time}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              /* call API to send now */
                            }}
                            aria-label={`Send reminder ${reminder.type} now`}
                          >
                            Send Now
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              /* call API to dismiss */
                            }}
                            aria-label={`Dismiss reminder ${reminder.type}`}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate('/settings/notifications')}
                  aria-label="Configure Notifications"
                >
                  <Settings className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" />
                  Configure Notifications
                </Button>
              </div>
            </SummaryCard>
          </motion.div>
        </div>

        {/* 5️⃣ Additional Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Achievements */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Achievements data={summary.achievements} />
          </motion.div>

          {/* Recent Activity */}
          <EnhancedCard
            title="Recent Activity"
            subtitle="Your latest coding sessions"
            icon={Activity}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="space-y-3">
              {summary.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer"
                  onClick={() => navigate(`/activity/${activity.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/activity/${activity.id}`);
                    }
                  }}
                  aria-label={`${activity.action}, ${activity.time}, via ${activity.platform}`}
                >
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time} • {activity.platform}
                    </p>
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
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="space-y-3">
              <Button
                variant="default"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/daily-log')}
                aria-label="Log Today's Practice"
              >
                <Calendar className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" />
                Log Today's Practice
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/contests')}
                aria-label="View Contest Schedule"
              >
                <Trophy className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" />
                View Contest Schedule
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/weekly-goals')}
                aria-label="Weekly Review"
              >
                <FileText className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" />
                Weekly Review
              </Button>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </AppLayout>
  );
};
