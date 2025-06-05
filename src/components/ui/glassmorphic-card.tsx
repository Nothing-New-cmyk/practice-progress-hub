
import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle'
  children: React.ReactNode
  as?: React.ElementType
}

export const GlassmorphicCard = React.forwardRef<HTMLDivElement, GlassmorphicCardProps>(
  ({ className, variant = 'default', children, as: Component = Card, ...props }, ref) => {
    const variants = {
      default: 'bg-white/10 backdrop-blur-md border-white/20',
      strong: 'bg-white/20 backdrop-blur-lg border-white/30',
      subtle: 'bg-white/5 backdrop-blur-sm border-white/10'
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'transition-all duration-300 hover:bg-white/15 hover:scale-[1.02]',
          'dark:bg-gray-900/20 dark:backdrop-blur-md dark:border-gray-700/30',
          'dark:hover:bg-gray-900/30',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
GlassmorphicCard.displayName = "GlassmorphicCard"
