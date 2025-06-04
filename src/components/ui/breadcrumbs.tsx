
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/daily-log': 'Daily Log',
  '/contest-log': 'Contest Log',
  '/weekly-goals': 'Weekly Goals',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on dashboard
  if (location.pathname === '/dashboard' || location.pathname === '/') {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' }
  ];

  // Build breadcrumbs from path segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      href: index === pathSegments.length - 1 ? undefined : currentPath // Last item has no link
    });
  });

  return (
    <nav 
      className="flex items-center space-x-1 text-sm text-muted-foreground px-4 py-2 bg-muted/30 border-b"
      aria-label="Breadcrumb"
    >
      <div className="hidden sm:flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
                aria-label={`Navigate to ${item.label}`}
              >
                {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile: Show only back link */}
      <div className="sm:hidden">
        {breadcrumbs.length > 1 && (
          <Link
            to={breadcrumbs[breadcrumbs.length - 2]?.href || '/dashboard'}
            className="flex items-center gap-1 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
            aria-label="Go back"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back
          </Link>
        )}
      </div>
    </nav>
  );
};
