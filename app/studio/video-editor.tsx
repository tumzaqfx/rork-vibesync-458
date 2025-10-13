import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Download,
  Video,
  Scissors,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Type,
  Sparkles,
  Music,
  Mic,
  Sliders,
  Smile,
  Image as ImageIcon,
  Square,
  Wand2,
  Undo,
  Redo,
  Save,
  Layers,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { Button } from '@/components/ui/Button';
import { useStudio } from '@/hooks/studio-store';

const { width: screenWidth } = Dimensions.get('window');

type ToolCategory = 'filters' | 'adjust' | 'effects' | 'text' | 'stickers' | 'overlays' | 'frames' | 'transitions' | 'audio' | 'trim';

interface Tool {
  id: ToolCategory;
  name: string;
  icon: React.ComponentType<any>;
}

const TOOLS: Tool[] = [
  { id: 'filters', name: 'Filters', icon: Sparkles },
  { id: 'adjust', name: 'Adjust', icon: Sliders },
  { id: 'effects', name: 'Effects', icon: Wand2 },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'stickers', name: 'Stickers', icon: Smile },
  { id: 'overlays', name: 'Overlays', icon: ImageIcon },
  { id: 'frames', name: 'Frames', icon: Square },
  { id: 'transitions', name: 'Transitions', icon: Layers },
  { id: 'audio', name: 'Audio', icon: Music },
  { id: 'trim', name: 'Trim', icon: Scissors },
];

const FILTERS = [
  { id: 'none', name: 'Original', preview: '#000' },
  { id: 'cinematic', name: 'Cinematic', preview: '#1a4d6d' },
  { id: 'vintage', name: 'Vintage', preview: '#8b7355' },
  { id: 'noir', name: 'Noir', preview: '#2a2a2a' },
  { id: 'warm', name: 'Warm', preview: '#ff8c42' },
  { id: 'cool', name: 'Cool', preview: '#4a90e2' },
  { id: 'neon', name: 'Neon', preview: '#ff00ff' },
  { id: 'pastel', name: 'Pastel', preview: '#ffd1dc' },
];

const EFFECTS = [
  { id: 'glitch', name: 'Glitch' },
  { id: 'vhs', name: 'VHS' },
  { id: 'sparkle', name: 'Sparkle' },
  { id: 'neon-glow', name: 'Neon Glow' },
  { id: 'blur', name: 'Blur' },
  { id: 'bokeh', name: 'Bokeh' },
  { id: 'lens-flare', name: 'Lens Flare' },
  { id: 'light-leak', name: 'Light Leak' },
];

const TRANSITIONS = [
  { id: 'fade', name: 'Fade' },
  { id: 'dissolve', name: 'Dissolve' },
  { id: 'wipe', name: 'Wipe' },
  { id: 'slide', name: 'Slide' },
  { id: 'zoom', name: 'Zoom' },
  { id: 'glitch', name: 'Glitch' },
];

