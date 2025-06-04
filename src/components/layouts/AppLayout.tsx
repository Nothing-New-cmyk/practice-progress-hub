
import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { OnboardingTooltip } from '@/components/ui/onboarding-tooltip'
import { PageTransition } from '@/components/ui/page-transition'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
  showFAB?: boolean
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className,
  showFAB = true 
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)

  const onboardingSteps = [
    {
      targetId: 'dashboard-nav',
      title: 'Dashboard',
      content: 'View your practice progress and analytics here.'
    },
    {
      targetId: 'daily-log-nav',
      title: 'Daily Log',
      content: 'Log your daily practice sessions and track your improvement.'
    },
    {
      targetId: 'settings-nav',
      title: 'Settings',
      content: 'Customize your preferences and notification settings.'
    }
  ]

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingNext = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      setShowOnboarding(false)
      localStorage.setItem('hasSeenOnboarding', 'true')
    }
  }

  const handleOnboardingSkip = () => {
    setShowOnboarding(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      {/* Parallax background shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Navbar */}
      <Navbar />
      
      {/* Theme toggle in top right */}
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div>

      {/* Main content without sidebar margin */}
      <main className={cn("transition-all duration-300 relative z-10", className)}>
        <PageTransition key={window.location.pathname}>
          {children}
        </PageTransition>
      </main>
      
      {showFAB && <FloatingActionButton />}

      {/* Onboarding tooltips */}
      {showOnboarding && onboardingStep < onboardingSteps.length && (
        <OnboardingTooltip
          {...onboardingSteps[onboardingStep]}
          step={onboardingStep + 1}
          totalSteps={onboardingSteps.length}
          onNext={handleOnboardingNext}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  )
}
