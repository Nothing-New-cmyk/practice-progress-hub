
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, Trophy, X, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: BookOpen,
      label: 'Daily Log',
      href: '/daily-log',
      color: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg',
      description: 'Log your daily practice'
    },
    {
      icon: Trophy,
      label: 'Contest Log',
      href: '/contest-log',
      color: 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg',
      description: 'Record contest performance'
    },
    {
      icon: Target,
      label: 'Set Goals',
      href: '/weekly-goals',
      color: 'bg-green-500 hover:bg-green-600 text-white shadow-lg',
      description: 'Create weekly goals'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-4 transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <div
            key={action.href}
            className={cn(
              "transform transition-all duration-300 ease-in-out",
              isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            )}
            style={{
              transitionDelay: isOpen ? `${index * 100}ms` : '0ms'
            }}
          >
            <Link
              to={action.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200",
                "hover:scale-105 active:scale-95 backdrop-blur-sm",
                action.color
              )}
              title={action.description}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap pr-1">
                {action.label}
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "h-16 w-16 rounded-full shadow-xl transition-all duration-300 ease-in-out",
          "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600",
          "hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700",
          "transform hover:scale-110 active:scale-95",
          "border-2 border-white/20 backdrop-blur-sm",
          isOpen && "rotate-45 scale-110"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
      >
        <div className={cn(
          "transition-transform duration-300",
          isOpen ? "rotate-0" : "rotate-0"
        )}>
          {isOpen ? (
            <X className="h-7 w-7 text-white" />
          ) : (
            <Plus className="h-7 w-7 text-white" />
          )}
        </div>
      </Button>

      {/* Background overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
