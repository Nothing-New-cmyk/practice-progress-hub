
import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        "relative h-9 w-9 rounded-xl",
        "bg-white/10 backdrop-blur-sm border border-white/20",
        "hover:bg-white/20 transition-all duration-300",
        "dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:bg-gray-700/50"
      )}
    >
      <Sun className={cn(
        "h-4 w-4 transition-all duration-300",
        theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
      )} />
      <Moon className={cn(
        "absolute h-4 w-4 transition-all duration-300",
        theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
