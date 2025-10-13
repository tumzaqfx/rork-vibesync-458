import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Animated, PanResponder } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { X, Play, Pause, MoreVertical } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/theme-store';
import { useStatus } from '@/hooks/status-store';
import { Status } from '@/types/status';
import VoiceStatusPlayer from '@/components/status/VoiceStatusPlayer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StatusViewerScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { colors } = useTheme();
  const { getUserStatuses, markStatusAsViewed } = useStatus();
  
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressAnims = useRef<Animated.Value[]>([]).current;
  const progressTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (userId) {
      const userStatuses = getUserStatuses(userId as string);
      setStatuses(userStatuses);
      
      progressAnims.length = 0;
      userStatuses.forEach(() => {
        progressAnims.push(new Animated.Value(0));
      });
    }
  }, [userId]);

  useEffect(() => {
    if (statuses.length > 0 && currentIndex < statuses.length) {
      startProgress();
      markStatusAsViewed(statuses[currentIndex].id);
    }
    
    return () => {
      progressTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, [currentIndex, statuses, isPaused]);

  const startProgress = () => {
    if (isPaused) return;
    
    const duration = statuses[currentIndex].type === 'video' ? 15000 : 5000;
    
    Animated.timing(progressAnims[currentIndex], {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isPaused) {
        handleNext();
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(prev => prev + 1);
      progressAnims[currentIndex].setValue(1);
    } else {
      router.back();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      progressAnims[currentIndex].setValue(0);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        if (Math.abs(dx) > 50) {
          if (dx > 0) {
            handlePrevious();
          } else {
            handleNext();
          }
        }
      },
    })
  ).current;

  if (!statuses.length) {
    return null;
  }

  const currentStatus = statuses[currentIndex];

  const renderStatusContent = () => {
    switch (currentStatus.type) {
      case 'photo':
        return (
          <Image
            source={{ uri: currentStatus.media?.uri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        );
      
      case 'text':
        if (currentStatus.textContent) {
          const bg = currentStatus.textContent.gradient || [currentStatus.textContent.backgroundColor || '#667eea'];
          return (
            <>
              <LinearGradient
                colors={bg as any}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.textContentContainer}>
                <Text
                  style={[
                    styles.textContent,
                    {
                      textAlign: currentStatus.textContent.textAlign || 'center',
                      fontSize: currentStatus.textContent.fontSize || 32,
                    },
                  ]}
                >
                  {currentStatus.textContent.text}
                </Text>
              </View>
            </>
          );
        }
        break;
      
      case 'voice':
        if (currentStatus.voiceContent) {
          return (
            <VoiceStatusPlayer
              voiceContent={currentStatus.voiceContent}
              isPaused={isPaused}
              onPlaybackComplete={handleNext}
            />
          );
        }
        break;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill}>
        {renderStatusContent()}
      </View>

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent']}
        style={styles.topGradient}
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
                    width: progressAnims[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }) || '0%',
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
            <Text style={styles.username}>{currentStatus.username}</Text>
            <Text style={styles.timestamp}>
              {new Date(currentStatus.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={() => setIsPaused(!isPaused)}
              style={styles.headerButton}
            >
              {isPaused ? (
                <Play size={24} color="#FFFFFF" />
              ) : (
                <Pause size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                console.log('More options');
              }}
            >
              <MoreVertical size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {currentStatus.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{currentStatus.caption}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topGradient: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  header: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 16,
    zIndex: 2,
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
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContentContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 32,
  },
  textContent: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  voiceContentContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: 24,
  },
  waveformContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    height: 150,
  },
  waveformBar: {
    width: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    minHeight: 6,
  },
  voiceDuration: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600' as const,
  },
  captionContainer: {
    position: 'absolute' as const,
    bottom: 40,
    left: 16,
    right: 16,
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
