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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/theme-store';
import { useEngagement } from '@/hooks/engagement-store';
import { Post } from '@/types';
import { X, Repeat2 } from 'lucide-react-native';

interface RevibeSheetProps {
  visible: boolean;
  onClose: () => void;
  post: Post;
  onRevibe?: (postId: string, caption?: string) => void;
}

export const RevibeSheet: React.FC<RevibeSheetProps> = ({
  visible,
  onClose,
  post,
  onRevibe,
}) => {
  const { colors } = useTheme();
  const { revibePost, isPostRevibed } = useEngagement();
  const [caption, setCaption] = useState<string>('');
  const [isRevibing, setIsRevibing] = useState<boolean>(false);

  const isRevibed = isPostRevibed(post.id);

  const handleRevibe = async () => {
    setIsRevibing(true);
    try {
      const result = await revibePost(post.id, caption.trim() || undefined);
      
      if (result) {
        console.log('Post revibed successfully');
        onRevibe?.(post.id, caption.trim() || undefined);
      } else {
        console.log('Post unrevibed');
      }
      
      setCaption('');
      onClose();
    } catch (error) {
      console.error('Error revibing post:', error);
    } finally {
      setIsRevibing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
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

        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Repeat2 size={24} color={colors.primary} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                {isRevibed ? 'Undo Revibe?' : 'Revibe to your followers?'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.postPreview, { backgroundColor: colors.background }]}>
              <Text style={[styles.postAuthor, { color: colors.textSecondary }]}>
                @{post.username}
              </Text>
              <Text style={[styles.postContent, { color: colors.text }]} numberOfLines={3}>
                {post.content}
              </Text>
            </View>

            {!isRevibed && (
              <View style={styles.captionContainer}>
                <Text style={[styles.captionLabel, { color: colors.textSecondary }]}>
                  Add a caption (optional)
                </Text>
                <TextInput
                  style={[
                    styles.captionInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="What's on your mind?"
                  placeholderTextColor={colors.textSecondary}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  maxLength={280}
                  textAlignVertical="top"
                />
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {caption.length}/280
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.background }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.revibeButton,
                {
                  backgroundColor: isRevibed ? colors.error : colors.primary,
                  opacity: isRevibing ? 0.6 : 1,
                },
              ]}
              onPress={handleRevibe}
              disabled={isRevibing}
            >
              <Repeat2 size={20} color="#FFFFFF" />
              <Text style={styles.revibeText}>
                {isRevibing ? 'Processing...' : isRevibed ? 'Undo Revibe' : 'Revibe'}
              </Text>
            </TouchableOpacity>
          </View>
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
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  postPreview: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  captionContainer: {
    marginBottom: 20,
  },
  captionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  captionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  revibeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  revibeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
