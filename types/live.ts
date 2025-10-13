export type LiveAudience = 'everyone' | 'followers' | 'close-friends';

export type LiveStatus = 'setup' | 'countdown' | 'live' | 'ended';

export type LiveUserRole = 'host' | 'co-host' | 'viewer' | 'moderator';

export interface LiveComment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: number;
  isPinned?: boolean;
  isGift?: boolean;
  giftType?: string;
}

export interface LiveReaction {
  id: string;
  type: 'heart' | 'fire' | 'clap' | 'wow' | 'laugh';
  x: number;
  y: number;
  timestamp: number;
}

export interface LiveViewer {
  id: string;
  username: string;
  avatar: string;
  joinedAt: number;
  role: LiveUserRole;
  isMuted?: boolean;
  isBlocked?: boolean;
  requestedToJoin?: boolean;
}

export interface LiveSession {
  id: string;
  hostId: string;
  hostUsername: string;
  hostAvatar: string;
  title?: string;
  description?: string;
  audience: LiveAudience;
  commentsEnabled: boolean;
  shareToFeedAfter: boolean;
  status: LiveStatus;
  startedAt?: number;
  endedAt?: number;
  viewerCount: number;
  peakViewerCount: number;
  totalViews: number;
  likeCount: number;
  commentCount: number;
  coHosts: LiveViewer[];
  viewers: LiveViewer[];
  moderators: string[];
  blockedUsers: string[];
  streamUrl?: string;
  thumbnailUrl?: string;
}

export interface LiveAnalytics {
  sessionId: string;
  duration: number;
  peakViewers: number;
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  newFollowers: number;
  topViewers: {
    userId: string;
    username: string;
    avatar: string;
    watchTime: number;
  }[];
  engagementRate: number;
}

export interface LiveGift {
  id: string;
  name: string;
  icon: string;
  value: number;
  animation?: string;
}
