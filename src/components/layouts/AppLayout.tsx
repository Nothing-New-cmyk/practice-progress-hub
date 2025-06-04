
import React from 'react'
import { Navbar } from '@/components/Navbar'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { cn } from '@/lib/utils'

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navbar />
      <main className={cn("md:ml-64 transition-all duration-300", className)}>
        {children}
      </main>
      {showFAB && <FloatingActionButton />}
    </div>
  )
}
