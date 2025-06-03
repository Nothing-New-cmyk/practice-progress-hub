
import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave'
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const variants = {
    text: 'h-4 w-full',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-4 w-full rounded'
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_1.6s_ease-in-out_infinite]'
  }

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variants[variant],
        animations[animation],
        className
      )}
    />
  )
}
