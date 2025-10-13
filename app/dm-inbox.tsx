import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  PanResponder,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDM } from '@/hooks/dm-store';
import { useTheme } from '@/hooks/theme-store';
import { Avatar } from '@/components/ui/Avatar';
import { ChevronDown, Camera, Send, ArrowLeft, Menu, Settings } from 'lucide-react-native';
import { Conversation } from '@/types/messaging';
import { mockUsers } from '@/mocks/users';

export default function DMInboxScreen() {
  const { colors, isDark } = useTheme();
  const {
    getActiveConversations,
    getTotalUnreadCount,
    selectConversation,
    toggleMute,
    deleteConversation,
    markAsRead,
  } = useDM();

  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const conversations = getActiveConversations();
  const totalUnread = getTotalUnreadCount();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${days}d ago`;
  };

  const handleConversationPress = (conversation: Conversation) => {
    selectConversation(conversation.id);
    router.push(`/chat/${conversation.id}`);
  };

  const getOtherUser = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find(id => id !== 'current-user');
    return mockUsers.find(u => u.id === otherUserId) || mockUsers[0];
  };

  const isUserActive = (userId: string) => {
    return ['user-2', 'user-3', 'user-8'].includes(userId);
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.name || 'Group Chat';
    }
    const user = getOtherUser(conversation);
    return user.displayName;
  };

  const getConversationImage = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.image;
    }
    const user = getOtherUser(conversation);
    return user.profileImage;
  };

  const getLastMessageText = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'Tap to chat';

    const msg = conversation.lastMessage;
    const isMe = msg.senderId === 'current-user';

    if (msg.deletedForEveryone) return 'This message was deleted';

    switch (msg.type) {
      case 'image':
        return isMe ? 'Sent a photo' : 'Sent a photo';
      case 'video':
        return isMe ? 'Sent a video' : 'Sent a video';
      case 'voice':
        return isMe ? 'Sent a voice message' : 'Sent a voice message';
      default:
        return msg.content;
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherUser = getOtherUser(item);
    const isActive = isUserActive(otherUser.id);

    return (
      <SwipeableRow
        conversationId={item.id}
        onMute={() => toggleMute(item.id)}
        onDelete={() => deleteConversation(item.id)}
        onMarkUnread={() => markAsRead(item.id)}
      >
        <TouchableOpacity
          style={styles.conversationItem}
          onPress={() => handleConversationPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <Avatar uri={getConversationImage(item)} size={56} />
            {isActive && <View style={styles.activeDot} />}
          </View>

          <View style={styles.conversationContent}>
            <View style={styles.conversationHeader}>
              <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                {getConversationName(item)}
              </Text>
              {item.lastMessage && (
                <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                  {formatTime(new Date(item.lastMessage.createdAt))}
                </Text>
              )}
            </View>

            <View style={styles.messagePreview}>
              <Text
                style={[
                  styles.lastMessage,
                  { color: colors.textSecondary },
                  item.unreadCount > 0 && { fontWeight: '600', color: colors.text },
                ]}
                numberOfLines={1}
              >
                {isActive && item.unreadCount === 0 ? 'Active now' : getLastMessageText(item)}
              </Text>
              {isActive && item.unreadCount === 0 && <View style={styles.activeIndicator} />}
            </View>
          </View>

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={(e) => {
              e.stopPropagation();
              router.push('/status/create');
            }}
          >
            <Camera size={24} color={colors.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
        </TouchableOpacity>
      </SwipeableRow>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.usernameContainer}
            onPress={() => setShowAccountSwitcher(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.username, { color: colors.text }]}>itumeleng_jay</Text>
            <ChevronDown size={18} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push('/messages-settings')}
              activeOpacity={0.7}
            >
              <Settings size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.messageIconButton}
              onPress={() => router.push('/inbox')}
              activeOpacity={0.7}
            >
              <Send size={24} color={colors.text} strokeWidth={2} />
              {totalUnread > 0 && <View style={styles.unreadBadge} />}
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8, backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={styles.bottomNavButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={26} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomNavButton}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <Menu size={26} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showAccountSwitcher}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAccountSwitcher(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowAccountSwitcher(false)}>
          <Pressable style={[styles.accountSwitcherModal, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.accountSwitcherHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.accountSwitcherTitle, { color: colors.text }]}>Switch Account</Text>
            </View>
            <TouchableOpacity
              style={[styles.accountOption, { borderBottomColor: colors.border }]}
              onPress={() => setShowAccountSwitcher(false)}
            >
              <Avatar uri={mockUsers[0].profileImage} size={40} />
              <View style={styles.accountInfo}>
                <Text style={[styles.accountName, { color: colors.text }]}>itumeleng_jay</Text>
                <Text style={[styles.accountStatus, { color: colors.textSecondary }]}>Current account</Text>
              </View>
              <View style={[styles.checkmark, { borderColor: colors.text }]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.accountOption, { borderBottomColor: colors.border }]}
              onPress={() => setShowAccountSwitcher(false)}
            >
              <Avatar uri={mockUsers[1].profileImage} size={40} />
              <View style={styles.accountInfo}>
                <Text style={[styles.accountName, { color: colors.text }]}>vibesync_official</Text>
                <Text style={[styles.accountStatus, { color: colors.textSecondary }]}>Switch to this account</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addAccountButton}
              onPress={() => setShowAccountSwitcher(false)}
            >
              <Text style={[styles.addAccountText, { color: colors.primary }]}>Add Account</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

interface SwipeableRowProps {
  children: React.ReactNode;
  conversationId: string;
  onMute: () => void;
  onDelete: () => void;
  onMarkUnread: () => void;
}

function SwipeableRow({ children, conversationId, onMute, onDelete, onMarkUnread }: SwipeableRowProps) {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -160));
        } else if (gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx, 80));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -80) {
          Animated.spring(translateX, {
            toValue: -160,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx > 40) {
          Animated.spring(translateX, {
            toValue: 80,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleMute = () => {
    onMute();
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleDelete = () => {
    onDelete();
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleMarkUnread = () => {
    onMarkUnread();
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.swipeableContainer}>
      <View style={styles.leftActions}>
        <TouchableOpacity style={[styles.markUnreadButton, { backgroundColor: colors.primary }]} onPress={handleMarkUnread}>
          <Text style={[styles.actionText, { color: colors.textInverse }]}>Unread</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity style={[styles.muteButton, { backgroundColor: colors.textSecondary }]} onPress={handleMute}>
          <Text style={[styles.actionText, { color: colors.textInverse }]}>Mute</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.deleteButton, { backgroundColor: colors.error }]} onPress={handleDelete}>
          <Text style={[styles.actionText, { color: colors.textInverse }]}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.swipeableContent,
          {
            transform: [{ translateX }],
            backgroundColor: colors.background,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    padding: 4,
  },
  messageIconButton: {
    padding: 4,
    position: 'relative',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    position: 'absolute',
    top: 2,
    right: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  swipeableContainer: {
    position: 'relative',
  },
  leftActions: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  markUnreadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  muteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  swipeableContent: {
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#44b700',
    borderWidth: 2.5,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600' as const,
    flex: 1,
  },
  timestamp: {
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '400' as const,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    fontWeight: '400' as const,
  },
  unreadMessage: {
    fontWeight: '600' as const,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#44b700',
  },
  cameraButton: {
    padding: 6,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountSwitcherModal: {
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  accountSwitcherHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  accountSwitcherTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    textAlign: 'center',
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  accountInfo: {
    flex: 1,
    marginLeft: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  accountStatus: {
    fontSize: 13,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0A84FF',
    borderWidth: 2,
  },
  addAccountButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  addAccountText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 0.5,
  },
  bottomNavButton: {
    padding: 8,
  },
});
