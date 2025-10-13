import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Camera, Image as ImageIcon, Type, Mic } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/theme-store';
import { useStatus } from '@/hooks/status-store';
import VoiceStatusRecorder from '@/components/status/VoiceStatusRecorder';
import TextStatusCreator from '@/components/status/TextStatusCreator';
import MediaStatusCreator from '@/components/status/MediaStatusCreator';
import UploadProgressOverlay from '@/components/status/UploadProgressOverlay';
import { uploadMedia, uploadVoiceNote, validateMediaFile } from '@/utils/media-upload';

type CreationType = 'photo' | 'video' | 'text' | 'voice' | null;

interface MediaData {
  uri: string;
  type: 'photo' | 'video';
}

export default function CreateStatusScreen() {
  const { colors } = useTheme();
  const { uploadStatus, uploadProgress } = useStatus();
  const [creationType, setCreationType] = useState<CreationType>(null);
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [retryData, setRetryData] = useState<any>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const isValid = await validateMediaFile(uri, 'photo');
        
        if (!isValid) {
          Alert.alert('File Too Large', 'Please select a smaller image (max 50MB)');
          return;
        }

        setMediaData({ uri, type: 'photo' });
        setCreationType('photo');
      }
    } catch (error) {
      console.error('[CreateStatus] Pick image error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const isValid = await validateMediaFile(uri, 'video');
        
        if (!isValid) {
          Alert.alert('File Too Large', 'Please select a smaller video (max 50MB)');
          return;
        }

        setMediaData({ uri, type: 'video' });
        setCreationType('video');
      }
    } catch (error) {
      console.error('[CreateStatus] Pick video error:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const takePhoto = async () => {
    try {
      if (Platform.OS === 'web') {
        pickImage();
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setMediaData({ uri, type: 'photo' });
        setCreationType('photo');
      }
    } catch (error) {
      console.error('[CreateStatus] Take photo error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleVoiceComplete = async (voiceData: { uri: string; duration: number; waveform: number[] }) => {
    try {
      const uploadResult = await uploadVoiceNote(voiceData.uri, voiceData.duration, {
        onProgress: (progress) => {
          console.log('[CreateStatus] Voice upload progress:', progress);
        },
      });

      await uploadStatus('voice', {
        uri: uploadResult.uri,
        duration: voiceData.duration,
        waveform: voiceData.waveform,
        gradient: ['#667eea', '#764ba2'],
      });

      setCreationType(null);
      router.back();
    } catch (error) {
      console.error('[CreateStatus] Voice upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload voice status. Please try again.');
      setRetryData({ type: 'voice', data: voiceData });
    }
  };

  const handleTextComplete = async (textData: any) => {
    try {
      await uploadStatus('text', textData);
      setCreationType(null);
      router.back();
    } catch (error) {
      console.error('[CreateStatus] Text upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload text status. Please try again.');
      setRetryData({ type: 'text', data: textData });
    }
  };

  const handleMediaComplete = async (mediaCompleteData: any) => {
    try {
      const uploadResult = await uploadMedia(mediaCompleteData.uri, mediaCompleteData.type, {
        onProgress: (progress) => {
          console.log('[CreateStatus] Media upload progress:', progress);
        },
        compressionQuality: 0.8,
      });

      const type = mediaCompleteData.type === 'video' ? 'video' : 'photo';
      await uploadStatus(type, uploadResult.uri, {
        caption: mediaCompleteData.caption,
        overlays: mediaCompleteData.overlays,
      });

      setCreationType(null);
      setMediaData(null);
      router.back();
    } catch (error) {
      console.error('[CreateStatus] Media upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload status. Please try again.');
      setRetryData({ type: mediaCompleteData.type, data: mediaCompleteData });
    }
  };

  const handleRetry = async (statusId: string) => {
    if (!retryData) return;

    try {
      if (retryData.type === 'voice') {
        await handleVoiceComplete(retryData.data);
      } else if (retryData.type === 'text') {
        await handleTextComplete(retryData.data);
      } else {
        await handleMediaComplete(retryData.data);
      }
      setRetryData(null);
    } catch (error) {
      console.error('[CreateStatus] Retry error:', error);
    }
  };

  const handleDismissProgress = (statusId: string) => {
    console.log('[CreateStatus] Dismissing progress:', statusId);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Create Status',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />

      <UploadProgressOverlay
        uploads={uploadProgress}
        onDismiss={handleDismissProgress}
        onRetry={handleRetry}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Share your moment
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose how you want to express yourself
        </Text>

        <View style={styles.optionsGrid}>
          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.card }]}
            onPress={takePhoto}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#667eea' }]}>
              <Camera size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Camera</Text>
            <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
              Take a photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.card }]}
            onPress={pickImage}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#f093fb' }]}>
              <ImageIcon size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Photo</Text>
            <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
              From gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.card }]}
            onPress={() => setCreationType('text')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#4facfe' }]}>
              <Type size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Text</Text>
            <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
              Write something
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.card }]}
            onPress={() => setCreationType('voice')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#43e97b' }]}>
              <Mic size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Voice</Text>
            <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
              Record audio
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Your status will be visible for 24 hours and can be viewed by your friends
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={creationType === 'voice'}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {creationType === 'voice' && (
          <VoiceStatusRecorder
            onComplete={handleVoiceComplete}
            onCancel={() => setCreationType(null)}
          />
        )}
      </Modal>

      <Modal
        visible={creationType === 'text'}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {creationType === 'text' && (
          <TextStatusCreator
            onComplete={handleTextComplete}
            onCancel={() => setCreationType(null)}
          />
        )}
      </Modal>

      <Modal
        visible={(creationType === 'photo' || creationType === 'video') && mediaData !== null}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {mediaData && (
          <MediaStatusCreator
            mediaUri={mediaData.uri}
            mediaType={mediaData.type}
            onComplete={handleMediaComplete}
            onCancel={() => {
              setCreationType(null);
              setMediaData(null);
            }}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  optionsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center' as const,
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  optionDesc: {
    fontSize: 14,
    textAlign: 'center' as const,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
});
