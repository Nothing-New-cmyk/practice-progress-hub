
// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Activity } from 'lucide-react';

// interface HeatmapData {
//   date: string;
//   count: number;
//   level: 0 | 1 | 2 | 3 | 4;
// }

// interface ActivityHeatmapProps {
//   data: HeatmapData[];
// }

// export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
//   const getColorClass = (level: number) => {
//     switch (level) {
//       case 0:
//         return 'bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700';
//       case 1:
//         return 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50';
//       case 2:
//         return 'bg-green-300 dark:bg-green-700/60 hover:bg-green-400 dark:hover:bg-green-600/80';
//       case 3:
//         return 'bg-green-500 dark:bg-green-600/80 hover:bg-green-600 dark:hover:bg-green-500';
//       case 4:
//         return 'bg-green-700 dark:bg-green-500 hover:bg-green-800 dark:hover:bg-green-400';
//       default:
//         return 'bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700';
//     }
//   };

//   // Generate proper GitHub-style heatmap grid
//   const generateHeatmapGrid = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Find the Sunday that's 52 weeks ago
//     const startDate = new Date(today);
//     startDate.setDate(today.getDate() - (52 * 7) + 1); // Go back 52 weeks
    
//     // Find the Sunday of that week
//     const dayOfWeek = startDate.getDay();
//     startDate.setDate(startDate.getDate() - dayOfWeek);
    
//     // Create a map for quick data lookup
//     const dataMap = new Map();
//     data.forEach(item => {
//       dataMap.set(item.date, item);
//     });

//     const weeks: HeatmapData[][] = [];
//     const currentDate = new Date(startDate);
    
//     // Generate 53 weeks to ensure we cover the full year
//     for (let week = 0; week < 53; week++) {
//       const weekData: HeatmapData[] = [];
      
//       // Generate 7 days for this week
//       for (let day = 0; day < 7; day++) {
//         const dateStr = currentDate.toISOString().split('T')[0];
        
//         // Don't show future dates
//         if (currentDate > today) {
//           weekData.push({
//             date: '',
//             count: 0,
//             level: 0
//           });
//         } else {
//           const dayData = dataMap.get(dateStr);
//           weekData.push(dayData || {
//             date: dateStr,
//             count: 0,
//             level: 0
//           });
//         }
        
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
      
//       weeks.push(weekData);
//     }

//     return weeks;
//   };

//   const weeks = generateHeatmapGrid();
//   const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
//   // Calculate month positions for labels
//   const getMonthLabels = () => {
//     const labels: { month: string; position: number }[] = [];
//     const today = new Date();
    
//     for (let i = 0; i < 12; i++) {
//       const monthDate = new Date(today);
//       monthDate.setMonth(today.getMonth() - 11 + i, 1);
      
//       labels.push({
//         month: monthLabels[monthDate.getMonth()],
//         position: i * 4.4 // Approximate positioning
//       });
//     }
    
//     return labels;
//   };

//   const monthPositions = getMonthLabels();
  
//   // Calculate stats
//   const totalContributions = data.reduce((sum, day) => sum + day.count, 0);
//   const longestStreak = calculateLongestStreak(data);
//   const currentStreak = calculateCurrentStreak(data);

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2 text-lg">
//           <Activity className="h-5 w-5 text-gray-700 dark:text-gray-300" />
//           {totalContributions} contributions in the last year
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Month labels */}
//           <div className="flex justify-start text-xs text-gray-500 dark:text-gray-400 ml-8">
//             <div className="relative w-full" style={{ minWidth: '636px' }}>
//               {monthPositions.map((label, index) => (
//                 <span 
//                   key={index} 
//                   className="absolute"
//                   style={{ left: `${label.position * 12}px` }}
//                 >
//                   {label.month}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Grid container */}
//           <div className="flex gap-1">
//             {/* Day labels */}
//             <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
//               {dayLabels.map((day, index) => (
//                 <div 
//                   key={index} 
//                   className="h-3 w-6 flex items-center justify-start"
//                 >
//                   {index % 2 === 1 ? day.slice(0, 1) : ''}
//                 </div>
//               ))}
//             </div>

//             {/* Weeks grid */}
//             <div className="flex gap-1 overflow-x-auto">
//               {weeks.map((week, weekIndex) => (
//                 <div key={weekIndex} className="flex flex-col gap-1">
//                   {week.map((day, dayIndex) => (
//                     <div
//                       key={`${weekIndex}-${dayIndex}`}
//                       className={`w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer ${
//                         day.date ? getColorClass(day.level) : 'invisible'
//                       }`}
//                       title={day.date ? `${day.date}: ${day.count} problems solved` : ''}
//                       aria-label={day.date ? `${day.date}, ${day.count} problems solved` : ''}
//                     />
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Legend and stats */}
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//               <span>Less</span>
//               <div className="flex items-center gap-1">
//                 {[0, 1, 2, 3, 4].map((level) => (
//                   <div
//                     key={level}
//                     className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
//                   />
//                 ))}
//               </div>
//               <span>More</span>
//             </div>
            
//             <div className="text-xs text-gray-500 dark:text-gray-400">
//               Current streak: {currentStreak} days • Longest streak: {longestStreak} days
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Helper functions
// function calculateLongestStreak(data: HeatmapData[]): number {
//   if (!data.length) return 0;

//   // Sort data by date and filter only active days
//   const activeDays = data
//     .filter(item => item.count > 0)
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
//   if (!activeDays.length) return 0;

//   let maxStreak = 1;
//   let currentStreak = 1;

//   for (let i = 1; i < activeDays.length; i++) {
//     const currentDate = new Date(activeDays[i].date);
//     const prevDate = new Date(activeDays[i - 1].date);
    
