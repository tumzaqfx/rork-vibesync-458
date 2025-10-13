export type ThreadPostType = 'text' | 'image' | 'video' | 'voice' | 'mixed';

export interface ThreadPost {
  id: string;
  authorId: string;
  parentId: string | null;
  rootId: string;
  content: string;
  type: ThreadPostType;
  mediaUrls?: string[];
  voiceUrl?: string;
  voiceDuration?: number;
  createdAt: string;
  likes: number;
  comments: number;
  revibes: number;
  saves: number;
  isLiked: boolean;
  isRevibed: boolean;
  isSaved: boolean;
  hasThread: boolean;
  threadCount: number;
}

export interface CommentReply {
  id: string;
  commentId: string;
  parentReplyId: string | null;
  authorId: string;
  content: string;
  type: 'text' | 'voice' | 'gif';
  voiceUrl?: string;
  voiceDuration?: number;
  gifUrl?: string;
  createdAt: string;
  likes: number;
  replies: CommentReply[];
  depth: number;
  isLiked: boolean;
}

export interface ThreadComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  type: 'text' | 'voice' | 'gif';
  voiceUrl?: string;
  voiceDuration?: number;
  gifUrl?: string;
  createdAt: string;
  likes: number;
  replies: CommentReply[];
  isLiked: boolean;
}

export interface Thread {
  id: string;
  rootPostId: string;
  posts: ThreadPost[];
  totalEngagement: number;
  isCollaborative: boolean;
  collaborators?: string[];
  isTrending: boolean;
  vibeScore: number;
}
