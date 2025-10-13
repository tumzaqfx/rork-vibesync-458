import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { Theme, ThemePreference, ColorScheme, DarkTheme, LightTheme } from '@/constants/colors';

interface ThemeContextType {
  theme: Theme;
  colors: ColorScheme;
  isDark: boolean;
  isLight: boolean;
  setTheme: (theme: ThemePreference) => void;
  userPreference: ThemePreference;
  toggleTheme: () => void;
  systemTheme: ColorSchemeName;
}

const THEME_STORAGE_KEY = '@vibesync_theme';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [userPreference, setUserPreference] = useState<ThemePreference>('system');

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('System theme changed to:', colorScheme);
      setSystemTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          const parsedTheme = savedTheme as ThemePreference;
          setUserPreference(parsedTheme);
          console.log('Loaded theme preference:', parsedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Update active theme based on user preference and system theme
  useEffect(() => {
    let activeTheme: Theme;
    
    if (userPreference === 'system') {
      activeTheme = systemTheme === 'light' ? 'light' : 'dark';
    } else {
      activeTheme = userPreference;
    }
    
    console.log('Setting active theme:', activeTheme, 'from preference:', userPreference, 'system:', systemTheme);
    setThemeState(activeTheme);
  }, [userPreference, systemTheme]);

  const setTheme = useCallback(async (newTheme: ThemePreference) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setUserPreference(newTheme);
      console.log('Theme preference saved:', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const colors = useMemo(() => theme === 'dark' ? DarkTheme : LightTheme, [theme]);
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    theme,
    colors,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
    systemTheme,
    userPreference,
  } as ThemeContextType;
});