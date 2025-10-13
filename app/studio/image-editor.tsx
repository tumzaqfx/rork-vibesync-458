import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
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
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Wand2,
  Type,
  Smile,
  Image as OverlayIcon,
  Square,
  Undo,
  Redo,
  Save,
  RotateCcw,
  Crop,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { Button } from '@/components/ui/Button';
import { useStudio } from '@/hooks/studio-store';
import { 
  FILTER_CATEGORIES, 
  ALL_FILTERS, 
  getFiltersByCategory,
  FilterCategoryType,
  FilterPreset 
} from '@/constants/filters';

type ToolCategory = 'filters' | 'adjust' | 'effects' | 'text' | 'stickers' | 'overlays' | 'frames' | 'crop';

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
  { id: 'overlays', name: 'Overlays', icon: OverlayIcon },
  { id: 'frames', name: 'Frames', icon: Square },
  { id: 'crop', name: 'Crop', icon: Crop },
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
  { id: 'dust', name: 'Dust & Scratches' },
];

export default function ImageEditorScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const { currentProject, createProject } = useStudio();
  
  const [imageUri, setImageUri] = useState<string | null>(
    (params.mediaUri as string) || currentProject?.mediaUri || null
  );
  const [activeTool, setActiveTool] = useState<ToolCategory | null>(null);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<FilterCategoryType>('basic');
  const [selectedFilter, setSelectedFilter] = useState<FilterPreset>(ALL_FILTERS[0]);
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        
        if (!currentProject) {
          createProject('image', 'New Image Project', '1:1', '1080p', undefined, result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const exportImage = (resolution: string) => {
    setShowExportModal(false);
    Alert.alert('Export Started', `Exporting image in ${resolution}...`);
  };

  const resetAdjustments = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setExposure(0);
  };

  const renderToolPanel = () => {
    if (!activeTool) return null;

    switch (activeTool) {
      case 'filters':
        const categoryFilters = getFiltersByCategory(selectedFilterCategory);
        return (
          <View style={styles.filterContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.filterCategoryScroll}
              contentContainerStyle={styles.filterCategoryContent}
            >
              {FILTER_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: colors.card },
                    selectedFilterCategory === category.id && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      borderWidth: 2
                    }
                  ]}
                  onPress={() => setSelectedFilterCategory(category.id)}
                >
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryName,
                      { color: selectedFilterCategory === category.id ? colors.textInverse : colors.text }
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}
            >
              {categoryFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterItem,
                    selectedFilter.id === filter.id && { 
                      borderColor: colors.primary, 
                      borderWidth: 3 
                    }
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <View style={[styles.filterPreview, { backgroundColor: filter.preview }]}>
                    {filter.isPremium && (
                      <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.premiumText, { color: colors.textInverse }]}>PRO</Text>
                      </View>
                    )}
                  </View>
                  <Text 
                    style={[styles.filterName, { color: colors.text }]} 
                    numberOfLines={1}
                  >
                    {filter.name}
                  </Text>
                  <Text 
                    style={[styles.filterDescription, { color: colors.textSecondary }]} 
                    numberOfLines={1}
                  >
                    {filter.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {selectedFilter.id !== 'original' && (
              <View style={[styles.intensityControl, { backgroundColor: colors.card }]}>
                <Text style={[styles.intensityLabel, { color: colors.text }]}>Intensity</Text>
                <Text style={[styles.intensityValue, { color: colors.primary }]}>{filterIntensity}%</Text>
              </View>
            )}
          </View>
        );

      case 'adjust':
        return (
          <ScrollView style={styles.toolContent}>
            <View style={styles.adjustmentItem}>
              <View style={styles.adjustmentHeader}>
                <Text style={[styles.adjustmentLabel, { color: colors.text }]}>Brightness</Text>
                <Text style={[styles.adjustmentValue, { color: colors.textSecondary }]}>{brightness}</Text>
              </View>
            </View>
            <View style={styles.adjustmentItem}>
              <View style={styles.adjustmentHeader}>
                <Text style={[styles.adjustmentLabel, { color: colors.text }]}>Contrast</Text>
                <Text style={[styles.adjustmentValue, { color: colors.textSecondary }]}>{contrast}</Text>
              </View>
            </View>
            <View style={styles.adjustmentItem}>
              <View style={styles.adjustmentHeader}>
                <Text style={[styles.adjustmentLabel, { color: colors.text }]}>Saturation</Text>
                <Text style={[styles.adjustmentValue, { color: colors.textSecondary }]}>{saturation}</Text>
              </View>
            </View>
            <View style={styles.adjustmentItem}>
              <View style={styles.adjustmentHeader}>
                <Text style={[styles.adjustmentLabel, { color: colors.text }]}>Exposure</Text>
                <Text style={[styles.adjustmentValue, { color: colors.textSecondary }]}>{exposure}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: colors.card }]}
              onPress={resetAdjustments}
            >
              <RotateCcw size={16} color={colors.text} />
              <Text style={[styles.resetButtonText, { color: colors.text }]}>Reset All</Text>
            </TouchableOpacity>
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
              <OverlayIcon size={20} color={colors.textInverse} />
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

      case 'crop':
        return (
          <View style={styles.toolContent}>
            <Text style={[styles.cropInfo, { color: colors.textSecondary }]}>
              Drag corners to crop image
            </Text>
            <View style={styles.aspectRatios}>
              {['1:1', '4:5', '16:9', '9:16', 'Free'].map((ratio) => (
                <TouchableOpacity
                  key={ratio}
                  style={[styles.aspectRatioButton, { backgroundColor: colors.card }]}
                  onPress={() => Alert.alert('Aspect Ratio', `Set to ${ratio}`)}
                >
                  <Text style={[styles.aspectRatioText, { color: colors.text }]}>{ratio}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
                'Post Image',
                'Post this edited image to your feed?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Post', 
                    onPress: () => {
                      Alert.alert('Success', 'Image posted to your feed!');
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

      {!imageUri ? (
        <View style={styles.emptyState}>
          <ImageIcon size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Image Selected</Text>
          <Button title="Choose Image" onPress={pickImage} style={styles.emptyStateButton} />
        </View>
      ) : (
        <>
          <View style={styles.canvas}>
            <View style={[styles.imagePreview, { backgroundColor: colors.card }]}>
              <Image
                source={{ uri: imageUri }}
                style={styles.imageContent}
                contentFit="contain"
              />
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>Export Image</Text>
            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: colors.background }]}
              onPress={() => exportImage('1080p')}
            >
              <Text style={[styles.exportOptionText, { color: colors.text }]}>1080p HD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: colors.background }]}
              onPress={() => exportImage('2K')}
            >
              <Text style={[styles.exportOptionText, { color: colors.text }]}>2K</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: colors.background }]}
              onPress={() => exportImage('4K')}
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
  imagePreview: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContent: {
    width: '100%',
    height: '100%',
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
    height: 240,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  toolContent: {
    padding: 16,
  },
  filterContainer: {
    flex: 1,
  },
  filterCategoryScroll: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterCategoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  filterScroll: {
    flex: 1,
  },
  filterScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  filterItem: {
    alignItems: 'center',
    width: 80,
    borderRadius: 8,
    padding: 4,
  },
  filterPreview: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginBottom: 6,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  premiumBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    margin: 4,
  },
  premiumText: {
    fontSize: 8,
    fontWeight: '700' as const,
  },
  filterName: {
    fontSize: 11,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  filterDescription: {
    fontSize: 9,
    textAlign: 'center',
  },
  intensityControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  intensityLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  intensityValue: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  adjustmentItem: {
    marginBottom: 16,
  },
  adjustmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adjustmentLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  adjustmentValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  cropInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  aspectRatios: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  aspectRatioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  aspectRatioText: {
    fontSize: 12,
    fontWeight: '600' as const,
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
