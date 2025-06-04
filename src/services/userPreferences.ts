
import { supabase } from '@/integrations/supabase/client';

interface UserPreferences {
  hasSeenOnboarding: boolean;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
}

export class UserPreferencesService {
  private static readonly STORAGE_KEY = 'user_preferences';

  // Get preferences from localStorage
  static async getPreferences(): Promise<UserPreferences> {
    try {
      // Use localStorage as primary storage
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

  // Save preferences to localStorage
  static async setPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };

      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  static async markOnboardingComplete(): Promise<void> {
    await this.setPreferences({ hasSeenOnboarding: true });
  }

  static async setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await this.setPreferences({ theme });
  }
}
