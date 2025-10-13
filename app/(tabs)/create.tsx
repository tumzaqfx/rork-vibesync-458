import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Image as ImageIcon,
  Video,
  Folder,
  Camera,
  Film,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { useStudio } from '@/hooks/studio-store';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreativeStudioScreen() {
  const { colors } = useTheme();
  const { projects } = useStudio();

  const handleImportMedia = async (type: 'photo' | 'video') => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant media library permissions.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'photo' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'photo') {
          router.push({
            pathname: '/studio/image-editor',
            params: { mediaUri: result.assets[0].uri }
          });
        } else {
          router.push({
            pathname: '/studio/video-editor',
            params: { mediaUri: result.assets[0].uri }
          });
        }
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media.');
    }
  };

  const handleCaptureMedia = async (type: 'photo' | 'video') => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant camera permissions.');
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: type === 'photo' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'photo') {
          router.push({
            pathname: '/studio/image-editor',
            params: { mediaUri: result.assets[0].uri }
          });
        } else {
          router.push({
            pathname: '/studio/video-editor',
            params: { mediaUri: result.assets[0].uri }
          });
        }
      }
    } catch (error) {
      console.error('Error capturing media:', error);
      Alert.alert('Error', 'Failed to capture media.');
    }
  };

  const createOptions = [
    {
      icon: Camera,
      label: 'Capture Photo',
      description: 'Take a photo & edit',
      gradient: ['#667eea', '#764ba2'] as const,
      onPress: () => handleCaptureMedia('photo'),
    },
    {
      icon: ImageIcon,
      label: 'Import Photo',
      description: 'Edit existing photos',
      gradient: ['#4facfe', '#00f2fe'] as const,
      onPress: () => handleImportMedia('photo'),
    },
    {
      icon: Video,
      label: 'Capture Video',
      description: 'Record & edit video',
      gradient: ['#f093fb', '#f5576c'] as const,
      onPress: () => handleCaptureMedia('video'),
    },
    {
      icon: Film,
      label: 'Import Video',
      description: 'Edit existing videos',
      gradient: ['#fa709a', '#fee140'] as const,
      onPress: () => handleImportMedia('video'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Creative Studio</Text>
        <TouchableOpacity onPress={() => router.push('/studio/projects')} style={styles.projectsButton}>
          <Folder size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Create New Project</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Import or capture content to start editing
          </Text>
          {createOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.createCard, { backgroundColor: colors.card }]}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={option.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createIconContainer}
              >
                <option.icon size={28} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.createInfo}>
                <Text style={[styles.createLabel, { color: colors.text }]}>{option.label}</Text>
                <Text style={[styles.createDescription, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>My Drafts</Text>
            {projects.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/studio/projects')}>
                <Text style={[styles.viewAllLink, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          {projects.length === 0 ? (
            <View style={styles.emptyDrafts}>
              <Folder size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyDraftsText, { color: colors.textSecondary }]}>
                No drafts yet. Start creating!
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.draftsScroll}>
              {projects.slice(0, 6).map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[styles.draftCard, { backgroundColor: colors.card }]}
                  onPress={() => {
                    if (project.type === 'image') {
                      router.push('/studio/image-editor');
                    } else {
                      router.push('/studio/video-editor');
                    }
                  }}
                >
                  <View style={styles.draftThumbnail}>
                    {project.type === 'video' && (
                      <View style={[styles.playBadge, { backgroundColor: colors.primary }]}>
                        <Video size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.draftName, { color: colors.text }]} numberOfLines={1}>
                    {project.name}
                  </Text>
                  <Text style={[styles.draftDate, { color: colors.textSecondary }]}>
                    {project.updatedAt.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  projectsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    marginTop: 4,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  createCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  createIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createInfo: {
    flex: 1,
    marginLeft: 16,
  },
  createLabel: {
    fontSize: 17,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  createDescription: {
    fontSize: 14,
  },
  emptyDrafts: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyDraftsText: {
    fontSize: 14,
    marginTop: 12,
  },
  draftsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  draftCard: {
    width: 120,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
  },
  draftThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#333',
    marginBottom: 8,
    position: 'relative',
  },
  playBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  draftDate: {
    fontSize: 11,
  },
});
