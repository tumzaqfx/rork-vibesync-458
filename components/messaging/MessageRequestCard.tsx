import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Check, X, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { Avatar } from '@/components/ui/Avatar';
import { Conversation } from '@/types/messaging';

interface MessageRequestCardProps {
  conversation: Conversation;
  senderName: string;
  senderImage: string;
  senderUsername: string;
  onAccept: () => void;
  onDecline: () => void;
  onViewProfile: () => void;
}

export function MessageRequestCard({
  conversation,
  senderName,
  senderImage,
  senderUsername,
  onAccept,
  onDecline,
  onViewProfile,
}: MessageRequestCardProps) {
  const { colors } = useTheme();

  const getLastMessagePreview = () => {
    if (!conversation.lastMessage) return 'Sent you a message';
    
    const msg = conversation.lastMessage;
    switch (msg.type) {
      case 'image':
        return '📷 Sent a photo';
      case 'video':
        return '🎥 Sent a video';
      case 'voice':
        return '🎤 Sent a voice message';
      case 'gif':
        return 'Sent a GIF';
      case 'sticker':
        return 'Sent a sticker';
      default:
        return msg.content;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onViewProfile} style={styles.profileSection}>
          <Avatar uri={senderImage} size={64} />
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>{senderName}</Text>
            <Text style={[styles.username, { color: colors.textSecondary }]}>@{senderUsername}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.messagePreview, { backgroundColor: colors.background }]}>
        <Text style={[styles.messageText, { color: colors.textSecondary }]} numberOfLines={2}>
          {getLastMessagePreview()}
        </Text>
      </View>

      <View style={[styles.warningBanner, { backgroundColor: colors.glass }]}>
        <AlertCircle size={16} color={colors.warning} />
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          You don&apos;t follow each other
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton, { backgroundColor: colors.background }]}
          onPress={onDecline}
        >
          <X size={20} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton, { backgroundColor: colors.primary }]}
          onPress={onAccept}
        >
          <Check size={20} color="#fff" />
          <Text style={[styles.actionText, { color: '#fff' }]}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
  },
  messagePreview: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  declineButton: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  acceptButton: {},
  actionText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
