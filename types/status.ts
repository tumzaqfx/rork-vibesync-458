export type StatusType = 'photo' | 'video' | 'text' | 'voice';

export type StatusPrivacy = 'public' | 'friends' | 'close-friends' | 'custom';

export interface StatusMedia {
  type: 'photo' | 'video';
  uri: string;
  thumbnail?: string;
  duration?: number;
  width?: number;
  height?: number;
}

export interface StatusTextContent {
  text: string;
  backgroundColor: string;
  gradient?: string[];
  fontFamily?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface StatusVoiceContent {
  uri: string;
  duration: number;
  waveform: number[];
  backgroundColor?: string;
  gradient?: string[];
  coverImage?: string;
}

export interface StatusOverlay {
  type: 'text' | 'sticker' | 'gif';
  content: string;
  position: { x: number; y: number };
  rotation?: number;
  scale?: number;
  color?: string;
  fontSize?: number;
}

export interface StatusViewer {
  userId: string;
  username: string;
  avatar: string;
  viewedAt: string;
  replyType?: 'text' | 'emoji' | 'gif' | 'voice';
  reply?: string;
}

export interface StatusAnalytics {
  views: number;
  replies: number;
  shares: number;
  viewers: StatusViewer[];
}

export interface Status {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  verified: boolean;
  type: StatusType;
  media?: StatusMedia;
  textContent?: StatusTextContent;
  voiceContent?: StatusVoiceContent;
  overlays?: StatusOverlay[];
  caption?: string;
  createdAt: string;
  expiresAt: string;
  isPinned: boolean;
  privacy: StatusPrivacy;
  analytics: StatusAnalytics;
  isMuted?: boolean;
  isHidden?: boolean;
}

export interface StatusUploadProgress {
  statusId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  error?: string;
}

export interface UserStatusGroup {
  userId: string;
  username: string;
  avatar: string;
  verified: boolean;
  statuses: Status[];
  hasUnviewed: boolean;
  lastStatusAt: string;
}
