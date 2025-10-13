import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { StatusVoiceContent } from '@/types/status';

interface VoiceStatusPlayerProps {
  voiceContent: StatusVoiceContent;
  onPlaybackComplete?: () => void;
  isPaused?: boolean;
}

export default function VoiceStatusPlayer({
  voiceContent,
  onPlaybackComplete,
  isPaused = false,
}: VoiceStatusPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const waveformAnims = useRef(
    voiceContent.waveform.map(() => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    setupAudio();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isPaused && isPlaying) {
      pausePlayback();
    } else if (!isPaused && !isPlaying) {
      playAudio();
    }
  }, [isPaused]);

  useEffect(() => {
    if (isPlaying) {
      animateWaveform();
    }
  }, [isPlaying]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('[VoiceStatusPlayer] Setup error:', error);
    }
  };

  const cleanup = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error('[VoiceStatusPlayer] Cleanup error:', error);
      }
    }
  };

  const playAudio = async () => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: voiceContent.uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('[VoiceStatusPlayer] Play error:', error);
    }
  };

  const pausePlayback = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('[VoiceStatusPlayer] Pause error:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        onPlaybackComplete?.();
      }
    }
  };

  const animateWaveform = () => {
    const animations = waveformAnims.map((anim) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random() * 0.7 + 0.3,
            duration: 200 + Math.random() * 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: Math.random() * 0.7 + 0.3,
            duration: 200 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.parallel(animations).start();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const gradientColors = voiceContent.gradient || ['#667eea', '#764ba2'];

  return (
    <LinearGradient
      colors={gradientColors as any}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.waveformContainer}>
          {voiceContent.waveform.map((amplitude, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: isPlaying
                    ? waveformAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, amplitude * 150],
                      })
                    : amplitude * 100,
                  opacity: waveformAnims[index],
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={isPlaying ? pausePlayback : playAudio}
        >
          {isPlaying ? (
            <Pause size={40} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Play size={40} color="#FFFFFF" fill="#FFFFFF" />
          )}
        </TouchableOpacity>

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(voiceContent.duration)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  content: {
    alignItems: 'center' as const,
    gap: 40,
  },
  waveformContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: 200,
    gap: 4,
  },
  waveformBar: {
    width: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    minHeight: 20,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