export default function VideoEditorScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const { currentProject, updateProject, createProject } = useStudio();
  
  const [videoUri, setVideoUri] = useState<string | null>(
    (params.mediaUri as string) || currentProject?.mediaUri || null
  );
  const [activeTool, setActiveTool] = useState<ToolCategory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
        setDuration(result.assets[0].duration || 100);
        
        if (!currentProject) {
          createProject('video', 'New Video Project', '9:16', '1080p', 30, result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video.');
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const exportVideo = (resolution: string) => {
    setShowExportModal(false);
    Alert.alert('Export Started', `Exporting video in ${resolution}...`);
  };

  const renderToolPanel = () => {
    if (!activeTool) return null;

    switch (activeTool) {
      case 'filters':
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolContent}>
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterItem,
                  selectedFilter === filter.id && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <View style={[styles.filterPreview, { backgroundColor: filter.preview }]} />
                <Text style={[styles.filterName, { color: colors.text }]}>{filter.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'adjust':
        return (
          <ScrollView style={styles.toolContent}>
            <View style={styles.adjustmentItem}>
              <Text style={[styles.adjustmentLabel, { color: colors.text }]}>Brightness</Text>
              <View style={styles.sliderContainer}>
                <Text style={[styles.sliderValue, { color: colors.textSecondary }]}>{brightness}</Text>
              </View>
            </View>
            <View style={styles.adjustmentItem}>
              <Text style={[styles.adjustmentLabel, { color: colors.text }]}>Contrast</Text>
              <View style={styles.sliderContainer}>
                <Text style={[styles.sliderValue, { color: colors.textSecondary }]}>{contrast}</Text>
              </View>
            </View>
            <View style={styles.adjustmentItem}>
              <Text style={[styles.adjustmentLabel, { color: colors.text }]}>Saturation</Text>
              <View style={styles.sliderContainer}>
                <Text style={[styles.sliderValue, { color: colors.textSecondary }]}>{saturation}</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'effects':
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolContent}>
            {EFFECTS.map((effect) => (
              <TouchableOpacity
                key={effect.id}
                style={[styles.effectItem, { backgroundColor: colors.card }]}
                onPress={() => Alert.alert('Effect', `Applied ${effect.name}`)}
              >
                <Wand2 size={24} color={colors.primary} />
                <Text style={[styles.effectName, { color: colors.text }]}>{effect.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'text':
        return (
          <View style={styles.toolContent}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Add Text', 'Text editor coming soon')}
            >
              <Type size={20} color={colors.textInverse} />
              <Text style={[styles.addButtonText, { color: colors.textInverse }]}>Add Text Layer</Text>
            </TouchableOpacity>
          </View>
        );

      case 'stickers':
        return (
          <View style={styles.toolContent}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Add Sticker', 'Sticker library coming soon')}
            >
              <Smile size={20} color={colors.textInverse} />
              <Text style={[styles.addButtonText, { color: colors.textInverse }]}>Add Sticker</Text>
            </TouchableOpacity>
          </View>
        );

      case 'overlays':
        return (
          <View style={styles.toolContent}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Add Overlay', 'Overlay library coming soon')}
            >
              <ImageIcon size={20} color={colors.textInverse} />
              <Text style={[styles.addButtonText, { color: colors.textInverse }]}>Add Overlay</Text>
            </TouchableOpacity>
          </View>
        );

      case 'frames':
        return (
          <View style={styles.toolContent}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Add Frame', 'Frame library coming soon')}
            >
              <Square size={20} color={colors.textInverse} />
              <Text style={[styles.addButtonText, { color: colors.textInverse }]}>Add Frame</Text>
            </TouchableOpacity>
          </View>
        );

      case 'transitions':
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolContent}>
            {TRANSITIONS.map((transition) => (
              <TouchableOpacity
                key={transition.id}
                style={[styles.transitionItem, { backgroundColor: colors.card }]}
                onPress={() => Alert.alert('Transition', `Applied ${transition.name}`)}
              >
                <Layers size={24} color={colors.primary} />
                <Text style={[styles.transitionName, { color: colors.text }]}>{transition.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'audio':
        return (
          <View style={styles.toolContent}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Add Audio', 'Audio library coming soon')}
            >
              <Music size={20} color={colors.textInverse} />
              <Text style={[styles.addButtonText, { color: colors.textInverse }]}>Add Music</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.card, marginTop: 8 }]}
              onPress={() => Alert.alert('Record', 'Voice recording coming soon')}
            >
              <Mic size={20} color={colors.text} />
              <Text style={[styles.addButtonText, { color: colors.text }]}>Record Voiceover</Text>
            </TouchableOpacity>
          </View>
        );

      case 'trim':
        return (
          <View style={styles.toolContent}>
            <View style={[styles.trimTimeline, { backgroundColor: colors.border }]}>
              <View style={[styles.trimHandle, { backgroundColor: colors.primary }]} />
              <View style={[styles.trimHandle, { backgroundColor: colors.primary, right: 0 }]} />
            </View>
            <Text style={[styles.trimInfo, { color: colors.textSecondary }]}>
              Drag handles to trim video
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Undo size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Redo size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Save size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                'Post Video',
                'Post this edited video to your feed?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Post', 
                    onPress: () => {
                      Alert.alert('Success', 'Video posted to your feed!');
                      router.back();
                    }
                  },
                ]
              );
            }} 
            style={[styles.headerButton, { backgroundColor: colors.primary, paddingHorizontal: 12, borderRadius: 8 }]}
          >
            <Text style={{ color: colors.textInverse, fontWeight: '600' as const, fontSize: 14 }}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExport} style={styles.headerButton}>
            <Download size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {!videoUri ? (
        <View style={styles.emptyState}>
          <Video size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Video Selected</Text>
          <Button title="Choose Video" onPress={pickVideo} style={styles.emptyStateButton} />
        </View>
      ) : (
        <>
          <View style={styles.canvas}>
            <View style={[styles.videoPreview, { backgroundColor: colors.card }]}>
              <Image
                source={{ uri: videoUri }}
                style={styles.videoImage}
                contentFit="contain"
              />
              <TouchableOpacity
                style={[styles.playOverlay, { backgroundColor: `${colors.background}80` }]}
                onPress={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause size={40} color={colors.text} />
                ) : (
                  <Play size={40} color={colors.text} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.timeline, { backgroundColor: colors.card }]}>
            <View style={styles.timelineHeader}>
              <Text style={[styles.timelineTime, { color: colors.text }]}>
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
              </Text>
              <View style={styles.playbackControls}>
                <TouchableOpacity style={styles.playbackButton}>
                  <SkipBack size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.playbackButton} onPress={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={16} color={colors.text} /> : <Play size={16} color={colors.text} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.playbackButton}>
                  <SkipForward size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={16} color={colors.text} /> : <Volume2 size={16} color={colors.text} />}
              </TouchableOpacity>
            </View>
            <View style={[styles.timelineTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.timelineProgress, { backgroundColor: colors.primary, width: '30%' }]} />
              <View style={[styles.timelinePlayhead, { backgroundColor: colors.primary, left: '30%' }]} />
            </View>
          </View>

          <View style={[styles.toolbar, { backgroundColor: colors.card }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarContent}>
              {TOOLS.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <TouchableOpacity
                    key={tool.id}
                    style={[
                      styles.toolButton,
                      activeTool === tool.id && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                  >
                    <IconComponent
                      size={20}
                      color={activeTool === tool.id ? colors.textInverse : colors.text}
                    />
                    <Text
                      style={[
                        styles.toolButtonText,
                        { color: activeTool === tool.id ? colors.textInverse : colors.text }
                      ]}
                    >
                      {tool.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {activeTool && (
            <View style={[styles.toolPanel, { backgroundColor: colors.card }]}>
              {renderToolPanel()}
            </View>
          )}
        </>
      )}

      <Modal visible={showExportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Export Video</Text>
            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: colors.background }]}
              onPress={() => exportVideo('720p')}
            >
              <Text style={[styles.exportOptionText, { color: colors.text }]}>720p HD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: colors.background }]}
              onPress={() => exportVideo('1080p')}
            >
              <Text style={[styles.exportOptionText, { color: colors.text }]}>1080p Full HD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: colors.background }]}
              onPress={() => exportVideo('4K')}
            >
              <Text style={[styles.exportOptionText, { color: colors.text }]}>4K Ultra HD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalCancel, { backgroundColor: colors.background }]}
              onPress={() => setShowExportModal(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  emptyStateButton: {
    marginTop: 16,
  },
  canvas: {
    flex: 1,
    padding: 16,
  },
  videoPreview: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeline: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timelineTime: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playbackButton: {
    padding: 4,
  },
  timelineTrack: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
  },
  timelineProgress: {
    height: '100%',
    borderRadius: 2,
  },
  timelinePlayhead: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
  },
  toolbar: {
    paddingVertical: 12,
  },
  toolbarContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  toolButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  toolButtonText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  toolPanel: {
    height: 180,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  toolContent: {
    padding: 16,
  },
  filterItem: {
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 8,
    padding: 4,
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 4,
  },
  filterName: {
    fontSize: 12,
  },
  adjustmentItem: {
    marginBottom: 16,
  },
  adjustmentLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderValue: {
    fontSize: 12,
  },
  effectItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 80,
  },
  effectName: {
    fontSize: 12,
    marginTop: 4,
  },
  transitionItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 80,
  },
  transitionName: {
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  trimTimeline: {
    height: 60,
    borderRadius: 8,
    position: 'relative',
    marginBottom: 8,
  },
  trimHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    left: 0,
  },
  trimInfo: {
    fontSize: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 20,
  },
  exportOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exportOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  modalCancel: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
