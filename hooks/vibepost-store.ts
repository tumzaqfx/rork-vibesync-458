import { useState, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { VibePost, VibePostUpload } from '@/types/vibepost';
import { mockVibePosts } from '@/mocks/vibeposts';

export const [VibePostProvider, useVibePosts] = createContextHook(() => {
  const [vibePosts, setVibePosts] = useState<VibePost[]>(mockVibePosts);
  const [isUploading, setIsUploading] = useState(false);

  const likeVibePost = useCallback((postId: string) => {
    setVibePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  }, []);

  const repostVibePost = useCallback((postId: string) => {
    setVibePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isReposted: !post.isReposted,
          reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1
        };
      }
      return post;
    }));
  }, []);

  const incrementViews = useCallback((postId: string) => {
    setVibePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          views: post.views + 1
        };
      }
      return post;
    }));
  }, []);

  const uploadVibePost = useCallback(async (upload: VibePostUpload, user: { id: string; username: string; displayName: string; avatar: string; verified: boolean }) => {
    setIsUploading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPost: VibePost = {
        id: `vp${Date.now()}`,
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        verified: user.verified,
        videoUrl: upload.videoUri,
        thumbnailUrl: upload.thumbnailUri || upload.videoUri,
        caption: upload.caption,
        duration: upload.duration,
        aspectRatio: upload.aspectRatio,
        likes: 0,
        comments: 0,
        reposts: 0,
        views: 0,
        isLiked: false,
        isReposted: false,
        createdAt: new Date(),
        music: upload.music,
        hashtags: upload.hashtags
      };

      setVibePosts(prev => [newPost, ...prev]);
      return newPost;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteVibePost = useCallback((postId: string) => {
    setVibePosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  return {
    vibePosts,
    isUploading,
    likeVibePost,
    repostVibePost,
    incrementViews,
    uploadVibePost,
    deleteVibePost
  };
});

export function useVibePostById(postId: string) {
  const { vibePosts } = useVibePosts();
  return useMemo(() => vibePosts.find(post => post.id === postId), [vibePosts, postId]);
}

export function useUserVibePosts(userId: string) {
  const { vibePosts } = useVibePosts();
  return useMemo(() => vibePosts.filter(post => post.userId === userId), [vibePosts, userId]);
}
