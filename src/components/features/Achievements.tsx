
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Star, Target, Zap, Calendar } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Solve your first problem',
    icon: <Star className="h-6 w-6" />,
    earned: true,
    earnedDate: '2024-05-01'
  },
  {
    id: '2',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: <Zap className="h-6 w-6" />,
    earned: true,
    earnedDate: '2024-05-15'
  },
  {
    id: '3',
    title: 'Century Club',
    description: 'Solve 100 problems',
    icon: <Trophy className="h-6 w-6" />,
    earned: false,
    progress: 75,
    maxProgress: 100
  },
  {
    id: '4',
    title: 'Weekly Warrior',
    description: 'Complete weekly goals for 4 weeks',
    icon: <Target className="h-6 w-6" />,
    earned: false,
    progress: 2,
    maxProgress: 4
  },
  {
    id: '5',
    title: 'Time Master',
    description: 'Study for 50 hours total',
    icon: <Calendar className="h-6 w-6" />,
    earned: false,
    progress: 32,
    maxProgress: 50
  }
];

export const Achievements = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 border rounded-lg transition-all ${
                achievement.earned 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  achievement.earned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    {achievement.earned && (
                      <Badge className="bg-yellow-500 text-white text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  {achievement.earnedDate && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                  {!achievement.earned && achievement.progress && achievement.maxProgress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-yellow-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
