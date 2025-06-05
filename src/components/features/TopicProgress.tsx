
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface TopicData {
  topic: string;
  solved: number;
  total: number;
  percentage?: number;
}

interface TopicProgressProps {
  topics: TopicData[];
}

export const TopicProgress: React.FC<TopicProgressProps> = ({ topics }) => {
  const getDifficultyColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDifficultyVariant = (percentage: number) => {
    if (percentage >= 80) return 'default' as const;
    if (percentage >= 60) return 'secondary' as const;
    return 'destructive' as const;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Topic Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic) => {
            const percentage = topic.percentage || (topic.solved / topic.total) * 100;
            const difficultyLevel = percentage >= 80 ? 'mastered' : percentage >= 60 ? 'good' : 'learning';
            
            return (
              <div key={topic.topic} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{topic.topic}</span>
                    <Badge variant={getDifficultyVariant(percentage)} className="text-xs">
                      {difficultyLevel}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {topic.solved}/{topic.total}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
