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
        return 'bg-gray-100 dark:bg-gray-800';
      case 1:
        return 'bg-green-200 dark:bg-green-900';
      case 2:
        return 'bg-green-300 dark:bg-green-700';
      case 3:
        return 'bg-green-500 dark:bg-green-600';
      case 4:
        return 'bg-green-700 dark:bg-green-500';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // Build 52 weeks × 7 days array
  const weeks: HeatmapData[][] = [];
  for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
    const week: HeatmapData[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = new Date();
      date.setDate(date.getDate() - (weekIndex * 7 + dayIndex));
      const dateStr = date.toISOString().split('T')[0];
      const dayData =
        data.find((d) => d.date === dateStr) || { date: dateStr, count: 0, level: 0 };
      week.push(dayData);
    }
    weeks.push(week);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Container with fixed height, horizontal scroll */}
          <div
            className="w-full h-64 overflow-x-auto"
            role="region"
            aria-labelledby="heatmap-title"
          >
            {/* Use inline-grid so columns shrink to content, but we still set grid-cols-52 */}
            <div className="inline-grid grid-rows-7 grid-cols-52 gap-1">
              {weeks
                .slice() // copy array
                .reverse() // most recent week on the left
                .map((week, wi) => (
                  <React.Fragment key={wi}>
                    {week.map((day, di) => (
                      <div
                        key={`${wi}-${di}`}
                        className={`w-4 h-4 rounded-sm ${getColorClass(
                          day.level
                        )} cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all`}
                        title={`${day.date}: ${day.count} problems solved`}
                        aria-label={`${day.date}, ${day.count} solved`}
                      />
                    ))}
                  </React.Fragment>
                ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-4 h-4 rounded-sm ${getColorClass(level)}`}
                  aria-label={`Level ${level}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
