
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface TopicData {
  topic: string;
  solved: number;
  total: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const topics: TopicData[] = [
  { topic: 'Arrays', solved: 45, total: 60, difficulty: 'easy' },
  { topic: 'Dynamic Programming', solved: 23, total: 50, difficulty: 'hard' },
  { topic: 'Trees', solved: 32, total: 40, difficulty: 'medium' },
  { topic: 'Graphs', solved: 18, total: 35, difficulty: 'hard' },
  { topic: 'Strings', solved: 28, total: 35, difficulty: 'medium' },
];

export const TopicProgress: React.FC = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'default' as const;
      case 'medium': return 'secondary' as const;
      case 'hard': return 'destructive' as const;
      default: return 'outline' as const;
    }
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
            const percentage = (topic.solved / topic.total) * 100;
            return (
              <div key={topic.topic} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{topic.topic}</span>
                    <Badge variant={getDifficultyVariant(topic.difficulty)} className="text-xs">
                      {topic.difficulty}
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
