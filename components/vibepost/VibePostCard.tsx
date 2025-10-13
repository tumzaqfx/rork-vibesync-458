import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Heart, MessageCircle, Repeat2, Share2, Play, Volume2, VolumeX, Maximize2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { VibePost } from '@/types/vibepost';
import { useVibePosts } from '@/hooks/vibepost-store';
import Avatar from '@/components/ui/Avatar';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { router } from 'expo-router';

let Video: any = null;
let ResizeMode: any = null;

if (Platform.OS !== 'web') {
  try {
    const expoAv = require('expo-av');
    Video = expoAv.Video;
    ResizeMode = expoAv.ResizeMode;
  } catch (e) {
    console.warn('expo-av not available:', e);
  }
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VibePostCardProps {
  post: VibePost;
  autoplay?: boolean;
}

const VideoPlayer = ({ videoRef, videoUrl, isMuted, autoplay, onPlaybackStatusUpdate }: any) => {
  if (!Video || !ResizeMode) {
    return (
      <View style={[{ width: '100%', height: '100%', backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FFF' }}>Video player not available</Text>
      </View>
    );
  }
  
  return (
    <Video
      ref={videoRef}
      source={{ uri: videoUrl }}
      style={{ width: '100%', height: '100%' }}
      resizeMode={ResizeMode.COVER}
      isLooping
      isMuted={isMuted}
      shouldPlay={autoplay}
      onPlaybackStatusUpdate={onPlaybackStatusUpdate}
    />
  );
};

const VibePostCard = React.memo(({ post, autoplay = false }: VibePostCardProps) => {
  const { theme } = useTheme();
  const { likeVibePost, repostVibePost, incrementViews } = useVibePosts();
  const videoRef = useRef<any>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

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

  const handlePlayPause = useCallback(async () => {
    if (!videoRef.current) return;

    if (Platform.OS === 'web') {
      const video = videoRef.current as any;
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
        if (!hasStarted) {
          incrementViews(post.id);
          setHasStarted(true);
        }
      }
      setIsPlaying(!isPlaying);
    } else {
      if (isPlaying) {
        await (videoRef.current as any).pauseAsync();
      } else {
        await (videoRef.current as any).playAsync();
        if (!hasStarted) {
          incrementViews(post.id);
          setHasStarted(true);
        }
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, hasStarted, post.id, incrementViews]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleFullscreen = useCallback(() => {
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

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  }, []);

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

      <View style={[styles.videoContainer, { height: videoHeight }]}>
        {Platform.OS === 'web' ? (
          <video
            ref={videoRef as any}
            src={post.videoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loop
            muted={isMuted}
            autoPlay={autoplay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <VideoPlayer
            videoRef={videoRef}
            videoUrl={post.videoUrl}
            isMuted={isMuted}
            autoplay={autoplay}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
        )}

        <TouchableOpacity 
          style={styles.videoOverlay}
          onPress={handlePlayPause}
          activeOpacity={1}
        >
          {!isPlaying && (
            <View style={styles.playButton}>
              <Play size={48} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.videoControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleMuteToggle}
          >
            {isMuted ? (
              <VolumeX size={20} color="#FFFFFF" />
            ) : (
              <Volume2 size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleFullscreen}
          >
            <Maximize2 size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(post.duration)}</Text>
        </View>
      </View>

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
    prevProps.post.views === nextProps.post.views &&
    prevProps.autoplay === nextProps.autoplay
  );
});

VibePostCard.displayName = 'VibePostCard';

export { VibePostCard };
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
    position: 'relative',
    backgroundColor: '#000',
  },
  video: {
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
  videoControls: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
