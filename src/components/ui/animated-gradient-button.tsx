
import React from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AnimatedGradientButtonProps extends ButtonProps {
  gradient?: 'primary' | 'secondary' | 'success' | 'rainbow'
}

export const AnimatedGradientButton = React.forwardRef<HTMLButtonElement, AnimatedGradientButtonProps>(
  ({ className, gradient = 'primary', children, ...props }, ref) => {
    const gradients = {
      primary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
      secondary: 'bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600',
      success: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600',
      rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500'
    }

    return (
      <Button
        ref={ref}
        className={cn(
          'relative overflow-hidden group transition-all duration-300',
          'before:absolute before:inset-0 before:bg-gradient-to-r',
          'before:from-transparent before:via-white/20 before:to-transparent',
          'before:translate-x-[-100%] before:transition-transform before:duration-1000',
          'hover:before:translate-x-[100%] hover:scale-105',
          'active:scale-95',
          gradients[gradient],
          'text-white border-0',
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Button>
    )
  }
)
AnimatedGradientButton.displayName = "AnimatedGradientButton"
