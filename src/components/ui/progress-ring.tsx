
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 120,
  strokeWidth = 8,
  progress,
  className,
  showPercentage = true,
  color = 'hsl(var(--primary))'
}) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          className="text-muted-foreground/20"
          fill="transparent"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};
