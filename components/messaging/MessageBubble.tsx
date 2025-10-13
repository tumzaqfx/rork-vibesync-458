import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Message } from '@/types/messaging';
import { Heart, Reply, Forward, Copy, Trash2, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';

interface MessageBubbleProps {
  message: Message;
  isMyMessage: boolean;
  senderAvatar?: string;
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onLongPress?: (message: Message) => void;
}

export function MessageBubble({
  message,
  isMyMessage,
  senderAvatar,
  onReact,
  onReply,
  onForward,
  onDelete,
  onLongPress,
}: MessageBubbleProps) {
  const { colors } = useTheme();
  const [showActions, setShowActions] = useState(false);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDoubleTap = () => {
    if (onReact) {
      onReact(message.id, '❤️');
    }
  };

  const handleLongPress = () => {
    setShowActions(true);
    if (onLongPress) {
      onLongPress(message);
    }
  };

  const renderMessageContent = () => {
    if (message.deletedForEveryone) {
      return (
        <View style={[styles.deletedMessage, { backgroundColor: colors.card }]}>
          <Text style={[styles.deletedText, { color: colors.textSecondary }]}>
            🚫 This message was deleted
          </Text>
        </View>
      );
    }

    switch (message.type) {
      case 'image':
        return (
          <View style={styles.mediaContainer}>
            {message.mediaUrl && (
              <Image
                source={{ uri: message.mediaUrl }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            )}
            {message.content && (
              <Text style={[styles.messageText, { color: isMyMessage ? '#FFFFFF' : colors.text }]}>
                {message.content}
              </Text>
            )}
          </View>
        );

      case 'video':
        return (
          <View style={styles.mediaContainer}>
            {message.thumbnailUrl && (
              <Image
                source={{ uri: message.thumbnailUrl }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.videoOverlay}>
              <Text style={styles.videoIcon}>▶️</Text>
            </View>
            {message.content && (
              <Text style={[styles.messageText, { color: isMyMessage ? '#FFFFFF' : colors.text }]}>
                {message.content}
              </Text>
            )}
          </View>
        );

      case 'voice':
        return (
          <View style={styles.voiceContainer}>
            <View style={[styles.voiceIcon, { backgroundColor: isMyMessage ? 'rgba(255,255,255,0.2)' : colors.primary }]}>
              <Text style={styles.voiceIconText}>🎤</Text>
            </View>
            <View style={styles.voiceWaveform}>
              {[...Array(20)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveformBar,
                    {
                      height: Math.random() * 20 + 10,
                      backgroundColor: isMyMessage ? 'rgba(255,255,255,0.6)' : colors.primary,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.voiceDuration, { color: isMyMessage ? '#FFFFFF' : colors.text }]}>
              {message.duration || 0}s
            </Text>
          </View>
        );

      case 'gif':
      case 'sticker':
        return (
          <View style={styles.mediaContainer}>
            {message.mediaUrl && (
              <Image
                source={{ uri: message.mediaUrl }}
                style={[styles.messageImage, message.type === 'sticker' && styles.stickerImage]}
                resizeMode="contain"
              />
            )}
          </View>
        );

      case 'file':
        return (
          <View style={styles.fileContainer}>
            <View style={[styles.fileIcon, { backgroundColor: isMyMessage ? 'rgba(255,255,255,0.2)' : colors.card }]}>
              <Text style={styles.fileIconText}>📎</Text>
            </View>
            <View style={styles.fileInfo}>
              <Text style={[styles.fileName, { color: isMyMessage ? '#FFFFFF' : colors.text }]} numberOfLines={1}>
                {message.fileName || 'File'}
              </Text>
              {message.fileSize && (
                <Text style={[styles.fileSize, { color: isMyMessage ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>
                  {(message.fileSize / 1024).toFixed(1)} KB
                </Text>
              )}
            </View>
          </View>
        );

      default:
        return (
          <Text style={[styles.messageText, { color: isMyMessage ? '#FFFFFF' : colors.text }]}>
            {message.content}
          </Text>
        );
    }
  };

  const renderReactions = () => {
    if (message.reactions.length === 0) return null;

    const reactionCounts = message.reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <View style={[styles.reactionsContainer, isMyMessage && styles.reactionsRight]}>
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <View key={emoji} style={[styles.reactionBubble, { backgroundColor: colors.card }]}>
            <Text style={styles.reactionEmoji}>{emoji}</Text>
            {count > 1 && <Text style={[styles.reactionCount, { color: colors.text }]}>{count}</Text>}
          </View>
        ))}
      </View>
    );
  };

  const renderReplyPreview = () => {
    if (!message.replyTo) return null;

    return (
      <View style={[styles.replyPreview, { backgroundColor: isMyMessage ? 'rgba(255,255,255,0.2)' : colors.card }]}>
        <View style={[styles.replyLine, { backgroundColor: colors.primary }]} />
        <View style={styles.replyContent}>
          <Text style={[styles.replyAuthor, { color: colors.primary }]}>Original Message</Text>
          <Text style={[styles.replyText, { color: isMyMessage ? 'rgba(255,255,255,0.8)' : colors.textSecondary }]} numberOfLines={2}>
            Reply preview text...
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, isMyMessage && styles.myMessageContainer]}>
      {!isMyMessage && senderAvatar && (
        <Avatar uri={senderAvatar} size={32} style={styles.avatar} />
      )}

      <View style={styles.messageWrapper}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleDoubleTap}
          onLongPress={handleLongPress}
          delayLongPress={500}
        >
          <View
            style={[
              styles.messageBubble,
              isMyMessage
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            {renderReplyPreview()}
            {renderMessageContent()}
            <View style={styles.messageFooter}>
              <Text
                style={[
                  styles.messageTime,
                  { color: isMyMessage ? 'rgba(255,255,255,0.7)' : colors.textSecondary },
                ]}
              >
                {formatTime(message.createdAt)}
              </Text>
              {isMyMessage && (
                <Text style={styles.messageStatus}>
                  {message.status === 'seen' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {renderReactions()}

        {showActions && (
          <View style={[styles.quickActions, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (onReact) onReact(message.id, '❤️');
                setShowActions(false);
              }}
            >
              <Heart size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (onReply) onReply(message);
                setShowActions(false);
              }}
            >
              <Reply size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (onForward) onForward(message);
                setShowActions(false);
              }}
            >
              <Forward size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                console.log('Copy message');
                setShowActions(false);
              }}
            >
              <Copy size={18} color={colors.text} />
            </TouchableOpacity>
            {isMyMessage && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  if (onDelete) onDelete(message.id);
                  setShowActions(false);
                }}
              >
                <Trash2 size={18} color={colors.error} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowActions(false)}
            >
              <MoreHorizontal size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    marginRight: 8,
  },
  messageWrapper: {
    maxWidth: '75%',
    position: 'relative',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  messageStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  mediaContainer: {
    overflow: 'hidden',
  },
  messageImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 8,
  },
  stickerImage: {
    width: 150,
    height: 150,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  videoIcon: {
    fontSize: 48,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 200,
  },
  voiceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIconText: {
    fontSize: 18,
  },
  voiceWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 30,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  voiceDuration: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 200,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIconText: {
    fontSize: 20,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
  },
  deletedMessage: {
    padding: 12,
    borderRadius: 8,
  },
  deletedText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  replyPreview: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 8,
  },
  replyLine: {
    width: 3,
    borderRadius: 2,
  },
  replyContent: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  reactionsRight: {
    justifyContent: 'flex-end',
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 8,
    borderRadius: 20,
    padding: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
