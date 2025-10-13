import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/theme-store';
import { useEngagement } from '@/hooks/engagement-store';
import { X, Bookmark, Plus, Check, Folder } from 'lucide-react-native';

interface SaveSheetProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  onSave?: (postId: string, collectionId: string) => void;
}

export const SaveSheet: React.FC<SaveSheetProps> = ({
  visible,
  onClose,
  postId,
  onSave,
}) => {
  const { colors } = useTheme();
  const {
    collections,
    savePost,
    createCollection,
    deleteCollection,
    getSavedPostsByCollection,
  } = useEngagement();
  
  const [showNewCollection, setShowNewCollection] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleSaveToCollection = async (collectionId: string) => {
    try {
      const result = await savePost(postId, collectionId);
      const collection = collections.find(c => c.id === collectionId);
      
      if (result) {
        console.log(`Post saved to ${collection?.name}`);
        Alert.alert('Saved', `Post saved to ${collection?.name}`);
      } else {
        console.log(`Post removed from ${collection?.name}`);
        Alert.alert('Removed', `Post removed from ${collection?.name}`);
      }
      
      onSave?.(postId, collectionId);
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Error', 'Failed to save post');
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }

    setIsCreating(true);
    try {
      const newCollection = await createCollection(newCollectionName.trim());
      
      if (newCollection) {
        console.log('Collection created:', newCollection.name);
        await savePost(postId, newCollection.id);
        Alert.alert('Success', `Saved to new collection: ${newCollection.name}`);
        setNewCollectionName('');
        setShowNewCollection(false);
        onClose();
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      Alert.alert('Error', 'Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCollection = (collectionId: string, collectionName: string) => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collectionName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCollection(collectionId);
            Alert.alert('Deleted', `Collection "${collectionName}" deleted`);
          },
        },
      ]
    );
  };

  const isPostInCollection = (collectionId: string) => {
    const postIds = getSavedPostsByCollection(collectionId);
    return postIds.includes(postId);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill} />
      </TouchableOpacity>

      <View style={[styles.sheet, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Bookmark size={24} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Save to Collection
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {collections.map((collection) => {
            const isSaved = isPostInCollection(collection.id);
            const postCount = getSavedPostsByCollection(collection.id).length;

            return (
              <TouchableOpacity
                key={collection.id}
                style={[
                  styles.collectionItem,
                  {
                    backgroundColor: isSaved ? colors.primary + '10' : colors.background,
                    borderColor: isSaved ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => handleSaveToCollection(collection.id)}
                onLongPress={() => {
                  if (collection.id !== 'default') {
                    handleDeleteCollection(collection.id, collection.name);
                  }
                }}
              >
                <View style={styles.collectionLeft}>
                  <View
                    style={[
                      styles.collectionIcon,
                      {
                        backgroundColor: isSaved ? colors.primary + '20' : colors.card,
                      },
                    ]}
                  >
                    <Folder
                      size={20}
                      color={isSaved ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.collectionInfo}>
                    <Text style={[styles.collectionName, { color: colors.text }]}>
                      {collection.name}
                    </Text>
                    <Text style={[styles.collectionCount, { color: colors.textSecondary }]}>
                      {postCount} {postCount === 1 ? 'post' : 'posts'}
                    </Text>
                  </View>
                </View>

                {isSaved && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <Check size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {showNewCollection ? (
            <View style={[styles.newCollectionForm, { backgroundColor: colors.background }]}>
              <TextInput
                style={[
                  styles.newCollectionInput,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Collection name"
                placeholderTextColor={colors.textSecondary}
                value={newCollectionName}
                onChangeText={setNewCollectionName}
                maxLength={30}
                autoFocus
              />
              <View style={styles.newCollectionActions}>
                <TouchableOpacity
                  style={[styles.newCollectionCancel, { backgroundColor: colors.card }]}
                  onPress={() => {
                    setShowNewCollection(false);
                    setNewCollectionName('');
                  }}
                >
                  <Text style={[styles.newCollectionCancelText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.newCollectionCreate,
                    {
                      backgroundColor: colors.primary,
                      opacity: isCreating || !newCollectionName.trim() ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleCreateCollection}
                  disabled={isCreating || !newCollectionName.trim()}
                >
                  <Text style={styles.newCollectionCreateText}>
                    {isCreating ? 'Creating...' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.newCollectionButton, { backgroundColor: colors.background }]}
              onPress={() => setShowNewCollection(true)}
            >
              <View style={[styles.newCollectionIcon, { backgroundColor: colors.primary + '20' }]}>
                <Plus size={20} color={colors.primary} />
              </View>
              <Text style={[styles.newCollectionText, { color: colors.primary }]}>
                Create New Collection
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  collectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  collectionCount: {
    fontSize: 13,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCollectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  newCollectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  newCollectionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  newCollectionForm: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  newCollectionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  newCollectionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  newCollectionCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCollectionCancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  newCollectionCreate: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCollectionCreateText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
