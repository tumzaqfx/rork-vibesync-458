import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Monitor, Smartphone, X, LogOut } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ActiveSession {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  location: string;
  lastActive: string;
  isCurrent: boolean;
  ipAddress: string;
}

interface ActiveSessionsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SESSIONS_KEY = '@vibesync_active_sessions';

export default function ActiveSessionsModal({ visible, onClose }: ActiveSessionsModalProps) {
  const { colors } = useTheme();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  useEffect(() => {
    if (visible) {
      loadSessions();
    }
  }, [visible]);

  const loadSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem(SESSIONS_KEY);
      if (stored) {
        setSessions(JSON.parse(stored));
      } else {
        const mockSessions: ActiveSession[] = [
          {
            id: '1',
            deviceName: 'iPhone 14 Pro',
            deviceType: 'mobile',
            location: 'New York, USA',
            lastActive: 'Active now',
            isCurrent: true,
            ipAddress: '192.168.1.1',
          },
          {
            id: '2',
            deviceName: 'MacBook Pro',
            deviceType: 'desktop',
            location: 'New York, USA',
            lastActive: '2 hours ago',
            isCurrent: false,
            ipAddress: '192.168.1.2',
          },
        ];
        setSessions(mockSessions);
        await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(mockSessions));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleLogoutSession = (sessionId: string) => {
    Alert.alert(
      'Logout Session',
      'Are you sure you want to logout this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const updatedSessions = sessions.filter(s => s.id !== sessionId);
            setSessions(updatedSessions);
            await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
            Alert.alert('Success', 'Device logged out successfully');
          },
        },
      ]
    );
  };

  const handleLogoutAllOthers = () => {
    Alert.alert(
      'Logout All Other Devices',
      'This will logout all devices except this one.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout All',
          style: 'destructive',
          onPress: async () => {
            const currentSession = sessions.filter(s => s.isCurrent);
            setSessions(currentSession);
            await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(currentSession));
            Alert.alert('Success', 'All other devices logged out');
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.container, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Active Sessions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {sessions.map((session) => (
              <View key={session.id} style={[styles.sessionCard, { backgroundColor: colors.cardLight }]}>
                <View style={styles.sessionHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.glass }]}>
                    {session.deviceType === 'mobile' ? (
                      <Smartphone size={20} color={colors.primary} />
                    ) : (
                      <Monitor size={20} color={colors.primary} />
                    )}
                  </View>
                  <View style={styles.sessionInfo}>
                    <View style={styles.deviceRow}>
                      <Text style={[styles.deviceName, { color: colors.text }]}>{session.deviceName}</Text>
                      {session.isCurrent && (
                        <View style={[styles.currentBadge, { backgroundColor: colors.success }]}>
                          <Text style={[styles.currentText, { color: colors.textInverse }]}>Current</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.location, { color: colors.textSecondary }]}>{session.location}</Text>
                    <Text style={[styles.lastActive, { color: colors.textSecondary }]}>{session.lastActive}</Text>
                    <Text style={[styles.ipAddress, { color: colors.textMuted }]}>IP: {session.ipAddress}</Text>
                  </View>
                </View>

                {!session.isCurrent && (
                  <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: colors.error + '20' }]}
                    onPress={() => handleLogoutSession(session.id)}
                  >
                    <LogOut size={16} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          {sessions.filter(s => !s.isCurrent).length > 0 && (
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.logoutAllButton, { backgroundColor: colors.error }]}
                onPress={handleLogoutAllOthers}
              >
                <LogOut size={18} color={colors.textInverse} />
                <Text style={[styles.logoutAllText, { color: colors.textInverse }]}>
                  Logout All Other Devices
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  sessionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  location: {
    fontSize: 14,
    marginBottom: 2,
  },
  lastActive: {
    fontSize: 13,
    marginBottom: 2,
  },
  ipAddress: {
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  logoutAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutAllText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
