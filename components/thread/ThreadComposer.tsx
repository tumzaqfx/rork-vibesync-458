import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { X, Image as ImageIcon, Video, Mic, Type } from 'lucide-react-native';
import { useThreads } from '@/hooks/thread-store';
import { useAuth } from '@/hooks/auth-store';
import { ThreadPostType } from '@/types/thread';
import { useTheme } from '@/hooks/theme-store';

interface ThreadComposerProps {
  visible: boolean;
  onClose: () => void;
  threadId: string;
  parentPostId: string;
  rootPostId: string;
}

export default function ThreadComposer({
  visible,
  onClose,
  threadId,
  parentPostId,
  rootPostId,
}: ThreadComposerProps) {
  const { addToThread } = useThreads();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [type, setType] = useState<ThreadPostType>('text');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handlePost = () => {
    if (!content.trim() && mediaUrls.length === 0) return;
    if (!user) return;

    addToThread(threadId, {
      authorId: user.id,
      parentId: parentPostId,
      rootId: rootPostId,
      content: content.trim(),
      type,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      hasThread: false,
      threadCount: 0,
    });

    setContent('');
    setMediaUrls([]);
    setType('text');
    onClose();
  };

  const handleAddImage = () => {
    const demoImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
    setMediaUrls([...mediaUrls, demoImage]);
    setType(mediaUrls.length > 0 ? 'mixed' : 'image');
  };

  const handleAddVideo = () => {
    const demoVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    setMediaUrls([...mediaUrls, demoVideo]);
    setType('video');
  };

  const handleRemoveMedia = (index: number) => {
    const newMediaUrls = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(newMediaUrls);
    if (newMediaUrls.length === 0) {
      setType('text');
    }
  };

  const handleVoiceNote = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setType('voice');
    } else {
      setType('text');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add to Thread</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.input}
              placeholder="What's next in your thread?"
              placeholderTextColor={colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={500}
            />

            {mediaUrls.length > 0 && (
              <ScrollView horizontal style={styles.mediaPreview} showsHorizontalScrollIndicator={false}>
                {mediaUrls.map((url, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <Image source={{ uri: url }} style={styles.mediaImage} />
                    <TouchableOpacity
                      style={styles.removeMediaButton}
                      onPress={() => handleRemoveMedia(index)}
                    >
                      <X size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording voice note...</Text>
              </View>
            )}

            <View style={styles.toolbar}>
              <TouchableOpacity style={styles.toolButton} onPress={handleAddImage}>
                <ImageIcon size={24} color={colors.primary} />
                <Text style={styles.toolLabel}>Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toolButton} onPress={handleAddVideo}>
                <Video size={24} color={colors.primary} />
                <Text style={styles.toolLabel}>Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toolButton, isRecording && styles.toolButtonActive]}
                onPress={handleVoiceNote}
              >
                <Mic size={24} color={isRecording ? '#fff' : colors.primary} />
                <Text style={[styles.toolLabel, isRecording && styles.toolLabelActive]}>
                  Voice
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => setType('text')}
              >
                <Type size={24} color={colors.primary} />
                <Text style={styles.toolLabel}>Text</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoText}>
                💡 This will be added to your thread and can be engaged with independently
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.charCount}>{content.length}/500</Text>
            <TouchableOpacity
              style={[
                styles.postButton,
                (!content.trim() && mediaUrls.length === 0) && styles.postButtonDisabled,
              ]}
              onPress={handlePost}
              disabled={!content.trim() && mediaUrls.length === 0}
            >
              <Text style={styles.postButtonText}>Add to Thread</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  container: {
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  input: {
    fontSize: 16,
    color: '#fff',
    minHeight: 120,
    textAlignVertical: 'top' as const,
    marginBottom: 16,
  },
  mediaPreview: {
    marginBottom: 16,
  },
  mediaItem: {
    marginRight: 12,
    position: 'relative' as const,
  },
  mediaImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
  },
  removeMediaButton: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  recordingIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#EF444420',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600' as const,
  },
  toolbar: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 16,
  },
  toolButton: {
    alignItems: 'center' as const,
    padding: 8,
    borderRadius: 12,
  },
  toolButtonActive: {
    backgroundColor: '#3B82F6',
  },
  toolLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  toolLabelActive: {
    color: '#fff',
  },
  info: {
    backgroundColor: '#3B82F610',
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#A0A0A0',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  charCount: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  postButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
