import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, Animated, PanResponder, Platform } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { VoiceNotePlayer } from '@/components/ui/VoiceNotePlayer';
import { X, Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react-native';
import { Image } from 'expo-image';
import { mockStories } from '@/mocks/stories';
import { Story } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function StoryViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    
    const foundStory = mockStories.find(s => s.id === id);
    if (foundStory) {
      setStory(foundStory);
      setIsLiked(Math.random() > 0.5);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (!story || isPaused) return;
    
    const duration = story.mediaType === 'voice' && story.voiceNote 
      ? story.voiceNote.duration * 1000 
      : 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;
    
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          router.back();
          return 100;
        }
        return newProgress;
      });
    }, interval);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [story, isPaused]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsPaused(true);
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsPaused(false);
        
        if (Math.abs(gestureState.dy) > 50) {
          router.back();
        }
      },
    })
  ).current;

  const handleClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    router.back();
  };

  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Comment on story:', story?.id);
  };

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Share story:', story?.id);
  };

  const handleUserPress = () => {
    if (story) {
      router.push(`/user/${story.author.id}`);
    }
  };

  if (!story) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Story not found</Text>
        <TouchableOpacity onPress={handleClose} style={[styles.backButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isVoiceStory = story.mediaType === 'voice';
  const backgroundColor = story.backgroundColor || '#1a1a1a';
  const textColor = story.textColor || '#FFFFFF';

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {!isVoiceStory && story.mediaUrl ? (
        <Image
          source={{ uri: story.mediaUrl }}
          style={styles.backgroundMedia}
          contentFit="cover"
        />
      ) : (
        <LinearGradient
          colors={[backgroundColor, backgroundColor + 'DD']}
          style={styles.backgroundMedia}
        />
      )}
      
      <View style={styles.overlay} />
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
          <Avatar
            uri={story.author.profileImage}
            size={36}
            style={styles.authorAvatar}
          />
          <View style={styles.authorInfo}>
            <View style={styles.authorName}>
              <Text style={styles.authorDisplayName}>{story.author.displayName}</Text>
              {story.author.isVerified && <VerifiedBadge size={14} />}
            </View>
            <Text style={styles.storyTime}>{formatTime(story.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setIsPaused(true);
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
              console.log('Story options for:', story.id);
            }}
          >
            <MoreHorizontal size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        {isVoiceStory && story.voiceNote ? (
          <View style={styles.voiceStoryContainer}>
            <View style={styles.voiceAvatarContainer}>
              <LinearGradient
                colors={['#3B82F6', '#06B6D4']}
                style={styles.voiceAvatarGradient}
              >
                <View style={[styles.voiceAvatarInner, { backgroundColor: colors.background }]}>
                  <Avatar uri={story.author.profileImage} size={120} />
                </View>
              </LinearGradient>
            </View>
            
            <VoiceNotePlayer
              uri={story.voiceNote.url}
              duration={story.voiceNote.duration}
              waveform={story.voiceNote.waveform}
              size="large"
            />
            
            {story.content && (
              <Text style={[styles.voiceCaption, { color: textColor }]}>
                {story.content}
              </Text>
            )}
          </View>
        ) : (
          story.content && (
            <Text style={[styles.storyContent, { color: textColor }]}>
              {story.content}
            </Text>
          )
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart 
            size={28} 
            color={isLiked ? '#FF0000' : '#FFFFFF'} 
            fill={isLiked ? '#FF0000' : 'transparent'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <MessageCircle size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Send size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatTime(timestamp: string) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now.getTime() - time.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  backgroundMedia: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    left: 8,
    right: 8,
    zIndex: 10,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorDisplayName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  storyTime: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 4,
  },
  contentContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -100 }],
    paddingHorizontal: 24,
    zIndex: 10,
    alignItems: 'center',
  },
  voiceStoryContainer: {
    alignItems: 'center',
    width: '100%',
    gap: 24,
  },
  voiceAvatarContainer: {
    marginBottom: 16,
  },
  voiceAvatarGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceAvatarInner: {
    width: 132,
    height: 132,
    borderRadius: 66,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceCaption: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: '90%',
  },
  storyContent: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 50,
    right: 16,
    alignItems: 'center',
    zIndex: 10,
    gap: 20,
  },
  actionButton: {
    padding: 8,
  },
});
