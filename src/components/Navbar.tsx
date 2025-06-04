
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Home, 
  PlusCircle, 
  Calendar, 
  Target, 
  Settings, 
  LogOut, 
  BarChart3,
  Bell,
  User,
  Trophy,
  BookOpen,
  TrendingUp
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
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <BarChart3 className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  DSA Tracker
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Level up your coding</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  id={item.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100",
                    isActive 
                      ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200" 
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu and Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* Quick Add */}
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Quick Log
            </Button>

            {/* User Profile */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                size="sm"
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center space-x-3 pb-6 border-b">
                    <div className="relative">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">DSA Tracker</h2>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 pt-6">
                    <div className="space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                              isActive 
                                ? "bg-blue-50 text-blue-700 border border-blue-200" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="pt-6 border-t space-y-3">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Quick Log
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      size="sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
