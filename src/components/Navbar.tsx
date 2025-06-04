
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
import { 
  Menu, 
  Home, 
  PlusCircle, 
  Calendar, 
  Target, 
  Settings, 
  BarChart3,
  TrendingUp,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, id: 'dashboard-nav' },
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

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement actual search functionality
    // navigate(`/search?q=${encodeURIComponent(query)}`);
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
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                aria-label="DSA Tracker - Go to dashboard"
              >
                <div className="relative">
                  <BarChart3 className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    DSA Tracker
                  </h1>
                  <p className="text-xs text-muted-foreground -mt-1">Level up your coding</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
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
            <div className="hidden md:flex items-center space-x-2">
              <SearchBar onSearch={handleSearch} />
              <NotificationsDropdown />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuickLog}
                className="flex items-center gap-2"
                aria-label="Quick log entry"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden lg:inline">Quick Log</span>
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
                    <div className="flex items-center justify-between p-6 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <BarChart3 className="h-8 w-8 text-primary" />
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" aria-hidden="true"></div>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-foreground">DSA Tracker</h2>
                          <p className="text-sm text-muted-foreground">Level up your coding</p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="p-4 border-b space-y-3">
                      <SearchBar onSearch={handleSearch} className="w-full" />
                      <div className="flex items-center justify-between">
                        <NotificationsDropdown />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleQuickLog}
                          className="flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
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
                    <div className="p-4 border-t">
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
