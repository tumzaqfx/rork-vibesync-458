import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/theme-store';
import { VoiceNoteRecorder } from '@/components/ui/VoiceNoteRecorder';
import { VoiceNotePlayer } from '@/components/ui/VoiceNotePlayer';
import { X, Image as ImageIcon, Video, Mic, Type, Palette } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface CreateStoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateStory?: (story: {
    type: 'image' | 'video' | 'voice' | 'text';
    mediaUri?: string;
    voiceNote?: { url: string; duration: number; waveform: number[] };
    content: string;
    backgroundColor?: string;
    textColor?: string;
  }) => void;
  testID?: string;
}

const BACKGROUND_COLORS = [
  '#1a1a1a',
  '#3B82F6',
  '#06B6D4',
  '#F59E0B',
  '#10B981',
  '#EF4444',
  '#EC4899',
];

const TEXT_COLORS = ['#FFFFFF', '#000000', '#FFD700', '#FF69B4'];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  visible,
  onClose,
  onCreateStory,
  testID,
}) => {
  const { colors } = useTheme();
  const [storyType, setStoryType] = useState<'image' | 'video' | 'voice' | 'text' | null>(null);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | null>(null);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState<number>(0);
  const [voiceNoteWaveform, setVoiceNoteWaveform] = useState<number[]>([]);
  const [content, setContent] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<string>(BACKGROUND_COLORS[0]);
  const [textColor, setTextColor] = useState<string>(TEXT_COLORS[0]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const handleClose = () => {
    setStoryType(null);
    setMediaUri(null);
    setVoiceNoteUri(null);
    setVoiceNoteDuration(0);
    setVoiceNoteWaveform([]);
    setContent('');
    setBackgroundColor(BACKGROUND_COLORS[0]);
    setTextColor(TEXT_COLORS[0]);
    setShowVoiceRecorder(false);
    setShowColorPicker(false);
    onClose();
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library permission to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      setStoryType('image');
    }
  };

  const handlePickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library permission to select videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      setStoryType('video');
    }
  };

  const handleVoiceRecordingComplete = (uri: string, duration: number, waveform: number[]) => {
    setVoiceNoteUri(uri);
    setVoiceNoteDuration(duration);
    setVoiceNoteWaveform(waveform);
    setStoryType('voice');
    setShowVoiceRecorder(false);
  };

  const handleCancelVoiceRecording = () => {
    setShowVoiceRecorder(false);
  };

  const handleCreateStory = () => {
    if (!storyType) {
      Alert.alert('Error', 'Please select a story type');
      return;
    }

    if (storyType === 'voice' && !voiceNoteUri) {
      Alert.alert('Error', 'Please record a voice note');
      return;
    }

    if (storyType === 'text' && !content.trim()) {
      Alert.alert('Error', 'Please add some text');
      return;
    }

    if ((storyType === 'image' || storyType === 'video') && !mediaUri) {
      Alert.alert('Error', 'Please select media');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onCreateStory?.({
      type: storyType,
      mediaUri: mediaUri || undefined,
      voiceNote: voiceNoteUri
        ? { url: voiceNoteUri, duration: voiceNoteDuration, waveform: voiceNoteWaveform }
        : undefined,
      content,
      backgroundColor: storyType === 'text' || storyType === 'voice' ? backgroundColor : undefined,
      textColor: storyType === 'text' || storyType === 'voice' ? textColor : undefined,
    });

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      testID={testID}
    >
      <View style={styles.container}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} />

        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Create Story</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {!storyType && (
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeButton, { backgroundColor: colors.background }]}
                  onPress={handlePickImage}
                >
                  <ImageIcon size={32} color={colors.primary} />
                  <Text style={[styles.typeButtonText, { color: colors.text }]}>Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeButton, { backgroundColor: colors.background }]}
                  onPress={handlePickVideo}
                >
                  <Video size={32} color={colors.primary} />
                  <Text style={[styles.typeButtonText, { color: colors.text }]}>Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeButton, { backgroundColor: colors.background }]}
                  onPress={() => setShowVoiceRecorder(true)}
                >
                  <Mic size={32} color={colors.primary} />
                  <Text style={[styles.typeButtonText, { color: colors.text }]}>Voice</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeButton, { backgroundColor: colors.background }]}
                  onPress={() => setStoryType('text')}
                >
                  <Type size={32} color={colors.primary} />
                  <Text style={[styles.typeButtonText, { color: colors.text }]}>Text</Text>
                </TouchableOpacity>
              </View>
            )}

            {showVoiceRecorder && (
              <View style={styles.voiceRecorderContainer}>
                <VoiceNoteRecorder
                  maxDuration={180}
                  onRecordingComplete={handleVoiceRecordingComplete}
                  onCancel={handleCancelVoiceRecording}
                />
              </View>
            )}

            {storyType === 'voice' && voiceNoteUri && (
              <View style={styles.previewContainer}>
                <LinearGradient
                  colors={[backgroundColor, backgroundColor + 'DD']}
                  style={styles.voicePreview}
                >
                  <VoiceNotePlayer
                    uri={voiceNoteUri}
                    duration={voiceNoteDuration}
                    waveform={voiceNoteWaveform}
                    size="large"
                  />
                </LinearGradient>

                <TouchableOpacity
                  style={[styles.colorPickerButton, { backgroundColor: colors.background }]}
                  onPress={() => setShowColorPicker(!showColorPicker)}
                >
                  <Palette size={20} color={colors.primary} />
                  <Text style={[styles.colorPickerButtonText, { color: colors.text }]}>
                    Background Color
                  </Text>
                </TouchableOpacity>

                {showColorPicker && (
                  <View style={styles.colorPicker}>
                    {BACKGROUND_COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          backgroundColor === color && styles.colorOptionSelected,
                        ]}
                        onPress={() => setBackgroundColor(color)}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            {storyType === 'text' && (
              <View style={styles.previewContainer}>
                <LinearGradient
                  colors={[backgroundColor, backgroundColor + 'DD']}
                  style={styles.textPreview}
                >
                  <TextInput
                    style={[styles.textInput, { color: textColor }]}
                    placeholder="Type your story..."
                    placeholderTextColor={textColor + '80'}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    maxLength={200}
                    textAlign="center"
                  />
                </LinearGradient>

                <TouchableOpacity
                  style={[styles.colorPickerButton, { backgroundColor: colors.background }]}
                  onPress={() => setShowColorPicker(!showColorPicker)}
                >
                  <Palette size={20} color={colors.primary} />
                  <Text style={[styles.colorPickerButtonText, { color: colors.text }]}>
                    Colors
                  </Text>
                </TouchableOpacity>

                {showColorPicker && (
                  <View style={styles.colorPickerSection}>
                    <Text style={[styles.colorPickerLabel, { color: colors.text }]}>
                      Background
                    </Text>
                    <View style={styles.colorPicker}>
                      {BACKGROUND_COLORS.map((color) => (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            backgroundColor === color && styles.colorOptionSelected,
                          ]}
                          onPress={() => setBackgroundColor(color)}
                        />
                      ))}
                    </View>

                    <Text style={[styles.colorPickerLabel, { color: colors.text }]}>
                      Text Color
                    </Text>
                    <View style={styles.colorPicker}>
                      {TEXT_COLORS.map((color) => (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            textColor === color && styles.colorOptionSelected,
                          ]}
                          onPress={() => setTextColor(color)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {(storyType === 'image' || storyType === 'video') && mediaUri && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: mediaUri }} style={styles.mediaPreview} contentFit="cover" />

                <TextInput
                  style={[styles.captionInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder="Add a caption..."
                  placeholderTextColor={colors.textSecondary}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  maxLength={200}
                />
              </View>
            )}
          </ScrollView>

          {storyType && !showVoiceRecorder && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => {
                  setStoryType(null);
                  setMediaUri(null);
                  setVoiceNoteUri(null);
                  setContent('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: colors.primary }]}
                onPress={handleCreateStory}
              >
                <Text style={styles.createButtonText}>Share Story</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  typeButton: {
    width: 100,
    height: 100,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  voiceRecorderContainer: {
    marginVertical: 20,
  },
  previewContainer: {
    gap: 16,
  },
  voicePreview: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  textPreview: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  textInput: {
    fontSize: 24,
    fontWeight: '600' as const,
    textAlign: 'center',
    width: '100%',
  },
  mediaPreview: {
    width: '100%',
    height: 400,
    borderRadius: 16,
  },
  captionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    maxHeight: 100,
  },
  colorPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  colorPickerButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  colorPickerSection: {
    gap: 12,
  },
  colorPickerLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  createButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