//     const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
//     if (dayDiff === 1) {
//       currentStreak++;
//       maxStreak = Math.max(maxStreak, currentStreak);
//     } else {
//       currentStreak = 1;
//     }
//   }
  
//   return maxStreak;
// }

// function calculateCurrentStreak(data: HeatmapData[]): number {
//   if (!data.length) return 0;

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   let streak = 0;
//   let currentDate = new Date(today);
  
//   // Check backwards from today
//   while (true) {
//     const dateStr = currentDate.toISOString().split('T')[0];
//     const dayData = data.find(d => d.date === dateStr);
    
//     if (dayData && dayData.count > 0) {
//       streak++;
//       currentDate.setDate(currentDate.getDate() - 1);
//     } else {
//       // If it's today and no activity, don't break the streak yet
//       if (streak === 0 && currentDate.getTime() === today.getTime()) {
//         currentDate.setDate(currentDate.getDate() - 1);
//         continue;
//       }
//       break;
//     }
    
//     // Prevent infinite loop
//     if (streak > 365) break;
//   }
  
//   return streak;
// }

"use client";
import React, { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface HeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export const ActivityHeatmap: React.FC = () => {
  const [data, setData] = useState<HeatmapData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError || !session) {
        console.error("No active session or error:", sessionError);
        return;
      }

      const userId = session.user.id;

      const { data: logs, error: logsError } = await supabaseClient
        .from("daily_logs")
        .select("date, problems_solved")
        .eq("user_id", userId)
        .order("date", { ascending: true });

      if (logsError) {
        console.error("Failed to fetch daily logs:", logsError);
        return;
      }

      const grouped = new Map<string, number>();
      logs.forEach((entry: { date: string; problems_solved: number }) => {
        grouped.set(entry.date, (grouped.get(entry.date) || 0) + entry.problems_solved);
      });

      const entries: HeatmapData[] = Array.from(grouped.entries()).map(([date, count]) => ({
        date,
        count,
        level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4
      }));

      setData(entries);
    };

    fetchData();
  }, []);

  const getColorClass = (level: number) => {
    switch (level) {
      case 1: return "bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50";
      case 2: return "bg-green-300 dark:bg-green-700/60 hover:bg-green-400 dark:hover:bg-green-600/80";
      case 3: return "bg-green-500 dark:bg-green-600/80 hover:bg-green-600 dark:hover:bg-green-500";
      case 4: return "bg-green-700 dark:bg-green-500 hover:bg-green-800 dark:hover:bg-green-400";
      default: return "bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700";
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 365);

  const dataMap = new Map(data.map(d => [d.date, d]));
  const weeks: HeatmapData[][] = [];
  const currentDate = new Date(startDate);

  for (let week = 0; week < 53; week++) {
    const weekData: HeatmapData[] = [];
    for (let day = 0; day < 7; day++) {
      const dateStr = currentDate.toISOString().split("T")[0];
      weekData.push(currentDate > today
        ? { date: "", count: 0, level: 0 }
        : dataMap.get(dateStr) || { date: dateStr, count: 0, level: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(weekData);
  }

  const totalContributions = data.reduce((sum, d) => sum + d.count, 0);
  const longestStreak = calculateLongestStreak(data);
  const currentStreak = calculateCurrentStreak(data);

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="w-full shadow rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {totalContributions} contributions in the last year
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 pt-4">
            {dayLabels.map((day, index) => (
              <div key={index} className="h-3 w-6 flex items-center justify-start">
                {index % 2 === 1 ? day[0] : ""}
              </div>
            ))}
          </div>

          {/* Scrollable container with month header and grid */}
          <div className="flex flex-col overflow-x-auto max-w-full pb-1 scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
            {/* Month header aligned with grid columns */}
            <div className="flex gap-1 text-xs text-gray-500 dark:text-gray-400 pl-px">
              {weeks.map((week, weekIndex) => {
                const firstDay = week[0];
                const month = firstDay.date ? new Date(firstDay.date).getMonth() : -1;
                const showMonth =
                  weekIndex === 0 ||
                  (firstDay.date &&
                    new Date(firstDay.date).getDate() <= 7 &&
                    month !== new Date(weeks[weekIndex - 1][0].date).getMonth());
                return (
                  <div key={weekIndex} className="w-3 flex-shrink-0">
                    {showMonth ? monthLabels[month] : ""}
                  </div>
                );
              })}
            </div>

            {/* Weeks grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer ${
                        day.date ? getColorClass(day.level) : "invisible"
                      }`}
                      title={day.date ? `${day.date}: ${day.count} problems solved` : ""}
                      aria-label={day.date ? `${day.date}, ${day.count} problems solved` : ""}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend & stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t mt-4 dark:border-muted text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getColorClass(level)}`} />
              ))}
            </div>
            <span>More</span>
          </div>
          <div>
            Current streak: {currentStreak} days • Longest streak: {longestStreak} days
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
function calculateLongestStreak(data: HeatmapData[]): number {
  if (!data.length) return 0;
  const activeDays = data.filter(item => item.count > 0).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (!activeDays.length) return 0;
  let maxStreak = 1;
  let currentStreak = 1;
  for (let i = 1; i < activeDays.length; i++) {
    const currentDate = new Date(activeDays[i].date);
    const prevDate = new Date(activeDays[i - 1].date);
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
  const currentDate = new Date(today);
  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayData = data.find(d => d.date === dateStr);
    if (dayData && dayData.count > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      if (streak === 0 && currentDate.getTime() === today.getTime()) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
    if (streak > 365) break;
  }
  return streak;
}
