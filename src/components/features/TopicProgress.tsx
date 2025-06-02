
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface TopicData {
  topic: string;
  solved: number;
  total: number;
  accuracy: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  avgTime: number;
}

export const TopicProgress = () => {
  const { user } = useAuth();
  const [topicData, setTopicData] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTopicProgress();
    }
  }, [user]);

  const fetchTopicProgress = async () => {
    if (!user) return;

    try {
      const { data: logs } = await supabaseClient
        .from('daily_logs')
        .select('topic, problems_solved, time_spent_minutes, difficulty')
        .eq('user_id', user.id);

      if (logs) {
        // Group by topic and calculate stats
        const topicStats = logs.reduce((acc: any, log: any) => {
          const topic = log.topic;
          if (!acc[topic]) {
            acc[topic] = {
              solved: 0,
              totalTime: 0,
              sessions: 0,
              difficulties: { Easy: 0, Medium: 0, Hard: 0 }
            };
          }
          
          acc[topic].solved += log.problems_solved;
          acc[topic].totalTime += log.time_spent_minutes;
          acc[topic].sessions += 1;
          acc[topic].difficulties[log.difficulty] = (acc[topic].difficulties[log.difficulty] || 0) + log.problems_solved;
          
          return acc;
        }, {});

        // Convert to TopicData format
        const processedData: TopicData[] = Object.entries(topicStats).map(([topic, stats]: [string, any]) => {
          const totalDifficulty = stats.difficulties.Easy + stats.difficulties.Medium + stats.difficulties.Hard;
          const weightedScore = (stats.difficulties.Easy * 1 + stats.difficulties.Medium * 2 + stats.difficulties.Hard * 3);
          const accuracy = totalDifficulty > 0 ? Math.round((weightedScore / (totalDifficulty * 3)) * 100) : 0;
          
          return {
            topic,
            solved: stats.solved,
            total: Math.max(stats.solved * 1.5, 20), // Estimate total based on solved
            accuracy,
            trend: Math.random() > 0.5 ? 'up' : 'down', // Random for now, can be calculated based on recent performance
            trendValue: Math.floor(Math.random() * 25),
            avgTime: Math.round(stats.totalTime / stats.sessions)
          };
        }).slice(0, 6); // Limit to top 6 topics

        setTopicData(processedData);
      }
    } catch (error) {
      console.error('Error fetching topic progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Topic-wise Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Topic-wise Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topicData.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No topic data available yet</p>
            <p className="text-sm text-muted-foreground">Start logging your practice sessions to see progress by topic</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topicData.map((topic) => {
              const progress = (topic.solved / topic.total) * 100;
              
              return (
                <div key={topic.topic} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-medium text-sm">{topic.topic}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {topic.accuracy}% accuracy
                      </Badge>
                      <div className={`flex items-center gap-1 text-xs ${getTrendColor(topic.trend)}`}>
                        {getTrendIcon(topic.trend)}
                        {topic.trendValue > 0 && `${topic.trendValue}%`}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{topic.solved} problems solved</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
