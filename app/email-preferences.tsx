import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEmailPreferences } from '@/hooks/email-preferences-store';
import { useTheme } from '@/hooks/theme-store';
import { Mail, Bell, BellOff, CheckCircle } from 'lucide-react-native';

export default function EmailPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const {
    preferences,
    loading,
    updateNotificationPreference,
    unsubscribeFromAll,
    resubscribe,
  } = useEmailPreferences();

  const handleToggle = async (key: keyof NonNullable<typeof preferences>['notifications'], value: boolean) => {
    await updateNotificationPreference(key, value);
  };

  const handleUnsubscribeAll = () => {
    Alert.alert(
      'Unsubscribe from All Emails',
      'Are you sure you want to unsubscribe from all promotional and notification emails? You will still receive important transactional emails.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unsubscribe',
          style: 'destructive',
          onPress: async () => {
            await unsubscribeFromAll();
            Alert.alert('Success', 'You have been unsubscribed from all emails.');
          },
        },
      ]
    );
  };

  const handleResubscribe = async () => {
    await resubscribe();
    Alert.alert('Success', 'You have been resubscribed to email notifications.');
  };

  if (loading || !preferences) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: 'Email Preferences',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
          }}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading preferences...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Email Preferences',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Mail size={32} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Email Notifications
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Manage your email preferences and control what notifications you receive
          </Text>
        </View>

        {preferences.unsubscribed && (
          <View style={[styles.unsubscribedBanner, { backgroundColor: '#FFF3CD' }]}>
            <BellOff size={20} color="#856404" />
            <Text style={[styles.unsubscribedText, { color: '#856404' }]}>
              You are currently unsubscribed from all emails
            </Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notification Emails
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Choose which notifications you want to receive via email
          </Text>

          <View style={styles.preferencesList}>
            <PreferenceItem
              title="Friend Follows"
              description="Get notified when someone follows you"
              value={preferences.notifications.friendship_follow}
              onValueChange={(value) => handleToggle('friendship_follow', value)}
              disabled={preferences.unsubscribed}
              colors={colors}
            />

            <PreferenceItem
              title="Playlist Updates"
              description="Get notified when friends update playlists"
              value={preferences.notifications.playlist_sync}
              onValueChange={(value) => handleToggle('playlist_sync', value)}
              disabled={preferences.unsubscribed}
              colors={colors}
            />

            <PreferenceItem
              title="Voice Note Replies"
              description="Get notified when someone replies with a voice note"
              value={preferences.notifications.voice_note_interaction}
              onValueChange={(value) => handleToggle('voice_note_interaction', value)}
              disabled={preferences.unsubscribed}
              colors={colors}
            />

            <PreferenceItem
              title="Engagement Reminders"
              description="Get reminded to check back when you've been inactive"
              value={preferences.notifications.engagement_boost}
              onValueChange={(value) => handleToggle('engagement_boost', value)}
              disabled={preferences.unsubscribed}
              colors={colors}
            />

            <PreferenceItem
              title="Monthly Digest"
              description="Receive a monthly summary of your activity"
              value={preferences.notifications.monthly_digest}
              onValueChange={(value) => handleToggle('monthly_digest', value)}
              disabled={preferences.unsubscribed}
              colors={colors}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Transactional Emails
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            These emails are always sent for security and account management
          </Text>

          <View style={[styles.transactionalItem, { borderColor: colors.border }]}>
            <CheckCircle size={20} color={colors.primary} />
            <View style={styles.transactionalText}>
              <Text style={[styles.transactionalTitle, { color: colors.text }]}>
                Account Security
              </Text>
              <Text style={[styles.transactionalDescription, { color: colors.textSecondary }]}>
                Password resets, login alerts, account recovery
              </Text>
            </View>
          </View>

          <View style={[styles.transactionalItem, { borderColor: colors.border }]}>
            <CheckCircle size={20} color={colors.primary} />
            <View style={styles.transactionalText}>
              <Text style={[styles.transactionalTitle, { color: colors.text }]}>
                Email Verification
              </Text>
              <Text style={[styles.transactionalDescription, { color: colors.textSecondary }]}>
                Verify your email address when signing up
              </Text>
            </View>
          </View>

          <View style={[styles.transactionalItem, { borderColor: colors.border }]}>
            <CheckCircle size={20} color={colors.primary} />
            <View style={styles.transactionalText}>
              <Text style={[styles.transactionalTitle, { color: colors.text }]}>
                Order Updates
              </Text>
              <Text style={[styles.transactionalDescription, { color: colors.textSecondary }]}>
                Order confirmations, shipping, and delivery notifications
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          {preferences.unsubscribed ? (
            <TouchableOpacity
              style={[styles.resubscribeButton, { backgroundColor: colors.primary }]}
              onPress={handleResubscribe}
            >
              <Bell size={20} color="#FFFFFF" />
              <Text style={styles.resubscribeButtonText}>Resubscribe to Emails</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.unsubscribeButton, { borderColor: colors.border }]}
              onPress={handleUnsubscribeAll}
            >
              <BellOff size={20} color={colors.textSecondary} />
              <Text style={[styles.unsubscribeButtonText, { color: colors.textSecondary }]}>
                Unsubscribe from All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.footer, { backgroundColor: colors.card }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Email: {preferences.email}
          </Text>
          {preferences.unsubscribedAt && (
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Unsubscribed on: {new Date(preferences.unsubscribedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

interface PreferenceItemProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled: boolean;
  colors: any;
}

function PreferenceItem({
  title,
  description,
  value,
  onValueChange,
  disabled,
  colors,
}: PreferenceItemProps) {
  return (
    <View style={[styles.preferenceItem, { borderBottomColor: colors.border }]}>
      <View style={styles.preferenceContent}>
        <Text style={[styles.preferenceTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.preferenceDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  unsubscribedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
  },
  unsubscribedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  sectionDescription: {
    fontSize: 14,
  },
  preferencesList: {
    marginTop: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  preferenceContent: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
  },
  transactionalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  transactionalText: {
    flex: 1,
  },
  transactionalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  transactionalDescription: {
    fontSize: 14,
  },
  actions: {
    marginTop: 8,
  },
  unsubscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  unsubscribeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  resubscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
  },
  resubscribeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
