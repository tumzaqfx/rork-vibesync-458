import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Type, Smile, Sticker as StickerIcon, Sparkles, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/theme-store';

interface MediaStatusCreatorProps {
  mediaUri: string;
  mediaType: 'photo' | 'video';
  onComplete: (data: {
    uri: string;
    type: 'photo' | 'video';
    caption?: string;
    overlays?: TextOverlay[];
  }) => void;
  onCancel: () => void;
}

interface TextOverlay {
  id: string;
  text: string;
  position: { x: number; y: number };
  color: string;
  fontSize: number;
  rotation: number;
}

const COLORS = ['#FFFFFF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#667eea', '#f093fb'];
const FONT_SIZES = [24, 32, 40, 48];

export default function MediaStatusCreator({
  mediaUri,
  mediaType,
  onComplete,
  onCancel,
}: MediaStatusCreatorProps) {
  const { colors } = useTheme();
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [overlays, setOverlays] = useState<TextOverlay[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedFontSize, setSelectedFontSize] = useState(FONT_SIZES[1]);

  const handlePost = async () => {
    setIsProcessing(true);
    try {
      await onComplete({
        uri: mediaUri,
        type: mediaType,
        caption: caption.trim() || undefined,
        overlays: overlays.length > 0 ? overlays : undefined,
      });
    } catch (error) {
      console.error('[MediaStatusCreator] Post error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const addTextOverlay = () => {
    if (!editingText.trim()) return;

    const newOverlay: TextOverlay = {
      id: `overlay-${Date.now()}`,
      text: editingText.trim(),
      position: { x: 50, y: 50 },
      color: selectedColor,
      fontSize: selectedFontSize,
      rotation: 0,
    };

    setOverlays([...overlays, newOverlay]);
    setEditingText('');
    setShowTextEditor(false);
  };

  const deleteOverlay = (id: string) => {
    setOverlays(overlays.filter(o => o.id !== id));
    setSelectedOverlay(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {mediaType === 'photo' ? 'Photo Status' : 'Video Status'}
        </Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={isProcessing}
          style={[styles.postButton, { backgroundColor: '#667eea' }]}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.previewContainer}>
        {mediaType === 'photo' ? (
          <Image source={{ uri: mediaUri }} style={styles.mediaPreview} resizeMode="cover" />
        ) : (
          <View style={[styles.mediaPreview, { backgroundColor: colors.card }]}>
            <Text style={[styles.videoPlaceholder, { color: colors.textSecondary }]}>
              Video Preview
            </Text>
          </View>
        )}

        {overlays.map((overlay) => (
          <TouchableOpacity
            key={overlay.id}
            style={[
              styles.textOverlay,
              {
                left: `${overlay.position.x}%`,
                top: `${overlay.position.y}%`,
                transform: [{ rotate: `${overlay.rotation}deg` }],
              },
            ]}
            onPress={() => setSelectedOverlay(overlay.id)}
            onLongPress={() => deleteOverlay(overlay.id)}
          >
            <Text
              style={[
                styles.overlayText,
                {
                  color: overlay.color,
                  fontSize: overlay.fontSize,
                  textShadowColor: 'rgba(0,0,0,0.5)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                },
              ]}
            >
              {overlay.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!showTextEditor ? (
        <>
          <View style={styles.toolsContainer}>
            <TouchableOpacity
              style={[styles.toolButton, { backgroundColor: colors.card }]}
              onPress={() => setShowTextEditor(true)}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.toolGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Type size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.toolLabel, { color: colors.text }]}>Text</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.toolButton, { backgroundColor: colors.card }]}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.toolGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Smile size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.toolLabel, { color: colors.text }]}>Emoji</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.toolButton, { backgroundColor: colors.card }]}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.toolGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <StickerIcon size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.toolLabel, { color: colors.text }]}>Sticker</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.toolButton, { backgroundColor: colors.card }]}>
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                style={styles.toolGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Sparkles size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.toolLabel, { color: colors.text }]}>Filter</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.captionContainer, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.captionInput, { color: colors.text }]}
              placeholder="Add a caption..."
              placeholderTextColor={colors.textSecondary}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={200}
            />
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {caption.length}/200
            </Text>
          </View>
        </>
      ) : (
        <View style={[styles.textEditorContainer, { backgroundColor: colors.card }]}>
          <View style={styles.textEditorHeader}>
            <Text style={[styles.textEditorTitle, { color: colors.text }]}>Add Text</Text>
            <TouchableOpacity onPress={() => setShowTextEditor(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.textEditorInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="Type your text..."
            placeholderTextColor={colors.textSecondary}
            value={editingText}
            onChangeText={setEditingText}
            multiline
            maxLength={100}
            autoFocus
          />

          <View style={styles.colorPicker}>
            <Text style={[styles.pickerLabel, { color: colors.text }]}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorOptions}>
                {COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                  >
                    {selectedColor === color && <Check size={16} color="#000" />}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.fontSizePicker}>
            <Text style={[styles.pickerLabel, { color: colors.text }]}>Size</Text>
            <View style={styles.fontSizeOptions}>
              {FONT_SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedFontSize(size)}
                  style={[
                    styles.fontSizeOption,
                    { backgroundColor: selectedFontSize === size ? '#667eea' : colors.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.fontSizeText,
                      { color: selectedFontSize === size ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={addTextOverlay}
            disabled={!editingText.trim()}
            style={[
              styles.addTextButton,
              {
                backgroundColor: editingText.trim() ? '#4ECDC4' : colors.background,
              },
            ]}
          >
            <Text
              style={[
                styles.addTextButtonText,
                { color: editingText.trim() ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Add Text
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: Platform.OS === 'ios' ? 60 : 12,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center' as const,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 16,
    position: 'relative' as const,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  videoPlaceholder: {
    fontSize: 16,
  },
  textOverlay: {
    position: 'absolute' as const,
    padding: 8,
  },
  overlayText: {
    fontWeight: '700' as const,
  },
  toolsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toolButton: {
    alignItems: 'center' as const,
    borderRadius: 12,
    overflow: 'hidden' as const,
  },
  toolGradient: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  toolLabel: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500' as const,
  },
  captionContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  captionInput: {
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top' as const,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right' as const,
    marginTop: 8,
  },
  textEditorContainer: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
  },
  textEditorHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  textEditorTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  textEditorInput: {
    fontSize: 18,
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top' as const,
  },
  colorPicker: {
    gap: 12,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  colorOptions: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#667eea',
  },
  fontSizePicker: {
    gap: 12,
  },
  fontSizeOptions: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  fontSizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  addTextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  addTextButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
