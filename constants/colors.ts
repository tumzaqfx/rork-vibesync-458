export type Theme = 'light' | 'dark';
export type ThemePreference = Theme | 'system';

export interface ColorScheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  backgroundSecondary: string;
  card: string;
  cardLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderLight: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  notification: string;
  transparent: string;
  overlay: string;
  glass: string;
  glassLight: string;
  shadow: string;
}

export const DarkTheme: ColorScheme = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  background: '#000000',
  backgroundSecondary: '#0A0A0A',
  card: '#121212',
  cardLight: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#6B7280',
  textInverse: '#000000',
  border: '#2A2A2A',
  borderLight: '#3A3A3A',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  notification: '#EF4444',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  glass: 'rgba(255, 255, 255, 0.1)',
  glassLight: 'rgba(255, 255, 255, 0.15)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const LightTheme: ColorScheme = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  card: '#FFFFFF',
  cardLight: '#F1F5F9',
  text: '#000000',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  notification: '#EF4444',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  glass: 'rgba(0, 0, 0, 0.1)',
  glassLight: 'rgba(0, 0, 0, 0.05)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Legacy export for backward compatibility
export const Colors = DarkTheme;