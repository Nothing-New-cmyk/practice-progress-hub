
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // intensity levels
}

interface ActivityHeatmapProps {
  data: HeatmapDay[];
  className?: string;
}

const levelColors = {
  0: 'bg-gray-100',
  1: 'bg-green-100',
  2: 'bg-green-200', 
  3: 'bg-green-400',
  4: 'bg-green-600'
};

export const ActivityHeatmap = ({ data, className }: ActivityHeatmapProps) => {
  // Generate last 365 days for demo
  const today = new Date();
  const days = Array.from({ length: 365 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (364 - i));
    return date.toISOString().split('T')[0];
  });

  const getLevel = (date: string): 0 | 1 | 2 | 3 | 4 => {
    const dayData = data.find(d => d.date === date);
    return dayData?.level || 0;
  };

  const getTooltipText = (date: string) => {
    const dayData = data.find(d => d.date === date);
    const count = dayData?.count || 0;
    return `${count} problems on ${new Date(date).toLocaleDateString()}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activity Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-53 gap-1">
          {days.map((date) => (
            <div
              key={date}
              className={cn(
                'w-3 h-3 rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-gray-400',
                levelColors[getLevel(date)]
              )}
              title={getTooltipText(date)}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {Object.entries(levelColors).map(([level, color]) => (
              <div key={level} className={cn('w-3 h-3 rounded-sm', color)} />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};
