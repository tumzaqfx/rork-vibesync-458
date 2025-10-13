export type SpillParticipant = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  role: 'host' | 'cohost' | 'speaker' | 'listener';
  joinedAt: Date;
};

export type SpillReaction = {
  id: string;
  userId: string;
  emoji: string;
  timestamp: Date;
};

export type SpillComment = {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
};

export type Spill = {
  id: string;
  topicId: string;
  topicName: string;
  topicType: 'hashtag' | 'name';
  hostId: string;
  hostName: string;
  hostUsername: string;
  hostAvatar: string;
  cohosts: SpillParticipant[];
  listenerCount: number;
  startedAt: Date;
  isLive: boolean;
  participants: SpillParticipant[];
  reactions: SpillReaction[];
  comments: SpillComment[];
  recordingEnabled: boolean;
  allowRequests: boolean;
};

export type SpillHighlight = {
  id: string;
  spillId: string;
  title: string;
  duration: number;
  timestamp: Date;
  thumbnailUrl: string;
  audioUrl: string;
};

export type SpillNotification = {
  id: string;
  spillId: string;
  hostName: string;
  topicName: string;
  timestamp: Date;
  type: 'started' | 'reminder' | 'ended';
};

export type ScheduledSpill = {
  id: string;
  topicId: string;
  topicName: string;
  hostId: string;
  hostName: string;
  scheduledFor: Date;
  reminderSet: boolean;
};
