
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
  className?: string;
}

export const ActivityHeatmap = ({ data, className }: ActivityHeatmapProps) => {
  // Generate last 12 weeks of dates
  const generateWeeks = () => {
    const weeks = [];
    const today = new Date();
    
    for (let week = 11; week >= 0; week--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (week * 7) - today.getDay());
      
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + day);
        weekDays.push(date.toISOString().split('T')[0]);
      }
      weeks.push(weekDays);
    }
    return weeks;
  };

  const weeks = generateWeeks();
  
  const getDataForDate = (date: string) => {
    return data.find(d => d.date === date) || { date, count: 0, level: 0 as const };
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-green-200';
      case 2: return 'bg-green-300';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-100';
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Mobile view - simplified */}
          <div className="block md:hidden">
            <div className="grid grid-cols-7 gap-1">
              {weeks.slice(-4).flat().map((date) => {
                const dayData = getDataForDate(date);
                return (
                  <div
                    key={date}
                    className={`w-6 h-6 rounded-sm ${getLevelColor(dayData.level)}`}
                    title={`${date}: ${dayData.count} problems`}
                  />
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Last 4 weeks activity
            </div>
          </div>

          {/* Desktop view - full heatmap */}
          <div className="hidden md:block">
            <div className="flex gap-1 overflow-x-auto">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((date) => {
                    const dayData = getDataForDate(date);
                    return (
                      <div
                        key={date}
                        className={`w-3 h-3 rounded-sm ${getLevelColor(dayData.level)} hover:ring-2 hover:ring-gray-300 transition-all`}
                        title={`${date}: ${dayData.count} problems`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div key={level} className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
