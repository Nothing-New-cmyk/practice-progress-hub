
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

  // Create a proper GitHub-style heatmap grid
  const generateHeatmapGrid = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Find the Sunday that starts our grid (start of the week containing one year ago)
    const startDate = new Date(oneYearAgo);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Create a map for quick data lookup
    const dataMap = new Map();
    data.forEach(item => {
      dataMap.set(item.date, item);
    });

    const weeks: HeatmapData[][] = [];
    const currentDate = new Date(startDate);
    
    // Generate exactly 53 weeks of data
    while (weeks.length < 53) {
      const week: HeatmapData[] = [];
      
      // Generate 7 days for this week
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Don't show future dates
        if (currentDate > today) {
          week.push({
            date: '',
            count: 0,
            level: 0
          });
        } else {
          const dayData = dataMap.get(dateStr);
          if (dayData) {
            week.push(dayData);
          } else {
            week.push({
              date: dateStr,
              count: 0,
              level: 0
            });
          }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = generateHeatmapGrid();
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Calculate month positions for labels
  const getMonthLabels = () => {
    const labels: { month: string; position: number }[] = [];
    const today = new Date();
    
    // Start from 12 months ago and work forward
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - 11 + i);
      const monthIndex = date.getMonth();
      
      labels.push({
        month: monthLabels[monthIndex],
        position: Math.floor((i * 53) / 12)
      });
    }
    
    return labels;
  };

  const monthPositions = getMonthLabels();
  
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
          {totalContributions} contributions in the last year
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month labels */}
          <div className="flex justify-start text-xs text-gray-500 dark:text-gray-400 ml-8">
            <div className="relative flex-1" style={{ minWidth: '636px' }}>
              {monthPositions.map((label, index) => (
                <span 
                  key={index} 
                  className="absolute"
                  style={{ left: `${(label.position * 12)}px` }}
                >
                  {label.month}
                </span>
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
  if (!data.length) return 0;

  // Sort data by date
  const sortedData = [...data]
    .filter(item => item.count > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (!sortedData.length) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedData.length; i++) {
    const currentDate = new Date(sortedData[i].date);
    const prevDate = new Date(sortedData[i - 1].date);
    
    const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
}

function calculateCurrentStreak(data: HeatmapData[]): number {
  if (!data.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check backwards from today
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = data.find(d => d.date === dateStr);
    
    if (dayData && dayData.count > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If it's today and no activity, don't break the streak yet
      if (streak === 0 && currentDate.getTime() === today.getTime()) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
  }
  
  return streak;
}
