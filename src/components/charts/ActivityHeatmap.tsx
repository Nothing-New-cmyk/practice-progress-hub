
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface HeatmapData {
  date: string;            // ISO date string: "2024-05-12"
  count: number;           // number of problems solved
  level: 0 | 1 | 2 | 3 | 4; // heatmap intensity
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  const getColorClass = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
      case 1:
        return 'bg-green-200 dark:bg-green-900 border border-green-300 dark:border-green-800';
      case 2:
        return 'bg-green-300 dark:bg-green-700 border border-green-400 dark:border-green-600';
      case 3:
        return 'bg-green-500 dark:bg-green-600 border border-green-600 dark:border-green-500';
      case 4:
        return 'bg-green-700 dark:bg-green-500 border border-green-800 dark:border-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
  };

  // Build weeks array for the last 52 weeks
  const weeks: HeatmapData[][] = [];
  const today = new Date();
  
  for (let weekIndex = 51; weekIndex >= 0; weekIndex--) {
    const week: HeatmapData[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (weekIndex * 7 + (6 - dayIndex)));
      const dateStr = date.toISOString().split('T')[0];
      const dayData = data.find((d) => d.date === dateStr) || { 
        date: dateStr, 
        count: 0, 
        level: 0 as 0 | 1 | 2 | 3 | 4
      };
      week.push(dayData);
    }
    weeks.push(week);
  }

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
            {monthLabels.map((month, index) => (
              <span key={index} className="text-center">{month}</span>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              <div className="h-3"></div> {/* spacer for month labels */}
              {dayLabels.map((day, index) => (
                <div 
                  key={index} 
                  className="h-3 w-8 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end pr-1"
                >
                  {index % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-600 ${getColorClass(day.level)}`}
                      title={`${day.date}: ${day.count} problems solved`}
                      aria-label={`${day.date}, ${day.count} problems solved`}
                      role="gridcell"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
                  aria-label={`Activity level ${level}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {data.reduce((sum, day) => sum + day.count, 0)} problems solved in the last year
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
