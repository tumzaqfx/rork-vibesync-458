import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Play,
  Edit3,
  Trash2,
  Copy,
  Share,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { useCreativeStudio, CreativeProject } from '@/hooks/creative-studio-store';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'image' | 'video';

export default function ProjectsGalleryScreen() {
  const { colors } = useTheme();
  const {
    projects,
    isLoading,
    deleteProject,
    duplicateProject,
    loadProject,
  } = useCreativeStudio();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.type === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleProjectPress = async (project: CreativeProject) => {
    await loadProject(project.id);
    if (project.type === 'image') {
      router.push('/studio/image-editor');
    } else {
      router.push('/studio/video-editor');
    }
  };

  const handleProjectLongPress = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProject(projectId),
        },
      ]
    );
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      await duplicateProject(projectId);
      Alert.alert('Success', 'Project duplicated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to duplicate project.');
    }
  };

  const handleShareProject = (project: CreativeProject) => {
    // In a real app, this would share the project
    Alert.alert('Share', `Sharing ${project.name}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Edit3 size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Projects Yet</Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        Create your first project using the Creative Studio
      </Text>
      <Button
        title="Start Creating"
        onPress={() => router.push('/(tabs)/create')}
        style={styles.emptyStateButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Projects</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/create')} style={styles.headerButton}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {filteredProjects.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Projects</Text>
          {filteredProjects.slice(0, 6).map((project) => (
            <TouchableOpacity
              key={project.id}
              style={[styles.projectCard, { backgroundColor: colors.card }]}
              onPress={() => handleProjectPress(project)}
            >
              <Image
                source={{ uri: project.thumbnail }}
                style={styles.projectThumbnail}
                contentFit="cover"
              />
              <View style={styles.projectInfo}>
                <Text style={[styles.projectName, { color: colors.text }]}>{project.name}</Text>
                <Text style={[styles.projectType, { color: colors.textSecondary }]}>
                  {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                </Text>
                <Text style={[styles.projectDate, { color: colors.textSecondary }]}>
                  {project.updatedAt.toLocaleDateString()}
                </Text>
              </View>
              {project.type === 'video' && (
                <View style={[styles.playIcon, { backgroundColor: `${colors.background}80` }]}>
                  <Play size={16} color={colors.text} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  projectCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
  },
  projectThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  projectInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  projectType: {
    fontSize: 14,
    marginBottom: 2,
  },
  projectDate: {
    fontSize: 12,
  },
  playIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyStateButton: {
    width: '100%',
  },
});