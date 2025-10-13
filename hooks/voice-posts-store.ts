import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VoicePost } from '@/types';

const VOICE_POSTS_STORAGE_KEY = '@vibesync_voice_posts';

export const [VoicePostsContext, useVoicePosts] = createContextHook(() => {
  const [voicePosts, setVoicePosts] = useState<VoicePost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadVoicePosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stored = await AsyncStorage.getItem(VOICE_POSTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setVoicePosts(parsed);
      }
    } catch (err) {
      console.error('Error loading voice posts:', err);
      setError('Failed to load voice posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVoicePosts();
  }, [loadVoicePosts]);

  const saveVoicePosts = useCallback(async (posts: VoicePost[]) => {
    try {
      await AsyncStorage.setItem(VOICE_POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (err) {
      console.error('Error saving voice posts:', err);
      throw new Error('Failed to save voice posts');
    }
  }, []);

  const createVoicePost = useCallback(async (data: {
    voiceUri: string;
    duration: number;
    waveform: number[];
    coverImage?: string;
    caption: string;
    userId: string;
    username: string;
    userDisplayName: string;
    profileImage?: string;
    isVerified: boolean;
  }) => {
    try {
      const newPost: VoicePost = {
        id: `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: data.userId,
        username: data.username,
        userDisplayName: data.userDisplayName,
        profileImage: data.profileImage,
        isVerified: data.isVerified,
        caption: data.caption,
        voiceNote: {
          url: data.voiceUri,
          duration: data.duration,
          waveform: data.waveform,
        },
        coverImage: data.coverImage,
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        timestamp: 'Just now',
        author: {
          id: data.userId,
          username: data.username,
          displayName: data.userDisplayName,
          profileImage: data.profileImage,
          isVerified: data.isVerified,
        },
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
      };

      const updatedPosts = [newPost, ...voicePosts];
      setVoicePosts(updatedPosts);
      await saveVoicePosts(updatedPosts);

      return newPost;
    } catch (err) {
      console.error('Error creating voice post:', err);
      throw new Error('Failed to create voice post');
    }
  }, [voicePosts, saveVoicePosts]);

  const deleteVoicePost = useCallback(async (postId: string) => {
    try {
      const updatedPosts = voicePosts.filter(post => post.id !== postId);
      setVoicePosts(updatedPosts);
      await saveVoicePosts(updatedPosts);
    } catch (err) {
      console.error('Error deleting voice post:', err);
      throw new Error('Failed to delete voice post');
    }
  }, [voicePosts, saveVoicePosts]);

  const likeVoicePost = useCallback(async (postId: string) => {
    try {
      const updatedPosts = voicePosts.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      });
      
      setVoicePosts(updatedPosts);
      await saveVoicePosts(updatedPosts);
    } catch (err) {
      console.error('Error liking voice post:', err);
      throw new Error('Failed to like voice post');
    }
  }, [voicePosts, saveVoicePosts]);

  const saveVoicePost = useCallback(async (postId: string) => {
    try {
      const updatedPosts = voicePosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isSaved: !post.isSaved,
          };
        }
        return post;
      });
      
      setVoicePosts(updatedPosts);
      await saveVoicePosts(updatedPosts);
    } catch (err) {
      console.error('Error saving voice post:', err);
      throw new Error('Failed to save voice post');
    }
  }, [voicePosts, saveVoicePosts]);

  const incrementViews = useCallback(async (postId: string) => {
    try {
      const updatedPosts = voicePosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            views: post.views + 1,
          };
        }
        return post;
      });
      
      setVoicePosts(updatedPosts);
      await saveVoicePosts(updatedPosts);
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  }, [voicePosts, saveVoicePosts]);

  const incrementShares = useCallback(async (postId: string) => {
    try {
      const updatedPosts = voicePosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            shares: post.shares + 1,
          };
        }
        return post;
      });
      
      setVoicePosts(updatedPosts);
      await saveVoicePosts(updatedPosts);
    } catch (err) {
      console.error('Error incrementing shares:', err);
    }
  }, [voicePosts, saveVoicePosts]);

  const getVoicePostById = useCallback((postId: string): VoicePost | undefined => {
    return voicePosts.find(post => post.id === postId);
  }, [voicePosts]);

  const getVoicePostsByUser = useCallback((userId: string): VoicePost[] => {
    return voicePosts.filter(post => post.userId === userId);
  }, [voicePosts]);

  const getSavedVoicePosts = useCallback((): VoicePost[] => {
    return voicePosts.filter(post => post.isSaved);
  }, [voicePosts]);

  return useMemo(() => ({
    voicePosts,
    isLoading,
    error,
    createVoicePost,
    deleteVoicePost,
    likeVoicePost,
    saveVoicePost,
    incrementViews,
    incrementShares,
    getVoicePostById,
    getVoicePostsByUser,
    getSavedVoicePosts,
    refreshVoicePosts: loadVoicePosts,
  }), [
    voicePosts,
    isLoading,
    error,
    createVoicePost,
    deleteVoicePost,
    likeVoicePost,
    saveVoicePost,
    incrementViews,
    incrementShares,
    getVoicePostById,
    getVoicePostsByUser,
    getSavedVoicePosts,
    loadVoicePosts,
  ]);
});
