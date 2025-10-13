import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { Send, Image, Music, Smile, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface QuickVibeProps {
  onPost?: (content: string, attachments?: any[]) => void;
}



export function QuickVibe({ onPost }: QuickVibeProps) {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const [vibeText, setVibeText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scaleValue, {
        toValue: isExpanded ? 1 : 0.95,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      })
    ]).start();
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAttachments(prev => [...prev, { type: 'image', uri: result.assets[0].uri }]);
    }
  };

  const handleMusicPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setAttachments(prev => [...prev, { type: 'music', uri: result.assets[0].uri, name: result.assets[0].name }]);
      }
    } catch (err) {
      console.log('Error picking music:', err);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!vibeText.trim() && attachments.length === 0) {
      Alert.alert('Empty Vibe', 'Please write something or add media to share your vibe!');
      return;
    }

    setIsPosting(true);
    try {
      console.log('Posting vibe:', vibeText, 'with attachments:', attachments);
      
      if (onPost) {
        onPost(vibeText, attachments);
      }
      
      setVibeText('');
      setAttachments([]);
      setIsExpanded(false);
      animatedValue.setValue(0);
      scaleValue.setValue(1);
      Alert.alert('Vibe Posted!', 'Your vibe has been shared with the community.');
    } catch (err) {
      Alert.alert('Error', 'Failed to post your vibe. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) return null;

  const expandedHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 320],
  });

  const contentOpacity = animatedValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <>
      {/* Floating Composer Button */}
      {!isExpanded && (
        <View style={styles.floatingButton}>
          <TouchableOpacity
            style={styles.floatingButtonInner}
            onPress={toggleExpanded}
            activeOpacity={0.8}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 100 : 80}
              tint={isDark ? 'dark' : 'light'}
              style={styles.blurContainer}
            >
              <Plus size={24} color={colors.primary} />
            </BlurView>
          </TouchableOpacity>
        </View>
      )}

      {/* Expanded Composer */}
      {isExpanded && (
        <Animated.View 
          style={[
            styles.expandedContainer,
            { 
              height: expandedHeight
            }
          ]}
        >
          <BlurView
            intensity={Platform.OS === 'ios' ? 100 : 80}
            tint={isDark ? 'dark' : 'light'}
            style={styles.expandedBlur}
          >
            <View style={styles.expandedHeader}>
              <View style={styles.headerLeft}>
                <Avatar
                  uri={user.profileImage}
                  size={40}
                  style={styles.avatar}
                />
                <View style={styles.headerText}>
                  <Text style={[styles.greeting, { color: colors.text }]}>What&apos;s your vibe?</Text>
                  <Text style={[styles.subtext, { color: colors.textSecondary }]}>Share with the community</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleExpanded}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Animated.View style={[styles.expandedContent, { opacity: contentOpacity }]}>
              <View style={[styles.inputContainer, { backgroundColor: colors.glass }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={vibeText}
                  onChangeText={setVibeText}
                  placeholder="Share your vibe..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  maxLength={280}
                  textAlignVertical="top"
                  autoFocus
                />
                
                {attachments.length > 0 && (
                  <View style={styles.attachments}>
                    {attachments.map((attachment, index) => (
                      <View key={index} style={[styles.attachment, { backgroundColor: colors.cardLight }]}>
                        <Text style={[styles.attachmentText, { color: colors.text }]}>
                          {attachment.type === 'image' ? '🖼️' : '🎵'} {attachment.name || 'Media'}
                        </Text>
                        <TouchableOpacity onPress={() => removeAttachment(index)}>
                          <X size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.inputFooter}>
                  <View style={styles.mediaButtons}>
                    <TouchableOpacity style={styles.mediaButton} onPress={handleImagePicker}>
                      <Image size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaButton} onPress={handleMusicPicker}>
                      <Music size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaButton}>
                      <Smile size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.postSection}>
                    <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                      {vibeText.length}/280
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.postButton,
                        { backgroundColor: colors.primary },
                        ((!vibeText.trim() && attachments.length === 0) || isPosting) && styles.postButtonDisabled
                      ]}
                      onPress={handlePost}
                      disabled={(!vibeText.trim() && attachments.length === 0) || isPosting}
                    >
                      <Send size={16} color={colors.textInverse} />
                      <Text style={[styles.postButtonText, { color: colors.textInverse }]}>
                        {isPosting ? 'Posting...' : 'Vibe'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          </BlurView>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Floating Button Styles
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    zIndex: 1000,
    elevation: 10,
  },
  floatingButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },

  
  // Expanded Composer Styles
  expandedContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  expandedBlur: {
    flex: 1,
    borderRadius: 20,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  
  // Content Styles
  expandedContent: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    borderRadius: 12,
    padding: 12,
    flex: 1,
  },
  input: {
    fontSize: 16,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  attachments: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  attachmentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  mediaButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  postSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    marginRight: 12,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});