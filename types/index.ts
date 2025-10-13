export interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  coverImage?: string;
  isVerified: boolean;
  followers: number;
  following: number;
  followersCount: number;
  followingCount: number;
  posts: number;
  vibeScore?: number;
  avatar?: string;
  name?: string;
  verified?: boolean;
  isFollowing?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  profileImage?: string;
  viewed: boolean;
  isLive?: boolean;
  author: {
    id: string;
    username: string;
    displayName: string;
    profileImage?: string;
    isVerified: boolean;
    vibeScore?: number;
  };
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'voice';
  voiceNote?: {
    url: string;
    duration: number;
    waveform?: number[];
  };
  content: string;
  createdAt: string;
  storyCount?: number;
  isSpecialEvent?: boolean;
  vibeScore?: number;
  backgroundColor?: string;
  textColor?: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  profileImage?: string;
  isVerified: boolean;
  content: string;
  image?: string;
  video?: string;
  audio?: string;
  voiceNote?: {
    url: string;
    duration: number;
    waveform?: number[];
  };
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  isBoosted?: boolean;
  engagement: number;
  author: {
    id: string;
    username: string;
    displayName: string;
    profileImage?: string;
    isVerified: boolean;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  isRevibed?: boolean;
  revibeCaption?: string;
  revibeCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'voice';
  timestamp: string;
  isRead: boolean;
  mediaUrl?: string;
  duration?: number;
  isCall?: boolean;
  callType?: 'voice' | 'video';
  callDuration?: number;
  isViewOnce?: boolean;
  viewedAt?: string;
  allowReplay?: boolean;
  replayCount?: number;
  maxReplays?: number;
  isExpired?: boolean;
  screenshotAttempts?: {
    timestamp: string;
    attempterId: string;
  }[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'live' | 'general';
  isRead: boolean;
  createdAt: string;
  userId: string;
  actionData?: any;
}

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  streamerId: string;
  streamerName: string;
  streamerAvatar?: string;
  category: string;
  viewers: number;
  isLive: boolean;
  startedAt: string;
  thumbnailUrl?: string;
  streamUrl?: string;
}

export interface QuickVibe {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  profileImage?: string;
  isVerified: boolean;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userDisplayName: string;
  profileImage?: string;
  isVerified: boolean;
  content: string;
  voiceNote?: {
    url: string;
    duration: number;
    waveform?: number[];
  };
  timestamp: string;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
  isAuthorLiked?: boolean;
  isAuthorReply?: boolean;
}

export interface TrendingTopic {
  id: string;
  title: string;
  category: 'music' | 'content' | 'events' | 'global' | 'local';
  posts: number;
  engagement: number;
  location?: string;
  hashtag?: string;
  description?: string;
  trendingScore: number;
  velocity: number;
  recencyScore: number;
  status: 'breaking' | 'peaking' | 'fading' | 'stable';
  relatedEventId?: string;
  relatedMusicId?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface TrendingPost extends Post {
  trendingScore: number;
  trendingRank: number;
  trendingCategory: 'for_you' | 'global' | 'local' | 'music' | 'content' | 'events';
  velocity: number;
}

export interface TrendingWeights {
  engagement: number;
  hashtag: number;
  mentions: number;
  recency: number;
  events: number;
}

export interface TrendingFilters {
  category?: 'for_you' | 'global' | 'local' | 'music' | 'content' | 'events';
  location?: string;
  timeRange?: '1h' | '6h' | '24h' | '7d';
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    messages: boolean;
    syncSessions: boolean;
    playlistActivity: boolean;
    vibeTab: boolean;
    influencerUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
    allowMessageRequests: boolean;
    screenshotProtection: boolean;
    whoCanMessageMe: 'everyone' | 'friends' | 'none';
    whoCanSeeMyVibes: 'public' | 'friends' | 'private';
    contentFilters: boolean;
  };
  messaging: {
    screenshotProtection: boolean;
    notifyOnScreenshotAttempt: boolean;
    defaultViewOnce: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
  };
  discoverability: {
    suggestedFollows: boolean;
    contactsSync: boolean;
    locationDiscovery: boolean;
    vibeScoreVisible: boolean;
  };
  data: {
    dataSaverMode: boolean;
    backgroundPlay: boolean;
    autoDownload: boolean;
  };
}

