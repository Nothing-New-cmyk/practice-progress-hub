
import { Card, CardContent } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  progress?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  progress,
  trend,
  trendValue,
  className,
  color = 'primary'
}: StatsCardProps) => {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trendValue && trend && (
                <span className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  trendColors[trend]
                )}>
                  {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          {progress !== undefined ? (
            <ProgressRing progress={progress} size="sm" color={color}>
              <span className="text-xs font-semibold">{progress}%</span>
            </ProgressRing>
          ) : Icon ? (
            <div className="flex-shrink-0">
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
