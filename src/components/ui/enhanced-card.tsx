
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  gradient?: boolean
  hover?: boolean
}

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, title, subtitle, icon: Icon, iconColor, gradient, hover = true, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          hover && "hover:shadow-lg hover:-translate-y-1",
          gradient && "bg-gradient-to-br from-white to-gray-50/50",
          className
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />
        )}
        
        {(title || Icon) && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {title && (
                  <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                )}
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
              {Icon && (
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  iconColor || "bg-primary/10 text-primary"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
              )}
            </div>
          </CardHeader>
        )}
        
        <CardContent className={title || Icon ? "pt-0" : undefined}>
          {children}
        </CardContent>
      </Card>
    )
  }
)
EnhancedCard.displayName = "EnhancedCard"
