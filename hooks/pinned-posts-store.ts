import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

const PINNED_POSTS_KEY = 'pinned_posts';
const MAX_PINNED_POSTS = 3;

export const [PinnedPostsProvider, usePinnedPosts] = createContextHook(() => {
  const [pinnedPosts, setPinnedPosts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPinnedPosts();
  }, []);

  const loadPinnedPosts = async () => {
    try {
      const stored = await AsyncStorage.getItem(PINNED_POSTS_KEY);
      if (stored) {
        setPinnedPosts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading pinned posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePinnedPosts = useCallback(async (posts: string[]) => {
    try {
      await AsyncStorage.setItem(PINNED_POSTS_KEY, JSON.stringify(posts));
      setPinnedPosts(posts);
    } catch (error) {
      console.error('Error saving pinned posts:', error);
    }
  }, []);

  const pinPost = useCallback(async (postId: string): Promise<boolean> => {
    if (pinnedPosts.includes(postId)) {
      console.log('Post already pinned');
      return false;
    }

    if (pinnedPosts.length >= MAX_PINNED_POSTS) {
      console.log(`Maximum ${MAX_PINNED_POSTS} posts can be pinned`);
      return false;
    }

    const updated = [postId, ...pinnedPosts];
    await savePinnedPosts(updated);
    return true;
  }, [pinnedPosts, savePinnedPosts]);

  const unpinPost = useCallback(async (postId: string): Promise<boolean> => {
    if (!pinnedPosts.includes(postId)) {
      console.log('Post is not pinned');
      return false;
    }

    const updated = pinnedPosts.filter(id => id !== postId);
    await savePinnedPosts(updated);
    return true;
  }, [pinnedPosts, savePinnedPosts]);

  const togglePinPost = useCallback(async (postId: string): Promise<boolean> => {
    if (pinnedPosts.includes(postId)) {
      return await unpinPost(postId);
    } else {
      return await pinPost(postId);
    }
  }, [pinnedPosts, pinPost, unpinPost]);

  const isPostPinned = useCallback((postId: string): boolean => {
    return pinnedPosts.includes(postId);
  }, [pinnedPosts]);

  const canPinMore = useCallback((): boolean => {
    return pinnedPosts.length < MAX_PINNED_POSTS;
  }, [pinnedPosts]);

  return useMemo(() => ({
    pinnedPosts,
    isLoading,
    pinPost,
    unpinPost,
    togglePinPost,
    isPostPinned,
    canPinMore,
    maxPinnedPosts: MAX_PINNED_POSTS,
  }), [pinnedPosts, isLoading, pinPost, unpinPost, togglePinPost, isPostPinned, canPinMore]);
});
