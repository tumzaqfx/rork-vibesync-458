import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMessageSettings } from '@/hooks/message-settings-store';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react-native';
import { MessageRequestFrom, CallPermission } from '@/types/message-settings';

export default function MessagesSettingsScreen() {
  const insets = useSafeAreaInsets();
  const {
    settings,
    updateMessageRequestsFrom,
    toggleAudioVideoCalling,
    updateCallPermission,
    toggleRelayCalls,
    toggleScreenshotProtection,
  } = useMessageSettings();

  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showCallPermissionModal, setShowCallPermissionModal] = useState(false);

  const messageRequestOptions: { value: MessageRequestFrom; label: string }[] = [
    { value: 'no_one', label: 'No one' },
    { value: 'verified', label: 'Verified users' },
    { value: 'everyone', label: 'Everyone' },
  ];

  const callPermissionOptions: { value: CallPermission; label: string }[] = [
    { value: 'contacts', label: 'People in your address book' },
    { value: 'following', label: 'People you follow' },
    { value: 'verified', label: 'Verified users' },
    { value: 'everyone', label: 'Everyone' },
  ];

  const getRequestsLabel = (value: MessageRequestFrom) => {
    return messageRequestOptions.find(opt => opt.value === value)?.label || 'Everyone';
  };

  const getCallPermissionLabel = (value: CallPermission) => {
    return callPermissionOptions.find(opt => opt.value === value)?.label || 'Everyone';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowRequestsModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Allow message requests from</Text>
              <Text style={styles.settingValue}>{getRequestsLabel(settings.messageRequestsFrom)}</Text>
            </View>
            <ChevronRight size={20} color="#A8A8A8" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Screenshot protection</Text>
              <Text style={styles.settingDescription}>
                Prevent screenshots of inbox messages
              </Text>
            </View>
            <Switch
              value={settings.screenshotProtection}
              onValueChange={toggleScreenshotProtection}
              trackColor={{ false: '#3A3A3C', true: '#0A84FF' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#3A3A3C"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calling</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable audio and video calling</Text>
              <Text style={styles.settingDescription}>
                Allow calls in direct messages
              </Text>
            </View>
            <Switch
              value={settings.audioVideoCallingEnabled}
              onValueChange={toggleAudioVideoCalling}
              trackColor={{ false: '#3A3A3C', true: '#0A84FF' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#3A3A3C"
            />
          </View>

          {settings.audioVideoCallingEnabled && (
            <>
              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setShowCallPermissionModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Who can call you</Text>
                  <Text style={styles.settingValue}>{getCallPermissionLabel(settings.callPermission)}</Text>
                </View>
                <ChevronRight size={20} color="#A8A8A8" strokeWidth={2} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Always relay calls</Text>
                  <Text style={styles.settingDescription}>
                    Hide your IP address from contacts
                  </Text>
                </View>
                <Switch
                  value={settings.alwaysRelayCalls}
                  onValueChange={toggleRelayCalls}
                  trackColor={{ false: '#3A3A3C', true: '#0A84FF' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#3A3A3C"
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            These settings help you control who can contact you and how they can reach you on VibeSync.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showRequestsModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowRequestsModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowRequestsModal(false)}>
          <Pressable style={styles.optionsModal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Allow message requests from</Text>
            </View>
            {messageRequestOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionRow}
                onPress={() => {
                  updateMessageRequestsFrom(option.value);
                  setShowRequestsModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {settings.messageRequestsFrom === option.value && (
                  <Check size={20} color="#0A84FF" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showCallPermissionModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCallPermissionModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowCallPermissionModal(false)}>
          <Pressable style={styles.optionsModal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Who can call you</Text>
            </View>
            {callPermissionOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionRow}
                onPress={() => {
                  updateCallPermission(option.value);
                  setShowCallPermissionModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {settings.callPermission === option.value && (
                  <Check size={20} color="#0A84FF" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 0.5,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#A8A8A8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: '#A8A8A8',
    marginTop: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#A8A8A8',
    marginTop: 2,
    lineHeight: 18,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#1A1A1A',
    marginVertical: 4,
  },
  infoBox: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#A8A8A8',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModal: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  optionLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },
});
