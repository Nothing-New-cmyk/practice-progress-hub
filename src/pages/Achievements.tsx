
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { supabaseClient } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Star, Flame, Target, Clock, Code2, Calendar, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
}

export const Achievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalProblems: 0,
    longestStreak: 0,
    completedGoals: 0,
    contestsParticipated: 0,
    maxProblemsInDay: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch daily logs for stats
      const { data: dailyLogs, error: dailyError } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id);

      if (dailyError) throw dailyError;

      // Fetch weekly goals
      const { data: weeklyGoals, error: goalsError } = await supabaseClient
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id);

      if (goalsError) throw goalsError;

      // Fetch contest logs
      const { data: contestLogs, error: contestError } = await supabaseClient
        .from('contest_logs')
        .select('*')
        .eq('user_id', user.id);

      if (contestError) throw contestError;

      // Fetch user badges
      const { data: userBadges, error: badgesError } = await supabaseClient
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      if (badgesError) throw badgesError;

      // Calculate stats
      const totalProblems = dailyLogs?.reduce((sum, log) => sum + (log.problems_solved || 0), 0) || 0;
      const longestStreak = calculateLongestStreak(dailyLogs || []);
      const completedGoals = weeklyGoals?.filter(goal => goal.status === 'completed').length || 0;
      const contestsParticipated = contestLogs?.length || 0;
      const maxProblemsInDay = Math.max(...(dailyLogs?.map(log => log.problems_solved || 0) || [0]));

      const stats = {
        totalProblems,
        longestStreak,
        completedGoals,
        contestsParticipated,
        maxProblemsInDay,
      };

      setUserStats(stats);
      setAchievements(generateAchievements(stats, userBadges || []));

    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch achievement data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateLongestStreak = (logs: any[]) => {
    if (!logs.length) return 0;
    
    const sortedLogs = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    for (const log of sortedLogs) {
      if (log.problems_solved > 0) {
        const logDate = new Date(log.date);
        if (lastDate && (logDate.getTime() - lastDate.getTime()) === 24 * 60 * 60 * 1000) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        maxStreak = Math.max(maxStreak, currentStreak);
        lastDate = logDate;
      } else {
        currentStreak = 0;
        lastDate = null;
      }
    }
    
    return maxStreak;
  };

  const generateAchievements = (stats: any, userBadges: any[]): Achievement[] => {
    const badgeIds = new Set(userBadges.map(badge => badge.badge_id));

    return [
      {
        id: 'first-solve',
        title: 'First Steps',
        description: 'Solve your first problem',
        icon: Star,
        unlocked: stats.totalProblems >= 1,
        unlockedAt: badgeIds.has('first-solve') ? userBadges.find(b => b.badge_id === 'first-solve')?.earned_at : undefined,
      },
      {
        id: 'problem-solver',
        title: 'Problem Solver',
        description: 'Solve 100 problems',
        icon: Trophy,
        unlocked: stats.totalProblems >= 100,
        progress: Math.min(stats.totalProblems, 100),
        maxProgress: 100,
        unlockedAt: badgeIds.has('problem-solver') ? userBadges.find(b => b.badge_id === 'problem-solver')?.earned_at : undefined,
      },
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintain a 7-day streak',
        icon: Flame,
        unlocked: stats.longestStreak >= 7,
        progress: Math.min(stats.longestStreak, 7),
        maxProgress: 7,
        unlockedAt: badgeIds.has('streak-master') ? userBadges.find(b => b.badge_id === 'streak-master')?.earned_at : undefined,
      },
      {
        id: 'goal-achiever',
        title: 'Goal Achiever',
        description: 'Complete 10 weekly goals',
        icon: Target,
        unlocked: stats.completedGoals >= 10,
        progress: Math.min(stats.completedGoals, 10),
        maxProgress: 10,
        unlockedAt: badgeIds.has('goal-achiever') ? userBadges.find(b => b.badge_id === 'goal-achiever')?.earned_at : undefined,
      },
      {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Solve 10 problems in one day',
        icon: Clock,
        unlocked: stats.maxProblemsInDay >= 10,
        progress: Math.min(stats.maxProblemsInDay, 10),
        maxProgress: 10,
        unlockedAt: badgeIds.has('speed-demon') ? userBadges.find(b => b.badge_id === 'speed-demon')?.earned_at : undefined,
      },
      {
        id: 'contest-warrior',
        title: 'Contest Warrior',
        description: 'Participate in 5 contests',
        icon: Code2,
        unlocked: stats.contestsParticipated >= 5,
        progress: Math.min(stats.contestsParticipated, 5),
        maxProgress: 5,
        unlockedAt: badgeIds.has('contest-warrior') ? userBadges.find(b => b.badge_id === 'contest-warrior')?.earned_at : undefined,
      },
    ];
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
          <LoadingSkeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        <SectionHeader
          title="Achievements"
          subtitle={`${unlockedAchievements.length} of ${achievements.length} achievements unlocked`}
          icon={Trophy}
        />

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.totalProblems}</div>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.longestStreak}</div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.completedGoals}</div>
                <p className="text-sm text-muted-foreground">Goals Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.contestsParticipated}</div>
                <p className="text-sm text-muted-foreground">Contests Joined</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Unlocked Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.id} className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-full bg-green-500 text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <Badge variant="default">Unlocked</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {achievement.unlockedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Earned on {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Locked Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                const progressPercentage = achievement.progress && achievement.maxProgress 
                  ? (achievement.progress / achievement.maxProgress) * 100 
                  : 0;

                return (
                  <Card key={achievement.id} className="bg-gray-50 border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-full bg-gray-300 text-gray-600">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-700">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          
                          {achievement.progress !== undefined && achievement.maxProgress && (
                            <div className="mt-3">
                              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
