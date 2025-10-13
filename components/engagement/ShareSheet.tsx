import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import { useMessaging } from '@/hooks/messaging-store';
import {
  X,
  Search,
  Send,
  Flame,
  Laugh,
  Heart,
  Sparkles,
  Check,
} from 'lucide-react-native';
import { User, Post, Vibe } from '@/types';
import { Avatar } from '@/components/ui/Avatar';

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  content: Post | Vibe;
  contentType: 'post' | 'vibe' | 'song';
}

interface QuickVibeReaction {
  id: string;
  emoji: string;
  label: string;
  icon: React.ReactNode;
}

interface ShareContact extends User {
  hasVibeStreak?: boolean;
  lastInteraction?: string;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({
  visible,
  onClose,
  content,
  contentType,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { conversations, createConversation, sendMessage } = useMessaging();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string>('');
  const [quickVibeEnabled, setQuickVibeEnabled] = useState<boolean>(false);
  const [selectedReaction, setSelectedReaction] = useState<string>('🔥');

  const quickVibeReactions: QuickVibeReaction[] = [
    {
      id: 'fire',
      emoji: '🔥',
      label: 'Fire',
      icon: <Flame size={20} color="#FF6B35" />,
    },
    {
      id: 'laugh',
      emoji: '😂',
      label: 'Funny',
      icon: <Laugh size={20} color="#FFD93D" />,
    },
    {
      id: 'love',
      emoji: '💜',
      label: 'Love',
      icon: <Heart size={20} color="#A855F7" />,
    },
    {
      id: 'sparkle',
      emoji: '✨',
      label: 'Amazing',
      icon: <Sparkles size={20} color="#60A5FA" />,
    },
  ];

  const shareContacts: ShareContact[] = useMemo(() => {
    const contacts: ShareContact[] = conversations.map((conv) => {
      const otherUser = conv.participants.find((p) => p.id !== user?.id);
      if (!otherUser) return null;

      const lastMessageTime = new Date(conv.lastMessage.timestamp).getTime();
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const hasVibeStreak = lastMessageTime > sevenDaysAgo;

      return {
        ...otherUser,
        hasVibeStreak,
        lastInteraction: conv.lastMessage.timestamp,
      };
    }).filter(Boolean) as ShareContact[];

    return contacts.sort((a, b) => {
      if (a.hasVibeStreak && !b.hasVibeStreak) return -1;
      if (!a.hasVibeStreak && b.hasVibeStreak) return 1;
      
      const aTime = new Date(a.lastInteraction || 0).getTime();
      const bTime = new Date(b.lastInteraction || 0).getTime();
      return bTime - aTime;
    });
  }, [conversations, user]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return shareContacts;
    
    const query = searchQuery.toLowerCase();
    return shareContacts.filter(
      (contact) =>
        contact.displayName.toLowerCase().includes(query) ||
        contact.username.toLowerCase().includes(query)
    );
  }, [shareContacts, searchQuery]);

  const frequentContacts = useMemo(() => {
    return shareContacts.slice(0, 8);
  }, [shareContacts]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleShare = async () => {
    if (selectedUsers.size === 0) return;

    const shareContent = quickVibeEnabled && !message.trim()
      ? `${selectedReaction} Check this out!`
      : message.trim() || 'Check this out!';

    const contentUrl = contentType === 'post' 
      ? `vibesync://post/${content.id}`
      : contentType === 'vibe'
      ? `vibesync://vibe/${content.id}`
      : `vibesync://song/${content.id}`;

    const fullMessage = `${shareContent}\n\n${contentUrl}`;

    for (const userId of Array.from(selectedUsers)) {
      const conversation = conversations.find((conv) =>
        conv.participants.some((p) => p.id === userId)
      );

      if (conversation) {
        await sendMessage(conversation.id, fullMessage);
      } else {
        const contact = shareContacts.find((c) => c.id === userId);
        if (contact) {
          const newConv = createConversation(contact);
          await sendMessage(newConv.id, fullMessage);
        }
      }
    }

    console.log(`[ShareSheet] Shared ${contentType} with ${selectedUsers.size} users`);
    
    setSelectedUsers(new Set());
    setMessage('');
    setSearchQuery('');
    setQuickVibeEnabled(false);
    onClose();
  };

  const getContentThumbnail = () => {
    if (contentType === 'post') {
      const post = content as Post;
      return post.image || post.video || null;
    } else if (contentType === 'vibe') {
      const vibe = content as Vibe;
      return vibe.thumbnailUrl || vibe.videoUrl || null;
    }
    return null;
  };

  const getContentPreview = () => {
    if (contentType === 'post') {
      const post = content as Post;
      return post.content.substring(0, 60) + (post.content.length > 60 ? '...' : '');
    } else if (contentType === 'vibe') {
      const vibe = content as Vibe;
      return vibe.caption.substring(0, 60) + (vibe.caption.length > 60 ? '...' : '');
    }
    return 'Shared content';
  };

  const renderFrequentContact = ({ item }: { item: ShareContact }) => {
    const isSelected = selectedUsers.has(item.id);

    return (
      <TouchableOpacity
        style={styles.frequentContact}
        onPress={() => toggleUserSelection(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.frequentAvatarContainer}>
          <Avatar
            source={item.profileImage}
            size={56}
          />
          {item.hasVibeStreak && (
            <View style={[styles.vibeStreakBadge, { backgroundColor: colors.primary }]}>
              <Flame size={12} color="#FFF" />
            </View>
          )}
          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
              <Check size={16} color="#FFF" />
            </View>
          )}
        </View>
        <Text
          style={[styles.frequentContactName, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.displayName.split(' ')[0]}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderContact = ({ item }: { item: ShareContact }) => {
    const isSelected = selectedUsers.has(item.id);

    return (
      <TouchableOpacity
        style={styles.gridContactItem}
        onPress={() => toggleUserSelection(item.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.gridAvatarContainer,
            isSelected && {
              borderColor: colors.primary,
              borderWidth: 3,
            },
          ]}
        >
          <Avatar
            source={item.profileImage}
            size={64}
          />
          {item.hasVibeStreak && (
            <View style={[styles.vibeStreakGrid, { backgroundColor: colors.primary }]}>
              <Flame size={10} color="#FFF" />
            </View>
          )}
          {isSelected && (
            <View style={[styles.selectedOverlay, { backgroundColor: colors.primary + '40' }]}>
              <View style={[styles.selectedCheckGrid, { backgroundColor: colors.primary }]}>
                <Check size={18} color="#FFF" />
              </View>
            </View>
          )}
        </View>
        <Text
          style={[styles.gridContactName, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.displayName.split(' ')[0]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />

        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.container}
        >
          <View
            style={[
              styles.sheetContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Share to
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.contentPreview}>
              {getContentThumbnail() && (
                <Image
                  source={{ uri: getContentThumbnail()! }}
                  style={styles.previewThumbnail}
                />
              )}
              <View style={styles.previewTextContainer}>
                <Text style={[styles.previewType, { color: colors.textSecondary }]}>
                  {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                </Text>
                <Text style={[styles.previewText, { color: colors.text }]} numberOfLines={2}>
                  {getContentPreview()}
                </Text>
              </View>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
              <Search size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search friends..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {!searchQuery && (
              <View style={styles.frequentSection}>
                <FlatList
                  data={frequentContacts}
                  renderItem={renderFrequentContact}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.frequentList}
                />
              </View>
            )}

            <FlatList
              data={filteredContacts}
              renderItem={renderContact}
              keyExtractor={(item) => item.id}
              numColumns={4}
              key="grid-4-columns"
              style={styles.contactsList}
              contentContainerStyle={styles.contactsGridContent}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.gridRow}
            />

            <View style={styles.quickVibeSection}>
              <TouchableOpacity
                style={styles.quickVibeToggle}
                onPress={() => setQuickVibeEnabled(!quickVibeEnabled)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    {
                      backgroundColor: quickVibeEnabled
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                >
                  {quickVibeEnabled && <Check size={16} color="#FFF" />}
                </View>
                <Text style={[styles.quickVibeLabel, { color: colors.text }]}>
                  Quick Vibe
                </Text>
              </TouchableOpacity>

              {quickVibeEnabled && (
                <View style={styles.reactionsRow}>
                  {quickVibeReactions.map((reaction) => (
                    <TouchableOpacity
                      key={reaction.id}
                      style={[
                        styles.reactionButton,
                        {
                          backgroundColor:
                            selectedReaction === reaction.emoji
                              ? colors.primary + '20'
                              : colors.card,
                          borderColor:
                            selectedReaction === reaction.emoji
                              ? colors.primary
                              : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedReaction(reaction.emoji)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.bottomSection}>
              <View style={[styles.messageInputContainer, { backgroundColor: colors.card }]}>
                <TextInput
                  style={[styles.messageInput, { color: colors.text }]}
                  placeholder={quickVibeEnabled ? "Optional message..." : "Write a message..."}
                  placeholderTextColor={colors.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={200}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  {
                    backgroundColor:
                      selectedUsers.size > 0 ? colors.primary : colors.border,
                  },
                ]}
                onPress={handleShare}
                disabled={selectedUsers.size === 0}
                activeOpacity={0.8}
              >
                <Send size={20} color="#FFF" />
                {selectedUsers.size > 0 && (
                  <View style={styles.selectedCount}>
                    <Text style={styles.selectedCountText}>
                      {selectedUsers.size}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  contentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  previewThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewTextContainer: {
    flex: 1,
    gap: 4,
  },
  previewType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  frequentSection: {
    marginBottom: 16,
  },
  frequentList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  frequentContact: {
    alignItems: 'center',
    gap: 8,
    width: 64,
  },
  frequentAvatarContainer: {
    position: 'relative',
  },
  vibeStreakBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  selectedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  frequentContactName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  contactsList: {
    flex: 1,
  },
  contactsGridContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  gridContactItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: '22%',
  },
  gridAvatarContainer: {
    position: 'relative',
    borderRadius: 32,
    marginBottom: 6,
  },
  vibeStreakGrid: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckGrid: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  gridContactName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  contactAvatarContainer: {
    position: 'relative',
  },
  vibeStreakSmall: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactUsername: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickVibeSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  quickVibeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickVibeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  reactionButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  reactionEmoji: {
    fontSize: 28,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    gap: 12,
  },
  messageInputContainer: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    maxHeight: 100,
  },
  messageInput: {
    fontSize: 16,
    fontWeight: '500',
  },
  sendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  selectedCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
