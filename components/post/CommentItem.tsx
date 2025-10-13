import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { VoicePlayer } from '@/components/ui/VoicePlayer';
import { useTheme } from '@/hooks/theme-store';
import { Comment } from '@/types';
import { Heart, MessageCircle, BadgeCheck } from 'lucide-react-native';

interface CommentItemProps {
  comment: Comment;
  postAuthorId: string;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  onUserPress?: (userId: string) => void;
  testID?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postAuthorId,
  onLike,
  onReply,
  onUserPress,
  testID,
}) => {
  const { colors } = useTheme();
  const isPostAuthor = comment.userId === postAuthorId;

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]} testID={testID}>
      <TouchableOpacity onPress={() => onUserPress?.(comment.userId)}>
        <Avatar uri={comment.profileImage} size={36} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => onUserPress?.(comment.userId)}
          >
            <Text style={[styles.username, { color: colors.text }]}>
              {comment.userDisplayName}
            </Text>
            {comment.isVerified && <VerifiedBadge size={12} />}
            {isPostAuthor && (
              <View style={[styles.authorBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.authorText, { color: colors.textInverse }]}>Author</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {comment.timestamp}
          </Text>
        </View>

        {comment.content && (
          <Text style={[styles.commentText, { color: colors.text }]}>
            {comment.content}
          </Text>
        )}

        {comment.voiceNote && (
          <View style={styles.voiceContainer}>
            <VoicePlayer
              url={comment.voiceNote.url}
              duration={comment.voiceNote.duration}
              waveform={comment.voiceNote.waveform}
              size="small"
            />
          </View>
        )}

        {comment.isAuthorLiked && (
          <View style={styles.authorInteraction}>
            <BadgeCheck size={14} color={colors.primary} fill={colors.primary} />
            <Text style={[styles.authorInteractionText, { color: colors.primary }]}>
              Author liked this comment
            </Text>
          </View>
        )}

        {comment.isAuthorReply && (
          <View style={styles.authorInteraction}>
            <BadgeCheck size={14} color={colors.primary} fill={colors.primary} />
            <Text style={[styles.authorInteractionText, { color: colors.primary }]}>
              Author replied
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onLike?.(comment.id)}
          >
            <Heart
              size={16}
              color={comment.isLiked ? colors.error : colors.textSecondary}
              fill={comment.isLiked ? colors.error : colors.transparent}
            />
            {comment.likes > 0 && (
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                {formatNumber(comment.likes)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onReply?.(comment.id)}
          >
            <MessageCircle size={16} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>

        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.replies}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postAuthorId={postAuthorId}
                onLike={onLike}
                onReply={onReply}
                onUserPress={onUserPress}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  authorBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  authorText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  timestamp: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  voiceContainer: {
    marginBottom: 8,
  },
  authorInteraction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  authorInteractionText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  replies: {
    marginTop: 12,
    marginLeft: -48,
  },
});
