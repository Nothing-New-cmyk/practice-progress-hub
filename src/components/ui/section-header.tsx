
import React from 'react'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  action,
  className
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className="shrink-0"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
