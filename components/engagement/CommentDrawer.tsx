import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { Post, Comment } from '@/types';
import { X, MessageCircle, Mic, Send } from 'lucide-react-native';
import { VoiceNoteRecorder } from '@/components/ui/VoiceNoteRecorder';
import { VoiceNotePlayer } from '@/components/ui/VoiceNotePlayer';

interface CommentDrawerProps {
  visible: boolean;
  onClose: () => void;
  post: Post;
  comments?: Comment[];
  onComment?: (postId: string, content: string, isVoice?: boolean) => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  visible,
  onClose,
  post,
  comments = [],
  onComment,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState<string>('');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState<boolean>(false);
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | null>(null);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState<number>(0);
  const [voiceNoteWaveform, setVoiceNoteWaveform] = useState<number[]>([]);

  const isPostAuthor = user?.id === post.userId;

  const handleVoiceRecordingComplete = (uri: string, duration: number, waveform: number[]) => {
    console.log('[CommentDrawer] Voice recording complete:', { uri, duration, waveformLength: waveform.length });
    setVoiceNoteUri(uri);
    setVoiceNoteDuration(duration);
    setVoiceNoteWaveform(waveform);
    setShowVoiceRecorder(false);
  };

  const handleCancelVoiceRecording = () => {
    setShowVoiceRecorder(false);
    setVoiceNoteUri(null);
    setVoiceNoteDuration(0);
    setVoiceNoteWaveform([]);
  };

  const handlePostComment = async () => {
    if (!commentText.trim() && !voiceNoteUri) return;

    setIsPosting(true);
    try {
      if (voiceNoteUri) {
        console.log('Posting voice comment, duration:', voiceNoteDuration);
        Alert.alert('Success', 'Voice comment posted!');
        onComment?.(post.id, '', true);
      } else {
        console.log('Posting text comment:', commentText);
        Alert.alert('Success', 'Comment posted!');
        onComment?.(post.id, commentText, false);
      }
      
      setCommentText('');
      setVoiceNoteUri(null);
      setVoiceNoteDuration(0);
      setVoiceNoteWaveform([]);
      onClose();
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <BlurView intensity={80} style={StyleSheet.absoluteFill} />
        </TouchableOpacity>

        <View style={[styles.drawer, { backgroundColor: colors.card }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <MessageCircle size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>Comments</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.postPreview, { backgroundColor: colors.background }]}>
            <View style={styles.postHeader}>
              <Avatar uri={post.profileImage} size={32} />
              <View style={styles.postAuthorInfo}>
                <Text style={[styles.postAuthor, { color: colors.text }]}>
                  @{post.username}
                </Text>
                <Text style={[styles.postTimestamp, { color: colors.textSecondary }]}>
                  {post.timestamp}
                </Text>
              </View>
            </View>
            <Text style={[styles.postContent, { color: colors.text }]} numberOfLines={2}>
              {post.content}
            </Text>
          </View>

          <ScrollView
            style={styles.commentsSection}
            showsVerticalScrollIndicator={false}
          >
            {comments.length === 0 ? (
              <View style={styles.emptyState}>
                <MessageCircle size={48} color={colors.textSecondary} opacity={0.3} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No comments yet
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  Be the first to comment!
                </Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Avatar uri={comment.profileImage} size={36} />
                  <View style={styles.commentContent}>
                    <Text style={[styles.commentAuthor, { color: colors.text }]}>
                      @{comment.username}
                    </Text>
                    {comment.voiceNote ? (
                      <VoiceNotePlayer
                        uri={comment.voiceNote.url}
                        duration={comment.voiceNote.duration}
                        waveform={comment.voiceNote.waveform}
                        size="small"
                      />
                    ) : (
                      <Text style={[styles.commentText, { color: colors.text }]}>
                        {comment.content}
                      </Text>
                    )}
                    <Text style={[styles.commentTimestamp, { color: colors.textSecondary }]}>
                      {comment.timestamp}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {showVoiceRecorder ? (
            <View style={[
              styles.voiceRecorderContainer, 
              { 
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 16),
              }
            ]}>
              <VoiceNoteRecorder
                maxDuration={30}
                onRecordingComplete={handleVoiceRecordingComplete}
                onCancel={handleCancelVoiceRecording}
              />
            </View>
          ) : (
            <View style={[
              styles.inputContainer, 
              { 
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 16),
              }
            ]}>
              {voiceNoteUri ? (
                <View style={styles.voicePreviewContainer}>
                  <VoiceNotePlayer
                    uri={voiceNoteUri}
                    duration={voiceNoteDuration}
                    waveform={voiceNoteWaveform}
                    size="small"
                  />
                  <TouchableOpacity
                    style={[styles.removeVoiceButton, { backgroundColor: colors.error }]}
                    onPress={handleCancelVoiceRecording}
                  >
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Avatar uri={user?.profileImage} size={36} />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    placeholder="Add a comment..."
                    placeholderTextColor={colors.textSecondary}
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={[styles.voiceButton, { backgroundColor: colors.background }]}
                    onPress={() => setShowVoiceRecorder(true)}
                  >
                    <Mic size={20} color={colors.primary} />
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: (!commentText.trim() && !voiceNoteUri) || isPosting ? 0.5 : 1,
                  },
                ]}
                onPress={handlePostComment}
                disabled={(!commentText.trim() && !voiceNoteUri) || isPosting}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  postPreview: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postAuthorInfo: {
    marginLeft: 8,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  postTimestamp: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 18,
  },
  commentsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 80,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceRecorderContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  voicePreviewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeVoiceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
