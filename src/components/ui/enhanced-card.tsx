
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklineChart } from "@/components/ui/sparkline-chart"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  gradient?: boolean
  hover?: boolean
  glassmorphic?: boolean
  sparklineData?: Array<{ value: number }>
  asymmetric?: boolean
}

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    icon: Icon, 
    iconColor, 
    gradient, 
    hover = true, 
    glassmorphic = false,
    sparklineData,
    asymmetric = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={asymmetric ? "transform hover:rotate-1 transition-transform duration-300" : ""}
      >
        <Card
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-all duration-300 interactive-element",
            hover && "hover:shadow-lg hover:-translate-y-1",
            glassmorphic && "bg-white/10 backdrop-blur-md border-white/20 dark:bg-gray-900/20 dark:backdrop-blur-md dark:border-gray-700/30",
            gradient && !glassmorphic && "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50",
            !glassmorphic && !gradient && "bg-white dark:bg-gray-900",
            className
          )}
          {...props}
        >
          {gradient && !glassmorphic && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />
          )}
          
          {(title || Icon) && (
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1">
                  {title && (
                    <CardTitle className="text-lg font-semibold heading-gradient">{title}</CardTitle>
                  )}
                  {subtitle && (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {sparklineData && (
                    <div className="w-16 h-8">
                      <SparklineChart data={sparklineData} color="#3B82F6" />
                    </div>
                  )}
                  {Icon && (
                    <motion.div 
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg animate-float",
                        iconColor || "bg-primary/10 text-primary"
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
              </div>
            </CardHeader>
          )}
          
          <CardContent className={title || Icon ? "pt-0" : undefined}>
            {children}
          </CardContent>
        </Card>
      </motion.div>
    )
  }
)
EnhancedCard.displayName = "EnhancedCard"
