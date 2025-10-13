import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Heart, MessageCircle, Repeat2, Share2, Play } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { VibePost } from '@/types/vibepost';
import { useVibePosts } from '@/hooks/vibepost-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { router } from 'expo-router';

interface VibePostCardProps {
  post: VibePost;
  autoplay?: boolean;
}



const VibePostCard = React.memo(({ post }: VibePostCardProps) => {
  const { theme } = useTheme();
  const { likeVibePost, repostVibePost } = useVibePosts();

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayVideo = useCallback(() => {
    router.push(`/vibepost/${post.id}`);
  }, [post.id]);

  const handleLike = useCallback(() => {
    likeVibePost(post.id);
  }, [post.id, likeVibePost]);

  const handleRepost = useCallback(() => {
    repostVibePost(post.id);
  }, [post.id, repostVibePost]);

  const handleComment = useCallback(() => {
    router.push(`/vibepost/${post.id}?focus=comments`);
  }, [post.id]);

  const handleShare = useCallback(() => {
    console.log('Share VibePost:', post.id);
  }, [post.id]);

  const handleUserPress = useCallback(() => {
    router.push(`/user/${post.userId}`);
  }, [post.userId]);



  const videoHeight = useMemo(() => {
    return post.aspectRatio === 'vertical' ? 500 : 
           post.aspectRatio === 'horizontal' ? 250 : 350;
  }, [post.aspectRatio]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUserPress} style={styles.userInfo}>
          <Avatar uri={post.avatar} size={40} />
          <View style={styles.userText}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: theme.text }]}>
                {post.displayName}
              </Text>
              {post.verified && <VerifiedBadge size={16} />}
            </View>
            <Text style={[styles.username, { color: theme.textSecondary }]}>
              @{post.username}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.videoContainer, { height: videoHeight }]}
        onPress={handlePlayVideo}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: post.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        >
          <View style={styles.videoOverlay}>
            <View style={styles.playButton}>
              <Play size={48} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>

          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDuration(post.duration)}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {post.caption && (
        <Text style={[styles.caption, { color: theme.text }]}>
          {post.caption}
        </Text>
      )}

      {post.music && (
        <View style={[styles.musicInfo, { backgroundColor: theme.card }]}>
          <Text style={[styles.musicText, { color: theme.textSecondary }]}>
            🎵 {post.music.title} - {post.music.artist}
          </Text>
        </View>
      )}

      <View style={styles.stats}>
        <Text style={[styles.statsText, { color: theme.textSecondary }]}>
          {formatCount(post.views)} views
        </Text>
      </View>

      <View style={[styles.actions, { borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Heart 
            size={20} 
            color={post.isLiked ? '#FF3B5C' : theme.textSecondary}
            fill={post.isLiked ? '#FF3B5C' : 'none'}
          />
          <Text style={[
            styles.actionText, 
            { color: post.isLiked ? '#FF3B5C' : theme.textSecondary }
          ]}>
            {formatCount(post.likes)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleComment}
        >
          <MessageCircle size={20} color={theme.textSecondary} />
          <Text style={[styles.actionText, { color: theme.textSecondary }]}>
            {formatCount(post.comments)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleRepost}
        >
          <Repeat2 
            size={20} 
            color={post.isReposted ? '#00BA7C' : theme.textSecondary}
          />
          <Text style={[
            styles.actionText, 
            { color: post.isReposted ? '#00BA7C' : theme.textSecondary }
          ]}>
            {formatCount(post.reposts)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Share2 size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.likes === nextProps.post.likes &&
    prevProps.post.comments === nextProps.post.comments &&
    prevProps.post.reposts === nextProps.post.reposts &&
    prevProps.post.views === nextProps.post.views
  );
});

VibePostCard.displayName = 'VibePostCard';

export default VibePostCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
  videoContainer: {
    width: '100%',
    position: 'relative' as const,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  durationBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  caption: {
    padding: 12,
    fontSize: 15,
    lineHeight: 20,
  },
  musicInfo: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
  musicText: {
    fontSize: 13,
  },
  stats: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  statsText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
