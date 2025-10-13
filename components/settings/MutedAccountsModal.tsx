import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { VolumeX, X, Search, Volume2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from '@/components/ui/Avatar';

interface MutedUser {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
  mutedAt: string;
  muteType: 'posts' | 'stories' | 'all';
}

interface MutedAccountsModalProps {
  visible: boolean;
  onClose: () => void;
}

const MUTED_KEY = '@vibesync_muted_accounts';

export default function MutedAccountsModal({ visible, onClose }: MutedAccountsModalProps) {
  const { colors } = useTheme();
  const [mutedUsers, setMutedUsers] = useState<MutedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible) {
      loadMutedUsers();
    }
  }, [visible]);

  const loadMutedUsers = async () => {
    try {
      const stored = await AsyncStorage.getItem(MUTED_KEY);
      if (stored) {
        setMutedUsers(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading muted users:', error);
    }
  };

  const handleUnmute = (userId: string, username: string) => {
    Alert.alert(
      'Unmute User',
      `Are you sure you want to unmute @${username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unmute',
          onPress: async () => {
            const updated = mutedUsers.filter(u => u.id !== userId);
            setMutedUsers(updated);
            await AsyncStorage.setItem(MUTED_KEY, JSON.stringify(updated));
            Alert.alert('Success', `@${username} has been unmuted`);
          },
        },
      ]
    );
  };

  const filteredUsers = mutedUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMuteTypeLabel = (type: string) => {
    switch (type) {
      case 'posts': return 'Posts muted';
      case 'stories': return 'Stories muted';
      case 'all': return 'All content muted';
      default: return 'Muted';
    }
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
            <Text style={[styles.title, { color: colors.text }]}>Muted Accounts</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: colors.cardLight }]}>
              <Search size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search muted accounts..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {filteredUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <VolumeX size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {searchQuery ? 'No muted accounts found' : 'No muted accounts'}
                </Text>
              </View>
            ) : (
              filteredUsers.map((user) => (
                <View key={user.id} style={[styles.userCard, { borderBottomColor: colors.border }]}>
                  <Avatar uri={user.profileImage} size={48} />
                  <View style={styles.userInfo}>
                    <Text style={[styles.displayName, { color: colors.text }]}>{user.displayName}</Text>
                    <Text style={[styles.username, { color: colors.textSecondary }]}>@{user.username}</Text>
                    <Text style={[styles.muteType, { color: colors.textMuted }]}>
                      {getMuteTypeLabel(user.muteType)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.unmuteButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleUnmute(user.id, user.username)}
                  >
                    <Volume2 size={16} color={colors.textInverse} />
                    <Text style={[styles.unmuteText, { color: colors.textInverse }]}>Unmute</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
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
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    marginBottom: 2,
  },
  muteType: {
    fontSize: 12,
  },
  unmuteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unmuteText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
