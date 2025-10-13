import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text, Platform, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Plus, Video, Image as ImageIcon, Mic, Type, Radio, X, Send, Droplet } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { useFeed } from '@/hooks/feed-store';
import StartSpillModal from '@/components/spill/StartSpillModal';

interface FloatingActionMenuProps {
  onClose?: () => void;
  onPostCreated?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  gradient: string[];
  route: string;
}

export function FloatingActionMenu({ onClose, onPostCreated }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const insets = useSafeAreaInsets();

  const [showTextPostModal, setShowTextPostModal] = useState(false);
  const [showSpillModal, setShowSpillModal] = useState(false);
  const [textPostContent, setTextPostContent] = useState('');
  const [, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const createPostMutation = trpc.posts.create.useMutation();
  const { refreshFeed } = useFeed();
  const utils = trpc.useUtils();

  const items: MenuItem[] = useMemo(() => [
    {
      id: 'text',
      label: 'Text Post',
      icon: <Type size={28} color="#FFFFFF" />,
      gradient: ['#3B82F6', '#2563EB'],
      route: '',
    },
    {
      id: 'picture',
      label: 'Picture',
      icon: <ImageIcon size={28} color="#FFFFFF" />,
      gradient: ['#10B981', '#059669'],
      route: '',
    },
    {
      id: 'voice',
      label: 'Voice Note',
      icon: <Mic size={28} color="#FFFFFF" />,
      gradient: ['#F59E0B', '#D97706'],
      route: '',
    },
    {
      id: 'video',
      label: 'Video',
      icon: <Video size={28} color="#FFFFFF" />,
      gradient: ['#8B5CF6', '#7C3AED'],
      route: '',
    },
    {
      id: 'spill',
      label: 'Start Spill',
      icon: <Droplet size={28} color="#FFFFFF" />,
      gradient: ['#7B61FF', '#A88FFF'],
      route: '',
    },
    {
      id: 'live',
      label: 'Go Live',
      icon: <Radio size={28} color="#FFFFFF" />,
      gradient: ['#EF4444', '#DC2626'],
      route: '/live/setup',
    },
  ], []);

  const toggleMenu = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!isOpen) {
      setIsOpen(true);
      Animated.parallel([
        Animated.spring(rotateAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(rotateAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 300,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]).start(() => {
        setIsOpen(false);
      });
    }
  };

  const handleItemPress = async (item: MenuItem) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    switch (item.id) {
      case 'text':
        toggleMenu();
        setTimeout(() => setShowTextPostModal(true), 300);
        break;
      case 'picture':
        toggleMenu();
        setTimeout(() => handlePickImage(), 300);
        break;
      case 'voice':
        toggleMenu();
        setTimeout(() => handleRecordVoice(), 300);
        break;
      case 'video':
        toggleMenu();
        setTimeout(() => handlePickVideo(), 300);
        break;
      case 'spill':
        toggleMenu();
        setTimeout(() => setShowSpillModal(true), 300);
        break;
      case 'live':
        toggleMenu();
        setTimeout(() => {
          router.push('/live/setup');
          onClose?.();
        }, 300);
        break;
      default:
        if (item.route) {
          toggleMenu();
          setTimeout(() => {
            router.push(item.route as any);
            onClose?.();
          }, 300);
        }
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        setUploadProgress(0);
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        try {
          console.log('[FloatingActionMenu] Creating image post');
          const postResult = await createPostMutation.mutateAsync({
            content: 'Shared an image',
            imageUrl: result.assets[0].uri,
          });
          console.log('[FloatingActionMenu] Image post created:', postResult.id);
          
          clearInterval(progressInterval);
          setUploadProgress(100);
          
          setTimeout(async () => {
            setIsUploading(false);
            setUploadProgress(0);
            await utils.posts.list.invalidate();
            await refreshFeed(false);
            Alert.alert('Success', 'Image posted to your feed!');
            onPostCreated?.();
          }, 500);
        } catch (error: any) {
          clearInterval(progressInterval);
          setIsUploading(false);
          setUploadProgress(0);
          console.error('[FloatingActionMenu] Post creation error:', error);
          const errorMessage = error?.message || 'Failed to create post. Please try again.';
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error) {
      console.error('[FloatingActionMenu] Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handlePickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        setUploadProgress(0);
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 5, 90));
        }, 200);

        try {
          await createPostMutation.mutateAsync({
            content: 'Shared a video',
            videoUrl: result.assets[0].uri,
          });
          
          clearInterval(progressInterval);
          setUploadProgress(100);
          
          setTimeout(async () => {
            setIsUploading(false);
            setUploadProgress(0);
            await utils.posts.list.invalidate();
            await refreshFeed(false);
            Alert.alert('Success', 'Video posted to your feed!');
            onPostCreated?.();
          }, 500);
        } catch (error) {
          clearInterval(progressInterval);
          setIsUploading(false);
          setUploadProgress(0);
          console.error('[FloatingActionMenu] Post creation error:', error);
          Alert.alert('Error', 'Failed to create post. Please try again.');
        }
      }
    } catch (error) {
      console.error('[FloatingActionMenu] Video picker error:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const handleRecordVoice = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant microphone permission');
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);

      Alert.alert(
        'Recording',
        'Voice note is recording. Press OK to stop.',
        [
          {
            text: 'Stop',
            onPress: async () => {
              if (recordingRef.current) {
                await recordingRef.current.stopAndUnloadAsync();
                const uri = recordingRef.current.getURI();
                setIsRecording(false);
                recordingRef.current = null;
                
                setIsUploading(true);
                setUploadProgress(0);
                
                const progressInterval = setInterval(() => {
                  setUploadProgress(prev => Math.min(prev + 10, 90));
                }, 100);

                try {
                  await createPostMutation.mutateAsync({
                    content: 'Shared a voice note',
                    audioUrl: uri || '',
                  });
                  
                  clearInterval(progressInterval);
                  setUploadProgress(100);
                  
                  setTimeout(async () => {
                    setIsUploading(false);
                    setUploadProgress(0);
                    await utils.posts.list.invalidate();
                    await refreshFeed(false);
                    Alert.alert('Success', 'Voice note posted to your feed!');
                    onPostCreated?.();
                  }, 500);
                } catch (error) {
                  clearInterval(progressInterval);
                  setIsUploading(false);
                  setUploadProgress(0);
                  console.error('[FloatingActionMenu] Post creation error:', error);
                  Alert.alert('Error', 'Failed to create post. Please try again.');
                }
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('[FloatingActionMenu] Voice recording error:', error);
      Alert.alert('Error', 'Failed to record voice note');
      setIsRecording(false);
    }
  };

  const handlePostText = async () => {
    if (!textPostContent.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 15, 90));
    }, 80);

    try {
      console.log('[FloatingActionMenu] Creating text post:', textPostContent.trim());
      const result = await createPostMutation.mutateAsync({
        content: textPostContent.trim(),
      });
      console.log('[FloatingActionMenu] Post created successfully:', result.id);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(async () => {
        setIsUploading(false);
        setUploadProgress(0);
        setShowTextPostModal(false);
        setTextPostContent('');
        await utils.posts.list.invalidate();
        await refreshFeed(false);
        Alert.alert('Success', 'Post created successfully!');
        onPostCreated?.();
      }, 500);
    } catch (error: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      console.error('[FloatingActionMenu] Post creation error:', error);
      const errorMessage = error?.message || 'Failed to create post. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
      <Animated.View style={[styles.container, { bottom: 90 + insets.bottom, transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={toggleMenu}
          activeOpacity={0.9}
        >
          <BlurView intensity={40} tint="light" style={styles.blurButton}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <View style={styles.liquidGlossTop} />
              <View style={styles.liquidGlossBottom} />
              <Animated.View style={{ transform: [{ rotate: rotation }], zIndex: 10 }}>
                <Plus size={28} color="#FFFFFF" strokeWidth={3} />
              </Animated.View>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View
            style={[
              styles.modalBackground,
              { opacity: modalOpacity },
            ]}
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: modalOpacity,
            },
          ]}
        >
          <BlurView intensity={100} tint="dark" style={styles.menuBlur}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Create</Text>
              <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuGrid}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItemCard}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={item.gradient as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.menuItemGradient}
                  >
                    <View style={styles.menuItemGloss} />
                    {item.icon}
                  </LinearGradient>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {isUploading && (
              <View style={styles.uploadProgress}>
                <View style={styles.uploadProgressBar}>
                  <View style={[styles.uploadProgressFill, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.uploadProgressText}>Uploading... {uploadProgress}%</Text>
              </View>
            )}
          </BlurView>
        </Animated.View>
      </Modal>

      <Modal
        visible={showTextPostModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTextPostModal(false)}
      >
        <View style={styles.textPostModalOverlay}>
          <View style={styles.textPostModalContent}>
            <View style={styles.textPostHeader}>
              <TouchableOpacity onPress={() => setShowTextPostModal(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.textPostTitle}>Create Text Post</Text>
              <TouchableOpacity onPress={handlePostText} disabled={isUploading}>
                {isUploading ? (
                  <ActivityIndicator size="small" color="#3B82F6" />
                ) : (
                  <Send size={24} color="#3B82F6" />
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textPostInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#999"
              multiline
              value={textPostContent}
              onChangeText={setTextPostContent}
              autoFocus
            />
          </View>
        </View>
      </Modal>

      <StartSpillModal
        visible={showSpillModal}
        onClose={() => setShowSpillModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 1000,
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  blurButton: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  liquidGlossTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  liquidGlossBottom: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 32,
    transform: [{ scaleX: 1.2 }],
  },
  modalOverlay: {
    flex: 1,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  menuBlur: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  menuItemCard: {
    width: '30%',
    alignItems: 'center',
    gap: 12,
  },
  menuItemGradient: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItemGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItemLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    textAlign: 'center' as const,
  },
  uploadProgress: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  uploadProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  uploadProgressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  uploadProgressText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    fontWeight: '600' as const,
  },
  textPostModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textPostModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  textPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  textPostTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#000',
  },
  textPostInput: {
    padding: 20,
    fontSize: 16,
    color: '#000',
    minHeight: 200,
    textAlignVertical: 'top',
  },
});
