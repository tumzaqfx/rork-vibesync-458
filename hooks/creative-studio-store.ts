import React, { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface CreativeProject {
  id: string;
  name: string;
  type: 'image' | 'video';
  originalUri: string;
  editedUri?: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  filters?: {
    selectedFilter: string;
    intensity: number;
  };
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    exposure?: number;
    highlights?: number;
    shadows?: number;
    temperature?: number;
    tint?: number;
  };
  effects?: {
    blur?: number;
    vignette?: number;
    grain?: number;
    sharpen?: number;
  };
  video?: {
    speed: number;
    volume: number;
    startTime: number;
    endTime: number;
    layers: VideoLayer[];
  };
  export?: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    format: 'mp4' | 'mov' | 'jpg' | 'png';
    resolution: string;
  };
}

export interface VideoLayer {
  id: string;
  type: 'video' | 'audio' | 'text' | 'image';
  uri?: string;
  text?: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  opacity: number;
}

export interface Filter {
  id: string;
  name: string;
  category: 'basic' | 'cinematic' | 'vintage' | 'artistic' | 'beauty';
  preview: string;
  settings: Record<string, number>;
}

export interface ExportPreset {
  id: string;
  name: string;
  platform: string;
  resolution: string;
  aspectRatio: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  format: string;
}

interface CreativeStudioContextType {
  // Projects
  projects: CreativeProject[];
  currentProject: CreativeProject | null;
  isLoading: boolean;
  
  // Project Management
  createProject: (name: string, type: 'image' | 'video', uri: string) => Promise<CreativeProject>;
  loadProject: (id: string) => Promise<void>;
  saveProject: (project: CreativeProject) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<CreativeProject>;
  
  // Editing State
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;
  applyFilter: (filterId: string, intensity?: number) => void;
  adjustParameter: (parameter: string, value: number) => void;
  addVideoLayer: (layer: Omit<VideoLayer, 'id'>) => void;
  updateVideoLayer: (layerId: string, updates: Partial<VideoLayer>) => void;
  removeVideoLayer: (layerId: string) => void;
  
  // Export
  exportProject: (preset: ExportPreset) => Promise<string>;
  getExportPresets: () => ExportPreset[];
  
  // Filters & Effects
  getFilters: (category?: string) => Filter[];
  getRecentFilters: () => Filter[];
  
  // History & Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  
  // Templates
  getTemplates: (type: 'image' | 'video') => CreativeProject[];
  applyTemplate: (templateId: string) => void;
}

const STORAGE_KEY = '@vibesync_creative_projects';
const RECENT_FILTERS_KEY = '@vibesync_recent_filters';

// Default filters
const DEFAULT_FILTERS: Filter[] = [
  {
    id: 'original',
    name: 'Original',
    category: 'basic',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
    settings: {},
  },
  {
    id: 'vivid',
    name: 'Vivid',
    category: 'basic',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&sat=2',
    settings: { saturation: 50, contrast: 20 },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    category: 'cinematic',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&con=50',
    settings: { contrast: 60, shadows: -30, highlights: -20 },
  },
  {
    id: 'warm',
    name: 'Warm',
    category: 'cinematic',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&temp=50',
    settings: { temperature: 40, tint: 10 },
  },
  {
    id: 'cool',
    name: 'Cool',
    category: 'cinematic',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&temp=-50',
    settings: { temperature: -40, tint: -10 },
  },
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'vintage',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&sepia=80',
    settings: { temperature: 20, tint: 15, saturation: -20, grain: 30 },
  },
  {
    id: 'beauty',
    name: 'Beauty',
    category: 'beauty',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&blur=1',
    settings: { highlights: 20, shadows: 10, saturation: 15 },
  },
];

// Export presets
const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'instagram_post',
    name: 'Instagram Post',
    platform: 'Instagram',
    resolution: '1080x1080',
    aspectRatio: '1:1',
    quality: 'high',
    format: 'jpg',
  },
  {
    id: 'instagram_story',
    name: 'Instagram Story',
    platform: 'Instagram',
    resolution: '1080x1920',
    aspectRatio: '9:16',
    quality: 'high',
    format: 'jpg',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    platform: 'TikTok',
    resolution: '1080x1920',
    aspectRatio: '9:16',
    quality: 'high',
    format: 'mp4',
  },
  {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    platform: 'YouTube',
    resolution: '1080x1920',
    aspectRatio: '9:16',
    quality: 'ultra',
    format: 'mp4',
  },
  {
    id: 'youtube_hd',
    name: 'YouTube HD',
    platform: 'YouTube',
    resolution: '1920x1080',
    aspectRatio: '16:9',
    quality: 'ultra',
    format: 'mp4',
  },
  {
    id: '4k_ultra',
    name: '4K Ultra HD',
    platform: 'Custom',
    resolution: '3840x2160',
    aspectRatio: '16:9',
    quality: 'ultra',
    format: 'mp4',
  },
];

