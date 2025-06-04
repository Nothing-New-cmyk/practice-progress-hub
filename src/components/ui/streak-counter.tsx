
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  lastActivity?: Date;
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  lastActivity,
  className
}) => {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 dark:text-purple-400';
    if (streak >= 14) return 'text-orange-600 dark:text-orange-400';
    if (streak >= 7) return 'text-yellow-600 dark:text-yellow-400';
    if (streak >= 3) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🌟';
    if (streak >= 3) return '✨';
    return '🎯';
  };

  return (
    <Card className={cn("p-6 hover:shadow-lg transition-shadow", className)}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
        <Flame className="h-4 w-4 text-orange-500" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold text-orange-500">{currentStreak}</span>
          <span className="text-lg">{getStreakEmoji(currentStreak)}</span>
          <span className="text-sm text-muted-foreground">days</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs">
              Best: {longestStreak} days
            </Badge>
          </div>
          {lastActivity && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{lastActivity.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Streak visualization */}
        <div className="flex space-x-1">
          {Array.from({ length: Math.min(currentStreak, 7) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full",
                getStreakColor(currentStreak)
              )}
              style={{ backgroundColor: 'currentColor' }}
            />
          ))}
          {currentStreak > 7 && (
            <span className="text-xs text-muted-foreground ml-1">+{currentStreak - 7}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
