export interface VibePost {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  duration: number;
  aspectRatio: 'vertical' | 'horizontal' | 'square';
  likes: number;
  comments: number;
  reposts: number;
  views: number;
  isLiked: boolean;
  isReposted: boolean;
  createdAt: Date;
  music?: {
    title: string;
    artist: string;
  };
  hashtags: string[];
}

export interface VibePostUpload {
  videoUri: string;
  thumbnailUri?: string;
  caption: string;
  duration: number;
  aspectRatio: 'vertical' | 'horizontal' | 'square';
  music?: {
    title: string;
    artist: string;
  };
  hashtags: string[];
}
