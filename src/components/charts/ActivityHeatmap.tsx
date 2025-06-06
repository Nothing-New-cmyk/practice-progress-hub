
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

  // Generate GitHub-style heatmap grid (53 weeks × 7 days)
  const generateWeeksGrid = () => {
    const weeks: HeatmapData[][] = [];
    const today = new Date();
    
    // Create a map for quick data lookup
    const dataMap = new Map();
    data.forEach(item => {
      dataMap.set(item.date, item);
    });

    // Find the Sunday that starts the grid (53 weeks ago from this Sunday)
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDayOfWeek - (52 * 7)); // 52 weeks back to start of grid

    // Generate 53 weeks of data
    for (let week = 0; week < 53; week++) {
      const weekData: HeatmapData[] = [];
      
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        
        // Don't show future dates beyond today
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
  
  // Calculate month positions for labels
  const getMonthLabels = () => {
    const labels: { month: string; position: number }[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    
    // Show labels for months that appear in our 53-week grid
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 11 + i + 12) % 12;
      const position = Math.floor((i * 53) / 12);
      labels.push({
        month: monthLabels[monthIndex],
        position: Math.max(0, Math.min(position, 52))
      });
    }
    
    return labels.slice(0, 12); // Only show 12 months
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
          {totalContributions} contributions in {currentYear}
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
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const item of sortedData) {
    if (item.count > 0) {
      const currentDate = new Date(item.date);
      
      if (lastDate) {
        const dayDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day
          currentStreak++;
        } else {
          // Gap in streak, start new streak
          currentStreak = 1;
        }
      } else {
        // First active day
        currentStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
      lastDate = currentDate;
    }
  }
  
  return maxStreak;
}

function calculateCurrentStreak(data: HeatmapData[]): number {
  if (!data.length) return 0;

  const today = new Date();
  let streak = 0;
  
  // Check each day going backwards from today
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const dayData = data.find(d => d.date === dateStr);
    if (dayData && dayData.count > 0) {
      streak++;
    } else if (i > 0) {
      // Only break if we've moved past today and found a gap
      break;
    }
  }
  
  return streak;
}
