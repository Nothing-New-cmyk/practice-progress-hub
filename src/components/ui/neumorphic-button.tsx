
import React from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NeumorphicButtonProps extends ButtonProps {
  variant?: 'raised' | 'inset' | 'flat'
}

export const NeumorphicButton = React.forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  ({ className, variant = 'raised', children, ...props }, ref) => {
    const variants = {
      raised: cn(
        'bg-gray-100 dark:bg-gray-800',
        'shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff]',
        'dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#2e2e2e]',
        'hover:shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff]',
        'dark:hover:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2e2e2e]',
        'active:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]',
        'dark:active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#2e2e2e]'
      ),
      inset: cn(
        'bg-gray-100 dark:bg-gray-800',
        'shadow-[inset_8px_8px_16px_#d1d1d1,inset_-8px_-8px_16px_#ffffff]',
        'dark:shadow-[inset_8px_8px_16px_#1a1a1a,inset_-8px_-8px_16px_#2e2e2e]'
      ),
      flat: cn(
        'bg-gray-100 dark:bg-gray-800',
        'shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff]',
        'dark:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2e2e2e]'
      )
    }

    return (
      <Button
        ref={ref}
        className={cn(
          'border-0 transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
NeumorphicButton.displayName = "NeumorphicButton"
