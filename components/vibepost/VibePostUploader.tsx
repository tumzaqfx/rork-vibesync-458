import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { X, Upload, Music, Type, Hash, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { useVibePosts } from '@/hooks/vibepost-store';
import { useAuth } from '@/hooks/auth-store';
import { VibePostUpload } from '@/types/vibepost';
import Button from '@/components/ui/Button';

interface VibePostUploaderProps {
  visible: boolean;
  onClose: () => void;
}

export default function VibePostUploader({ visible, onClose }: VibePostUploaderProps) {
  const { theme } = useTheme();
  const { uploadVibePost, isUploading } = useVibePosts();
  const { user } = useAuth();

  const [videoUri, setVideoUri] = useState<string>('');
  const [thumbnailUri, setThumbnailUri] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [musicTitle, setMusicTitle] = useState('');
  const [musicArtist, setMusicArtist] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [duration, setDuration] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'vertical' | 'horizontal' | 'square'>('vertical');

  const pickVideo = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library access to upload videos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 120,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setVideoUri(asset.uri);
        
        if (asset.duration) {
          setDuration(Math.floor(asset.duration / 1000));
        }

        if (asset.width && asset.height) {
          const ratio = asset.width / asset.height;
          if (ratio > 1.2) {
            setAspectRatio('horizontal');
          } else if (ratio < 0.8) {
            setAspectRatio('vertical');
          } else {
            setAspectRatio('square');
          }
        }
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video. Please try again.');
    }
  }, []);

  const pickThumbnail = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library access to select thumbnail.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio === 'vertical' ? [9, 16] : aspectRatio === 'horizontal' ? [16, 9] : [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setThumbnailUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking thumbnail:', error);
      Alert.alert('Error', 'Failed to pick thumbnail. Please try again.');
    }
  }, [aspectRatio]);

  const addHashtag = useCallback(() => {
    const tag = hashtagInput.trim().replace('#', '');
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  }, [hashtagInput, hashtags]);

  const removeHashtag = useCallback((tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  }, [hashtags]);

  const handleUpload = useCallback(async () => {
    if (!videoUri) {
      Alert.alert('No Video', 'Please select a video to upload.');
      return;
    }

    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to upload videos.');
      return;
    }

    const upload: VibePostUpload = {
      videoUri,
      thumbnailUri: thumbnailUri || videoUri,
      caption,
      duration,
      aspectRatio,
      music: musicTitle && musicArtist ? { title: musicTitle, artist: musicArtist } : undefined,
      hashtags,
    };

    try {
      await uploadVibePost(upload, user);
      Alert.alert('Success', 'Your VibePost is now live!');
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload video. Please try again.');
    }
  }, [videoUri, thumbnailUri, caption, duration, aspectRatio, musicTitle, musicArtist, hashtags, user, uploadVibePost, handleClose]);

  const handleClose = useCallback(() => {
    setVideoUri('');
    setThumbnailUri('');
    setCaption('');
    setMusicTitle('');
    setMusicArtist('');
    setHashtags([]);
    setHashtagInput('');
    setDuration(0);
    setAspectRatio('vertical');
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Upload VibePost</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {!videoUri ? (
            <TouchableOpacity 
              style={[styles.uploadArea, { borderColor: theme.border }]}
              onPress={pickVideo}
            >
              <Upload size={48} color={theme.textSecondary} />
              <Text style={[styles.uploadText, { color: theme.text }]}>
                Tap to select video
              </Text>
              <Text style={[styles.uploadSubtext, { color: theme.textSecondary }]}>
                Max 2 minutes
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.videoPreview}>
              <Video
                source={{ uri: videoUri }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isLooping
              />
              <TouchableOpacity 
                style={styles.changeVideoButton}
                onPress={pickVideo}
              >
                <Text style={styles.changeVideoText}>Change Video</Text>
              </TouchableOpacity>
            </View>
          )}

          {videoUri && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  <ImageIcon size={18} color={theme.text} /> Thumbnail
                </Text>
                <TouchableOpacity 
                  style={[styles.thumbnailButton, { borderColor: theme.border }]}
                  onPress={pickThumbnail}
                >
                  <Text style={[styles.thumbnailButtonText, { color: theme.primary }]}>
                    {thumbnailUri ? 'Change Thumbnail' : 'Select Custom Thumbnail'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  <Type size={18} color={theme.text} /> Caption
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.card, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  placeholder="What's this video about?"
                  placeholderTextColor={theme.textSecondary}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  maxLength={280}
                />
                <Text style={[styles.charCount, { color: theme.textSecondary }]}>
                  {caption.length}/280
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  <Music size={18} color={theme.text} /> Music (Optional)
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.card, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  placeholder="Song title"
                  placeholderTextColor={theme.textSecondary}
                  value={musicTitle}
                  onChangeText={setMusicTitle}
                />
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.card, 
                    color: theme.text,
                    borderColor: theme.border,
                    marginTop: 8 
                  }]}
                  placeholder="Artist name"
                  placeholderTextColor={theme.textSecondary}
                  value={musicArtist}
                  onChangeText={setMusicArtist}
                />
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  <Hash size={18} color={theme.text} /> Hashtags
                </Text>
                <View style={styles.hashtagInput}>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.card, 
                      color: theme.text,
                      borderColor: theme.border,
                      flex: 1 
                    }]}
                    placeholder="Add hashtag"
                    placeholderTextColor={theme.textSecondary}
                    value={hashtagInput}
                    onChangeText={setHashtagInput}
                    onSubmitEditing={addHashtag}
                  />
                  <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: theme.primary }]}
                    onPress={addHashtag}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
                {hashtags.length > 0 && (
                  <View style={styles.hashtagList}>
                    {hashtags.map(tag => (
                      <TouchableOpacity
                        key={tag}
                        style={[styles.hashtagChip, { backgroundColor: theme.card }]}
                        onPress={() => removeHashtag(tag)}
                      >
                        <Text style={[styles.hashtagText, { color: theme.primary }]}>
                          #{tag}
                        </Text>
                        <X size={14} color={theme.textSecondary} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>

        {videoUri && (
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Button
              title={isUploading ? 'Uploading...' : 'Post VibePost'}
              onPress={handleUpload}
              disabled={isUploading}
              style={styles.uploadButton}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  uploadArea: {
    height: 300,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginTop: 16,
  },
  uploadSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  videoPreview: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  changeVideoButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeVideoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  thumbnailButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  thumbnailButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  hashtagInput: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  hashtagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  hashtagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hashtagText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  uploadButton: {
    width: '100%',
  },
});
