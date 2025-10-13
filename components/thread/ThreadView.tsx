import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Heart, MessageCircle, Repeat2, Bookmark, MoreVertical } from 'lucide-react-native';
import { ThreadPost } from '@/types/thread';
import { useThreads } from '@/hooks/thread-store';
import { useTheme } from '@/hooks/theme-store';
import { mockUsers } from '@/mocks/users';
import { VoicePlayer } from '@/components/ui/VoicePlayer';

interface ThreadViewProps {
  posts: ThreadPost[];
  threadId: string;
  onShowFullThread?: () => void;
  collapsed?: boolean;
}

export default function ThreadView({ posts, threadId, onShowFullThread, collapsed = false }: ThreadViewProps) {
  const { toggleThreadPostLike } = useThreads();
  const { colors } = useTheme();

  const displayPosts = collapsed ? [posts[0]] : posts;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTimeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const renderPost = (post: ThreadPost, index: number, isLast: boolean) => {
    const author = mockUsers.find(u => u.id === post.authorId);
    if (!author) return null;

    return (
      <View key={post.id} style={styles.postContainer}>
        {!isLast && <View style={styles.threadLine} />}
        
        <View style={styles.postHeader}>
          <Image source={{ uri: author.profileImage }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]}>{author.displayName}</Text>
              <Text style={[styles.username, { color: colors.textSecondary }]}>@{author.username}</Text>
              <Text style={[styles.time, { color: colors.textSecondary }]}>· {getTimeSince(post.createdAt)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.postContent}>
          {post.content && (
            <Text style={[styles.contentText, { color: colors.text }]}>{post.content}</Text>
          )}

          {post.type === 'voice' && post.voiceUrl && (
            <View style={styles.voiceContainer}>
              <VoicePlayer url={post.voiceUrl} duration={post.voiceDuration || 0} />
            </View>
          )}

          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
              {post.mediaUrls.map((url, idx) => (
                <Image key={idx} source={{ uri: url }} style={styles.mediaImage} />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleThreadPostLike(threadId, post.id)}
          >
            <Heart
              size={20}
              color={post.isLiked ? '#EF4444' : colors.textSecondary}
              fill={post.isLiked ? '#EF4444' : 'none'}
            />
            {post.likes > 0 && (
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                {formatNumber(post.likes)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color={colors.textSecondary} />
            {post.comments > 0 && (
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                {formatNumber(post.comments)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Repeat2
              size={20}
              color={post.isRevibed ? '#10B981' : colors.textSecondary}
            />
            {post.revibes > 0 && (
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                {formatNumber(post.revibes)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Bookmark
              size={20}
              color={post.isSaved ? '#3B82F6' : colors.textSecondary}
              fill={post.isSaved ? '#3B82F6' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {displayPosts.map((post, index) => renderPost(post, index, index === displayPosts.length - 1))}
      
      {collapsed && posts.length > 1 && onShowFullThread && (
        <TouchableOpacity style={styles.showThreadButton} onPress={onShowFullThread}>
          <View style={[styles.threadIndicator, { backgroundColor: colors.primary }]} />
          <Text style={[styles.showThreadText, { color: colors.primary }]}>
            Show this thread ({posts.length} posts)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  postContainer: {
    position: 'relative' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  threadLine: {
    position: 'absolute' as const,
    left: 36,
    top: 60,
    bottom: 0,
    width: 2,
    backgroundColor: '#2A2A2A',
  },
  postHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flexWrap: 'wrap' as const,
  },
  name: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginRight: 4,
  },
  username: {
    fontSize: 15,
    marginRight: 4,
  },
  time: {
    fontSize: 15,
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    marginLeft: 52,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  voiceContainer: {
    marginVertical: 8,
  },
  mediaScroll: {
    marginTop: 8,
  },
  mediaImage: {
    width: 280,
    height: 280,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#2A2A2A',
  },
  actions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: 52,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
  },
  showThreadButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 52,
  },
  threadIndicator: {
    width: 24,
    height: 2,
    borderRadius: 1,
    marginRight: 8,
  },
  showThreadText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
