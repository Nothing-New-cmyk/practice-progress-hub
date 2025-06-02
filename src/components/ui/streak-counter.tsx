
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

export const StreakCounter = ({ currentStreak, longestStreak, className }: StreakCounterProps) => {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-orange-600">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">day streak</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Best: {longestStreak} days
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
