
import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { OnboardingDialog } from '@/components/ui/onboarding-dialog'
import { PageTransition } from '@/components/ui/page-transition'
import { UserPreferencesService } from '@/services/userPreferences'
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

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const preferences = await UserPreferencesService.getPreferences()
        if (!preferences.hasSeenOnboarding) {
          setShowOnboarding(true)
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
      }
    }

    checkOnboarding()
  }, [])

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

      {/* Main content */}
      <main className={cn("relative z-10", className)}>
        <PageTransition key={window.location.pathname}>
          {children}
        </PageTransition>
      </main>
      
      {showFAB && <FloatingActionButton />}

      {/* Onboarding dialog */}
      <OnboardingDialog 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding}
      />
    </div>
  )
}
