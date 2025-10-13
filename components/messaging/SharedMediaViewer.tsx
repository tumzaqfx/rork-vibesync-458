import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { X, Download, Share2, Image as ImageIcon, Video, FileText } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  thumbnail?: string;
  fileName?: string;
  createdAt: Date;
}

interface SharedMediaViewerProps {
  visible: boolean;
  onClose: () => void;
  conversationId: string;
}

const MOCK_MEDIA: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: '3',
    type: 'video',
    url: 'https://example.com/video.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200',
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200',
    createdAt: new Date(Date.now() - 345600000),
  },
  {
    id: '5',
    type: 'file',
    url: 'https://example.com/document.pdf',
    fileName: 'Project_Proposal.pdf',
    createdAt: new Date(Date.now() - 432000000),
  },
  {
    id: '6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200',
    createdAt: new Date(Date.now() - 518400000),
  },
];

export function SharedMediaViewer({ visible, onClose, conversationId }: SharedMediaViewerProps) {
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'photos' | 'videos' | 'files'>('photos');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia = MOCK_MEDIA.filter(item => {
    if (selectedTab === 'photos') return item.type === 'image';
    if (selectedTab === 'videos') return item.type === 'video';
    if (selectedTab === 'files') return item.type === 'file';
    return false;
  });

  const renderMediaItem = ({ item }: { item: MediaItem }) => {
    if (item.type === 'file') {
      return (
        <TouchableOpacity
          style={[styles.fileItem, { backgroundColor: colors.background }]}
          onPress={() => setSelectedMedia(item)}
        >
          <View style={[styles.fileIcon, { backgroundColor: colors.primary }]}>
            <FileText size={24} color="#fff" />
          </View>
          <View style={styles.fileInfo}>
            <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
              {item.fileName}
            </Text>
            <Text style={[styles.fileDate, { color: colors.textSecondary }]}>
              {item.createdAt.toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.mediaItem}
        onPress={() => setSelectedMedia(item)}
      >
        <Image
          source={{ uri: item.thumbnail || item.url }}
          style={styles.mediaThumbnail}
          resizeMode="cover"
        />
        {item.type === 'video' && (
          <View style={styles.videoOverlay}>
            <Video size={24} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={[styles.container, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: colors.text }]}>Shared Media</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={[styles.tabs, { backgroundColor: colors.background }]}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === 'photos' && [styles.activeTab, { borderBottomColor: colors.primary }],
                ]}
                onPress={() => setSelectedTab('photos')}
              >
                <ImageIcon size={20} color={selectedTab === 'photos' ? colors.primary : colors.textSecondary} />
                <Text
                  style={[
                    styles.tabText,
                    { color: selectedTab === 'photos' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Photos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === 'videos' && [styles.activeTab, { borderBottomColor: colors.primary }],
                ]}
                onPress={() => setSelectedTab('videos')}
              >
                <Video size={20} color={selectedTab === 'videos' ? colors.primary : colors.textSecondary} />
                <Text
                  style={[
                    styles.tabText,
                    { color: selectedTab === 'videos' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Videos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === 'files' && [styles.activeTab, { borderBottomColor: colors.primary }],
                ]}
                onPress={() => setSelectedTab('files')}
              >
                <FileText size={20} color={selectedTab === 'files' ? colors.primary : colors.textSecondary} />
                <Text
                  style={[
                    styles.tabText,
                    { color: selectedTab === 'files' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Files
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredMedia}
              keyExtractor={(item) => item.id}
              numColumns={selectedTab === 'files' ? 1 : 3}
              key={selectedTab}
              contentContainerStyle={styles.mediaList}
              renderItem={renderMediaItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No {selectedTab} shared yet
                  </Text>
                </View>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>

      {selectedMedia && (
        <Modal
          visible={!!selectedMedia}
          animationType="fade"
          transparent
          onRequestClose={() => setSelectedMedia(null)}
        >
          <View style={styles.fullscreenOverlay}>
            <View style={styles.fullscreenHeader}>
              <TouchableOpacity onPress={() => setSelectedMedia(null)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.fullscreenActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Download size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Share2 size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fullscreenContent}>
              {selectedMedia.type === 'image' && (
                <Image
                  source={{ uri: selectedMedia.url }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                />
              )}
              {selectedMedia.type === 'video' && (
                <View style={styles.videoPlaceholder}>
                  <Video size={64} color="#fff" />
                  <Text style={styles.videoPlaceholderText}>Video Player</Text>
                </View>
              )}
              {selectedMedia.type === 'file' && (
                <View style={styles.filePlaceholder}>
                  <FileText size={64} color="#fff" />
                  <Text style={styles.filePlaceholderText}>{selectedMedia.fileName}</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  mediaList: {
    padding: 12,
  },
  mediaItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 12,
    gap: 12,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  fileDate: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  fullscreenActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  fullscreenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  videoPlaceholderText: {
    color: '#fff',
    fontSize: 18,
  },
  filePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  filePlaceholderText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
