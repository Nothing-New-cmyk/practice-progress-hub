
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32'
};

const colorClasses = {
  primary: 'text-primary',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500'
};

export const ProgressRing = ({ 
  progress, 
  size = 'md', 
  children, 
  className,
  color = 'primary'
}: ProgressRingProps) => {
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-300', colorClasses[color])}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
