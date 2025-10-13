import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import {
  TrendingTopic,
  TrendingPost,
  TrendingWeights,
  TrendingFilters,
  Post,
} from '@/types';
import { mockTrendingTopics } from '@/mocks/trending';
import { mockPosts } from '@/mocks/posts';

const DEFAULT_WEIGHTS: TrendingWeights = {
  engagement: 0.4,
  hashtag: 0.25,
  mentions: 0.15,
  recency: 0.15,
  events: 0.05,
};

const calculateTrendingScore = (
  post: Post,
  weights: TrendingWeights = DEFAULT_WEIGHTS
): number => {
  const now = Date.now();
  const postTime = new Date(post.timestamp).getTime();
  const ageInHours = (now - postTime) / (1000 * 60 * 60);
  
  const engagementScore = (post.likes + post.comments * 2 + post.shares * 3) / 100;
  
  const hashtagCount = (post.content.match(/#\w+/g) || []).length;
  const hashtagScore = Math.min(hashtagCount * 10, 50);
  
  const mentionCount = (post.content.match(/@\w+/g) || []).length;
  const mentionScore = Math.min(mentionCount * 5, 30);
  
  const recencyScore = Math.max(0, 100 - ageInHours * 2);
  
  const eventScore = post.isBoosted ? 50 : 0;
  
  const totalScore =
    engagementScore * weights.engagement +
    hashtagScore * weights.hashtag +
    mentionScore * weights.mentions +
    recencyScore * weights.recency +
    eventScore * weights.events;
  
  return Math.min(100, totalScore);
};

const calculateVelocity = (post: Post): number => {
  const now = Date.now();
  const postTime = new Date(post.timestamp).getTime();
  const ageInMinutes = (now - postTime) / (1000 * 60);
  
  if (ageInMinutes < 1) return 0;
  
  const totalEngagement = post.likes + post.comments + post.shares;
  const velocity = totalEngagement / ageInMinutes;
  
  return velocity;
};

export const [TrendingProvider, useTrending] = createContextHook(() => {
  const [topics, setTopics] = useState<TrendingTopic[]>(mockTrendingTopics);
  const [filters, setFilters] = useState<TrendingFilters>({
    category: 'for_you',
    timeRange: '24h',
  });
  const [weights] = useState<TrendingWeights>(DEFAULT_WEIGHTS);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [newTrendsCount, setNewTrendsCount] = useState<number>(0);
  const [hasNewTrends, setHasNewTrends] = useState<boolean>(false);
  const [pendingTopics, setPendingTopics] = useState<TrendingTopic[]>([]);

  const calculatePostTrendingData = useCallback(
    (post: Post): TrendingPost => {
      const trendingScore = calculateTrendingScore(post, weights);
      const velocity = calculateVelocity(post);
      
      let category: TrendingPost['trendingCategory'] = 'for_you';
      if (post.content.includes('#music') || post.content.includes('🎵')) {
        category = 'music';
      } else if (post.content.includes('#event') || post.isBoosted) {
        category = 'events';
      } else if (post.video || post.image) {
        category = 'content';
      } else if (post.views > 10000) {
        category = 'global';
      }
      
      return {
        ...post,
        trendingScore,
        trendingRank: 0,
        trendingCategory: category,
        velocity,
      };
    },
    [weights]
  );

  const trendingPosts = useMemo(() => {
    const postsWithTrending = mockPosts.map(calculatePostTrendingData);
    
    let filtered = postsWithTrending;
    
    if (filters.category && filters.category !== 'for_you') {
      filtered = filtered.filter(
        (post) => post.trendingCategory === filters.category
      );
    }
    
    if (filters.timeRange) {
      const now = Date.now();
      const timeRanges: Record<string, number> = {
        '1h': 1 * 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
      };
      
      const maxAge = timeRanges[filters.timeRange] || timeRanges['24h'];
      
      filtered = filtered.filter((post) => {
        const postTime = new Date(post.timestamp).getTime();
        return now - postTime <= maxAge;
      });
    }
    
    const sorted = filtered.sort((a, b) => b.trendingScore - a.trendingScore);
    
    return sorted.map((post, index) => ({
      ...post,
      trendingRank: index + 1,
    }));
  }, [filters, calculatePostTrendingData]);

  const filteredTopics = useMemo(() => {
    let filtered = topics;
    
    if (filters.category) {
      if (filters.category === 'for_you') {
        filtered = topics;
      } else {
        filtered = topics.filter((topic) => topic.category === filters.category);
      }
    }
    
    if (filters.location) {
      filtered = filtered.filter(
        (topic) =>
          topic.location === filters.location ||
          topic.location === 'Global' ||
          topic.location === 'Worldwide'
      );
    }
    
    return filtered.sort((a, b) => b.trendingScore - a.trendingScore);
  }, [topics, filters]);

  const getTopicsByCategory = useCallback(
    (category: TrendingFilters['category']) => {
      if (!category || category === 'for_you') {
        return topics.sort((a, b) => b.trendingScore - a.trendingScore);
      }
      
      return topics
        .filter((topic) => topic.category === category)
        .sort((a, b) => b.trendingScore - a.trendingScore);
    },
    [topics]
  );

  const getPostsByCategory = useCallback(
    (category: TrendingFilters['category']) => {
      if (!category || category === 'for_you') {
        return trendingPosts;
      }
      
      return trendingPosts.filter((post) => post.trendingCategory === category);
    },
    [trendingPosts]
  );

  const generateNewTrends = useCallback((): TrendingTopic[] => {
    const newTrends: TrendingTopic[] = [];
    const numNewTrends = Math.floor(Math.random() * 3) + 1;

    const categories: TrendingTopic['category'][] = ['music', 'content', 'events', 'local', 'global'];
    const statuses: TrendingTopic['status'][] = ['breaking', 'peaking'];
    const locations = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Global'];

    for (let i = 0; i < numNewTrends; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      const newTrend: TrendingTopic = {
        id: `trend_${Date.now()}_${i}`,
        title: `New Trending Topic ${Date.now()}`,
        category,
        posts: Math.floor(Math.random() * 50000) + 10000,
        engagement: Math.floor(Math.random() * 500000) + 100000,
        location,
        hashtag: `#Trend${Date.now()}`,
        description: 'Fresh trending topic just emerged',
        trendingScore: Math.random() * 20 + 80,
        velocity: Math.random() * 10 + 10,
        recencyScore: Math.random() * 10 + 90,
        status,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      newTrends.push(newTrend);
    }

    return newTrends;
  }, []);

  const checkForNewTrends = useCallback(async () => {
    console.log('🔥 Auto-checking for new trends...');
    
    const updatedTopics = topics.map((topic) => {
      const velocityChange = (Math.random() - 0.5) * 5;
      const newVelocity = Math.max(0, topic.velocity + velocityChange);
      const scoreChange = (Math.random() - 0.5) * 3;
      const newScore = Math.max(0, Math.min(100, topic.trendingScore + scoreChange));
      
      let newStatus = topic.status;
      if (newVelocity > 15 && newScore > 90) {
        newStatus = 'breaking';
      } else if (newVelocity > 10 && newScore > 80) {
        newStatus = 'peaking';
      } else if (newVelocity < 5) {
        newStatus = 'fading';
      } else {
        newStatus = 'stable';
      }

      return {
        ...topic,
        lastUpdated: new Date().toISOString(),
        trendingScore: newScore,
        velocity: newVelocity,
        status: newStatus,
      };
    });

    const newTrends = generateNewTrends();
    
    if (newTrends.length > 0) {
      console.log(`⚡ Found ${newTrends.length} new trending topics`);
      setPendingTopics(prev => [...newTrends, ...prev]);
      setNewTrendsCount(prev => prev + newTrends.length);
      setHasNewTrends(true);
    }

    setTopics(updatedTopics);
  }, [topics, generateNewTrends]);

  const refreshTrending = useCallback(async (showLoading: boolean = true) => {
    if (showLoading) {
      setIsRefreshing(true);
    }
    
    console.log('🔄 Refreshing trending topics...');
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const updatedTopics = topics.map((topic) => {
      const velocityChange = (Math.random() - 0.5) * 5;
      const newVelocity = Math.max(0, topic.velocity + velocityChange);
      const scoreChange = (Math.random() - 0.5) * 3;
      const newScore = Math.max(0, Math.min(100, topic.trendingScore + scoreChange));
      
      let newStatus = topic.status;
      if (newVelocity > 15 && newScore > 90) {
        newStatus = 'breaking';
      } else if (newVelocity > 10 && newScore > 80) {
        newStatus = 'peaking';
      } else if (newVelocity < 5) {
        newStatus = 'fading';
      } else {
        newStatus = 'stable';
      }

      return {
        ...topic,
        lastUpdated: new Date().toISOString(),
        trendingScore: newScore,
        velocity: newVelocity,
        status: newStatus,
      };
    });
    
    const allTopics = [...pendingTopics, ...updatedTopics];
    const sortedTopics = allTopics.sort((a, b) => b.trendingScore - a.trendingScore);
    
    setTopics(sortedTopics);
    setPendingTopics([]);
    setNewTrendsCount(0);
    setHasNewTrends(false);
    setLastRefresh(new Date());
    
    if (showLoading) {
      setIsRefreshing(false);
    }
    
    console.log('✅ Trending refreshed successfully');
  }, [topics, pendingTopics]);

  const loadNewTrends = useCallback(async () => {
    console.log(`📥 Loading ${pendingTopics.length} new trends...`);
    
    const allTopics = [...pendingTopics, ...topics];
    const sortedTopics = allTopics.sort((a, b) => b.trendingScore - a.trendingScore);
    
    setTopics(sortedTopics);
    setPendingTopics([]);
    setNewTrendsCount(0);
    setHasNewTrends(false);
    setLastRefresh(new Date());
  }, [pendingTopics, topics]);

  const updateFilters = useCallback((newFilters: Partial<TrendingFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const getBreakingTopics = useCallback(() => {
    return topics
      .filter((topic) => topic.status === 'breaking')
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 5);
  }, [topics]);

  const getPeakingTopics = useCallback(() => {
    return topics
      .filter((topic) => topic.status === 'peaking')
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);
  }, [topics]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewTrends();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [checkForNewTrends]);

  return useMemo(
    () => ({
      topics: filteredTopics,
      trendingTopics: filteredTopics,
      trendingPosts,
      filters,
      weights,
      lastRefresh,
      isRefreshing,
      newTrendsCount,
      hasNewTrends,
      updateFilters,
      refreshTrending,
      loadNewTrends,
      getTopicsByCategory,
      getPostsByCategory,
      getBreakingTopics,
      getPeakingTopics,
    }),
    [
      filteredTopics,
      trendingPosts,
      filters,
      weights,
      lastRefresh,
      isRefreshing,
      newTrendsCount,
      hasNewTrends,
      updateFilters,
      refreshTrending,
      loadNewTrends,
      getTopicsByCategory,
      getPostsByCategory,
      getBreakingTopics,
      getPeakingTopics,
    ]
  );
});
