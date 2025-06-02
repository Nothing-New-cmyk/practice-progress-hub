
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TopicData {
  topic: string;
  solved: number;
  total: number;
  accuracy: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
}

const topicData: TopicData[] = [
  { topic: "Arrays", solved: 45, total: 60, accuracy: 89, trend: 'up', trendValue: 12 },
  { topic: "Dynamic Programming", solved: 18, total: 40, accuracy: 67, trend: 'down', trendValue: 5 },
  { topic: "Trees", solved: 32, total: 45, accuracy: 91, trend: 'up', trendValue: 8 },
  { topic: "Graphs", solved: 15, total: 35, accuracy: 72, trend: 'neutral', trendValue: 0 },
  { topic: "Strings", solved: 28, total: 35, accuracy: 85, trend: 'up', trendValue: 15 },
  { topic: "Binary Search", solved: 22, total: 25, accuracy: 94, trend: 'up', trendValue: 22 },
];

export const TopicProgress = () => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic-wise Progress</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <span>{topic.solved}/{topic.total} solved</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