export const [CreativeStudioProvider, useCreativeStudio] = createContextHook<CreativeStudioContextType>(() => {
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [currentProject, setCurrentProject] = useState<CreativeProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ProjectSettings[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [recentFilters, setRecentFilters] = useState<Filter[]>([]);

  // Load projects from storage
  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedProjects = JSON.parse(stored).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }));
        setProjects(parsedProjects);
      }
      
      const recentFiltersStored = await AsyncStorage.getItem(RECENT_FILTERS_KEY);
      if (recentFiltersStored) {
        setRecentFilters(JSON.parse(recentFiltersStored));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save projects to storage
  const saveProjects = useCallback(async (updatedProjects: CreativeProject[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  }, []);

  // Create new project
  const createProject = useCallback(async (name: string, type: 'image' | 'video', uri: string): Promise<CreativeProject> => {
    const project: CreativeProject = {
      id: Date.now().toString(),
      name,
      type,
      originalUri: uri,
      thumbnail: uri,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        adjustments: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          exposure: 0,
          highlights: 0,
          shadows: 0,
          temperature: 0,
          tint: 0,
        },
        effects: {
          blur: 0,
          vignette: 0,
          grain: 0,
          sharpen: 0,
        },
        filters: {
          selectedFilter: 'original',
          intensity: 100,
        },
        export: {
          quality: 'high',
          format: type === 'image' ? 'jpg' : 'mp4',
          resolution: '1080x1080',
        },
        ...(type === 'video' && {
          video: {
            speed: 1,
            volume: 1,
            startTime: 0,
            endTime: 100,
            layers: [],
          },
        }),
      },
    };

    const updatedProjects = [project, ...projects];
    await saveProjects(updatedProjects);
    setCurrentProject(project);
    setHistory([project.settings]);
    setHistoryIndex(0);
    
    return project;
  }, [projects, saveProjects]);

  // Load project
  const loadProject = useCallback(async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project);
      setHistory([project.settings]);
      setHistoryIndex(0);
    }
  }, [projects]);

  // Save current project
  const saveProject = useCallback(async (project: CreativeProject) => {
    const updatedProjects = projects.map(p => 
      p.id === project.id ? { ...project, updatedAt: new Date() } : p
    );
    await saveProjects(updatedProjects);
    setCurrentProject({ ...project, updatedAt: new Date() });
  }, [projects, saveProjects]);

  // Delete project
  const deleteProject = useCallback(async (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    await saveProjects(updatedProjects);
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  }, [projects, currentProject, saveProjects]);

  // Duplicate project
  const duplicateProject = useCallback(async (id: string): Promise<CreativeProject> => {
    const original = projects.find(p => p.id === id);
    if (!original) throw new Error('Project not found');

    const duplicate: CreativeProject = {
      ...original,
      id: Date.now().toString(),
      name: `${original.name} Copy`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProjects = [duplicate, ...projects];
    await saveProjects(updatedProjects);
    return duplicate;
  }, [projects, saveProjects]);

  // Update project settings with history
  const updateProjectSettings = useCallback((settings: Partial<ProjectSettings>) => {
    if (!currentProject) return;

    const newSettings = { ...currentProject.settings, ...settings };
    const updatedProject = { ...currentProject, settings: newSettings };
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSettings);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setCurrentProject(updatedProject);
    saveProject(updatedProject);
  }, [currentProject, history, historyIndex, saveProject]);

  // Apply filter
  const applyFilter = useCallback((filterId: string, intensity = 100) => {
    const filter = DEFAULT_FILTERS.find(f => f.id === filterId);
    if (!filter || !currentProject) return;

    // Add to recent filters
    const updatedRecentFilters = [filter, ...recentFilters.filter(f => f.id !== filterId)].slice(0, 10);
    setRecentFilters(updatedRecentFilters);
    AsyncStorage.setItem(RECENT_FILTERS_KEY, JSON.stringify(updatedRecentFilters));

    updateProjectSettings({
      filters: { selectedFilter: filterId, intensity },
      adjustments: {
        ...currentProject.settings.adjustments,
        ...filter.settings,
      },
    });
  }, [currentProject, recentFilters, updateProjectSettings]);

  // Adjust parameter
  const adjustParameter = useCallback((parameter: string, value: number) => {
    if (!currentProject) return;

    const [category, param] = parameter.split('.');
    const updates: Partial<ProjectSettings> = {};
    
    if (category === 'adjustments') {
      updates.adjustments = {
        ...currentProject.settings.adjustments,
        [param]: value,
      };
    } else if (category === 'effects') {
      updates.effects = {
        ...currentProject.settings.effects,
        [param]: value,
      };
    }

    updateProjectSettings(updates);
  }, [currentProject, updateProjectSettings]);

  // Video layer management
  const addVideoLayer = useCallback((layer: Omit<VideoLayer, 'id'>) => {
    if (!currentProject || currentProject.type !== 'video') return;

    const newLayer: VideoLayer = {
      ...layer,
      id: Date.now().toString(),
    };

    updateProjectSettings({
      video: {
        ...currentProject.settings.video!,
        layers: [...(currentProject.settings.video?.layers || []), newLayer],
      },
    });
  }, [currentProject, updateProjectSettings]);

  const updateVideoLayer = useCallback((layerId: string, updates: Partial<VideoLayer>) => {
    if (!currentProject || currentProject.type !== 'video') return;

    const updatedLayers = currentProject.settings.video?.layers?.map(layer =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    ) || [];

    updateProjectSettings({
      video: {
        ...currentProject.settings.video!,
        layers: updatedLayers,
      },
    });
  }, [currentProject, updateProjectSettings]);

  const removeVideoLayer = useCallback((layerId: string) => {
    if (!currentProject || currentProject.type !== 'video') return;

    const updatedLayers = currentProject.settings.video?.layers?.filter(layer => layer.id !== layerId) || [];

    updateProjectSettings({
      video: {
        ...currentProject.settings.video!,
        layers: updatedLayers,
      },
    });
  }, [currentProject, updateProjectSettings]);

  // Export project
  const exportProject = useCallback(async (preset: ExportPreset): Promise<string> => {
    if (!currentProject) throw new Error('No project selected');

    console.log('[Creative Studio] Exporting project:', currentProject.name);
    console.log('[Creative Studio] Export preset:', preset);
    console.log('[Creative Studio] Applied filters:', currentProject.settings.filters);
    console.log('[Creative Studio] Adjustments:', currentProject.settings.adjustments);
    console.log('[Creative Studio] Effects:', currentProject.settings.effects);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const exportedUri = currentProject.editedUri || currentProject.originalUri;
    console.log('[Creative Studio] Export complete:', exportedUri);
    
    return exportedUri;
  }, [currentProject]);

  // Get export presets
  const getExportPresets = useCallback(() => {
    return EXPORT_PRESETS.filter(preset => {
      if (!currentProject) return true;
      if (currentProject.type === 'image') {
        return ['jpg', 'png'].includes(preset.format);
      }
      return ['mp4', 'mov'].includes(preset.format);
    });
  }, [currentProject]);

  // Get filters
  const getFilters = useCallback((category?: string) => {
    if (category) {
      return DEFAULT_FILTERS.filter(f => f.category === category);
    }
    return DEFAULT_FILTERS;
  }, []);

  const getRecentFilters = useCallback(() => {
    return recentFilters;
  }, [recentFilters]);

  // Undo/Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (!canUndo || !currentProject) return;
    
    const newIndex = historyIndex - 1;
    const previousSettings = history[newIndex];
    
    setHistoryIndex(newIndex);
    setCurrentProject({ ...currentProject, settings: previousSettings });
    saveProject({ ...currentProject, settings: previousSettings });
  }, [canUndo, currentProject, history, historyIndex, saveProject]);

  const redo = useCallback(() => {
    if (!canRedo || !currentProject) return;
    
    const newIndex = historyIndex + 1;
    const nextSettings = history[newIndex];
    
    setHistoryIndex(newIndex);
    setCurrentProject({ ...currentProject, settings: nextSettings });
    saveProject({ ...currentProject, settings: nextSettings });
  }, [canRedo, currentProject, history, historyIndex, saveProject]);

  // Templates (placeholder)
  const getTemplates = useCallback((type: 'image' | 'video') => {
    // In a real app, this would return predefined templates
    return [];
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    // In a real app, this would apply a template to the current project
    console.log('Applying template:', templateId);
  }, []);

  // Load projects on mount
  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return useMemo(() => ({
    projects,
    currentProject,
    isLoading,
    createProject,
    loadProject,
    saveProject,
    deleteProject,
    duplicateProject,
    updateProjectSettings,
    applyFilter,
    adjustParameter,
    addVideoLayer,
    updateVideoLayer,
    removeVideoLayer,
    exportProject,
    getExportPresets,
    getFilters,
    getRecentFilters,
    canUndo,
    canRedo,
    undo,
    redo,
    getTemplates,
    applyTemplate,
  }), [
    projects,
    currentProject,
    isLoading,
    createProject,
    loadProject,
    saveProject,
    deleteProject,
    duplicateProject,
    updateProjectSettings,
    applyFilter,
    adjustParameter,
    addVideoLayer,
    updateVideoLayer,
    removeVideoLayer,
    exportProject,
    getExportPresets,
    getFilters,
    getRecentFilters,
    canUndo,
    canRedo,
    undo,
    redo,
    getTemplates,
    applyTemplate,
  ]);
});