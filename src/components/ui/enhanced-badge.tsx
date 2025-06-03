
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface EnhancedBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  className?: string
}

export const EnhancedBadge: React.FC<EnhancedBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className
}) => {
  const variantClasses = {
    default: '',
    secondary: '',
    destructive: '',
    outline: '',
    success: 'bg-green-100 text-green-800 hover:bg-green-100/80',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  return (
    <Badge
      variant={variant === 'success' || variant === 'warning' ? 'secondary' : variant}
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        Icon && 'flex items-center gap-1',
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </Badge>
  )
}
