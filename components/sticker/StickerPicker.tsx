import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';

interface StickerPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: string) => void;
}

const STICKER_CATEGORIES = [
  {
    id: 'emotions',
    name: 'Emotions',
    stickers: ['😀', '😂', '🥰', '😍', '🤩', '😎', '🥳', '😭', '😱', '🤔', '😴', '🤯'],
  },
  {
    id: 'gestures',
    name: 'Gestures',
    stickers: ['👍', '👎', '👏', '🙌', '👊', '✊', '🤝', '🙏', '💪', '🤘', '✌️', '🤞'],
  },
  {
    id: 'hearts',
    name: 'Hearts',
    stickers: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕'],
  },
  {
    id: 'symbols',
    name: 'Symbols',
    stickers: ['🔥', '⭐', '✨', '💫', '⚡', '💥', '💯', '✅', '❌', '⚠️', '🎉', '🎊'],
  },
  {
    id: 'animals',
    name: 'Animals',
    stickers: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  },
  {
    id: 'food',
    name: 'Food',
    stickers: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈'],
  },
];

export function StickerPicker({ visible, onClose, onSelectSticker }: StickerPickerProps) {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(STICKER_CATEGORIES[0]);

  const handleSelectSticker = (sticker: string) => {
    onSelectSticker(sticker);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.container, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Choose a Sticker</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContainer}>
            <FlatList
              horizontal
              data={STICKER_CATEGORIES}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    { backgroundColor: colors.background },
                    selectedCategory.id === item.id && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: colors.text },
                      selectedCategory.id === item.id && { color: colors.textInverse },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <FlatList
            data={selectedCategory.stickers}
            keyExtractor={(item, index) => `${selectedCategory.id}-${index}`}
            numColumns={6}
            contentContainerStyle={styles.stickerList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stickerItem}
                onPress={() => handleSelectSticker(item)}
              >
                <Text style={styles.stickerEmoji}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '60%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingVertical: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  stickerList: {
    padding: 16,
  },
  stickerItem: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  stickerEmoji: {
    fontSize: 32,
  },
});
