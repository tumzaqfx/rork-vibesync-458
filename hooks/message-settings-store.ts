import { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

import {
  MessageSettings,
  DEFAULT_MESSAGE_SETTINGS,
  MessageRequestFrom,
  CallPermission,
} from '@/types/message-settings';

const STORAGE_KEY = 'message-settings';

export const [MessageSettingsProvider, useMessageSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<MessageSettings>(DEFAULT_MESSAGE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      }
    } catch (error) {
      console.error('[MessageSettings] Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: MessageSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('[MessageSettings] Error saving settings:', error);
    }
  };

  const updateMessageRequestsFrom = useCallback((value: MessageRequestFrom) => {
    const newSettings = { ...settings, messageRequestsFrom: value };
    saveSettings(newSettings);
  }, [settings]);

  const toggleAudioVideoCalling = useCallback(() => {
    const newSettings = { ...settings, audioVideoCallingEnabled: !settings.audioVideoCallingEnabled };
    saveSettings(newSettings);
  }, [settings]);

  const updateCallPermission = useCallback((value: CallPermission) => {
    const newSettings = { ...settings, callPermission: value };
    saveSettings(newSettings);
  }, [settings]);

  const toggleRelayCalls = useCallback(() => {
    const newSettings = { ...settings, alwaysRelayCalls: !settings.alwaysRelayCalls };
    saveSettings(newSettings);
  }, [settings]);

  const toggleScreenshotProtection = useCallback(() => {
    const newSettings = { ...settings, screenshotProtection: !settings.screenshotProtection };
    saveSettings(newSettings);
  }, [settings]);

  const resetToDefaults = useCallback(() => {
    saveSettings(DEFAULT_MESSAGE_SETTINGS);
  }, []);

  return useMemo(() => ({
    settings,
    isLoading,
    updateMessageRequestsFrom,
    toggleAudioVideoCalling,
    updateCallPermission,
    toggleRelayCalls,
    toggleScreenshotProtection,
    resetToDefaults,
  }), [
    settings,
    isLoading,
    updateMessageRequestsFrom,
    toggleAudioVideoCalling,
    updateCallPermission,
    toggleRelayCalls,
    toggleScreenshotProtection,
    resetToDefaults,
  ]);
});
