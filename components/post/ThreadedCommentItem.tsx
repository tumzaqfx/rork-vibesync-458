import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { VoicePlayer } from '@/components/ui/VoicePlayer';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import { Comment } from '@/types';
import { Heart, MessageCircle, ChevronDown, ChevronUp, Send, Flame } from 'lucide-react-native';

interface ThreadedCommentItemProps {
  comment: Comment;
  postAuthorId: string;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  onUserPress?: (userId: string) => void;
  depth?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  replyingTo?: string | null;
  replyText?: string;
  onReplyTextChange?: (text: string) => void;
  onSubmitReply?: (commentId: string) => void;
  onCancelReply?: () => void;
}

const MAX_DEPTH = 2;

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const ThreadedCommentItem: React.FC<ThreadedCommentItemProps> = ({
  comment,
  postAuthorId,
  onLike,
  onReply,
  onUserPress,
  depth = 0,
  isExpanded = false,
  onToggleExpand,
  replyingTo,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const isPostAuthor = comment.userId === postAuthorId;
  const isCurrentUserPostAuthor = user?.id === postAuthorId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const canNest = depth < MAX_DEPTH;

  const indentWidth = depth * 40;

  return (
    <View style={[styles.container, { marginLeft: indentWidth }]}>
      <View
        style={[
          styles.commentWrapper,
          { borderBottomColor: colors.border },
          isPostAuthor && { borderLeftColor: colors.primary, borderLeftWidth: 2 },
        ]}
      >
        <TouchableOpacity onPress={() => onUserPress?.(comment.userId)}>
          <Avatar uri={comment.profileImage} size={depth > 0 ? 32 : 36} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.userInfo} onPress={() => onUserPress?.(comment.userId)}>
              <Text style={[styles.username, { color: colors.text }]}>
                {comment.userDisplayName}
              </Text>
              {comment.isVerified && <VerifiedBadge size={12} />}
              {isPostAuthor && (
                <View style={[styles.authorBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.authorText}>Author</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {comment.timestamp}
            </Text>
          </View>

          {comment.content && (
            <Text style={[styles.commentText, { color: colors.text }]}>{comment.content}</Text>
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
              <Flame size={14} color={colors.primary} fill={colors.primary} />
              <Text style={[styles.authorInteractionText, { color: colors.primary }]}>
                Liked by Author
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onLike?.(comment.id)}>
              <Heart
                size={16}
                color={comment.isLiked ? colors.error : colors.textSecondary}
                fill={comment.isLiked ? colors.error : 'transparent'}
              />
              {comment.likes > 0 && (
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                  {formatNumber(comment.likes)}
                </Text>
              )}
            </TouchableOpacity>

            {canNest && (
              <TouchableOpacity style={styles.actionButton} onPress={() => onReply?.(comment.id)}>
                <MessageCircle size={16} color={colors.textSecondary} />
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>Reply</Text>
              </TouchableOpacity>
            )}

            {hasReplies && (
              <TouchableOpacity style={styles.actionButton} onPress={onToggleExpand}>
                {isExpanded ? (
                  <ChevronUp size={16} color={colors.primary} />
                ) : (
                  <ChevronDown size={16} color={colors.primary} />
                )}
                <Text style={[styles.actionText, { color: colors.primary }]}>
                  {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {replyingTo === comment.id && (
            <View style={[styles.replyInputContainer, { backgroundColor: colors.background }]}>
              <Avatar uri={user?.profileImage} size={28} />
              <TextInput
                value={replyText}
                onChangeText={onReplyTextChange}
                placeholder={`Reply to ${comment.userDisplayName}...`}
                placeholderTextColor={colors.textSecondary}
                style={[styles.replyInput, { color: colors.text, borderColor: colors.border }]}
                multiline
                maxLength={300}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.replyButton, { backgroundColor: colors.primary }]}
                onPress={() => onSubmitReply?.(comment.id)}
                disabled={!replyText?.trim()}
              >
                <Send size={14} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancelReply}>
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {isExpanded && hasReplies && (
        <View style={styles.repliesContainer}>
          {comment.replies?.map((reply) => (
            <ThreadedCommentItem
              key={reply.id}
              comment={reply}
              postAuthorId={postAuthorId}
              onLike={onLike}
              onReply={onReply}
              onUserPress={onUserPress}
              depth={depth + 1}
              isExpanded={false}
              replyingTo={replyingTo}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  commentWrapper: {
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
    color: '#FFFFFF',
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
  },
  authorInteractionText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
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
  repliesContainer: {
    marginTop: 0,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 8,
    borderRadius: 12,
  },
  replyInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 16,
    maxHeight: 60,
  },
  replyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: 8,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
