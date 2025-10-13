import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated, Platform } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { Audio } from 'expo-av';

interface VoicePlayerProps {
  url: string;
  duration: number;
  waveform?: number[];
  size?: 'small' | 'medium' | 'large';
  testID?: string;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  url,
  duration,
  waveform,
  size = 'medium',
  testID,
}) => {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const sizeConfig = {
    small: { button: 32, waveHeight: 24, fontSize: 10 },
    medium: { button: 40, waveHeight: 32, fontSize: 12 },
    large: { button: 48, waveHeight: 40, fontSize: 14 },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    return () => {
      if (sound && Platform.OS !== 'web') {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [sound]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (Platform.OS === 'web') {
      return;
    }
    try {
      if (!sound) {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
        setIsPlaying(true);
      } else {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      const progress = status.positionMillis / (duration * 1000);
      progressAnim.setValue(progress);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentTime(0);
        progressAnim.setValue(0);
      }
    }
  };

  const generateWaveform = () => {
    if (waveform && waveform.length > 0) {
      return waveform;
    }
    return Array.from({ length: 30 }, () => Math.random() * 0.5 + 0.3);
  };

  const waveformData = generateWaveform();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]} testID={testID}>
      <TouchableOpacity
        style={[
          styles.playButton,
          {
            backgroundColor: colors.primary,
            width: config.button,
            height: config.button,
            borderRadius: config.button / 2,
          },
        ]}
        onPress={handlePlayPause}
      >
        {isPlaying ? (
          <Pause size={config.button * 0.5} color={colors.textInverse} fill={colors.textInverse} />
        ) : (
          <Play size={config.button * 0.5} color={colors.textInverse} fill={colors.textInverse} />
        )}
      </TouchableOpacity>

      <View style={styles.waveformContainer}>
        <View style={[styles.waveform, { height: config.waveHeight }]}>
          {waveformData.map((height, index) => {
            const progress = currentTime / duration;
            const isPassed = index / waveformData.length < progress;
            return (
              <View
                key={index}
                style={[
                  styles.waveformBar,
                  {
                    height: `${height * 100}%`,
                    backgroundColor: isPassed ? colors.primary : colors.border,
                  },
                ]}
              />
            );
          })}
        </View>
        <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: config.fontSize }]}>
          {formatTime(isPlaying ? currentTime : duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 12,
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveformBar: {
    flex: 1,
    borderRadius: 2,
  },
  timeText: {
    fontWeight: '600' as const,
    minWidth: 35,
  },
});
