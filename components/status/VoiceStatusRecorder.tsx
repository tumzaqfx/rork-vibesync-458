import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Mic, Square, Play, Pause, Check, X } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { useTheme } from '@/hooks/theme-store';

interface VoiceStatusRecorderProps {
  onComplete: (voiceData: { uri: string; duration: number; waveform: number[] }) => void;
  onCancel: () => void;
  maxDuration?: number;
}

export default function VoiceStatusRecorder({ 
  onComplete, 
  onCancel,
  maxDuration = 60 
}: VoiceStatusRecorderProps) {
  const { colors } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>([]);
  
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setupAudio();
    return () => {
      cleanup();
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.setValue(1);
  };

  useEffect(() => {
    if (isRecording && !isPaused) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isRecording, isPaused]);

  const setupAudio = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }
    } catch (error) {
      console.error('[VoiceStatusRecorder] Setup error:', error);
    }
  };

  const cleanup = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recordingRef.current) {
      try {
        const status = await recordingRef.current.getStatusAsync();
        if (status.isRecording) {
          await recordingRef.current.stopAndUnloadAsync();
        } else if (status.canRecord && !status.isDoneRecording) {
          await recordingRef.current.stopAndUnloadAsync();
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (!errorMessage.includes('already been unloaded')) {
          console.error('[VoiceStatusRecorder] Cleanup recording error:', e);
        }
      } finally {
        recordingRef.current = null;
      }
    }
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.unloadAsync();
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (!errorMessage.includes('already been unloaded')) {
          console.error('[VoiceStatusRecorder] Cleanup sound error:', e);
        }
      } finally {
        soundRef.current = null;
      }
    }
    if (Platform.OS !== 'web') {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      } catch (e) {
        console.error('[VoiceStatusRecorder] Cleanup audio mode error:', e);
      }
    }
  };

  const startRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        console.log('[VoiceStatusRecorder] Web recording not fully supported');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        web: {},
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      setDuration(0);
      setWaveform([]);

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 0.1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });

        const randomAmplitude = Math.random() * 0.7 + 0.3;
        setWaveform(prev => [...prev, randomAmplitude].slice(-50));
      }, 100);

      console.log('[VoiceStatusRecorder] Recording started');
    } catch (error) {
      console.error('[VoiceStatusRecorder] Start recording error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setIsRecording(false);
      setIsPaused(false);
      setRecordingUri(uri);

      console.log('[VoiceStatusRecorder] Recording stopped:', uri);
    } catch (error) {
      console.error('[VoiceStatusRecorder] Stop recording error:', error);
    }
  };

  const playRecording = async () => {
    try {
      if (!recordingUri) return;

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setIsPlaying(true);
      console.log('[VoiceStatusRecorder] Playback started');
    } catch (error) {
      console.error('[VoiceStatusRecorder] Playback error:', error);
    }
  };

  const pausePlayback = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('[VoiceStatusRecorder] Pause error:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  const handleComplete = () => {
    if (recordingUri && duration > 0) {
      onComplete({
        uri: recordingUri,
        duration: Math.floor(duration),
        waveform,
      });
    }
  };

  const handleCancel = async () => {
    await cleanup();
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Voice Status</Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.waveformContainer}>
          {waveform.length > 0 ? (
            <View style={styles.waveform}>
              {waveform.map((amplitude, index) => (
                <View
                  key={index}
                  style={[
                    styles.waveformBar,
                    {
                      height: amplitude * 100,
                      backgroundColor: isRecording ? '#667eea' : colors.textSecondary,
                    },
                  ]}
                />
              ))}
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Mic size={64} color={colors.textSecondary} />
              <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                Tap to start recording
              </Text>
            </View>
          )}
        </View>

        <View style={styles.timerContainer}>
          <Text style={[styles.timer, { color: colors.text }]}>
            {formatTime(duration)}
          </Text>
          <Text style={[styles.maxDuration, { color: colors.textSecondary }]}>
            / {formatTime(maxDuration)}
          </Text>
        </View>

        <View style={styles.controls}>
          {!recordingUri ? (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={[
                  styles.recordButton,
                  { backgroundColor: isRecording ? '#FF6B6B' : '#667eea' },
                ]}
              >
                {isRecording ? (
                  <Square size={32} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Mic size={32} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={styles.playbackControls}>
              <TouchableOpacity
                onPress={isPlaying ? pausePlayback : playRecording}
                style={[styles.playButton, { backgroundColor: colors.card }]}
              >
                {isPlaying ? (
                  <Pause size={24} color={colors.text} />
                ) : (
                  <Play size={24} color={colors.text} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleComplete}
                style={[styles.completeButton, { backgroundColor: '#4ECDC4' }]}
              >
                <Check size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 24,
  },
  waveformContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 40,
  },
  waveform: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: 150,
    gap: 3,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
    minHeight: 4,
  },
  placeholder: {
    alignItems: 'center' as const,
    gap: 16,
  },
  placeholderText: {
    fontSize: 16,
  },
  timerContainer: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    marginBottom: 40,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700' as const,
  },
  maxDuration: {
    fontSize: 20,
    marginLeft: 8,
  },
  controls: {
    alignItems: 'center' as const,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playbackControls: {
    flexDirection: 'row' as const,
    gap: 20,
    alignItems: 'center' as const,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  completeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
