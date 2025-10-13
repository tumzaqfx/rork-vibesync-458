import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Modal, Pressable, ActivityIndicator } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';

interface GifPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectGif: (gifUrl: string) => void;
}

interface Gif {
  id: string;
  url: string;
  preview: string;
  title: string;
}

const MOCK_GIFS: Gif[] = [
  {
    id: '1',
    url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    preview: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/200w.gif',
    title: 'Happy Dance',
  },
  {
    id: '2',
    url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    preview: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200w.gif',
    title: 'Thumbs Up',
  },
  {
    id: '3',
    url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    preview: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/200w.gif',
    title: 'Excited',
  },
  {
    id: '4',
    url: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    preview: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/200w.gif',
    title: 'Laughing',
  },
  {
    id: '5',
    url: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif',
    preview: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/200w.gif',
    title: 'Love',
  },
  {
    id: '6',
    url: 'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif',
    preview: 'https://media.giphy.com/media/l0MYC0LajbaPoEADu/200w.gif',
    title: 'Clapping',
  },
];

export function GifPicker({ visible, onClose, onSelectGif }: GifPickerProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<Gif[]>(MOCK_GIFS);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    setTimeout(() => {
      const filtered = MOCK_GIFS.filter(gif =>
        gif.title.toLowerCase().includes(query.toLowerCase())
      );
      setGifs(filtered);
      setLoading(false);
    }, 500);
  };

  const handleSelectGif = (gif: Gif) => {
    onSelectGif(gif.url);
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
            <Text style={[styles.title, { color: colors.text }]}>Choose a GIF</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search GIFs..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={gifs}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.gifList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.gifItem}
                  onPress={() => handleSelectGif(item)}
                >
                  <Image
                    source={{ uri: item.preview }}
                    style={styles.gifImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No GIFs found
                  </Text>
                </View>
              }
            />
          )}
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
    height: '70%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifList: {
    padding: 8,
  },
  gifItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});
