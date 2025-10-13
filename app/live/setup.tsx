import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Users, UserCheck, Globe } from 'lucide-react-native';
import { useLiveStreaming } from '@/hooks/live-streaming-store';
import { LiveAudience } from '@/types/live';
import { Colors } from '@/constants/colors';

const colors = {
  primary: Colors.primary,
  background: {
    primary: Colors.background,
    secondary: Colors.backgroundSecondary,
  },
  text: {
    primary: Colors.text,
    secondary: Colors.textSecondary,
  },
  border: Colors.border,
};

export default function LiveSetupScreen() {
  const { startLive } = useLiveStreaming();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [audience, setAudience] = useState<LiveAudience>('everyone');
  const [commentsEnabled, setCommentsEnabled] = useState<boolean>(true);
  const [shareToFeed, setShareToFeed] = useState<boolean>(true);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  const audienceOptions: { value: LiveAudience; label: string; icon: typeof Globe; description: string }[] = [
    {
      value: 'everyone',
      label: 'Everyone',
      icon: Globe,
      description: 'Anyone can watch your live',
    },
    {
      value: 'followers',
      label: 'Followers',
      icon: Users,
      description: 'Only your followers can watch',
    },
    {
      value: 'close-friends',
      label: 'Close Friends',
      icon: UserCheck,
      description: 'Only close friends can watch',
    },
  ];

  const handleStartLive = async () => {
    setIsStarting(true);
    try {
      const session = await startLive(
        title || undefined,
        description || undefined,
        audience,
        commentsEnabled,
        shareToFeed
      );
      
      router.replace(`/live/${session.id}`);
    } catch (error) {
      console.error('Failed to start live:', error);
      setIsStarting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          testID="close-button"
        >
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Go Live</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="What's your live about?"
            placeholderTextColor={colors.text.secondary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            testID="title-input"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell viewers more about your live..."
            placeholderTextColor={colors.text.secondary}
            value={description}
            onChangeText={setDescription}
            maxLength={500}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            testID="description-input"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who can watch</Text>
          {audienceOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = audience === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.audienceOption,
                  isSelected && styles.audienceOptionSelected,
                ]}
                onPress={() => setAudience(option.value)}
                testID={`audience-${option.value}`}
              >
                <View style={styles.audienceIconContainer}>
                  <Icon
                    size={24}
                    color={isSelected ? colors.primary : colors.text.secondary}
                  />
                </View>
                <View style={styles.audienceTextContainer}>
                  <Text
                    style={[
                      styles.audienceLabel,
                      isSelected && styles.audienceLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.audienceDescription}>
                    {option.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Enable Comments</Text>
              <Text style={styles.settingDescription}>
                Let viewers comment during your live
              </Text>
            </View>
            <Switch
              value={commentsEnabled}
              onValueChange={setCommentsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background.primary}
              testID="comments-switch"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Share to Feed</Text>
              <Text style={styles.settingDescription}>
                Post replay to your profile after live ends
              </Text>
            </View>
            <Switch
              value={shareToFeed}
              onValueChange={setShareToFeed}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background.primary}
              testID="share-switch"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, isStarting && styles.startButtonDisabled]}
          onPress={handleStartLive}
          disabled={isStarting}
          testID="start-live-button"
        >
          <Text style={styles.startButtonText}>
            {isStarting ? 'Starting...' : 'Start Live'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  audienceOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  audienceIconContainer: {
    marginRight: 12,
  },
  audienceTextContainer: {
    flex: 1,
  },
  audienceLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  audienceLabelSelected: {
    color: colors.primary,
  },
  audienceDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
