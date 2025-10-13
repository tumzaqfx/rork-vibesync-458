import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  Camera,
  Image as ImageIcon,
  Mic,
  Send,
  Smile,
  X,
  Paperclip,
  Gift,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { GifPicker } from '@/components/gif/GifPicker';
import { StickerPicker } from '@/components/sticker/StickerPicker';

interface MessageComposerProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'video' | 'voice' | 'gif' | 'sticker') => void;
  onSendMedia?: (uri: string, type: 'image' | 'video') => void;
  onSendVoice?: (uri: string, duration: number) => void;
  replyTo?: { id: string; content: string; sender: string } | null;
  onCancelReply?: () => void;
}

const EMOJIS = ['😀', '😂', '❤️', '🔥', '👍', '🎉', '😍', '🥳', '😎', '🤔', '👏', '🙌'];

export function MessageComposer({
  onSendMessage,
  onSendMedia,
  onSendVoice,
  replyTo,
  onCancelReply,
}: MessageComposerProps) {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleGifSelect = (gifUrl: string) => {
    onSendMessage(gifUrl, 'gif');
    setShowGifPicker(false);
  };

  const handleStickerSelect = (sticker: string) => {
    onSendMessage(sticker, 'sticker');
    setShowStickerPicker(false);
  };

  const handleCamera = () => {
    setShowMediaOptions(false);
    console.log('Open camera');
  };

  const handleGallery = () => {
    setShowMediaOptions(false);
    console.log('Open gallery');
  };

  const handleFile = () => {
    setShowMediaOptions(false);
    console.log('Open file picker');
  };

  const toggleRecording = () => {
    if (isRecording) {
      console.log('Stop recording');
      setIsRecording(false);
    } else {
      console.log('Start recording');
      setIsRecording(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {replyTo && (
        <View style={[styles.replyContainer, { backgroundColor: colors.background }]}>
          <View style={styles.replyContent}>
            <View style={[styles.replyLine, { backgroundColor: colors.primary }]} />
            <View style={styles.replyText}>
              <Text style={[styles.replyLabel, { color: colors.primary }]}>
                Replying to {replyTo.sender}
              </Text>
              <Text style={[styles.replyMessage, { color: colors.textSecondary }]} numberOfLines={1}>
                {replyTo.content}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onCancelReply} style={styles.replyClose}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {showEmojiPicker && (
        <View style={[styles.emojiPicker, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiScroll}>
            {EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emojiButton}
                onPress={() => handleEmojiSelect(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowMediaOptions(true)}
        >
          <Paperclip size={22} color={colors.primary} />
        </TouchableOpacity>

        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Message..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={1000}
          />
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile size={22} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowGifPicker(true)}
        >
          <Gift size={22} color={colors.primary} />
        </TouchableOpacity>

        {message.trim() ? (
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={handleSend}
          >
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording && { backgroundColor: colors.error },
            ]}
            onPress={toggleRecording}
            onLongPress={toggleRecording}
          >
            <Mic size={22} color={isRecording ? '#fff' : colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showMediaOptions}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMediaOptions(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowMediaOptions(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Send Media</Text>
              <TouchableOpacity onPress={() => setShowMediaOptions(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.mediaOption} onPress={handleCamera}>
                <View style={[styles.mediaIcon, { backgroundColor: colors.primary }]}>
                  <Camera size={24} color="#fff" />
                </View>
                <Text style={[styles.mediaLabel, { color: colors.text }]}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaOption} onPress={handleGallery}>
                <View style={[styles.mediaIcon, { backgroundColor: colors.primary }]}>
                  <ImageIcon size={24} color="#fff" />
                </View>
                <Text style={[styles.mediaLabel, { color: colors.text }]}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaOption} onPress={handleFile}>
                <View style={[styles.mediaIcon, { backgroundColor: colors.primary }]}>
                  <Paperclip size={24} color="#fff" />
                </View>
                <Text style={[styles.mediaLabel, { color: colors.text }]}>File</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <GifPicker
        visible={showGifPicker}
        onClose={() => setShowGifPicker(false)}
        onSelectGif={handleGifSelect}
      />

      <StickerPicker
        visible={showStickerPicker}
        onClose={() => setShowStickerPicker(false)}
        onSelectSticker={handleStickerSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  replyContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  replyLine: {
    width: 3,
    borderRadius: 2,
  },
  replyText: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  replyMessage: {
    fontSize: 14,
  },
  replyClose: {
    padding: 4,
  },
  emojiPicker: {
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  emojiScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  emojiButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 32,
    maxHeight: 96,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  modalBody: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  mediaOption: {
    alignItems: 'center',
    gap: 12,
  },
  mediaIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
