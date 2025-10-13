import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import { X, Search, Check } from 'lucide-react-native';
import { ImageTag } from '@/types/tag';
import { User } from '@/types';
import { useTagging } from '@/hooks/tagging-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TagPeopleModalProps = {
  visible: boolean;
  onClose: () => void;
  imageUri: string;
  existingTags: ImageTag[];
  onTagsChange: (tags: ImageTag[]) => void;
};

export default function TagPeopleModal({
  visible,
  onClose,
  imageUri,
  existingTags,
  onTagsChange,
}: TagPeopleModalProps) {
  const { searchUsers } = useTagging();
  const [tags, setTags] = useState<ImageTag[]>(existingTags);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);

  const handleImagePress = useCallback((event: any) => {
    if (isSearching) return;

    const { locationX, locationY } = event.nativeEvent;
    const x = (locationX / SCREEN_WIDTH) * 100;
    const y = (locationY / (SCREEN_WIDTH * 1.25)) * 100;

    setSelectedPosition({ x, y });
    setIsSearching(true);
  }, [isSearching]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchUsers]);

  const handleSelectUser = useCallback((user: User) => {
    if (!selectedPosition) return;

    const newTag: ImageTag = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      avatar: user.avatar || user.profileImage || '',
      verified: user.verified || user.isVerified,
      position: selectedPosition,
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedPosition(null);
  }, [selectedPosition, tags]);

  const handleRemoveTag = useCallback((tagId: string) => {
    const updatedTags = tags.filter(t => t.id !== tagId);
    setTags(updatedTags);
  }, [tags]);

  const handleDone = useCallback(() => {
    onTagsChange(tags);
    onClose();
  }, [tags, onTagsChange, onClose]);

  const handleCancel = useCallback(() => {
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedPosition(null);
  }, []);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tag People</Text>
          <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
            <Check size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Pressable onPress={handleImagePress}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          </Pressable>

          {tags.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagMarker,
                {
                  left: `${tag.position.x}%`,
                  top: `${tag.position.y}%`,
                },
              ]}
              onPress={() => handleRemoveTag(tag.id)}
            >
              <View style={styles.tagLabel}>
                <Text style={styles.tagText}>@{tag.username}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {selectedPosition && (
            <View
              style={[
                styles.tempMarker,
                {
                  left: `${selectedPosition.x}%`,
                  top: `${selectedPosition.y}%`,
                },
              ]}
            />
          )}
        </View>

        {isSearching && (
          <View style={styles.searchContainer}>
            <View style={styles.searchHeader}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search people..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoFocus
                />
              </View>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => handleSelectUser(item)}
                >
                  <Avatar
                    uri={item.avatar || item.profileImage}
                    size={44}
                  />
                  <View style={styles.userInfo}>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{item.username}</Text>
                      {(item.verified || item.isVerified) && (
                        <VerifiedBadge size={14} />
                      )}
                    </View>
                    <Text style={styles.userDisplayName}>{item.name || item.displayName}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                searchQuery.trim() ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No users found</Text>
                  </View>
                ) : null
              }
            />
          </View>
        )}

        {!isSearching && tags.length > 0 && (
          <View style={styles.tagsList}>
            <Text style={styles.tagsListTitle}>Tagged ({tags.length})</Text>
            {tags.map(tag => (
              <View key={tag.id} style={styles.taggedUser}>
                <Avatar uri={tag.avatar} size={36} />
                <View style={styles.taggedUserInfo}>
                  <View style={styles.taggedUserNameRow}>
                    <Text style={styles.taggedUserName}>@{tag.username}</Text>
                    {tag.verified && <VerifiedBadge size={12} />}
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleRemoveTag(tag.id)}>
                  <X size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
    position: 'relative' as const,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagMarker: {
    position: 'absolute' as const,
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  tagLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  tempMarker: {
    position: 'absolute' as const,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderColor: '#fff',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  userDisplayName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  tagsList: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 16,
  },
  tagsListTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  taggedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  taggedUserInfo: {
    flex: 1,
  },
  taggedUserNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taggedUserName: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#fff',
  },
});
