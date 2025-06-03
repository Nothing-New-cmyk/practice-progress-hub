
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ElementType;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  className,
  trend = 'neutral'
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card className={cn("p-6 hover:shadow-lg transition-shadow", className)}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={cn("flex items-center text-xs", getTrendColor())}>
            {TrendIcon && <TrendIcon className="h-3 w-3 mr-1" />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
            {changeLabel && <span className="ml-1 text-muted-foreground">{changeLabel}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
