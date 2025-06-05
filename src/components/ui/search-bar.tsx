
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '@/lib/supabase-utils';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

interface SearchResult {
  id: string;
  type: 'daily_log' | 'contest_log' | 'weekly_goal';
  title: string;
  subtitle: string;
  date: string;
  url: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search logs, contests, goals...",
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isExpanded && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsExpanded(true);
      }
      
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        setQuery('');
        setShowResults(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setShowResults(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (query.trim() && user) {
      performSearch(query.trim());
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, user]);

  const performSearch = async (searchQuery: string) => {
    if (!user) return;

    setIsSearching(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search daily logs
      const { data: dailyLogs, error: dailyError } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .or(`topic.ilike.%${searchQuery}%,platform.ilike.%${searchQuery}%,notes.ilike.%${searchQuery}%,difficulty.ilike.%${searchQuery}%`)
        .order('date', { ascending: false })
        .limit(5);

      if (!dailyError && dailyLogs) {
        dailyLogs.forEach(log => {
          searchResults.push({
            id: log.id,
            type: 'daily_log',
            title: `${log.topic} - ${log.platform}`,
            subtitle: `${log.problems_solved} problems solved, ${log.difficulty}`,
            date: log.date,
            url: '/daily-log'
          });
        });
      }

      // Search contest logs
      const { data: contestLogs, error: contestError } = await supabaseClient
        .from('contest_logs')
        .select('*')
        .eq('user_id', user.id)
        .or(`contest_name.ilike.%${searchQuery}%,platform.ilike.%${searchQuery}%,notes.ilike.%${searchQuery}%`)
        .order('date', { ascending: false })
        .limit(5);

      if (!contestError && contestLogs) {
        contestLogs.forEach(log => {
          searchResults.push({
            id: log.id,
            type: 'contest_log',
            title: log.contest_name,
            subtitle: `${log.platform} - ${log.problems_solved} problems solved`,
            date: log.date,
            url: '/contest-log'
          });
        });
      }

      // Search weekly goals
      const { data: weeklyGoals, error: goalsError } = await supabaseClient
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .or(`goal_description.ilike.%${searchQuery}%,review_notes.ilike.%${searchQuery}%`)
        .order('week_start_date', { ascending: false })
        .limit(5);

      if (!goalsError && weeklyGoals) {
        weeklyGoals.forEach(goal => {
          searchResults.push({
            id: goal.id,
            type: 'weekly_goal',
            title: goal.goal_description,
            subtitle: `${goal.current_value}/${goal.target_value} - ${goal.status}`,
            date: goal.week_start_date,
            url: '/weekly-goals'
          });
        });
      }

      // Sort by date (most recent first)
      searchResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setResults(searchResults.slice(0, 10));
      setShowResults(true);

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      
      // Navigate to analytics page with search context
      navigate('/analytics', { state: { searchQuery: query.trim() } });
      setIsExpanded(false);
      setQuery('');
      setShowResults(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsExpanded(false);
    setQuery('');
    setShowResults(false);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setQuery('');
    setShowResults(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily_log':
        return '📝';
      case 'contest_log':
        return '🏆';
      case 'weekly_goal':
        return '🎯';
      default:
        return '📄';
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {!isExpanded ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(true)}
          className="h-9 w-9"
          aria-label="Open search (Press / to focus)"
          title="Search (Press / to focus)"
        >
          <Search className="h-4 w-4" />
        </Button>
      ) : (
        <div className="relative">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="pl-8 pr-8 w-64"
                aria-label="Search input"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setQuery('');
                    setShowResults(false);
                  }}
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-9 w-9"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-muted-foreground">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3"
                    >
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(result.date).toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="p-4 text-center text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
