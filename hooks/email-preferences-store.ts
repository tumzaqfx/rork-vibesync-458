import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { EmailPreferences } from '@/types/email';

const DEFAULT_PREFERENCES: Omit<EmailPreferences, 'userId' | 'email'> = {
  notifications: {
    friendship_follow: true,
    playlist_sync: true,
    voice_note_interaction: true,
    engagement_boost: true,
    monthly_digest: true,
  },
  unsubscribed: false,
};

export const [EmailPreferencesProvider, useEmailPreferences] = createContextHook(() => {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPreferences = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('email_preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('[EmailPreferences] Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const syncPreferencesWithBackend = useCallback(async (prefs: EmailPreferences) => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      
      await fetch(`${API_URL}/api/trpc/email.updatePreferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prefs),
      });

      console.log('[EmailPreferences] Synced with backend');
    } catch (error) {
      console.error('[EmailPreferences] Error syncing with backend:', error);
    }
  }, []);

  const savePreferences = useCallback(async (newPreferences: EmailPreferences) => {
    try {
      await AsyncStorage.setItem('email_preferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      
      await syncPreferencesWithBackend(newPreferences);
    } catch (error) {
      console.error('[EmailPreferences] Error saving preferences:', error);
    }
  }, [syncPreferencesWithBackend]);

  const initializePreferences = useCallback(async (userId: string, email: string) => {
    const newPreferences: EmailPreferences = {
      userId,
      email,
      ...DEFAULT_PREFERENCES,
    };
    
    await savePreferences(newPreferences);
  }, [savePreferences]);

  const updateNotificationPreference = useCallback(async (
    key: keyof EmailPreferences['notifications'],
    value: boolean
  ) => {
    if (!preferences) return;

    const updated: EmailPreferences = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: value,
      },
    };

    await savePreferences(updated);
  }, [preferences, savePreferences]);

  const unsubscribeFromAll = useCallback(async () => {
    if (!preferences) return;

    const updated: EmailPreferences = {
      ...preferences,
      unsubscribed: true,
      unsubscribedAt: new Date().toISOString(),
    };

    await savePreferences(updated);
  }, [preferences, savePreferences]);

  const resubscribe = useCallback(async () => {
    if (!preferences) return;

    const updated: EmailPreferences = {
      ...preferences,
      unsubscribed: false,
      unsubscribedAt: undefined,
    };

    await savePreferences(updated);
  }, [preferences, savePreferences]);

  const canSendEmail = useCallback((emailType: keyof EmailPreferences['notifications']): boolean => {
    if (!preferences) return false;
    if (preferences.unsubscribed) return false;
    return preferences.notifications[emailType];
  }, [preferences]);

  return useMemo(
    () => ({
      preferences,
      loading,
      initializePreferences,
      updateNotificationPreference,
      unsubscribeFromAll,
      resubscribe,
      canSendEmail,
    }),
    [preferences, loading, initializePreferences, updateNotificationPreference, unsubscribeFromAll, resubscribe, canSendEmail]
  );
});
