
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

import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';

import {
  Code2,
  Clock,
  Trophy,
  ChevronRight,
  CheckCircle,
  XCircle,
  Settings,
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
  const { data, loading, refreshData } = useDashboardData();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  
  const [realTimeData, setRealTimeData] = useState({
    heatmapData: [] as Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>,
    difficultyData: [] as Array<{ difficulty: string; count: number; color: string }>,
    topicsData: [] as Array<{ topic: string; solved: number; total: number; percentage: number }>,
    badgesCount: 0,
    platformData: [] as Array<{ platform: string; count: number }>,
    currentStreak: 0,
    longestStreak: 0,
    successRate: 0,
  });

  useEffect(() => {
    if (user) {
      fetchRealTimeData();
    }
  }, [user]);

  const fetchRealTimeData = async () => {
    if (!user) return;

    try {
      // Fetch daily logs for analytics
      const { data: dailyLogs, error: dailyError } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (dailyError) throw dailyError;

      // Fetch user badges
      const { data: userBadges, error: badgesError } = await supabaseClient
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      if (badgesError) throw badgesError;

      // Process heatmap data
      const heatmapData = generateHeatmapFromLogs(dailyLogs || []);
      
      // Process difficulty data
      const difficultyData = processDifficultyData(dailyLogs || []);
      
      // Process topics data
      const topicsData = processTopicsData(dailyLogs || []);
      
      // Process platform data
      const platformData = processPlatformData(dailyLogs || []);
      
      // Calculate streaks and success rate
      const { currentStreak, longestStreak } = calculateStreaks(dailyLogs || []);
      const successRate = calculateSuccessRate(dailyLogs || []);

      setRealTimeData({
        heatmapData,
        difficultyData,
        topicsData,
        badgesCount: userBadges?.length || 0,
        platformData,
        currentStreak,
        longestStreak,
        successRate,
      });

    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const generateHeatmapFromLogs = (logs: any[]) => {
    const today = new Date();
    const heatmapData = [];
    
    const logMap = new Map();
    logs.forEach(log => {
      logMap.set(log.date, (log.problems_solved || 0));
    });

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = logMap.get(dateStr) || 0;
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 5) level = 3;
      if (count >= 8) level = 4;

      heatmapData.push({ date: dateStr, count, level });
    }

    return heatmapData;
  };

  const processDifficultyData = (logs: any[]) => {
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    
    logs.forEach(log => {
      const difficulty = log.difficulty?.toLowerCase();
      if (difficulty && difficultyCounts.hasOwnProperty(difficulty)) {
        difficultyCounts[difficulty as keyof typeof difficultyCounts] += log.problems_solved || 0;
      }
    });

    return [
      { difficulty: 'Easy', count: difficultyCounts.easy, color: '#10B981' },
      { difficulty: 'Medium', count: difficultyCounts.medium, color: '#F59E0B' },
      { difficulty: 'Hard', count: difficultyCounts.hard, color: '#EF4444' }
    ];
  };

  const processTopicsData = (logs: any[]) => {
    const topicCounts = new Map();
    
    logs.forEach(log => {
      if (log.topic) {
        const current = topicCounts.get(log.topic) || 0;
        topicCounts.set(log.topic, current + (log.problems_solved || 0));
      }
    });

    return Array.from(topicCounts.entries())
      .map(([topic, solved]) => ({
        topic,
        solved: solved as number,
        total: (solved as number) + Math.max(10, Math.floor((solved as number) * 0.3)),
        percentage: Math.min(100, ((solved as number) / ((solved as number) + Math.max(10, Math.floor((solved as number) * 0.3)))) * 100)
      }))
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 5);
  };

  const processPlatformData = (logs: any[]) => {
    const platformCounts = new Map();
    
    logs.forEach(log => {
      if (log.platform) {
        const current = platformCounts.get(log.platform) || 0;
        platformCounts.set(log.platform, current + (log.problems_solved || 0));
      }
    });

    return Array.from(platformCounts.entries())
      .map(([platform, count]) => ({ platform, count: count as number }))
      .sort((a, b) => b.count - a.count);
  };

  const calculateStreaks = (logs: any[]) => {
    if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 };
    
    const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (sortedLogs[i].problems_solved > 0) {
        if (daysDiff === i) {
          tempStreak++;
          if (i === 0 || daysDiff === 0 || daysDiff === 1) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    return { currentStreak, longestStreak };
  };

  const calculateSuccessRate = (logs: any[]) => {
    if (logs.length === 0) return 0;
    
    const successfulSessions = logs.filter(log => (log.problems_solved || 0) > 0).length;
    return Math.round((successfulSessions / logs.length) * 100);
  };

  // Generate sparkline data based on current values
  const generateSparklineData = (baseValue: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      value: Math.max(0, baseValue + Math.floor(Math.random() * 3) - 1)
    }));
  };

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

  const problemsSparklineData = generateSparklineData(data.weeklyStats.problemsSolved);
  const hoursSparklineData = generateSparklineData(Math.floor(data.weeklyStats.timeSpent / 60));

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

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Problems This Week */}
          <GlassmorphicCard
            as="button"
            onClick={() => navigate('/daily-log')}
            className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Problems This Week</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    {data.weeklyStats.problemsSolved}
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
              currentStreak={realTimeData.currentStreak}
              longestStreak={realTimeData.longestStreak}
              lastActivity={new Date()}
              className="p-6 rounded-lg shadow-sm"
            />
          </motion.div>

          {/* Badges Earned */}
          <GlassmorphicCard
            as="button"
            onClick={() => navigate('/achievements')}
            className="p-6 hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Badges Earned</h3>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {realTimeData.badgesCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View all achievements
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Heatmap */}
          <motion.section
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ActivityHeatmap data={realTimeData.heatmapData} />
          </motion.section>

          {/* Difficulty & Topic Progress */}
          <motion.div
            className="space-y-6"
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <DifficultyChart data={realTimeData.difficultyData} />
            <TopicProgress topics={realTimeData.topicsData} />
          </motion.div>
        </div>

        {/* Goals & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Goals */}
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
                                className={`h-1.5 rounded-full ${
                                  goal.status === 'completed'
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
              </div>
            </SummaryCard>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
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
                        Solved {log.problems_solved} problems
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </EnhancedCard>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <EnhancedCard
            title="Quick Actions"
            subtitle="Fast access to common tasks"
            icon={Zap}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="default"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/daily-log')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Log Today's Practice
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/contest-log')}
              >
                <Trophy className="h-4 w-4 mr-2" />
                View Contest Schedule
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/weekly-goals')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Weekly Review
              </Button>
            </div>
          </EnhancedCard>
        </motion.div>
      </div>
    </AppLayout>
  );
};
