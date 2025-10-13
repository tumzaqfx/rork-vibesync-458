import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useAuth } from './auth-store';
import { Post } from '@/types';
import { mockPosts } from '@/mocks/posts';
import { mockUsers } from '@/mocks/users';

interface FeedState {
  posts: Post[];
  lastRefresh: string;
  newPostsCount: number;
  hasNewPosts: boolean;
}

const STORAGE_KEY = 'feed_data';
const AUTO_REFRESH_INTERVAL = 150000;
const DAILY_RESET_INTERVAL = 86400000;

export const [FeedProvider, useFeed] = createContextHook(() => {
  const { user } = useAuth();
  const [state, setState] = useState<FeedState>({
    posts: mockPosts,
    lastRefresh: new Date().toISOString(),
    newPostsCount: 0,
    hasNewPosts: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const autoRefreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dailyResetTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadFeedData = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          setState(parsed);
        }
      } catch (error) {
        console.error('Error loading feed data:', error);
      }
    };
    
    loadFeedData();
  }, []);

  const saveFeedData = useCallback(async (newState: FeedState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.error('Error saving feed data:', error);
    }
  }, []);

  const generateNewPosts = useCallback((): Post[] => {
    const newPosts: Post[] = [];
    const numNewPosts = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numNewPosts; i++) {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const isHighEngagement = Math.random() > 0.7;
      
      const newPost: Post = {
        id: `post_${Date.now()}_${i}`,
        userId: randomUser.id,
        username: randomUser.username,
        userDisplayName: randomUser.displayName,
        profileImage: randomUser.profileImage,
        isVerified: randomUser.isVerified,
        content: `New vibe from ${randomUser.displayName}! 🎵✨ #vibesync #music`,
        likes: isHighEngagement ? Math.floor(Math.random() * 500) + 100 : Math.floor(Math.random() * 50),
        comments: isHighEngagement ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 10),
        shares: isHighEngagement ? Math.floor(Math.random() * 30) + 5 : Math.floor(Math.random() * 5),
        views: isHighEngagement ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 500),
        timestamp: 'Just now',
        engagement: 0,
        author: {
          id: randomUser.id,
          username: randomUser.username,
          displayName: randomUser.displayName,
          profileImage: randomUser.profileImage,
          isVerified: randomUser.isVerified,
        },
      };

      newPost.engagement = newPost.likes + newPost.comments + newPost.shares;
      newPosts.push(newPost);
    }

    return newPosts;
  }, []);

  const checkForNewPosts = useCallback(async () => {
    console.log('🔄 Auto-checking for new posts...');
    const newPosts = generateNewPosts();
    
    const priorityPosts = newPosts.filter(post => {
      const postUser = mockUsers.find(u => u.id === post.userId);
      return postUser?.isVerified || post.engagement > 100;
    });

    if (priorityPosts.length > 0) {
      console.log(`✨ Found ${priorityPosts.length} priority posts`);
      setPendingPosts(prev => [...priorityPosts, ...prev]);
      setState(prev => ({
        ...prev,
        newPostsCount: prev.newPostsCount + priorityPosts.length,
        hasNewPosts: true,
      }));
    } else if (newPosts.length > 0) {
      console.log(`📬 Found ${newPosts.length} new posts`);
      setPendingPosts(prev => [...newPosts, ...prev]);
      setState(prev => ({
        ...prev,
        newPostsCount: prev.newPostsCount + newPosts.length,
        hasNewPosts: true,
      }));
    }
  }, [generateNewPosts]);

  const applyHybridSorting = useCallback((posts: Post[]): Post[] => {
    const userPostCounts = new Map<string, number>();

    const scoredPosts = posts.map(post => {
      const timeScore = post.timestamp === 'Just now' ? 1000 : 
                       post.timestamp.includes('m') ? 500 :
                       post.timestamp.includes('h') ? 200 :
                       post.timestamp.includes('d') ? 50 : 10;
      
      const engagementScore = post.engagement || 0;
      const verifiedBoost = post.isVerified ? 100 : 0;
      const vibeBoost = post.timestamp === 'Just now' && engagementScore > 50 ? 200 : 0;

      const totalScore = timeScore + engagementScore * 0.5 + verifiedBoost + vibeBoost;

      return { post, score: totalScore };
    });

    scoredPosts.sort((a, b) => b.score - a.score);

    const diversifiedPosts: Post[] = [];
    for (const { post } of scoredPosts) {
      const userCount = userPostCounts.get(post.userId) || 0;
      
      if (userCount < 2) {
        diversifiedPosts.push(post);
        userPostCounts.set(post.userId, userCount + 1);
      } else {
        diversifiedPosts.push(post);
      }
    }

    return diversifiedPosts;
  }, []);

  const refreshFeed = useCallback(async (showLoading: boolean = true) => {
    if (showLoading) {
      setIsRefreshing(true);
    }

    console.log('🔄 Refreshing feed...');

    await new Promise(resolve => setTimeout(resolve, 800));

    const newPosts = generateNewPosts();
    const allPosts = [...newPosts, ...pendingPosts, ...state.posts];
    const sortedPosts = applyHybridSorting(allPosts);

    const newState: FeedState = {
      posts: sortedPosts,
      lastRefresh: new Date().toISOString(),
      newPostsCount: 0,
      hasNewPosts: false,
    };

    await saveFeedData(newState);
    setPendingPosts([]);

    if (showLoading) {
      setIsRefreshing(false);
    }

    console.log('✅ Feed refreshed successfully');
  }, [state.posts, pendingPosts, generateNewPosts, applyHybridSorting, saveFeedData]);

  const loadNewPosts = useCallback(async () => {
    console.log(`📥 Loading ${pendingPosts.length} new posts...`);
    
    const allPosts = [...pendingPosts, ...state.posts];
    const sortedPosts = applyHybridSorting(allPosts);

    const newState: FeedState = {
      posts: sortedPosts,
      lastRefresh: new Date().toISOString(),
      newPostsCount: 0,
      hasNewPosts: false,
    };

    await saveFeedData(newState);
    setPendingPosts([]);
  }, [pendingPosts, state.posts, applyHybridSorting, saveFeedData]);

  const performDailyReset = useCallback(async () => {
    console.log('🌅 Performing daily feed reset...');
    
    const freshPosts = generateNewPosts();
    const sortedPosts = applyHybridSorting([...freshPosts, ...mockPosts]);

    const newState: FeedState = {
      posts: sortedPosts,
      lastRefresh: new Date().toISOString(),
      newPostsCount: 0,
      hasNewPosts: false,
    };

    await saveFeedData(newState);
    setPendingPosts([]);
  }, [generateNewPosts, applyHybridSorting, saveFeedData]);

  useEffect(() => {
    autoRefreshTimerRef.current = setInterval(() => {
      checkForNewPosts();
    }, AUTO_REFRESH_INTERVAL);

    dailyResetTimerRef.current = setInterval(() => {
      performDailyReset();
    }, DAILY_RESET_INTERVAL);

    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
      if (dailyResetTimerRef.current) {
        clearInterval(dailyResetTimerRef.current);
      }
    };
  }, [checkForNewPosts, performDailyReset]);

  const addPost = useCallback(async (content: string, attachments?: any[]) => {
    if (!user) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: user.id,
      username: user.username,
      userDisplayName: user.displayName,
      profileImage: user.profileImage,
      isVerified: user.isVerified || false,
      content,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      timestamp: 'Just now',
      engagement: 0,
      author: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        profileImage: user.profileImage,
        isVerified: user.isVerified || false,
      },
    };

    const updatedPosts = [newPost, ...state.posts];
    const sortedPosts = applyHybridSorting(updatedPosts);

    await saveFeedData({
      ...state,
      posts: sortedPosts,
      lastRefresh: new Date().toISOString(),
    });
  }, [user, state, applyHybridSorting, saveFeedData]);

  return useMemo(() => ({
    posts: state.posts,
    lastRefresh: state.lastRefresh,
    newPostsCount: state.newPostsCount,
    hasNewPosts: state.hasNewPosts,
    isRefreshing,
    refreshFeed,
    loadNewPosts,
    addPost,
  }), [
    state.posts,
    state.lastRefresh,
    state.newPostsCount,
    state.hasNewPosts,
    isRefreshing,
    refreshFeed,
    loadNewPosts,
    addPost,
  ]);
});
