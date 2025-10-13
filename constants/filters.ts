/**
 * Professional-grade filter system for Creative Studio
 * Industry-level LUTs and color grading presets
 */

export interface FilterPreset {
  id: string;
  name: string;
  category: FilterCategoryType;
  description: string;
  preview: string;
  isPremium?: boolean;
  settings: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    exposure?: number;
    highlights?: number;
    shadows?: number;
    whites?: number;
    blacks?: number;
    temperature?: number;
    tint?: number;
    vibrance?: number;
    clarity?: number;
    grain?: number;
    vignette?: number;
    sharpen?: number;
    hue?: number;
  };
}

export type FilterCategoryType = 
  | 'cinematic'
  | 'professional'
  | 'film'
  | 'creative'
  | 'lighting'
  | 'vintage'
  | 'beauty'
  | 'basic';

export interface FilterCategoryInfo {
  id: FilterCategoryType;
  name: string;
  icon: string;
  description: string;
}

export const FILTER_CATEGORIES: FilterCategoryInfo[] = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    icon: '🎬',
    description: 'Hollywood-grade color grading',
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: '⭐',
    description: 'Industry-standard color tools',
  },
  {
    id: 'film',
    name: 'Film Simulation',
    icon: '🎞️',
    description: 'Classic film stock emulation',
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: '✨',
    description: 'Artistic effects & styles',
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: '💡',
    description: 'Advanced lighting effects',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: '📷',
    description: 'Retro & nostalgic looks',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: '💄',
    description: 'Portrait enhancement',
  },
  {
    id: 'basic',
    name: 'Basic',
    icon: '🎨',
    description: 'Essential adjustments',
  },
];

export const CINEMATIC_FILTERS: FilterPreset[] = [
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    category: 'cinematic',
    description: 'Classic blockbuster look',
    preview: '#1a7a8a',
    settings: {
      temperature: 15,
      tint: -5,
      saturation: 20,
      contrast: 25,
      highlights: -10,
      shadows: -15,
      vibrance: 30,
    },
  },
  {
    id: 'desaturated-grit',
    name: 'Desaturated Grit',
    category: 'cinematic',
    description: 'Crime/drama mood',
    preview: '#4a4a4a',
    settings: {
      saturation: -40,
      contrast: 35,
      clarity: 40,
      shadows: -20,
      blacks: -15,
      grain: 15,
    },
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    category: 'cinematic',
    description: 'Warm sunset tones',
    preview: '#ff9a3c',
    settings: {
      temperature: 35,
      tint: 10,
      exposure: 5,
      highlights: -5,
      saturation: 15,
      vibrance: 25,
    },
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'cinematic',
    description: 'Neon purples, blues, pinks',
    preview: '#ff00ff',
    settings: {
      saturation: 60,
      vibrance: 50,
      contrast: 30,
      shadows: -25,
      blacks: -30,
      tint: 15,
      hue: 280,
    },
  },
  {
    id: 'monochrome-noir',
    name: 'Monochrome Noir',
    category: 'cinematic',
    description: 'Cinematic black & white',
    preview: '#1a1a1a',
    settings: {
      saturation: -100,
      contrast: 45,
      clarity: 35,
      highlights: -15,
      shadows: -25,
      blacks: -20,
      grain: 10,
    },
  },
  {
    id: 'bleach-bypass',
    name: 'Bleach Bypass',
    category: 'cinematic',
    description: 'Washed-out war movie style',
    preview: '#8a8a7a',
    settings: {
      saturation: -30,
      contrast: 40,
      highlights: 20,
      shadows: -10,
      clarity: 30,
    },
  },
];

export const PROFESSIONAL_FILTERS: FilterPreset[] = [
  {
    id: 'hdr-boost',
    name: 'HDR Boost',
    category: 'professional',
    description: 'Enhanced dynamic range',
    preview: '#ff8c42',
    settings: {
      highlights: -30,
      shadows: 30,
      whites: 10,
      blacks: -10,
      clarity: 25,
      vibrance: 20,
    },
  },
  {
    id: 'studio-portrait',
    name: 'Studio Portrait',
    category: 'professional',
    description: 'Professional portrait lighting',
    preview: '#ffd1b3',
    settings: {
      exposure: 10,
      highlights: -15,
      shadows: 15,
      temperature: 5,
      saturation: -5,
      clarity: -10,
      sharpen: 20,
    },
  },
  {
    id: 'landscape-vivid',
    name: 'Landscape Vivid',
    category: 'professional',
    description: 'Enhanced nature colors',
    preview: '#4a9d5f',
    settings: {
      vibrance: 40,
      saturation: 15,
      clarity: 30,
      contrast: 20,
      highlights: -10,
      shadows: 5,
    },
  },
  {
    id: 'color-match',
    name: 'Color Match',
    category: 'professional',
    description: 'Balanced color correction',
    preview: '#7a8a9a',
    settings: {
      temperature: 0,
      tint: 0,
      exposure: 5,
      contrast: 10,
      highlights: -5,
      shadows: 5,
    },
  },
];

