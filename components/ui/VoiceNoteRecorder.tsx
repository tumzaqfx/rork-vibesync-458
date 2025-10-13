import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useTheme } from '@/hooks/theme-store';
import { Mic, Trash2, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface VoiceNoteRecorderProps {
  maxDuration?: number;
  onRecordingComplete?: (uri: string, duration: number, waveform: number[]) => void;
  onCancel?: () => void;
  testID?: string;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  maxDuration = 180,
  onRecordingComplete,
  onCancel,
  testID,
}) => {
  const { colors } = useTheme();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const durationTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (durationTimer.current) {
        clearInterval(durationTimer.current);
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not Supported', 'Voice recording is not supported on web.');
        return;
      }

      const permission = await Audio.requestPermissionsAsync();
      
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record voice notes.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      setRecording(newRecording);
      setIsRecording(true);
      setDuration(0);
      setWaveformData([]);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      durationTimer.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });

        const randomWaveform = Math.random() * 0.8 + 0.2;
        setWaveformData(prev => [...prev.slice(-50), randomWaveform]);
      }, 1000);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      pulseAnim.setValue(1);
      
      if (durationTimer.current) {
        clearInterval(durationTimer.current);
        durationTimer.current = null;
      }

      await recording.stopAndUnloadAsync();
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      
      if (uri && onRecordingComplete) {
        onRecordingComplete(uri, duration, waveformData);
      }

      setRecording(null);
      setDuration(0);
      setWaveformData([]);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const cancelRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    }

    setIsRecording(false);
    setRecording(null);
    setDuration(0);
    setWaveformData([]);
    pulseAnim.setValue(1);
    
    if (durationTimer.current) {
      clearInterval(durationTimer.current);
      durationTimer.current = null;
    }

    onCancel?.();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording && !recording) {
    return (
      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: colors.primary }]}
        onPress={startRecording}
        testID={testID}
      >
        <Mic size={24} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Record Voice Note</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]} testID={testID}>
      <View style={styles.waveformContainer}>
        {waveformData.slice(-30).map((amplitude, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: amplitude * 40,
                backgroundColor: colors.primary,
                opacity: 0.3 + (index / 30) * 0.7,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <Animated.View
          style={[
            styles.recordingIndicator,
            { backgroundColor: colors.error, transform: [{ scale: pulseAnim }] },
          ]}
        />
        
        <View style={styles.durationContainer}>
          <Text style={[styles.durationText, { color: colors.text }]}>
            {formatDuration(duration)}
          </Text>
          <Text style={[styles.maxDurationText, { color: colors.textSecondary }]}>
            / {formatDuration(maxDuration)}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
            onPress={cancelRecording}
          >
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success + '20' }]}
            onPress={stopRecording}
          >
            <Check size={20} color={colors.success} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 2,
  },
  waveformBar: {
    width: 2,
    borderRadius: 1,
    minHeight: 3,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  maxDurationText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
