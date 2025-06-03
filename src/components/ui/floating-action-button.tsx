
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, Trophy, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: BookOpen,
      label: 'Daily Log',
      href: '/daily-log',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Trophy,
      label: 'Contest Log',
      href: '/contest-log',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <Link
            key={action.href}
            to={action.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-full text-white shadow-lg transition-all duration-300",
              action.color,
              "transform hover:scale-105"
            )}
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
            }}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
          "transform hover:scale-110 active:scale-95",
          isOpen && "rotate-45"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </div>
  )
}