export const FILM_SIMULATION_FILTERS: FilterPreset[] = [
  {
    id: 'kodak-portra',
    name: 'Kodak Portra',
    category: 'film',
    description: 'Classic portrait film',
    preview: '#ffd1c1',
    settings: {
      temperature: 8,
      tint: 5,
      saturation: -5,
      contrast: -5,
      highlights: -10,
      shadows: 10,
      grain: 8,
    },
  },
  {
    id: 'fuji-velvia',
    name: 'Fuji Velvia',
    category: 'film',
    description: 'Vibrant landscape film',
    preview: '#ff6a3c',
    settings: {
      saturation: 35,
      vibrance: 30,
      contrast: 20,
      clarity: 15,
      grain: 5,
    },
  },
  {
    id: 'polaroid-sx70',
    name: 'Polaroid SX-70',
    category: 'film',
    description: 'Instant film aesthetic',
    preview: '#f0e68c',
    settings: {
      temperature: 15,
      saturation: -10,
      contrast: -15,
      exposure: 10,
      vignette: 20,
      grain: 25,
    },
  },
  {
    id: 'tri-x-400',
    name: 'Tri-X 400',
    category: 'film',
    description: 'Classic B&W film',
    preview: '#3a3a3a',
    settings: {
      saturation: -100,
      contrast: 30,
      grain: 20,
      clarity: 20,
      blacks: -10,
    },
  },
];

export const CREATIVE_FILTERS: FilterPreset[] = [
  {
    id: 'glitch-art',
    name: 'Glitch Art',
    category: 'creative',
    description: 'Digital distortion effect',
    preview: '#ff00aa',
    isPremium: true,
    settings: {
      saturation: 80,
      contrast: 50,
      hue: 180,
      vibrance: 60,
    },
  },
  {
    id: 'vhs-tape',
    name: 'VHS Tape',
    category: 'creative',
    description: 'Retro video aesthetic',
    preview: '#8b4789',
    settings: {
      saturation: -20,
      contrast: -10,
      grain: 40,
      vignette: 30,
      temperature: -5,
    },
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    category: 'creative',
    description: 'Vibrant neon effect',
    preview: '#00ffff',
    isPremium: true,
    settings: {
      saturation: 70,
      vibrance: 80,
      contrast: 35,
      highlights: 20,
      clarity: -20,
    },
  },
  {
    id: 'dreamy-soft',
    name: 'Dreamy Soft',
    category: 'creative',
    description: 'Soft ethereal look',
    preview: '#ffd1ff',
    settings: {
      exposure: 15,
      highlights: -20,
      clarity: -30,
      saturation: -10,
      temperature: 10,
    },
  },
];

export const LIGHTING_FILTERS: FilterPreset[] = [
  {
    id: 'day-to-night',
    name: 'Day to Night',
    category: 'lighting',
    description: 'Transform day shots to night',
    preview: '#1a2a4a',
    isPremium: true,
    settings: {
      exposure: -40,
      temperature: -20,
      tint: -10,
      highlights: -30,
      shadows: -20,
      saturation: -15,
    },
  },
  {
    id: 'golden-light',
    name: 'Golden Light',
    category: 'lighting',
    description: 'Add sunset lighting',
    preview: '#ffb347',
    settings: {
      temperature: 30,
      tint: 8,
      exposure: 8,
      highlights: -5,
      vibrance: 20,
    },
  },
  {
    id: 'studio-light',
    name: 'Studio Light',
    category: 'lighting',
    description: 'Brighten faces, darken backgrounds',
    preview: '#ffffff',
    settings: {
      exposure: 15,
      highlights: -10,
      shadows: -15,
      contrast: 20,
      clarity: 15,
    },
  },
  {
    id: 'moody-dark',
    name: 'Moody Dark',
    category: 'lighting',
    description: 'Dramatic low-key lighting',
    preview: '#2a2a2a',
    settings: {
      exposure: -15,
      shadows: -25,
      blacks: -20,
      contrast: 30,
      clarity: 25,
    },
  },
];

