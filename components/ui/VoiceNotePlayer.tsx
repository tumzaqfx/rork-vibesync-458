import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { useTheme } from '@/hooks/theme-store';
import { Play, Pause } from 'lucide-react-native';

interface VoiceNotePlayerProps {
  uri: string;
  duration: number;
  waveform?: number[];
  size?: 'small' | 'medium' | 'large';
  testID?: string;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  uri,
  duration,
  waveform = [],
  size = 'medium',
  testID,
}) => {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: duration > 0 ? position / duration : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [position, duration, progressAnim]);

  const loadSound = async () => {
    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsLoading(false);
      return newSound;
    } catch (error) {
      console.error('Error loading sound:', error);
      setIsLoading(false);
      return null;
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const togglePlayback = async () => {
    try {
      let currentSound = sound;
      
      if (!currentSound) {
        currentSound = await loadSound();
        if (!currentSound) return;
      }

      if (isPlaying) {
        await currentSound.pauseAsync();
        setIsPlaying(false);
      } else {
        await currentSound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          button: styles.buttonSmall,
          icon: 14,
          waveformHeight: 20,
        };
      case 'large':
        return {
          container: styles.containerLarge,
          button: styles.buttonLarge,
          icon: 24,
          waveformHeight: 40,
        };
      default:
        return {
          container: styles.containerMedium,
          button: styles.buttonMedium,
          icon: 18,
          waveformHeight: 28,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const displayWaveform = waveform.length > 0 ? waveform : Array(40).fill(0.5);

  return (
    <View style={[styles.container, sizeStyles.container, { backgroundColor: colors.card }]} testID={testID}>
      <TouchableOpacity
        style={[styles.playButton, sizeStyles.button, { backgroundColor: colors.primary }]}
        onPress={togglePlayback}
        disabled={isLoading}
      >
        {isPlaying ? (
          <Pause size={sizeStyles.icon} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Play size={sizeStyles.icon} color="#FFFFFF" fill="#FFFFFF" />
        )}
      </TouchableOpacity>

      <View style={styles.waveformContainer}>
        <View style={[styles.waveform, { height: sizeStyles.waveformHeight }]}>
          {displayWaveform.map((amplitude, index) => {
            const progress = position / duration;
            const barProgress = index / displayWaveform.length;
            const isPlayed = barProgress <= progress;
            
            return (
              <View
                key={index}
                style={[
                  styles.waveformBar,
                  {
                    height: Math.max(amplitude * sizeStyles.waveformHeight, 4),
                    backgroundColor: isPlayed ? colors.primary : colors.textSecondary,
                    opacity: isPlayed ? 1 : 0.3,
                  },
                ]}
              />
            );
          })}
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(position)}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  containerSmall: {
    padding: 6,
    gap: 6,
    borderRadius: 10,
  },
  containerMedium: {
    padding: 10,
    gap: 10,
    borderRadius: 12,
  },
  containerLarge: {
    padding: 14,
    gap: 14,
    borderRadius: 14,
  },
  playButton: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  buttonMedium: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  buttonLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  waveformContainer: {
    flex: 1,
    gap: 6,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
  },
  waveformBar: {
    flex: 1,
    borderRadius: 1,
    minHeight: 3,
    width: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
});
