
import { supabase } from '@/integrations/supabase/client';

interface UserPreferences {
  hasSeenOnboarding: boolean;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
}

export class UserPreferencesService {
  private static readonly STORAGE_KEY = 'user_preferences';

  // Get preferences from localStorage (fallback) or database
  static async getPreferences(): Promise<UserPreferences> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to get from database first
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          return {
            hasSeenOnboarding: data.has_seen_onboarding || false,
            theme: data.theme_preference || 'system',
            notificationsEnabled: data.notifications_enabled || true,
          };
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Default preferences
      return {
        hasSeenOnboarding: false,
        theme: 'system',
        notificationsEnabled: true,
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        hasSeenOnboarding: false,
        theme: 'system',
        notificationsEnabled: true,
      };
    }
  }

  // Save preferences to both localStorage and database
  static async setPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };

      // Save to localStorage immediately
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));

      // Try to save to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            has_seen_onboarding: updated.hasSeenOnboarding,
            theme_preference: updated.theme,
            notifications_enabled: updated.notificationsEnabled,
          });
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
      // Still save to localStorage as fallback
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }
  }

  static async markOnboardingComplete(): Promise<void> {
    await this.setPreferences({ hasSeenOnboarding: true });
  }

  static async setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await this.setPreferences({ theme });
  }
}