export interface ShareOptions {
  platform: 'facebook' | 'twitter' | 'instagram' | 'whatsapp' | 'email' | 'copy';
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export interface Vibe {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  profileImage?: string;
  isVerified: boolean;
  caption: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  soundId?: string;
  soundName?: string;
  soundArtist?: string;
  filters?: string[];
  effects?: string[];
  isLiked?: boolean;
  isSaved?: boolean;
  author: {
    id: string;
    username: string;
    displayName: string;
    profileImage?: string;
    isVerified: boolean;
  };
}

export type DistanceFilter = '1km' | '5km' | '20km' | 'city';

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  lastUpdated: string;
}

export interface ProximitySuggestion {
  user: User;
  distance: number;
  distanceUnit: 'km' | 'm';
  sharedInterests: string[];
  isRecentlyActive: boolean;
  activityHeatScore: number;
}

export interface MutualConnection {
  user: User;
  mutualFollowers: User[];
  mutualCount: number;
  connectionStrength: number;
}

export interface ContactSuggestion {
  user: User;
  contactName: string;
  phoneNumber?: string;
  email?: string;
  isNewUser: boolean;
  joinedAt?: string;
}

export interface SuggestionScore {
  userId: string;
  proximityScore: number;
  mutualScore: number;
  contactScore: number;
  totalScore: number;
  reasons: string[];
}

export interface DiscoverySuggestion {
  user: User;
  score: SuggestionScore;
  primaryReason: 'proximity' | 'mutual' | 'contact' | 'hybrid';
  distance?: number;
  mutualCount?: number;
  isContact?: boolean;
  metadata: {
    sharedInterests?: string[];
    mutualFollowers?: User[];
    contactInfo?: string;
    activityLevel?: 'high' | 'medium' | 'low';
  };
}

export interface SponsoredAd {
  id: string;
  type: 'image' | 'video' | 'carousel' | 'interactive';
  brandName: string;
  brandAvatar: string;
  isVerified: boolean;
  headline: string;
  description: string;
  mediaUrl?: string;
  carouselItems?: {
    mediaUrl: string;
    caption: string;
  }[];
  interactiveType?: 'poll' | 'quiz' | 'swipe';
  interactiveOptions?: string[];
  ctaText: string;
  ctaUrl: string;
  pricing?: {
    originalPrice?: string;
    discountedPrice?: string;
    discount?: string;
  };
  geoTargeted?: boolean;
  location?: {
    city: string;
    radius: number;
  };
  targetAudience: {
    interests: string[];
    location: string;
    ageRange: [number, number];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
  };
  timestamp: string;
}

export interface AdEngagement {
  adId: string;
  userId: string;
  action: 'view' | 'click' | 'like' | 'comment' | 'share' | 'save' | 'hide' | 'report';
  timestamp: string;
  metadata?: any;
}

export interface AdPreferences {
  userId: string;
  enabledCategories: string[];
  disabledBrands: string[];
  personalizedAds: boolean;
  dataSharing: boolean;
}

export interface ProfileView {
  id: string;
  profileOwnerId: string;
  viewerId: string;
  viewerUsername: string;
  viewerDisplayName: string;
  viewerProfileImage?: string;
  viewerIsVerified: boolean;
  timestamp: string;
  deviceId: string;
  isPrivateView: boolean;
}

export interface VibeLike {
  id: string;
  vibeId: string;
  userId: string;
  username: string;
  displayName: string;
  profileImage?: string;
  isVerified: boolean;
  timestamp: string;
}

export interface FriendActivity {
  id: string;
  friendId: string;
  friendUsername: string;
  friendDisplayName: string;
  friendProfileImage?: string;
  friendIsVerified: boolean;
  activityType: 'like' | 'comment' | 'share' | 'follow';
  contentId: string;
  contentType: 'vibe' | 'post' | 'story';
  timestamp: string;
  contentPreview?: {
    thumbnailUrl?: string;
    caption?: string;
  };
}

export interface VoicePost {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  profileImage?: string;
  isVerified: boolean;
  caption: string;
  voiceNote: {
    url: string;
    duration: number;
    waveform?: number[];
  };
  coverImage?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    profileImage?: string;
    isVerified: boolean;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

