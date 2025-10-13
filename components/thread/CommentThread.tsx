import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Heart, MessageCircle, MoreVertical } from 'lucide-react-native';
import { ThreadComment, CommentReply } from '@/types/thread';
import { useThreads } from '@/hooks/thread-store';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import { mockUsers } from '@/mocks/users';

interface CommentThreadProps {
  postId: string;
  comment: ThreadComment;
  depth?: number;
}

export default function CommentThread({ postId, comment, depth = 0 }: CommentThreadProps) {
  const { toggleCommentLike, toggleReplyLike, addReply } = useThreads();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const author = mockUsers.find(u => u.id === comment.authorId);
  if (!author) return null;

  const getTimeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const handleReply = () => {
    if (!replyText.trim() || !user) return;

    addReply(postId, comment.id, {
      commentId: comment.id,
      parentReplyId: null,
      authorId: user.id,
      content: replyText.trim(),
      type: 'text',
      depth: depth + 1,
    });

    setReplyText('');
    setShowReplyInput(false);
    setShowReplies(true);
  };

  const renderReply = (reply: CommentReply) => {
    const replyAuthor = mockUsers.find(u => u.id === reply.authorId);
    if (!replyAuthor) return null;

    return (
      <View key={reply.id} style={[styles.replyContainer, { marginLeft: Math.min(depth * 20, 60) }]}>
        <View style={styles.replyLine} />
        <Image source={{ uri: replyAuthor.profileImage }} style={styles.smallAvatar} />
        <View style={styles.replyContent}>
          <View style={styles.replyHeader}>
            <Text style={[styles.replyName, { color: colors.text }]}>{replyAuthor.displayName}</Text>
            <Text style={[styles.replyTime, { color: colors.textSecondary }]}>
              · {getTimeSince(reply.createdAt)}
            </Text>
          </View>
          <Text style={[styles.replyText, { color: colors.text }]}>{reply.content}</Text>
          <View style={styles.replyActions}>
            <TouchableOpacity
              style={styles.replyAction}
              onPress={() => toggleReplyLike(postId, reply.id)}
            >
              <Heart
                size={14}
                color={reply.isLiked ? '#EF4444' : colors.textSecondary}
                fill={reply.isLiked ? '#EF4444' : 'none'}
              />
              {reply.likes > 0 && (
                <Text style={[styles.replyActionText, { color: colors.textSecondary }]}>
                  {reply.likes}
                </Text>
              )}
            </TouchableOpacity>
            {depth < 2 && (
              <TouchableOpacity style={styles.replyAction}>
                <Text style={[styles.replyActionText, { color: colors.textSecondary }]}>Reply</Text>
              </TouchableOpacity>
            )}
          </View>
          {reply.replies && reply.replies.length > 0 && reply.replies.map(renderReply)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: author.profileImage }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{author.displayName}</Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>@{author.username}</Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>· {getTimeSince(comment.createdAt)}</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.commentText, { color: colors.text }]}>{comment.content}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleCommentLike(postId, comment.id)}
          >
            <Heart
              size={16}
              color={comment.isLiked ? '#EF4444' : colors.textSecondary}
              fill={comment.isLiked ? '#EF4444' : 'none'}
            />
            {comment.likes > 0 && (
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                {comment.likes}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowReplyInput(!showReplyInput)}
          >
            <MessageCircle size={16} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>Reply</Text>
          </TouchableOpacity>
        </View>

        {showReplyInput && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={[styles.replyInput, { color: colors.text, borderColor: colors.border }]}
              placeholder="Write a reply..."
              placeholderTextColor={colors.textSecondary}
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
            <TouchableOpacity
              style={[styles.replyButton, !replyText.trim() && styles.replyButtonDisabled]}
              onPress={handleReply}
              disabled={!replyText.trim()}
            >
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
          </View>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <>
            {!showReplies && (
              <TouchableOpacity
                style={styles.showRepliesButton}
                onPress={() => setShowReplies(true)}
              >
                <View style={[styles.repliesLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.showRepliesText, { color: colors.primary }]}>
                  View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </Text>
              </TouchableOpacity>
            )}
            {showReplies && comment.replies.map(renderReply)}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700' as const,
    marginRight: 4,
  },
  username: {
    fontSize: 14,
    marginRight: 4,
  },
  time: {
    fontSize: 14,
  },
  moreButton: {
    marginLeft: 'auto' as const,
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
  },
  replyInputContainer: {
    marginTop: 12,
    gap: 8,
  },
  replyInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top' as const,
  },
  replyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end' as const,
  },
  replyButtonDisabled: {
    opacity: 0.5,
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  showRepliesButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 12,
    gap: 8,
  },
  repliesLine: {
    width: 20,
    height: 2,
    borderRadius: 1,
  },
  showRepliesText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  replyContainer: {
    flexDirection: 'row' as const,
    marginTop: 12,
    position: 'relative' as const,
  },
  replyLine: {
    position: 'absolute' as const,
    left: -8,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#2A2A2A',
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 2,
  },
  replyName: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginRight: 4,
  },
  replyTime: {
    fontSize: 13,
  },
  replyText: {
    fontSize: 13,
    lineHeight: 17,
    marginBottom: 6,
  },
  replyActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  replyAction: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  replyActionText: {
    fontSize: 11,
  },
});
