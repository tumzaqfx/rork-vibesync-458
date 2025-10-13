import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, FlatList, Dimensions, TouchableOpacity, Text, Platform, Animated, Image, Pressable } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useTheme } from '@/hooks/theme-store';
import { mockVibes } from '@/mocks/vibes';
import { Vibe } from '@/types';
import { ColorScheme } from '@/constants/colors';
import { Heart, MessageCircle, Send, Bookmark, Music2, RefreshCw, Repeat2, Play, Pause } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { useProfileViews } from '@/hooks/profile-views-store';
import { useAuth } from '@/hooks/auth-store';
import { CommentDrawer } from '@/components/engagement/CommentDrawer';
import { ShareSheet } from '@/components/engagement/ShareSheet';

const getScreenDimensions = () => {
  if (Platform.OS === 'web') {
    return {
      height: typeof window !== 'undefined' ? window.innerHeight : 800,
      width: typeof window !== 'undefined' ? window.innerWidth : 400
    };
  }
  return Dimensions.get('window');
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = getScreenDimensions();

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

interface VibeItemProps {
  vibe: Vibe;
  isActive: boolean;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  onSave: (id: string) => void;
  onRevibe: (id: string) => void;
  onUserPress: (userId: string) => void;
  onFollowPress: (userId: string) => void;
  friendsWhoLiked: any[];
  colors: ColorScheme;
}

const VibeItem = React.memo<VibeItemProps>(function VibeItem({
  vibe,
  isActive,
  onLike,
  onComment,
  onShare,
  onSave,
  onRevibe,
  onUserPress,
  onFollowPress,
  friendsWhoLiked,
  colors,
}) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [, setShowPlayPause] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const likeScale = useRef(new Animated.Value(1)).current;
  const playPauseOpacity = useRef(new Animated.Value(0)).current;
  const playPauseScale = useRef(new Animated.Value(0)).current;
  const progressBarOpacity = useRef(new Animated.Value(0)).current;
  
  const hideProgressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.playAsync();
      setIsPlaying(true);
    } else if (!isActive && videoRef.current) {
      videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    };
  }, [isActive]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      if (status.didJustFinish) {
        videoRef.current?.replayAsync();
      }
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setShowPlayPause(true);
      } else {
        await videoRef.current.playAsync();
        setShowPlayPause(false);
      }
      
      Animated.sequence([
        Animated.parallel([
          Animated.timing(playPauseOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(playPauseScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 5,
          }),
        ]),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(playPauseOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(playPauseScale, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 5,
          }),
        ]),
      ]).start(() => {
        if (isPlaying) {
          setShowPlayPause(false);
        }
      });
    }
  };

  const handleSingleTap = () => {
    togglePlayPause();
    showProgressBarTemporarily();
  };

  const showProgressBarTemporarily = () => {
    setShowProgressBar(true);
    Animated.timing(progressBarOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (hideProgressTimeout.current) {
      clearTimeout(hideProgressTimeout.current);
    }

    hideProgressTimeout.current = setTimeout(() => {
      Animated.timing(progressBarOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowProgressBar(false);
      });
    }, 3000);
  };

  const handleProgressBarPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const screenWidth = SCREEN_WIDTH - 32;
    const percentage = locationX / screenWidth;
    const newPosition = percentage * duration;
    
    videoRef.current?.setPositionAsync(newPosition * 1000);
    showProgressBarTemporarily();
  };

  const handleLikePress = () => {
    onLike(vibe.id);
    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1.3,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }),
    ]).start();
  };

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
    onFollowPress(vibe.userId);
  };

  return (
    <View style={styles.vibeContainer}>
      <Pressable
        style={styles.videoContainer}
        onPress={handleSingleTap}
      >
        <Video
          ref={videoRef}
          source={{ uri: vibe.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={isActive}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
        
        <Animated.View
          style={[
            styles.playPauseOverlay,
            {
              opacity: playPauseOpacity,
              transform: [{ scale: playPauseScale }],
            },
          ]}
        >
          <View style={styles.playPauseIcon}>
            {isPlaying ? (
              <Pause size={60} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={60} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </View>
        </Animated.View>
      </Pressable>

      <Animated.View
        style={[
          styles.progressBarContainer,
          {
            opacity: progressBarOpacity,
          },
        ]}
        pointerEvents={showProgressBar ? 'auto' : 'none'}
      >
        <Pressable
          style={styles.progressBarTouchable}
          onPress={handleProgressBarPress}
        >
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                },
              ]}
            />
          </View>
        </Pressable>
      </Animated.View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      <View style={styles.rightActions}>
        <View style={styles.profileAvatarContainer}>
          <TouchableOpacity onPress={() => onUserPress(vibe.userId)}>
            <Avatar uri={vibe.profileImage} size={48} />
          </TouchableOpacity>
          {!isFollowing && (
            <TouchableOpacity 
              style={styles.followButton}
              onPress={handleFollowPress}
              activeOpacity={0.8}
            >
              <View style={styles.followButtonInner}>
                <Text style={styles.followButtonText}>+</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View style={[styles.actionItem, { transform: [{ scale: likeScale }] }]}>
          <TouchableOpacity onPress={handleLikePress} activeOpacity={0.7}>
            <Heart
              size={32}
              color={vibe.isLiked ? '#FF3B5C' : '#FFFFFF'}
              fill={vibe.isLiked ? '#FF3B5C' : 'transparent'}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>{formatNumber(vibe.likes)}</Text>
        </Animated.View>

        <TouchableOpacity onPress={() => onComment(vibe.id)} style={styles.actionItem} activeOpacity={0.7}>
          <MessageCircle size={32} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.actionText}>{formatNumber(vibe.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onRevibe(vibe.id)} style={styles.actionItem} activeOpacity={0.7}>
          <Repeat2 size={32} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.actionText}>{formatNumber(vibe.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onShare(vibe.id)} style={styles.actionItem} activeOpacity={0.7}>
          <Send size={30} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSave(vibe.id)} style={styles.actionItem} activeOpacity={0.7}>
          <Bookmark
            size={30}
            color={vibe.isSaved ? '#FFD700' : '#FFFFFF'}
            fill={vibe.isSaved ? '#FFD700' : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>

        {vibe.soundName && (
          <TouchableOpacity style={styles.soundButton} activeOpacity={0.8}>
            <Image
              source={{ uri: vibe.profileImage }}
              style={styles.soundImage}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomInfo}>
        <TouchableOpacity
          style={styles.userInfoRow}
          onPress={() => onUserPress(vibe.userId)}
        >
          <Text style={styles.displayName}>@{vibe.username}</Text>
          {vibe.isVerified && <VerifiedBadge size={16} />}
        </TouchableOpacity>

        {vibe.caption && (
          <Text style={styles.caption} numberOfLines={3}>
            {vibe.caption}
          </Text>
        )}

        {vibe.soundName && (
          <TouchableOpacity style={styles.soundInfo}>
            <Music2 size={12} color="#FFFFFF" />
            <Text style={styles.soundText} numberOfLines={1}>
              {vibe.soundName} • {vibe.soundArtist}
            </Text>
          </TouchableOpacity>
        )}
      </View>


    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.vibe.id === nextProps.vibe.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.vibe.isLiked === nextProps.vibe.isLiked &&
    prevProps.vibe.isSaved === nextProps.vibe.isSaved &&
    prevProps.vibe.likes === nextProps.vibe.likes &&
    prevProps.vibe.comments === nextProps.vibe.comments &&
    prevProps.vibe.shares === nextProps.vibe.shares
  );
});

export default function VibezScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { getFriendsWhoLiked, trackVibeLike } = useProfileViews();
  const [vibes, setVibes] = useState(mockVibes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [newVibesCount, setNewVibesCount] = useState(0);
  const [selectedVibeForComment, setSelectedVibeForComment] = useState<Vibe | null>(null);
  const [selectedVibeForShare, setSelectedVibeForShare] = useState<Vibe | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const buttonScale = useRef(new Animated.Value(0)).current;
  const lastCheckTime = useRef(Date.now());
  const checkInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFocused = useIsFocused();
  
  const friendIds = ['1', '2', '3', '4', '5'];

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const handleLike = useCallback((id: string) => {
    setVibes((prev) =>
      prev.map((vibe) =>
        vibe.id === id
          ? {
              ...vibe,
              isLiked: !vibe.isLiked,
              likes: vibe.isLiked ? vibe.likes - 1 : vibe.likes + 1,
            }
          : vibe
      )
    );
    
    if (user?.id) {
      trackVibeLike(id, user.id);
    }
  }, [user, trackVibeLike]);

  const handleComment = useCallback((id: string) => {
    const vibe = vibes.find(v => v.id === id);
    if (vibe) {
      setSelectedVibeForComment(vibe);
    }
  }, [vibes]);

  const handleShare = useCallback((id: string) => {
    const vibe = vibes.find(v => v.id === id);
    if (vibe) {
      setSelectedVibeForShare(vibe);
    }
  }, [vibes]);

  const handleRevibe = useCallback((id: string) => {
    console.log('Revibe:', id);
    setVibes((prev) =>
      prev.map((vibe) =>
        vibe.id === id
          ? { ...vibe, shares: vibe.shares + 1 }
          : vibe
      )
    );
  }, []);

  const handleFollowPress = useCallback((userId: string) => {
    console.log('Follow user:', userId);
  }, []);

  const handleSave = useCallback((id: string) => {
    setVibes((prev) =>
      prev.map((vibe) =>
        vibe.id === id ? { ...vibe, isSaved: !vibe.isSaved } : vibe
      )
    );
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/user/${userId}`);
  }, []);

  const generateNewVibes = useCallback((): Vibe[] => {
    const newVibes: Vibe[] = [];
    const numNewVibes = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numNewVibes; i++) {
      const randomVibe = mockVibes[Math.floor(Math.random() * mockVibes.length)];
      const newVibe: Vibe = {
        ...randomVibe,
        id: `vibe_${Date.now()}_${i}`,
        timestamp: 'Just now',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 10000),
        isLiked: false,
        isSaved: false,
      };
      newVibes.push(newVibe);
    }

    return newVibes;
  }, []);

  const checkForNewVibes = useCallback(() => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastCheckTime.current;

    if (timeDiff >= 600000) {
      console.log('🎬 Checking for new vibes...');
      const newVibes = generateNewVibes();
      setNewVibesCount(newVibes.length);
      setShowRefreshButton(true);
      
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      lastCheckTime.current = currentTime;
    }
  }, [generateNewVibes, buttonScale]);

  useEffect(() => {
    if (isFocused) {
      checkInterval.current = setInterval(() => {
        checkForNewVibes();
      }, 60000);
    }

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [checkForNewVibes, isFocused]);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Loading new vibes...');
    const newVibes = generateNewVibes();
    setVibes(prev => [...newVibes, ...prev]);
    
    Animated.spring(buttonScale, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setShowRefreshButton(false);
      setNewVibesCount(0);
    });

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [generateNewVibes, buttonScale]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={vibes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const friendsWhoLiked = getFriendsWhoLiked(item.id, friendIds);
          return (
            <VibeItem
              vibe={item}
              isActive={index === currentIndex && isFocused}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
              onRevibe={handleRevibe}
              onUserPress={handleUserPress}
              onFollowPress={handleFollowPress}
              friendsWhoLiked={friendsWhoLiked}
              colors={colors}
            />
          );
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={2}
        windowSize={3}
      />

      {showRefreshButton && (
        <Animated.View
          style={[
            styles.refreshButtonContainer,
            {
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.refreshButton,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.6)' },
            ]}
            onPress={handleRefresh}
            activeOpacity={0.8}
          >
            <BlurView
              intensity={isDark ? 20 : 40}
              tint={isDark ? 'dark' : 'light'}
              style={styles.blurContainer}
            >
              <RefreshCw size={20} color="#FFFFFF" />
              <Text style={styles.refreshButtonText}>
                {newVibesCount} New Vibe{newVibesCount > 1 ? 's' : ''}
              </Text>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.topGradient}>
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          style={styles.gradientFill}
        />
      </View>

      {selectedVibeForComment && (
        <CommentDrawer
          visible={true}
          onClose={() => setSelectedVibeForComment(null)}
          post={{
            id: selectedVibeForComment.id,
            userId: selectedVibeForComment.userId,
            username: selectedVibeForComment.username,
            userDisplayName: selectedVibeForComment.userDisplayName,
            profileImage: selectedVibeForComment.profileImage,
            isVerified: selectedVibeForComment.isVerified,
            content: selectedVibeForComment.caption,
            likes: selectedVibeForComment.likes,
            comments: selectedVibeForComment.comments,
            shares: selectedVibeForComment.shares,
            views: selectedVibeForComment.views,
            timestamp: selectedVibeForComment.timestamp,
            engagement: selectedVibeForComment.likes + selectedVibeForComment.comments + selectedVibeForComment.shares,
            author: selectedVibeForComment.author,
          }}
          comments={[]}
        />
      )}

      {selectedVibeForShare && (
        <ShareSheet
          visible={true}
          onClose={() => setSelectedVibeForShare(null)}
          content={selectedVibeForShare}
          contentType="vibe"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  vibeContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  playPauseIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 350,
  },
  rightActions: {
    position: 'absolute',
    right: 8,
    bottom: 100,
    gap: 24,
    alignItems: 'center',
  },
  profileAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  followButton: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -12,
    zIndex: 10,
  },
  followButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B5C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 18,
  },
  actionItem: {
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  soundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginTop: 4,
  },
  soundImage: {
    width: '100%',
    height: '100%',
  },
  bottomInfo: {
    position: 'absolute',
    left: 12,
    right: 80,
    bottom: 100,
    gap: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  displayName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  soundText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    flex: 1,
  },
  refreshButtonContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  refreshButton: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    pointerEvents: 'none',
  },
  gradientFill: {
    flex: 1,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  progressBarTouchable: {
    paddingVertical: 12,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});
