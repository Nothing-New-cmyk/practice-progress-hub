
import React from 'react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface NeumorphicToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  className?: string
}

export const NeumorphicToggle: React.FC<NeumorphicToggleProps> = ({
  checked,
  onCheckedChange,
  label,
  className
}) => {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200',
        'bg-gray-200 dark:bg-gray-700',
        'shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]',
        'dark:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#2e2e2e]',
        checked && 'bg-blue-500 dark:bg-blue-600'
      )}>
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full transition-all duration-200',
            'bg-white shadow-[2px_2px_4px_#d1d1d1,-2px_-2px_4px_#ffffff]',
            'dark:bg-gray-300 dark:shadow-[2px_2px_4px_#1a1a1a,-2px_-2px_4px_#2e2e2e]',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
          onClick={() => onCheckedChange(!checked)}
        />
      </div>
    </div>
  )
}