export const VINTAGE_FILTERS: FilterPreset[] = [
  {
    id: 'vintage-film',
    name: 'Vintage Film',
    category: 'vintage',
    description: 'Grainy warm tones',
    preview: '#8b7355',
    settings: {
      temperature: 20,
      tint: 15,
      saturation: -20,
      contrast: -10,
      grain: 30,
      vignette: 25,
    },
  },
  {
    id: 'sepia-tone',
    name: 'Sepia Tone',
    category: 'vintage',
    description: 'Classic sepia look',
    preview: '#704214',
    settings: {
      saturation: -100,
      temperature: 40,
      tint: 20,
      contrast: -5,
      grain: 15,
    },
  },
  {
    id: 'faded-memories',
    name: 'Faded Memories',
    category: 'vintage',
    description: 'Washed-out nostalgic',
    preview: '#c9b8a8',
    settings: {
      exposure: 10,
      contrast: -20,
      saturation: -30,
      highlights: -15,
      grain: 20,
      vignette: 15,
    },
  },
  {
    id: 'retro-80s',
    name: 'Retro 80s',
    category: 'vintage',
    description: '80s color palette',
    preview: '#ff6b9d',
    settings: {
      saturation: 40,
      temperature: 10,
      tint: 15,
      contrast: 15,
      grain: 12,
    },
  },
];

export const BEAUTY_FILTERS: FilterPreset[] = [
  {
    id: 'beauty-glow',
    name: 'Beauty Glow',
    category: 'beauty',
    description: 'Soft skin enhancement',
    preview: '#ffe4e1',
    settings: {
      highlights: 20,
      shadows: 10,
      clarity: -25,
      saturation: 5,
      temperature: 5,
      exposure: 5,
    },
  },
  {
    id: 'skin-smooth',
    name: 'Skin Smooth',
    category: 'beauty',
    description: 'Natural skin smoothing',
    preview: '#ffd1b3',
    settings: {
      clarity: -30,
      sharpen: -10,
      highlights: 10,
      shadows: 5,
      temperature: 3,
    },
  },
  {
    id: 'portrait-enhance',
    name: 'Portrait Enhance',
    category: 'beauty',
    description: 'Overall portrait improvement',
    preview: '#ffb3ba',
    settings: {
      exposure: 8,
      highlights: -10,
      shadows: 15,
      clarity: -15,
      saturation: 10,
      sharpen: 15,
    },
  },
];

export const BASIC_FILTERS: FilterPreset[] = [
  {
    id: 'original',
    name: 'Original',
    category: 'basic',
    description: 'No filter applied',
    preview: '#808080',
    settings: {},
  },
  {
    id: 'vivid',
    name: 'Vivid',
    category: 'basic',
    description: 'Enhanced colors',
    preview: '#ff6347',
    settings: {
      saturation: 30,
      vibrance: 25,
      contrast: 15,
    },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    category: 'basic',
    description: 'High contrast',
    preview: '#2a2a2a',
    settings: {
      contrast: 50,
      clarity: 30,
      shadows: -20,
      blacks: -15,
    },
  },
  {
    id: 'warm',
    name: 'Warm',
    category: 'basic',
    description: 'Warm color temperature',
    preview: '#ff8c42',
    settings: {
      temperature: 25,
      tint: 5,
    },
  },
  {
    id: 'cool',
    name: 'Cool',
    category: 'basic',
    description: 'Cool color temperature',
    preview: '#4a90e2',
    settings: {
      temperature: -25,
      tint: -5,
    },
  },
  {
    id: 'black-white',
    name: 'Black & White',
    category: 'basic',
    description: 'Classic monochrome',
    preview: '#000000',
    settings: {
      saturation: -100,
      contrast: 20,
    },
  },
];

export const ALL_FILTERS: FilterPreset[] = [
  ...BASIC_FILTERS,
  ...CINEMATIC_FILTERS,
  ...PROFESSIONAL_FILTERS,
  ...FILM_SIMULATION_FILTERS,
  ...CREATIVE_FILTERS,
  ...LIGHTING_FILTERS,
  ...VINTAGE_FILTERS,
  ...BEAUTY_FILTERS,
];

export const getFiltersByCategory = (category: FilterCategoryType): FilterPreset[] => {
  return ALL_FILTERS.filter(filter => filter.category === category);
};

export const getFilterById = (id: string): FilterPreset | undefined => {
  return ALL_FILTERS.find(filter => filter.id === id);
};

export const getPremiumFilters = (): FilterPreset[] => {
  return ALL_FILTERS.filter(filter => filter.isPremium);
};

export const getFreeFilters = (): FilterPreset[] => {
  return ALL_FILTERS.filter(filter => !filter.isPremium);
};
