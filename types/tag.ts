export type TagPosition = {
  x: number;
  y: number;
};

export type ImageTag = {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  verified: boolean;
  position: TagPosition;
};

export type Mention = {
  userId: string;
  username: string;
  avatar: string;
  verified: boolean;
  startIndex: number;
  endIndex: number;
};

export type TagPrivacySetting = 'everyone' | 'following' | 'no-one';

export type TagSettings = {
  whoCanTagMe: TagPrivacySetting;
  reviewTagsBeforeShowing: boolean;
};

export type PendingTag = {
  id: string;
  postId: string;
  postImage: string;
  postType: 'post' | 'vibe' | 'story';
  taggedBy: {
    userId: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  position?: TagPosition;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
};

export type TagAnalytics = {
  totalTags: number;
  profileVisitsFromTags: number;
  topTaggers: {
    userId: string;
    username: string;
    avatar: string;
    tagCount: number;
  }[];
  tagsByVerifiedUsers: number;
  vibeScoreFromTags: number;
};
