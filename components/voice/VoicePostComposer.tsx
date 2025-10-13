import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView, TextInput, Platform } from 'react-native';
import { useTheme } from '@/hooks/theme-store';
import { VoiceNoteRecorder } from '@/components/ui/VoiceNoteRecorder';
import { VoiceNotePlayer } from '@/components/ui/VoiceNotePlayer';
import { X, ImageIcon, Sparkles } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

interface VoicePostComposerProps {
  onPublish?: (data: {
    voiceUri: string;
    duration: number;
    waveform: number[];
    coverImage?: string;
    caption: string;
  }) => void;
  onCancel?: () => void;
  testID?: string;
}

export const VoicePostComposer: React.FC<VoicePostComposerProps> = ({
  onPublish,
  onCancel,
  testID,
}) => {
  const { colors } = useTheme();
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const handleRecordingComplete = (uri: string, recordDuration: number, recordWaveform: number[]) => {
    setVoiceUri(uri);
    setDuration(recordDuration);
    setWaveform(recordWaveform);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handlePickCoverImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library permission to add a cover image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverImage(result.assets[0].uri);
        
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.error('Error picking cover image:', error);
      Alert.alert('Error', 'Failed to pick cover image.');
    }
  };

  const handleGenerateCover = async () => {
    Alert.alert(
      'Generate Cover',
      'AI cover generation will be available soon! For now, please upload an image.',
      [{ text: 'OK' }]
    );
  };

  const handlePublish = async () => {
    if (!voiceUri) {
      Alert.alert('No Recording', 'Please record a voice note first.');
      return;
    }

    if (duration < 3) {
      Alert.alert('Too Short', 'Voice posts must be at least 3 seconds long.');
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Add Caption', 'Please add a caption to your voice post.');
      return;
    }

    setIsPublishing(true);

    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      onPublish?.({
        voiceUri,
        duration,
        waveform,
        coverImage: coverImage || undefined,
        caption: caption.trim(),
      });

      setVoiceUri(null);
      setDuration(0);
      setWaveform([]);
      setCoverImage(null);
      setCaption('');
    } catch (error) {
      console.error('Error publishing voice post:', error);
      Alert.alert('Error', 'Failed to publish voice post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    if (voiceUri || caption.trim() || coverImage) {
      Alert.alert(
        'Discard Voice Post?',
        'Are you sure you want to discard this voice post?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setVoiceUri(null);
              setDuration(0);
              setWaveform([]);
              setCoverImage(null);
              setCaption('');
              onCancel?.();
            },
          },
        ]
      );
    } else {
      onCancel?.();
    }
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleReRecord = () => {
    Alert.alert(
      'Re-record Voice Note?',
      'This will delete your current recording.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Re-record',
          style: 'destructive',
          onPress: () => {
            setVoiceUri(null);
            setDuration(0);
            setWaveform([]);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      testID={testID}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Voice Post</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Voice Recording</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Record up to 60 seconds
        </Text>

        {!voiceUri ? (
          <VoiceNoteRecorder
            maxDuration={60}
            onRecordingComplete={handleRecordingComplete}
            testID={`${testID}-recorder`}
          />
        ) : (
          <View style={styles.recordedContainer}>
            <VoiceNotePlayer
              uri={voiceUri}
              duration={duration}
              waveform={waveform}
              size="large"
              testID={`${testID}-player`}
            />
            <TouchableOpacity
              style={[styles.reRecordButton, { backgroundColor: colors.card }]}
              onPress={handleReRecord}
            >
              <Text style={[styles.reRecordText, { color: colors.primary }]}>
                Re-record
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {voiceUri && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cover Image (Optional)</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Add a visual to your voice post
            </Text>

            {coverImage ? (
              <View style={styles.coverImageContainer}>
                <Image source={{ uri: coverImage }} style={styles.coverImage} />
                <TouchableOpacity
                  style={[styles.removeCoverButton, { backgroundColor: colors.error }]}
                  onPress={handleRemoveCover}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.coverActions}>
                <TouchableOpacity
                  style={[styles.coverActionButton, { backgroundColor: colors.card }]}
                  onPress={handlePickCoverImage}
                >
                  <ImageIcon size={24} color={colors.primary} />
                  <Text style={[styles.coverActionText, { color: colors.text }]}>
                    Upload Image
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.coverActionButton, { backgroundColor: colors.card }]}
                  onPress={handleGenerateCover}
                >
                  <Sparkles size={24} color={colors.primary} />
                  <Text style={[styles.coverActionText, { color: colors.text }]}>
                    AI Generate
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Caption</Text>
            <TextInput
              style={[
                styles.captionInput,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="What's this voice post about?"
              placeholderTextColor={colors.textSecondary}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={280}
              testID={`${testID}-caption-input`}
            />
            <Text style={[styles.characterCount, { color: colors.textSecondary }]}>
              {caption.length}/280
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.publishButton,
              {
                backgroundColor: colors.primary,
                opacity: isPublishing ? 0.6 : 1,
              },
            ]}
            onPress={handlePublish}
            disabled={isPublishing}
            testID={`${testID}-publish-button`}
          >
            <Text style={styles.publishButtonText}>
              {isPublishing ? 'Publishing...' : 'Publish Voice Post'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  recordedContainer: {
    gap: 12,
  },
  reRecordButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  reRecordText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  coverImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  removeCoverButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverActions: {
    flexDirection: 'row',
    gap: 12,
  },
  coverActionButton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  coverActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  captionInput: {
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  publishButton: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
