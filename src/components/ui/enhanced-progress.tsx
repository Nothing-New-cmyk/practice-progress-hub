
import React from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface EnhancedProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  showLabel?: boolean
  label?: string
  animated?: boolean
  className?: string
}

export const EnhancedProgress: React.FC<EnhancedProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = false,
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const variantClasses = {
    default: '[&>div]:bg-primary',
    success: '[&>div]:bg-green-500',
    warning: '[&>div]:bg-yellow-500',
    destructive: '[&>div]:bg-red-500'
  }

  return (
    <div className="space-y-2">
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {label || `Progress`}
          </span>
          <span className="text-sm text-muted-foreground">
            {value}/{max}
          </span>
        </div>
      )}
      <Progress
        value={percentage}
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
          animated && '[&>div]:transition-all [&>div]:duration-500',
          className
        )}
      />
    </div>
  )
}
