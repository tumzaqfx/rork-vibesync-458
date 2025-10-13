import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  ScrollView,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { TagSettings, TagPrivacySetting } from '@/types/tag';
import { useTagging } from '@/hooks/tagging-store';

type TagSettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function TagSettingsModal({
  visible,
  onClose,
}: TagSettingsModalProps) {
  const { tagSettings, saveSettings, loadSettings } = useTagging();
  const [localSettings, setLocalSettings] = useState<TagSettings>(tagSettings);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible, loadSettings]);

  useEffect(() => {
    setLocalSettings(tagSettings);
  }, [tagSettings]);

  const handleSave = async () => {
    await saveSettings(localSettings);
    onClose();
  };

  const handlePrivacyChange = (setting: TagPrivacySetting) => {
    setLocalSettings(prev => ({ ...prev, whoCanTagMe: setting }));
  };

  const handleReviewToggle = (value: boolean) => {
    setLocalSettings(prev => ({ ...prev, reviewTagsBeforeShowing: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tag Settings</Text>
            <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
              <Check size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Who can tag me</Text>
              <Text style={styles.sectionDescription}>
                Control who can tag you in photos, videos, and stories
              </Text>

              <TouchableOpacity
                style={styles.option}
                onPress={() => handlePrivacyChange('everyone')}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>Everyone</Text>
                  <Text style={styles.optionDescription}>
                    Anyone can tag you
                  </Text>
                </View>
                {localSettings.whoCanTagMe === 'everyone' && (
                  <View style={styles.checkmark}>
                    <Check size={20} color="#007AFF" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => handlePrivacyChange('following')}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>People I Follow</Text>
                  <Text style={styles.optionDescription}>
                    Only people you follow can tag you
                  </Text>
                </View>
                {localSettings.whoCanTagMe === 'following' && (
                  <View style={styles.checkmark}>
                    <Check size={20} color="#007AFF" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => handlePrivacyChange('no-one')}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>No One</Text>
                  <Text style={styles.optionDescription}>
                    Disable tagging completely
                  </Text>
                </View>
                {localSettings.whoCanTagMe === 'no-one' && (
                  <View style={styles.checkmark}>
                    <Check size={20} color="#007AFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <View style={styles.toggleOption}>
                <View style={styles.toggleContent}>
                  <Text style={styles.optionText}>Review Tags</Text>
                  <Text style={styles.optionDescription}>
                    Manually approve tags before they appear on your profile
                  </Text>
                </View>
                <Switch
                  value={localSettings.reviewTagsBeforeShowing}
                  onValueChange={handleReviewToggle}
                  trackColor={{ false: '#333', true: '#007AFF' }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                When review is enabled, you&apos;ll receive notifications for pending
                tags. You can approve or reject them from the notifications tab.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    marginLeft: 12,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  toggleContent: {
    flex: 1,
    marginRight: 12,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
