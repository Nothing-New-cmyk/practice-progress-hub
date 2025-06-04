
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Target, Clock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const achievements: Achievement[] = [
  {
    id: 'first-solve',
    title: 'First Steps',
    description: 'Solve your first problem',
    icon: Star,
    unlocked: true,
  },
  {
    id: 'problem-solver',
    title: 'Problem Solver',
    description: 'Solve 100 problems',
    icon: Trophy,
    unlocked: true,
    progress: 100,
    maxProgress: 100,
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    unlocked: false,
    progress: 5,
    maxProgress: 7,
  },
  {
    id: 'goal-achiever',
    title: 'Goal Achiever',
    description: 'Complete 10 weekly goals',
    icon: Target,
    unlocked: false,
    progress: 6,
    maxProgress: 10,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Solve 10 problems in one day',
    icon: Clock,
    unlocked: false,
    progress: 3,
    maxProgress: 10,
  },
];

export const Achievements: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercentage = achievement.progress && achievement.maxProgress 
              ? (achievement.progress / achievement.maxProgress) * 100 
              : 0;

            return (
              <div
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  achievement.unlocked 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  achievement.unlocked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    {achievement.unlocked && (
                      <Badge variant="default" className="text-xs">Unlocked</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  
                  {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
