import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { EyeOff, X, Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface PrivateViewToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const PrivateViewToggle: React.FC<PrivateViewToggleProps> = ({
  isEnabled,
  onToggle,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <EyeOff size={20} color={Colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Private View Mode</Text>
            <Text style={styles.subtitle}>
              Hide your identity when viewing profiles
            </Text>
          </View>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowInfoModal(true)}
          >
            <Info size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={Colors.text}
          ios_backgroundColor={Colors.border}
        />
      </View>

      <Modal
        visible={showInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowInfoModal(false)}
          />
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(6, 182, 212, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalIconContainer}>
                  <EyeOff size={24} color={Colors.primary} />
                </View>
                <Text style={styles.modalTitle}>Private View Mode</Text>
                <TouchableOpacity
                  onPress={() => setShowInfoModal(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>What is Private View Mode?</Text>
                  <Text style={styles.infoText}>
                    When enabled, your profile views will be anonymous. Other users won&apos;t see that you viewed their profile.
                  </Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>How it works:</Text>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.infoText}>
                      Your views won&apos;t appear in other users&apos; &quot;Profile Views&quot; list
                    </Text>
                  </View>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.infoText}>
                      You can still see who viewed your profile
                    </Text>
                  </View>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.infoText}>
                      Toggle on/off anytime in settings
                    </Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Note:</Text>
                  <Text style={styles.infoText}>
                    Private viewing is a premium feature that helps you browse profiles discreetly while maintaining your privacy.
                  </Text>
                </View>
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  infoButton: {
    padding: 4,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: 400,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    color: Colors.primary,
    fontSize: 16,
    marginRight: 8,
    fontWeight: '700' as const,
  },
});
