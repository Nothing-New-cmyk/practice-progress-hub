
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingTooltipProps {
  title: string
  content: string
  targetId: string
  step: number
  totalSteps: number
  onNext: () => void
  onSkip: () => void
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  title,
  content,
  targetId,
  step,
  totalSteps,
  onNext,
  onSkip,
  position = 'bottom'
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const element = document.getElementById(targetId)
    if (element) {
      setTargetElement(element)
      
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      
      let top = 0
      let left = 0
      
      switch (position) {
        case 'bottom':
          top = rect.bottom + scrollTop + 10
          left = rect.left + scrollLeft + rect.width / 2
          break
        case 'top':
          top = rect.top + scrollTop - 10
          left = rect.left + scrollLeft + rect.width / 2
          break
        case 'right':
          top = rect.top + scrollTop + rect.height / 2
          left = rect.right + scrollLeft + 10
          break
        case 'left':
          top = rect.top + scrollTop + rect.height / 2
          left = rect.left + scrollLeft - 10
          break
      }
      
      setTooltipPosition({ top, left })
    }
  }, [targetId, position])

  if (!targetElement) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none" />
      
      {/* Spotlight */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: targetElement.getBoundingClientRect().top - 4,
          left: targetElement.getBoundingClientRect().left - 4,
          width: targetElement.getBoundingClientRect().width + 8,
          height: targetElement.getBoundingClientRect().height + 8,
          boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px'
        }}
      />
      
      {/* Tooltip */}
      <div
        className={cn(
          'fixed z-50 w-80 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border',
          'transform -translate-x-1/2',
          position === 'top' && '-translate-y-full',
          position === 'left' && 'translate-x-[-100%] -translate-y-1/2',
          position === 'right' && 'translate-x-0 -translate-y-1/2'
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left
        }}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onSkip}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{content}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {step} of {totalSteps}
          </span>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={onSkip}>
              Skip
            </Button>
            <Button size="sm" onClick={onNext}>
              {step === totalSteps ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
