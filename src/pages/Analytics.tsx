
import React from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { TopicProgress } from '@/components/features/TopicProgress';
import { BarChart3 } from 'lucide-react';

export const Analytics = () => {
  // Generate sample data for demonstration
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const level = Math.floor(Math.random() * 5);
      data.push({
        date: date.toISOString().split('T')[0],
        count: level * 2,
        level: level as 0 | 1 | 2 | 3 | 4
      });
    }
    return data;
  };

  const difficultyData = [
    { difficulty: 'Easy', count: 45, color: '#10B981' },
    { difficulty: 'Medium', count: 32, color: '#F59E0B' },
    { difficulty: 'Hard', count: 18, color: '#EF4444' }
  ];

  const heatmapData = generateHeatmapData();

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        <SectionHeader
          title="Analytics"
          subtitle="Detailed insights into your coding progress and performance"
          icon={BarChart3}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Heatmap */}
          <div className="lg:col-span-2">
            <ActivityHeatmap data={heatmapData} />
          </div>

          {/* Difficulty Chart */}
          <DifficultyChart data={difficultyData} />

          {/* Topic Progress */}
          <TopicProgress />
        </div>

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Problem Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { platform: 'LeetCode', count: 45, color: 'bg-orange-500' },
                  { platform: 'Codeforces', count: 32, color: 'bg-blue-500' },
                  { platform: 'HackerRank', count: 18, color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.platform}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">87%</div>
                <p className="text-sm text-muted-foreground">Overall accuracy</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-orange-600">15</div>
                <p className="text-sm text-muted-foreground">Days in a row</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};
