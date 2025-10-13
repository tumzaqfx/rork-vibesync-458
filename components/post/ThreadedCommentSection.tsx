import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { Comment } from '@/types';
import { ThreadedCommentItem } from './ThreadedCommentItem';
import { Send, Mic, X } from 'lucide-react-native';
import { VoiceNoteRecorder } from '@/components/ui/VoiceNoteRecorder';
import { VoiceNotePlayer } from '@/components/ui/VoiceNotePlayer';

interface ThreadedCommentSectionProps {
  comments: Comment[];
  postAuthorId: string;
  onCommentLike: (commentId: string) => void;
  onCommentReply: (commentId: string, content: string, isVoice?: boolean, voiceData?: any) => void;
  onUserPress: (userId: string) => void;
  onPostComment: (content: string, isVoice?: boolean, voiceData?: any) => void;
}

export const ThreadedCommentSection: React.FC<ThreadedCommentSectionProps> = ({
  comments,
  postAuthorId,
  onCommentLike,
  onCommentReply,
  onUserPress,
  onPostComment,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | null>(null);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState(0);
  const [voiceNoteWaveform, setVoiceNoteWaveform] = useState<number[]>([]);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  const isPostAuthor = user?.id === postAuthorId;

  const handleVoiceRecordingComplete = (uri: string, duration: number, waveform: number[]) => {
    setVoiceNoteUri(uri);
    setVoiceNoteDuration(duration);
    setVoiceNoteWaveform(waveform);
    setIsRecordingVoice(false);
  };

  const handleCancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    setVoiceNoteUri(null);
    setVoiceNoteDuration(0);
    setVoiceNoteWaveform([]);
  };

  const handlePostComment = () => {
    if (!commentText.trim() && !voiceNoteUri) return;

    if (voiceNoteUri) {
      onPostComment('', true, {
        url: voiceNoteUri,
        duration: voiceNoteDuration,
        waveform: voiceNoteWaveform,
      });
    } else {
      onPostComment(commentText, false);
    }

    setCommentText('');
    setVoiceNoteUri(null);
    setVoiceNoteDuration(0);
    setVoiceNoteWaveform([]);
  };

  const handleReply = (commentId: string) => {
    if (!replyText.trim()) return;
    onCommentReply(commentId, replyText);
    setReplyText('');
    setReplyingTo(null);
  };

  const toggleThread = (commentId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedThreads(newExpanded);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <ThreadedCommentItem
      comment={item}
      postAuthorId={postAuthorId}
      onLike={onCommentLike}
      onReply={(commentId) => setReplyingTo(commentId)}
      onUserPress={onUserPress}
      isExpanded={expandedThreads.has(item.id)}
      onToggleExpand={() => toggleThread(item.id)}
      depth={0}
      replyingTo={replyingTo}
      replyText={replyText}
      onReplyTextChange={setReplyText}
      onSubmitReply={handleReply}
      onCancelReply={() => setReplyingTo(null)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No comments yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Be the first to comment!
            </Text>
          </View>
        }
      />

      {isRecordingVoice ? (
        <View style={[styles.voiceRecorderContainer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom }]}>
          <VoiceNoteRecorder
            maxDuration={30}
            onRecordingComplete={handleVoiceRecordingComplete}
            onCancel={handleCancelVoiceRecording}
          />
        </View>
      ) : (
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Avatar uri={user?.profileImage} size={36} style={styles.inputAvatar} />
          
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
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            />
          )}

          {isPostAuthor && !voiceNoteUri && (
            <TouchableOpacity
              style={[styles.voiceButton, { backgroundColor: colors.primary + '20' }]}
              onPress={() => setIsRecordingVoice(true)}
            >
              <Mic size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.primary },
              (!commentText.trim() && !voiceNoteUri) && styles.sendButtonDisabled,
            ]}
            onPress={handlePostComment}
            disabled={!commentText.trim() && !voiceNoteUri}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  inputAvatar: {
    marginBottom: 4,
  },
  input: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  voiceRecorderContainer: {
    padding: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
