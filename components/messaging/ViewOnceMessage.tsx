import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, Image, Modal, Platform } from 'react-native';
import { Lock, Eye, RotateCcw } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { Message } from '@/types';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface ViewOnceMessageProps {
  message: Message;
  onView: () => void;
  onExpire: () => void;
  isMyMessage: boolean;
}

export function ViewOnceMessage({ message, onView, onExpire, isMyMessage }: ViewOnceMessageProps) {
  const { colors } = useTheme();
  const [isViewing, setIsViewing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [hasViewed, setHasViewed] = useState(!!message.viewedAt);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const canReplay = message.allowReplay && 
                    message.replayCount !== undefined && 
                    message.maxReplays !== undefined &&
                    message.replayCount < message.maxReplays;

  const handleClose = useCallback(() => {
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
      setIsViewing(false);
      if (!canReplay) {
        onExpire();
      }
    });
  }, [fadeAnim, scaleAnim, canReplay, onExpire]);

  useEffect(() => {
    if (isViewing) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start();

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isViewing, fadeAnim, scaleAnim, progressAnim, handleClose]);

  const handleOpen = () => {
    if (hasViewed && !canReplay) return;
    
    setIsViewing(true);
    setCountdown(5);
    progressAnim.setValue(0);
    onView();
    
    if (!hasViewed) {
      setHasViewed(true);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderPreview = () => {
    if (hasViewed && !canReplay) {
      return (
        <View style={[styles.expiredContainer, { backgroundColor: colors.card }]}>
          <Eye size={24} color={colors.textSecondary} />
          <Text style={[styles.expiredText, { color: colors.textSecondary }]}>
            {isMyMessage ? 'Viewed' : 'Opened'}
          </Text>
          {message.viewedAt && (
            <Text style={[styles.viewedTime, { color: colors.textSecondary }]}>
              {new Date(message.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.previewContainer, { backgroundColor: colors.card }]}
        onPress={handleOpen}
        disabled={isMyMessage}
      >
        <View style={[styles.lockIcon, { backgroundColor: colors.primary }]}>
          <Lock size={20} color={colors.text} />
        </View>
        <Text style={[styles.previewText, { color: colors.text }]}>
          {message.type === 'image' && '📷 Photo'}
          {message.type === 'video' && '🎥 Video'}
          {message.type === 'voice' && '🎤 Voice message'}
        </Text>
        <Text style={[styles.viewOnceLabel, { color: colors.textSecondary }]}>
          Tap to view once
        </Text>
        {canReplay && (
          <View style={styles.replayBadge}>
            <RotateCcw size={12} color={colors.primary} />
            <Text style={[styles.replayText, { color: colors.primary }]}>
              {message.maxReplays! - message.replayCount!} replay{message.maxReplays! - message.replayCount! > 1 ? 's' : ''} left
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (message.type === 'image' && message.mediaUrl) {
      return (
        <Image
          source={{ uri: message.mediaUrl }}
          style={styles.mediaContent}
          resizeMode="contain"
        />
      );
    }

    if (message.type === 'video' && message.mediaUrl) {
      return (
        <View style={styles.mediaContent}>
          <Text style={[styles.placeholderText, { color: colors.text }]}>
            Video Player
          </Text>
        </View>
      );
    }

    if (message.type === 'voice') {
      return (
        <View style={[styles.voiceContent, { backgroundColor: colors.card }]}>
          <View style={styles.waveform}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveformBar,
                  { 
                    backgroundColor: colors.primary,
                    height: Math.random() * 40 + 20,
                  }
                ]}
              />
            ))}
          </View>
          <Text style={[styles.voiceDuration, { color: colors.text }]}>
            {message.duration ? `${Math.floor(message.duration / 60)}:${(message.duration % 60).toString().padStart(2, '0')}` : '0:30'}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <>
      {renderPreview()}

      <Modal
        visible={isViewing}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          {Platform.OS === 'web' ? (
            <View style={[styles.modalBackground, { backgroundColor: 'rgba(0, 0, 0, 0.95)' }]}>
              <View style={styles.modalContent}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  {renderContent()}
                </Animated.View>

                <View style={styles.countdownContainer}>
                  <View style={[styles.progressBar, { backgroundColor: colors.cardLight }]}>
                    <Animated.View 
                      style={[
                        styles.progressFill,
                        { 
                          backgroundColor: colors.primary,
                          width: progressWidth,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.countdownText, { color: colors.text }]}>
                    Closing in {countdown}s
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: colors.card }]}
                  onPress={handleClose}
                >
                  <Text style={[styles.closeButtonText, { color: colors.text }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <BlurView intensity={100} tint="dark" style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  {renderContent()}
                </Animated.View>

                <View style={styles.countdownContainer}>
                  <View style={[styles.progressBar, { backgroundColor: colors.cardLight }]}>
                    <Animated.View 
                      style={[
                        styles.progressFill,
                        { 
                          backgroundColor: colors.primary,
                          width: progressWidth,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.countdownText, { color: colors.text }]}>
                    Closing in {countdown}s
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: colors.card }]}
                  onPress={handleClose}
                >
                  <Text style={[styles.closeButtonText, { color: colors.text }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          )}
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
    gap: 8,
  },
  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  viewOnceLabel: {
    fontSize: 12,
  },
  replayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  replayText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  expiredContainer: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 150,
    gap: 6,
    opacity: 0.6,
  },
  expiredText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  viewedTime: {
    fontSize: 11,
  },
  modalContainer: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 500,
    alignItems: 'center',
    gap: 20,
  },
  mediaContent: {
    width: '100%',
    height: height * 0.6,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  voiceContent: {
    width: '100%',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 60,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
  },
  voiceDuration: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  countdownContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
