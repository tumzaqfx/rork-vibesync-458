import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useDM } from '@/hooks/dm-store';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Search, 
  Edit3, 
  MoreHorizontal,
  Settings,
  X,
  UserPlus,
  Users,
  ChevronDown,
} from 'lucide-react-native';
import { Conversation } from '@/types/messaging';
import { mockUsers } from '@/mocks/users';
import { useTheme } from '@/hooks/theme-store';
import { MessageRequestCard } from '@/components/messaging/MessageRequestCard';


export default function InboxScreen() {
  const { colors } = useTheme();
  const { 
    getActiveConversations,
    getMessageRequests,
    getTotalUnreadCount,
    selectConversation,
    togglePin,
    toggleMute,
    archiveConversation,
    deleteConversation,
    acceptRequest,
    declineRequest,
  } = useDM();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const conversations = showRequests ? getMessageRequests() : getActiveConversations();
  const requestCount = getMessageRequests().length;
  const totalUnread = getTotalUnreadCount();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleConversationPress = (conversation: Conversation) => {
    selectConversation(conversation.id);
    router.push(`/chat/${conversation.id}`);
  };

  const getOtherUser = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find(id => id !== 'current-user');
    return mockUsers.find(u => u.id === otherUserId) || mockUsers[0];
  };

  const isUserOnline = (userId: string) => {
    return Math.random() > 0.5;
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
    const prefix = isMe ? 'You: ' : '';
    
    if (msg.deletedForEveryone) return '🚫 This message was deleted';
    
    switch (msg.type) {
      case 'image':
        return `${prefix}📷 Photo`;
      case 'video':
        return `${prefix}🎥 Video`;
      case 'voice':
        return `${prefix}🎤 Voice message`;
      default:
        return `${prefix}${msg.content}`;
    }
  };



  const renderConversation = ({ item }: { item: Conversation }) => {
    if (showRequests && item.isRequest) {
      const otherUser = getOtherUser(item);
      return (
        <MessageRequestCard
          conversation={item}
          senderName={otherUser.displayName}
          senderImage={otherUser.profileImage || ''}
          senderUsername={otherUser.username}
          onAccept={() => {
            acceptRequest(item.id);
          }}
          onDecline={() => {
            declineRequest(item.id);
          }}
          onViewProfile={() => {
            router.push(`/user/${otherUser.id}`);
          }}
        />
      );
    }

    const otherUser = getOtherUser(item);
    const isOnline = isUserOnline(otherUser.id);

    return (
      <TouchableOpacity
        style={[styles.conversationItem, { backgroundColor: colors.background }]}
        onPress={() => handleConversationPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.avatarContainer}>
          <Avatar
            uri={getConversationImage(item)}
            size={56}
          />
          {isOnline && (
            <View style={[styles.onlineDot, { backgroundColor: '#44b700' }]} />
          )}
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <View style={styles.nameContainer}>
              <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                {getConversationName(item)}
              </Text>
              {isOnline && (
                <View style={styles.onlineBadge}>
                  <Text style={styles.onlineBadgeText}>Active</Text>
                </View>
              )}
            </View>
            <View style={styles.headerRight}>
              {item.lastMessage && (
                <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                  {formatTime(new Date(item.lastMessage.createdAt))}
                </Text>
              )}
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => setShowSettingsModal(true)}
              >
                <MoreHorizontal size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.messagePreview}>
            <Text 
              style={[
                styles.lastMessage,
                { color: colors.textSecondary },
                item.unreadCount > 0 && [styles.unreadMessage, { color: colors.text }]
              ]}
              numberOfLines={1}
            >
              {getLastMessageText(item)}
            </Text>
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const name = getConversationName(conv).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Messages',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { 
            color: colors.text,
            fontSize: 22,
            fontWeight: 'bold' as const,
          },
          headerTintColor: colors.text,
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/messages-settings')}
              >
                <Settings size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowNewChatModal(true)}
              >
                <Edit3 size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {requestCount > 0 && !showRequests && (
        <TouchableOpacity 
          style={[styles.requestsBanner, { backgroundColor: colors.background, borderBottomColor: colors.border }]}
          onPress={() => setShowRequests(true)}
        >
          <View style={styles.requestsLeft}>
            <Text style={[styles.requestsText, { color: colors.text }]}>
              Message Requests
            </Text>
            <Text style={[styles.requestsCount, { color: colors.primary }]}>
              {requestCount}
            </Text>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} style={{ transform: [{ rotate: '-90deg' }] }} />
        </TouchableOpacity>
      )}

      {showRequests && (
        <View style={[styles.requestsHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setShowRequests(false)}>
            <Text style={[styles.backToInbox, { color: colors.primary }]}>‹ Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.card }]}>
            <Edit3 size={64} color={colors.textSecondary} strokeWidth={1.5} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {searchQuery ? 'No results found' : showRequests ? 'No message requests' : 'No messages yet'}
          </Text>
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
            {searchQuery 
              ? 'Try searching for something else' 
              : showRequests
              ? 'Message requests from people you don\'t follow will appear here'
              : 'Send a message to start a conversation'}
          </Text>
          {!searchQuery && !showRequests && (
            <TouchableOpacity 
              style={[styles.sendMessageButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowNewChatModal(true)}
            >
              <Text style={styles.sendMessageButtonText}>Send Message</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}

      <Modal
        visible={showNewChatModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNewChatModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowNewChatModal(false)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Message</Text>
              <TouchableOpacity onPress={() => setShowNewChatModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={[styles.searchBar, { backgroundColor: colors.background, marginHorizontal: 16, marginBottom: 16 }]}>
                <Search size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search people to message..."
                  placeholderTextColor={colors.textSecondary}
                  autoFocus
                />
              </View>
              <TouchableOpacity 
                style={[styles.modalOption, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setShowNewChatModal(false);
                }}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: colors.primary }]}>
                  <UserPlus size={24} color="#fff" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={[styles.modalOptionTitle, { color: colors.text }]}>New Chat</Text>
                  <Text style={[styles.modalOptionSubtitle, { color: colors.textSecondary }]}>Start a conversation</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setShowNewChatModal(false);
                }}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: colors.primary }]}>
                  <Users size={24} color="#fff" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={[styles.modalOptionTitle, { color: colors.text }]}>New Group</Text>
                  <Text style={[styles.modalOptionSubtitle, { color: colors.textSecondary }]}>Create a group chat</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowSettingsModal(false)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Message Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TouchableOpacity 
                style={[styles.settingsOption, { borderBottomColor: colors.border }]}
                onPress={() => setShowSettingsModal(false)}
              >
                <Text style={[styles.settingsOptionText, { color: colors.text }]}>Mute notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.settingsOption, { borderBottomColor: colors.border }]}
                onPress={() => setShowSettingsModal(false)}
              >
                <Text style={[styles.settingsOptionText, { color: colors.text }]}>Mark as unread</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.settingsOption, { borderBottomColor: colors.border }]}
                onPress={() => setShowSettingsModal(false)}
              >
                <Text style={[styles.settingsOptionText, { color: colors.text }]}>Archive chat</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.settingsOption}
                onPress={() => setShowSettingsModal(false)}
              >
                <Text style={[styles.settingsOptionText, { color: colors.error }]}>Delete chat</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: 16,
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  requestsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  requestsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requestsText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  requestsCount: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  requestsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backToInbox: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  listContainer: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  onlineBadge: {
    backgroundColor: 'rgba(68, 183, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  onlineBadgeText: {
    color: '#44b700',
    fontSize: 11,
    fontWeight: '600' as const,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    padding: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  timestamp: {
    fontSize: 13,
    marginLeft: 4,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastMessage: {
    fontSize: 15,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600' as const,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700' as const,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  sendMessageButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  sendMessageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  modalBody: {
    paddingTop: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  modalOptionSubtitle: {
    fontSize: 14,
  },
  settingsOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingsOptionText: {
    fontSize: 16,
  },
});
