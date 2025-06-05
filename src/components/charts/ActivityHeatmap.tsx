
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface HeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  const getColorClass = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700';
      case 1:
        return 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50';
      case 2:
        return 'bg-green-300 dark:bg-green-700/60 hover:bg-green-400 dark:hover:bg-green-600/80';
      case 3:
        return 'bg-green-500 dark:bg-green-600/80 hover:bg-green-600 dark:hover:bg-green-500';
      case 4:
        return 'bg-green-700 dark:bg-green-500 hover:bg-green-800 dark:hover:bg-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700';
    }
  };

  // Generate 53 weeks (371 days) ending with today - like GitHub
  const generateWeeksGrid = () => {
    const weeks: HeatmapData[][] = [];
    const today = new Date();
    const endDate = new Date(today);
    
    // Start from Sunday of the current week
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay - (52 * 7)); // 52 weeks back + current week offset

    const dataMap = new Map();
    data.forEach(item => {
      dataMap.set(item.date, item);
    });

    for (let week = 0; week < 53; week++) {
      const weekData: HeatmapData[] = [];
      
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        
        // Don't show future dates
        if (currentDate > today) {
          weekData.push({
            date: '',
            count: 0,
            level: 0
          });
          continue;
        }

        const dateStr = currentDate.toISOString().split('T')[0];
        const dayData = dataMap.get(dateStr);
        
        if (dayData) {
          weekData.push(dayData);
        } else {
          weekData.push({
            date: dateStr,
            count: 0,
            level: 0
          });
        }
      }
      
      weeks.push(weekData);
    }

    return weeks;
  };

  const weeks = generateWeeksGrid();
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Calculate stats
  const totalContributions = data.reduce((sum, day) => sum + day.count, 0);
  const currentYear = new Date().getFullYear();
  const longestStreak = calculateLongestStreak(data);
  const currentStreak = calculateCurrentStreak(data);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {totalContributions} contributions in {currentYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month labels */}
          <div className="flex justify-start text-xs text-gray-500 dark:text-gray-400 ml-8">
            <div className="grid grid-cols-12 gap-1 flex-1">
              {monthLabels.map((month, index) => (
                <span key={index} className="text-center">{month}</span>
              ))}
            </div>
          </div>

          {/* Grid container */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1">
              {dayLabels.map((day, index) => (
                <div 
                  key={index} 
                  className="h-3 w-6 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center"
                >
                  {index % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="flex gap-1 overflow-x-auto">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer ${
                        day.date ? getColorClass(day.level) : 'invisible'
                      }`}
                      title={day.date ? `${day.date}: ${day.count} problems solved` : ''}
                      aria-label={day.date ? `${day.date}, ${day.count} problems solved` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend and stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Less</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Current streak: {currentStreak} days • Longest streak: {longestStreak} days
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
function calculateLongestStreak(data: HeatmapData[]): number {
  const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let maxStreak = 0;
  let currentStreak = 0;
  
  for (let i = 0; i < sortedData.length; i++) {
    if (sortedData[i].count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return maxStreak;
}

function calculateCurrentStreak(data: HeatmapData[]): number {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const dayData = data.find(d => d.date === dateStr);
    if (dayData && dayData.count > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
