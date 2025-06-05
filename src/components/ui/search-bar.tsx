
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Trophy, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-utils';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'daily-log' | 'contest-log' | 'weekly-goal';
  title: string;
  subtitle: string;
  date: string;
  badge?: string;
  url: string;
}

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2 && user) {
      performSearch(query);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, user]);

  const performSearch = async (searchQuery: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search daily logs
      const { data: dailyLogs } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .or(`topic.ilike.%${searchQuery}%,platform.ilike.%${searchQuery}%,difficulty.ilike.%${searchQuery}%,notes.ilike.%${searchQuery}%`)
        .order('date', { ascending: false })
        .limit(5);

      dailyLogs?.forEach(log => {
        searchResults.push({
          id: log.id,
          type: 'daily-log',
          title: `${log.problems_solved} problems on ${log.platform}`,
          subtitle: `Topic: ${log.topic} • Difficulty: ${log.difficulty}`,
          date: log.date,
          badge: `${log.problems_solved} solved`,
          url: '/daily-log'
        });
      });

      // Search contest logs
      const { data: contestLogs } = await supabaseClient
        .from('contest_logs')
        .select('*')
        .eq('user_id', user.id)
        .or(`contest_name.ilike.%${searchQuery}%,platform.ilike.%${searchQuery}%,notes.ilike.%${searchQuery}%`)
        .order('date', { ascending: false })
        .limit(5);

      contestLogs?.forEach(log => {
        searchResults.push({
          id: log.id,
          type: 'contest-log',
          title: log.contest_name,
          subtitle: `Platform: ${log.platform} • Rank: ${log.rank || 'N/A'}`,
          date: log.date,
          badge: log.rank ? `Rank ${log.rank}` : undefined,
          url: '/contest-log'
        });
      });

      // Search weekly goals
      const { data: weeklyGoals } = await supabaseClient
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .ilike('goal_description', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      weeklyGoals?.forEach(goal => {
        const progress = Math.round((goal.current_value / goal.target_value) * 100);
        searchResults.push({
          id: goal.id,
          type: 'weekly-goal',
          title: goal.goal_description,
          subtitle: `Progress: ${goal.current_value}/${goal.target_value}`,
          date: goal.week_start_date,
          badge: `${progress}%`,
          url: '/weekly-goals'
        });
      });

      setResults(searchResults.slice(0, 8));
      setIsOpen(searchResults.length > 0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setIsOpen(false);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'daily-log':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'contest-log':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'weekly-goal':
        return <Target className="h-4 w-4 text-green-500" />;
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'daily-log':
        return 'Daily Log';
      case 'contest-log':
        return 'Contest';
      case 'weekly-goal':
        return 'Goal';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search logs, contests, goals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10 w-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y">
                {results.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="p-3 hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {getResultIcon(result.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">
                            {result.title}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {getResultTypeLabel(result.type)}
                          </Badge>
                          {result.badge && (
                            <Badge variant="outline" className="text-xs">
                              {result.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(result.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
