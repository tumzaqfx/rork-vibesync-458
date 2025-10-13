import { useState, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';

export type ProjectType = 'image' | 'video';
export type AspectRatio = '1:1' | '9:16' | '16:9' | '4:5' | 'freeform';
export type Resolution = '720p' | '1080p' | '2K' | '4K';
export type FrameRate = 24 | 30 | 60;

export interface Project {
  id: string;
  type: ProjectType;
  name: string;
  thumbnail?: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  frameRate?: FrameRate;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  mediaUri?: string;
  edits: ProjectEdits;
}

export interface ProjectEdits {
  filters: FilterEdit[];
  adjustments: AdjustmentEdit;
  effects: EffectEdit[];
  textLayers: TextLayer[];
  stickers: StickerLayer[];
  overlays: OverlayLayer[];
  audioTracks: AudioTrack[];
  transitions?: TransitionEdit[];
  trimData?: TrimData;
}

export interface FilterEdit {
  id: string;
  name: string;
  intensity: number;
}

export interface AdjustmentEdit {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  clarity: number;
  sharpness: number;
  grain: number;
  vignette: number;
}

export interface EffectEdit {
  id: string;
  type: 'glitch' | 'vhs' | 'sparkle' | 'neon' | 'blur' | 'bokeh' | 'motion' | 'lens-flare' | 'light-leak' | 'dust';
  intensity: number;
  params?: Record<string, any>;
}

export interface TextLayer {
  id: string;
  text: string;
  font: string;
  size: number;
  color: string;
  position: { x: number; y: number };
  rotation: number;
  opacity: number;
  style: {
    shadow?: boolean;
    stroke?: boolean;
    glow?: boolean;
    neon?: boolean;
  };
  animation?: 'fade-in' | 'typewriter' | 'bounce' | 'zoom';
}

export interface StickerLayer {
  id: string;
  uri: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  opacity: number;
}

export interface OverlayLayer {
  id: string;
  uri: string;
  blendMode: 'overlay' | 'multiply' | 'screen' | 'soft-light';
  opacity: number;
}

export interface AudioTrack {
  id: string;
  uri: string;
  name: string;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  startTime: number;
  duration: number;
}

export interface TransitionEdit {
  id: string;
  type: 'fade' | 'dissolve' | 'wipe' | 'slide' | 'zoom' | 'glitch';
  duration: number;
  position: number;
}

export interface TrimData {
  startTime: number;
  endTime: number;
  clips: ClipData[];
}

export interface ClipData {
  id: string;
  startTime: number;
  endTime: number;
  speed: number;
}

const defaultAdjustments: AdjustmentEdit = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  clarity: 0,
  sharpness: 0,
  grain: 0,
  vignette: 0,
};

export const [StudioProvider, useStudio] = createContextHook(() => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const createProject = useCallback((
    type: ProjectType,
    name: string,
    aspectRatio: AspectRatio,
    resolution: Resolution,
    frameRate?: FrameRate,
    mediaUri?: string
  ): Project => {
    const project: Project = {
      id: Date.now().toString(),
      type,
      name,
      aspectRatio,
      resolution,
      frameRate,
      mediaUri,
      createdAt: new Date(),
      updatedAt: new Date(),
      edits: {
        filters: [],
        adjustments: { ...defaultAdjustments },
        effects: [],
        textLayers: [],
        stickers: [],
        overlays: [],
        audioTracks: [],
        transitions: type === 'video' ? [] : undefined,
        trimData: type === 'video' ? { startTime: 0, endTime: 0, clips: [] } : undefined,
      },
    };

    setProjects(prev => [project, ...prev]);
    setCurrentProject(project);
    return project;
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, ...updates, updatedAt: new Date() }
        : p
    ));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  }, [currentProject]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const duplicateProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const duplicate: Project = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prev => [duplicate, ...prev]);
  }, [projects]);

  const addFilter = useCallback((filter: FilterEdit) => {
    if (!currentProject) return;
    
    updateProject(currentProject.id, {
      edits: {
        ...currentProject.edits,
        filters: [...currentProject.edits.filters, filter],
      },
    });
  }, [currentProject, updateProject]);

  const updateAdjustments = useCallback((adjustments: Partial<AdjustmentEdit>) => {
    if (!currentProject) return;
    
    updateProject(currentProject.id, {
      edits: {
        ...currentProject.edits,
        adjustments: { ...currentProject.edits.adjustments, ...adjustments },
      },
    });
  }, [currentProject, updateProject]);

  const addEffect = useCallback((effect: EffectEdit) => {
    if (!currentProject) return;
    
    updateProject(currentProject.id, {
      edits: {
        ...currentProject.edits,
        effects: [...currentProject.edits.effects, effect],
      },
    });
  }, [currentProject, updateProject]);

  const addTextLayer = useCallback((textLayer: TextLayer) => {
    if (!currentProject) return;
    
    updateProject(currentProject.id, {
      edits: {
        ...currentProject.edits,
        textLayers: [...currentProject.edits.textLayers, textLayer],
      },
    });
  }, [currentProject, updateProject]);

  const addSticker = useCallback((sticker: StickerLayer) => {
    if (!currentProject) return;
    
    updateProject(currentProject.id, {
      edits: {
        ...currentProject.edits,
        stickers: [...currentProject.edits.stickers, sticker],
      },
    });
  }, [currentProject, updateProject]);

  const addOverlay = useCallback((overlay: OverlayLayer) => {
    if (!currentProject) return;
    
    updateProject(currentProject.id, {
      edits: {
        ...currentProject.edits,
        overlays: [...currentProject.edits.overlays, overlay],
      },
    });
  }, [currentProject, updateProject]);

  const addAudioTrack = useCallback((audio: AudioTrack) => {
    if (!currentProject) return;
    
    updateProject(currentProject.id, {
      edits: {
        ...currentProject.edits,
        audioTracks: [...currentProject.edits.audioTracks, audio],
      },
    });
  }, [currentProject, updateProject]);

  const resetAdjustments = useCallback(() => {
    if (!currentProject) return;
    
    updateProject(currentProject.id, {
      edits: {
        ...currentProject.edits,
        adjustments: { ...defaultAdjustments },
      },
    });
  }, [currentProject, updateProject]);

  return useMemo(() => ({
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    addFilter,
    updateAdjustments,
    addEffect,
    addTextLayer,
    addSticker,
    addOverlay,
    addAudioTrack,
    resetAdjustments,
  }), [
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    addFilter,
    updateAdjustments,
    addEffect,
    addTextLayer,
    addSticker,
    addOverlay,
    addAudioTrack,
    resetAdjustments,
  ]);
});
