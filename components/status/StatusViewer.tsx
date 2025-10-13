import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, MoreVertical, Send, Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { Status } from '@/types/status';
import VoiceStatusPlayer from './VoiceStatusPlayer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUS_DURATION = 5000;

interface StatusViewerProps {
  statuses: Status[];
  initialIndex?: number;
  onClose: () => void;
  onStatusChange?: (index: number) => void;
  onComplete?: () => void;
}

export default function StatusViewer({
  statuses,
  initialIndex = 0,
  onClose,
  onStatusChange,
  onComplete,
}: StatusViewerProps) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const progressAnims = useRef(
    statuses.map(() => new Animated.Value(0))
  ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const currentStatus = statuses[currentIndex];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isPaused && currentIndex < statuses.length) {
      startProgress();
    }

    return () => {
      progressAnims[currentIndex].stopAnimation();
    };
  }, [currentIndex, isPaused]);

  const startProgress = () => {
    progressAnims[currentIndex].setValue(0);
    
    Animated.timing(progressAnims[currentIndex], {
      toValue: 1,
      duration: STATUS_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isPaused) {
        goToNext();
      }
    });
  };

  const goToNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
      onStatusChange?.(currentIndex + 1);
    } else {
      onComplete?.();
      handleClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      progressAnims[currentIndex].setValue(0);
      setCurrentIndex(currentIndex - 1);
      onStatusChange?.(currentIndex - 1);
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsPaused(true);
        progressAnims[currentIndex].stopAnimation();
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsPaused(false);
        
        if (Math.abs(gestureState.dx) > 50) {
          if (gestureState.dx > 0) {
            goToPrevious();
          } else {
            goToNext();
          }
        } else if (Math.abs(gestureState.dy) > 100) {
          handleClose();
        } else {
          const tapX = gestureState.x0;
          if (tapX < SCREEN_WIDTH / 3) {
            goToPrevious();
          } else if (tapX > (SCREEN_WIDTH * 2) / 3) {
            goToNext();
          } else {
            startProgress();
          }
        }
      },
    })
  ).current;

  const renderStatusContent = () => {
    switch (currentStatus.type) {
      case 'photo':
        return (
          <Image
            source={{ uri: currentStatus.media?.uri }}
            style={styles.mediaContent}
            resizeMode="cover"
          />
        );

      case 'video':
        return (
          <View style={[styles.mediaContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.videoPlaceholder, { color: colors.text }]}>
              Video Content
            </Text>
          </View>
        );

      case 'text':
        if (currentStatus.textContent?.gradient) {
          return (
            <LinearGradient
              colors={currentStatus.textContent.gradient as any}
              style={styles.textContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text
                style={[
                  styles.textStatusText,
                  {
                    fontSize: currentStatus.textContent.fontSize || 32,
                    textAlign: currentStatus.textContent.textAlign || 'center',
                  },
                ]}
              >
                {currentStatus.textContent.text}
              </Text>
            </LinearGradient>
          );
        }
        return (
          <View
            style={[
              styles.textContent,
              { backgroundColor: currentStatus.textContent?.backgroundColor },
            ]}
          >
            <Text
              style={[
                styles.textStatusText,
                {
                  fontSize: currentStatus.textContent?.fontSize || 32,
                  textAlign: currentStatus.textContent?.textAlign || 'center',
                },
              ]}
            >
              {currentStatus.textContent?.text}
            </Text>
          </View>
        );

      case 'voice':
        return (
          <VoiceStatusPlayer
            voiceContent={currentStatus.voiceContent!}
            onPlaybackComplete={goToNext}
            isPaused={isPaused}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {renderStatusContent()}

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.3)']}
        style={styles.overlay}
        pointerEvents="none"
      />

      <View style={styles.header}>
        <View style={styles.progressBars}>
          {statuses.map((_, index) => (
            <View key={index} style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    opacity: index <= currentIndex ? 1 : 0.3,
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: currentStatus.avatar }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.username}>{currentStatus.username}</Text>
              <Text style={styles.timestamp}>
                {getTimeAgo(currentStatus.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                setIsPaused(true);
                progressAnims[currentIndex].stopAnimation();
                console.log('More options for status:', currentStatus.id);
              }}
              activeOpacity={0.7}
            >
              <MoreVertical size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {currentStatus.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{currentStatus.caption}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => {
            setIsPaused(true);
            progressAnims[currentIndex].stopAnimation();
            setShowReply(!showReply);
            console.log('Reply to status:', currentStatus.id);
          }}
          activeOpacity={0.7}
        >
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.replyText}>Reply</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => {
            setIsLiked(!isLiked);
            console.log('Like status:', currentStatus.id, !isLiked);
          }}
          activeOpacity={0.7}
        >
          <Heart 
            size={24} 
            color={isLiked ? "#FF3B5C" : "#FFFFFF"} 
            fill={isLiked ? "#FF3B5C" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.analytics}>
        <Text style={styles.analyticsText}>
          {currentStatus.analytics.views} views
        </Text>
      </View>
    </Animated.View>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  textContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 40,
    paddingVertical: 100,
  },
  textStatusText: {
    color: '#FFFFFF',
    fontWeight: '700' as const,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    width: '100%',
  },
  videoPlaceholder: {
    fontSize: 18,
  },
  header: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  progressBars: {
    flexDirection: 'row' as const,
    gap: 4,
    marginBottom: 16,
  },
  progressBarContainer: {
    flex: 1,
    height: 3,
    position: 'relative' as const,
  },
  progressBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  headerContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  userInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    gap: 2,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  captionContainer: {
    position: 'absolute' as const,
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 12,
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute' as const,
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 16,
    right: 16,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  replyButton: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginRight: 12,
  },
  replyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  analytics: {
    position: 'absolute' as const,
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: 16,
  },
  analyticsText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
});
