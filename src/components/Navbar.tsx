
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, PlusCircle, Calendar, Target, Settings, LogOut, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, id: 'dashboard-nav' },
  { name: 'Daily Log', href: '/daily-log', icon: PlusCircle, id: 'daily-log-nav' },
  { name: 'Contest Log', href: '/contest-log', icon: Calendar, id: 'contest-log-nav' },
  { name: 'Weekly Goals', href: '/weekly-goals', icon: Target, id: 'weekly-goals-nav' },
  { name: 'Settings', href: '/settings', icon: Settings, id: 'settings-nav' },
];

export const Navbar = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            id={item.id}
            onClick={() => mobile && setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm justify-start text-muted-foreground hover:bg-accent w-full"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col fixed left-0 top-0 z-40 bg-background border-r">
        <div className="flex h-14 items-center border-b px-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">DSA Tracker</h1>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavLinks />
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex h-14 items-center justify-between border-b px-4 bg-background fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">DSA Tracker</h1>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col space-y-1 mt-4">
              <NavLinks mobile />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
