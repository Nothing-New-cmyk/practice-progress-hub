
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  badges?: Array<{
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  subtitle,
  children,
  icon: Icon,
  className,
  progress,
  badges
}) => {
  return (
    <Card className={cn("p-6 hover:shadow-lg transition-shadow", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {Icon && <Icon className="h-5 w-5 text-primary" />}
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {badges && (
            <div className="flex space-x-1">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || 'default'}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div>{children}</div>

        {/* Progress */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress.label || 'Progress'}</span>
              <span>{progress.value}/{progress.max}</span>
            </div>
            <Progress value={(progress.value / progress.max) * 100} />
          </div>
        )}
      </div>
    </Card>
  );
};
