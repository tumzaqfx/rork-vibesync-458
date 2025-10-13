import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, Modal, Pressable } from 'react-native';
import ActiveSessionsModal from '@/components/settings/ActiveSessionsModal';
import BlockedAccountsModal from '@/components/settings/BlockedAccountsModal';
import MutedAccountsModal from '@/components/settings/MutedAccountsModal';
import LegalDocumentModal from '@/components/settings/LegalDocumentModal';
import SupportModal from '@/components/settings/SupportModal';
import FAQModal from '@/components/settings/FAQModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Shield, 
  Bell, 
  Globe, 
  Palette, 
  Sun, 
  Moon, 
  Smartphone, 
  HelpCircle, 
  AlertCircle, 
  Mail, 
  Info, 
  FileText, 
  LogOut,
  ChevronRight,
  Eye,
  UserX,
  Database,
  Fingerprint,
  Monitor,
  Trash2,
  Download,
  Wifi,
  MapPin,
  Users,
  TrendingUp,
  MessageSquare,
  Type,
  Zap
} from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-store';
import { useTheme } from '@/hooks/theme-store';
import { AppSettings } from '@/types';

const SETTINGS_STORAGE_KEY = '@vibesync_settings';

const ACCENT_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Cyan', value: '#06B6D4' },
];

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { colors, userPreference, setTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<AppSettings>({
    theme: userPreference,
    accentColor: '#3B82F6',
    fontSize: 'medium',
    language: 'English',
    notifications: {
      push: true,
      email: false,
      sms: false,
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      syncSessions: true,
      playlistActivity: true,
      vibeTab: true,
      influencerUpdates: true,
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowMessageRequests: true,
      screenshotProtection: false,
      whoCanMessageMe: 'everyone',
      whoCanSeeMyVibes: 'public',
      contentFilters: false,
    },
    messaging: {
      screenshotProtection: false,
      notifyOnScreenshotAttempt: true,
      defaultViewOnce: false,
    },
    security: {
      twoFactorEnabled: false,
      biometricEnabled: false,
    },
    discoverability: {
      suggestedFollows: true,
      contactsSync: false,
      locationDiscovery: false,
      vibeScoreVisible: true,
    },
    data: {
      dataSaverMode: false,
      backgroundPlay: true,
      autoDownload: false,
    },
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAccentColorModal, setShowAccentColorModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showMessagePermissionModal, setShowMessagePermissionModal] = useState(false);
  const [showVibeVisibilityModal, setShowVibeVisibilityModal] = useState(false);
  const [showActiveSessionsModal, setShowActiveSessionsModal] = useState(false);
  const [showBlockedAccountsModal, setShowBlockedAccountsModal] = useState(false);
  const [showMutedAccountsModal, setShowMutedAccountsModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalModalContent, setLegalModalContent] = useState({ title: '', content: '' });
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalType, setSupportModalType] = useState<'contact' | 'bug' | 'feedback'>('contact');
  const [showFAQModal, setShowFAQModal] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings(prev => ({
            ...prev,
            ...parsed,
            theme: parsed.theme || prev.theme,
            notifications: { ...prev.notifications, ...parsed.notifications },
            privacy: { ...prev.privacy, ...parsed.privacy },
            messaging: { ...prev.messaging, ...parsed.messaging },
            security: { ...prev.security, ...parsed.security },
            discoverability: { ...prev.discoverability, ...parsed.discoverability },
            data: { ...prev.data, ...parsed.data },
          }));
        }
      } catch (error) {
        console.error('[Settings] Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('[Settings] Error saving settings:', error);
      }
    };
    const timeoutId = setTimeout(() => {
      saveSettings();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [settings]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      'Deactivate Account',
      'Your account will be temporarily deactivated. You can reactivate it by logging in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deactivated', 'Your account has been deactivated.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will free up storage space on your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Cache Cleared', 'App cache has been cleared successfully.');
          },
        },
      ]
    );
  };

  const updateNotificationSetting = (key: keyof AppSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updatePrivacySetting = (key: keyof AppSettings['privacy'], value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  };

  const updateMessagingSetting = (key: keyof AppSettings['messaging'], value: any) => {
    setSettings(prev => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        [key]: value,
      },
    }));
  };

  const updateSecuritySetting = (key: keyof AppSettings['security'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }));
  };

  const updateDiscoverabilitySetting = (key: keyof AppSettings['discoverability'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      discoverability: {
        ...prev.discoverability,
        [key]: value,
      },
    }));
  };

  const updateDataSetting = (key: keyof AppSettings['data'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: value,
      },
    }));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setSettings(prev => ({ ...prev, theme: newTheme }));
  };

  const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Chinese', 'Japanese', 'Arabic', 'Hindi'];
  const fontSizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
  const messagePermissions: ('everyone' | 'friends' | 'none')[] = ['everyone', 'friends', 'none'];
  const vibeVisibility: ('public' | 'friends' | 'private')[] = ['public', 'friends', 'private'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: colors.background }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        <View style={[styles.sectionHeader, { backgroundColor: colors.glass }]}>
          <Lock size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account & Security</Text>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/edit-profile')}
          >
            <User size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Profile Information</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/change-password')}
          >
            <Lock size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Change Password</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Shield size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Two-Factor Authentication</Text>
            <Switch
              value={settings.security.twoFactorEnabled}
              onValueChange={(value) => updateSecuritySetting('twoFactorEnabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Fingerprint size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Biometric / PIN Lock</Text>
            <Switch
              value={settings.security.biometricEnabled}
              onValueChange={(value) => updateSecuritySetting('biometricEnabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowActiveSessionsModal(true)}
          >
            <Monitor size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Active Sessions</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={handleDeactivateAccount}
          >
            <AlertCircle size={18} color={colors.warning} />
            <Text style={[styles.settingLabel, { color: colors.warning }]}>Deactivate Account</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={handleDeleteAccount}
          >
            <Trash2 size={18} color={colors.error} />
            <Text style={[styles.settingLabel, { color: colors.error }]}>Delete Account</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionHeader, { backgroundColor: colors.glass }]}>
          <Palette size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance & Personalization</Text>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.themeSection, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeOptions}>
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  { backgroundColor: colors.cardLight }, 
                  userPreference === 'light' && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleThemeChange('light')}
              >
                <Sun size={16} color={userPreference === 'light' ? colors.textInverse : colors.textSecondary} />
                <Text style={[styles.themeOptionText, { 
                  color: userPreference === 'light' ? colors.textInverse : colors.textSecondary 
                }]}>Light</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  { backgroundColor: colors.cardLight }, 
                  userPreference === 'dark' && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleThemeChange('dark')}
              >
                <Moon size={16} color={userPreference === 'dark' ? colors.textInverse : colors.textSecondary} />
                <Text style={[styles.themeOptionText, { 
                  color: userPreference === 'dark' ? colors.textInverse : colors.textSecondary 
                }]}>Dark</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  { backgroundColor: colors.cardLight }, 
                  userPreference === 'system' && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleThemeChange('system')}
              >
                <Smartphone size={16} color={userPreference === 'system' ? colors.textInverse : colors.textSecondary} />
                <Text style={[styles.themeOptionText, { 
                  color: userPreference === 'system' ? colors.textInverse : colors.textSecondary 
                }]}>System</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowAccentColorModal(true)}
          >
            <Palette size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Accent Color</Text>
            <View style={styles.languageValue}>
              <View style={[styles.colorPreview, { backgroundColor: settings.accentColor }]} />
              <ChevronRight size={18} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowFontSizeModal(true)}
          >
            <Type size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Font Size</Text>
            <View style={styles.languageValue}>
              <Text style={[styles.settingValue, { color: colors.textSecondary, textTransform: 'capitalize' }]}>
                {settings.fontSize}
              </Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <Globe size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Language</Text>
            <View style={styles.languageValue}>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{settings.language}</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionHeader, { backgroundColor: colors.glass }]}>
          <Bell size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
            <Switch
              value={settings.notifications.push}
              onValueChange={(value) => updateNotificationSetting('push', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Email Alerts</Text>
            <Switch
              value={settings.notifications.email}
              onValueChange={(value) => updateNotificationSetting('email', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>SMS Alerts</Text>
            <Switch
              value={settings.notifications.sms}
              onValueChange={(value) => updateNotificationSetting('sms', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Messages</Text>
            <Switch
              value={settings.notifications.messages}
              onValueChange={(value) => updateNotificationSetting('messages', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Likes</Text>
            <Switch
              value={settings.notifications.likes}
              onValueChange={(value) => updateNotificationSetting('likes', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Comments</Text>
            <Switch
              value={settings.notifications.comments}
              onValueChange={(value) => updateNotificationSetting('comments', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>New Followers</Text>
            <Switch
              value={settings.notifications.follows}
              onValueChange={(value) => updateNotificationSetting('follows', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.card }]} 
            onPress={handleLogout}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
            </View>
            <ScrollView style={styles.modalScroll}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.modalOption,
                    { borderBottomColor: colors.border },
                    settings.language === lang && { backgroundColor: colors.glass }
                  ]}
                  onPress={() => {
                    setSettings(prev => ({ ...prev, language: lang }));
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    { color: settings.language === lang ? colors.primary : colors.text }
                  ]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <ActiveSessionsModal
        visible={showActiveSessionsModal}
        onClose={() => setShowActiveSessionsModal(false)}
      />

      <BlockedAccountsModal
        visible={showBlockedAccountsModal}
        onClose={() => setShowBlockedAccountsModal(false)}
      />

      <MutedAccountsModal
        visible={showMutedAccountsModal}
        onClose={() => setShowMutedAccountsModal(false)}
      />

      <LegalDocumentModal
        visible={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        title={legalModalContent.title}
        content={legalModalContent.content}
      />

      <SupportModal
        visible={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        type={supportModalType}
      />

      <FAQModal
        visible={showFAQModal}
        onClose={() => setShowFAQModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginLeft: 8,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    flex: 1,
    fontWeight: '500' as const,
  },
  settingValue: {
    fontSize: 15,
    marginRight: 4,
  },
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  themeOptions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
});
