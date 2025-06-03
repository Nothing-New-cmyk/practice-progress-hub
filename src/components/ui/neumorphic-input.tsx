
import React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const NeumorphicInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={cn(
        'bg-gray-100 dark:bg-gray-800 border-0',
        'shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]',
        'dark:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#2e2e2e]',
        'focus:shadow-[inset_6px_6px_12px_#d1d1d1,inset_-6px_-6px_12px_#ffffff]',
        'dark:focus:shadow-[inset_6px_6px_12px_#1a1a1a,inset_-6px_-6px_12px_#2e2e2e]',
        'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50',
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  )
})
NeumorphicInput.displayName = "NeumorphicInput"
