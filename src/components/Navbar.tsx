
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavItem } from '@/components/ui/nav-item';
import { SearchBar } from '@/components/ui/search-bar';
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import { NotificationsDropdown } from '@/components/ui/notifications-dropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { QuickLogModal } from '@/components/ui/quick-log-modal';
import logo from './favicon.png'
import { 
  Menu, 
  PlusCircle, 
  Calendar, 
  Target, 
  Settings, 
  Code2,
  TrendingUp,
  X,
  Zap
} from 'lucide-react';

const navigation = [
  { name: 'Daily Log', href: '/daily-log', icon: PlusCircle, id: 'daily-log-nav' },
  { name: 'Contest Log', href: '/contest-log', icon: Calendar, id: 'contest-log-nav' },
  { name: 'Weekly Goals', href: '/weekly-goals', icon: Target, id: 'weekly-goals-nav' },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, id: 'analytics-nav' },
  { name: 'Settings', href: '/settings', icon: Settings, id: 'settings-nav' },
];

export const Navbar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleQuickLog = () => {
    setIsQuickLogOpen(true);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav 
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand - Now clickable */}
            <div className="flex items-center">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg px-2 py-1"
                aria-label="NoobsterDSA - Go to dashboard"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                    <img src={logo} alt="NoobsterDSA Logo" className="h-5 w-5" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse shadow-sm" aria-hidden="true"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-colors">
                    NoobsterDSA
                  </h1>
                  <p className="text-xs text-muted-foreground -mt-1 font-medium">Patience & Consistency</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Icon only with tooltips */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  href={item.href}
                  icon={item.icon}
                  label={item.name}
                  id={item.id}
                  variant="desktop"
                />
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <SearchBar />
              <NotificationsDropdown />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuickLog}
                className="flex items-center gap-2 hover:bg-accent/80 transition-colors"
                aria-label="Quick log entry"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden lg:inline font-medium">Quick Log</span>
              </Button>
              <ThemeToggle />
              <ProfileDropdown onSignOut={handleSignOut} />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    aria-label="Open menu"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                  >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-80 p-0"
                  id="mobile-menu"
                  aria-label="Mobile navigation menu"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Code2 className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" aria-hidden="true"></div>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NoobsterDSA</h2>
                          <p className="text-sm text-muted-foreground font-medium">Master DSA</p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="p-4 border-b space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
                      <SearchBar />
                      <div className="flex items-center justify-between">
                        <NotificationsDropdown />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleQuickLog}
                          className="flex items-center gap-2"
                        >
                          <Zap className="h-4 w-4" />
                          Quick Log
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4" role="menu">
                      <div className="space-y-2">
                        {navigation.map((item) => (
                          <NavItem
                            key={item.name}
                            href={item.href}
                            icon={item.icon}
                            label={item.name}
                            id={`mobile-${item.id}`}
                            variant="mobile"
                            onClick={() => setIsMobileMenuOpen(false)}
                          />
                        ))}
                      </div>
                    </nav>

                    {/* Mobile Footer */}
                    <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-900/50">
                      <ProfileDropdown onSignOut={handleSignOut} />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs />
      </nav>

      {/* Quick Log Modal */}
      <QuickLogModal 
        open={isQuickLogOpen} 
        onOpenChange={setIsQuickLogOpen}
      />
    </>
  );
};
