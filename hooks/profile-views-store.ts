import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { ProfileView, VibeLike } from '@/types';
import { mockUsers } from '@/mocks/users';

const PROFILE_VIEWS_KEY = '@vibesync/profile_views';
const VIBE_LIKES_KEY = '@vibesync/vibe_likes';
const PROFILE_VIEWS_ENABLED_KEY = '@vibesync/profile_views_enabled';
const PROFILE_VIEWS_EXPIRY_DAYS = 30;

const generateMockProfileViews = (userId: string): ProfileView[] => {
  const views: ProfileView[] = [];
  const viewerIds = mockUsers.filter(u => u.id !== userId).slice(0, 8);
  
  viewerIds.forEach((viewer, index) => {
    const hoursAgo = index * 3;
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
    
    views.push({
      id: `view_${userId}_${viewer.id}_${Date.now()}_${index}`,
      profileOwnerId: userId,
      viewerId: viewer.id,
      viewerUsername: viewer.username,
      viewerDisplayName: viewer.displayName,
      viewerProfileImage: viewer.profileImage,
      viewerIsVerified: viewer.isVerified,
      timestamp,
      deviceId: `device_${Math.random().toString(36).substr(2, 9)}`,
      isPrivateView: Math.random() > 0.8,
    });
  });
  
  return views.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateMockVibeLikes = (vibeId: string): VibeLike[] => {
  const likes: VibeLike[] = [];
  const likerIds = mockUsers.slice(0, Math.floor(Math.random() * 5) + 1);
  
  likerIds.forEach((liker, index) => {
    const hoursAgo = index * 2;
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
    
    likes.push({
      id: `like_${vibeId}_${liker.id}_${Date.now()}_${index}`,
      vibeId,
      userId: liker.id,
      username: liker.username,
      displayName: liker.displayName,
      profileImage: liker.profileImage,
      isVerified: liker.isVerified,
      timestamp,
    });
  });
  
  return likes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const [ProfileViewsProvider, useProfileViews] = createContextHook(() => {
  const [profileViews, setProfileViews] = useState<Record<string, ProfileView[]>>({});
  const [vibeLikes, setVibeLikes] = useState<Record<string, VibeLike[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [profileViewsEnabled, setProfileViewsEnabled] = useState<Record<string, boolean>>({});
  const [repeatVisitors, setRepeatVisitors] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [viewsData, likesData, enabledData] = await Promise.all([
        AsyncStorage.getItem(PROFILE_VIEWS_KEY),
        AsyncStorage.getItem(VIBE_LIKES_KEY),
        AsyncStorage.getItem(PROFILE_VIEWS_ENABLED_KEY),
      ]);

      if (viewsData) {
        const views = JSON.parse(viewsData);
        const cleanedViews = cleanExpiredViews(views);
        setProfileViews(cleanedViews);
        calculateRepeatVisitors(cleanedViews);
      }
      if (likesData) {
        setVibeLikes(JSON.parse(likesData));
      }
      if (enabledData) {
        setProfileViewsEnabled(JSON.parse(enabledData));
      }
    } catch (error) {
      console.error('[ProfileViews] Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanExpiredViews = (views: Record<string, ProfileView[]>): Record<string, ProfileView[]> => {
    const now = Date.now();
    const expiryTime = PROFILE_VIEWS_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const cleaned: Record<string, ProfileView[]> = {};

    Object.keys(views).forEach(userId => {
      cleaned[userId] = views[userId].filter(view => {
        const viewTime = new Date(view.timestamp).getTime();
        return now - viewTime <= expiryTime;
      });
    });

    return cleaned;
  };

  const calculateRepeatVisitors = (views: Record<string, ProfileView[]>) => {
    const repeats: Record<string, Record<string, number>> = {};

    Object.keys(views).forEach(userId => {
      repeats[userId] = {};
      views[userId].forEach(view => {
        if (!repeats[userId][view.viewerId]) {
          repeats[userId][view.viewerId] = 0;
        }
        repeats[userId][view.viewerId]++;
      });
    });

    setRepeatVisitors(repeats);
  };

  const saveData = async (
    views: Record<string, ProfileView[]>,
    likes: Record<string, VibeLike[]>,
    enabled?: Record<string, boolean>
  ) => {
    try {
      const promises = [
        AsyncStorage.setItem(PROFILE_VIEWS_KEY, JSON.stringify(views)),
        AsyncStorage.setItem(VIBE_LIKES_KEY, JSON.stringify(likes)),
      ];

      if (enabled) {
        promises.push(AsyncStorage.setItem(PROFILE_VIEWS_ENABLED_KEY, JSON.stringify(enabled)));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('[ProfileViews] Error saving data:', error);
    }
  };

  const trackProfileView = useCallback(async (profileOwnerId: string, viewerId: string) => {
    if (profileOwnerId === viewerId) {
      return;
    }

    const viewerEnabled = profileViewsEnabled[viewerId] !== false;
    const ownerEnabled = profileViewsEnabled[profileOwnerId] !== false;

    if (!viewerEnabled || !ownerEnabled) {
      console.log(`[ProfileViews] View not tracked - viewer or owner has views disabled`);
      return;
    }

    const viewer = mockUsers.find(u => u.id === viewerId);
    if (!viewer) {
      return;
    }

    const existingViews = profileViews[profileOwnerId] || [];
    const recentView = existingViews.find(
      v => v.viewerId === viewerId && 
      Date.now() - new Date(v.timestamp).getTime() < 60 * 60 * 1000
    );

    if (recentView) {
      return;
    }

    const newView: ProfileView = {
      id: `view_${profileOwnerId}_${viewerId}_${Date.now()}`,
      profileOwnerId,
      viewerId,
      viewerUsername: viewer.username,
      viewerDisplayName: viewer.displayName,
      viewerProfileImage: viewer.profileImage,
      viewerIsVerified: viewer.isVerified,
      timestamp: new Date().toISOString(),
      deviceId: `device_${Math.random().toString(36).substr(2, 9)}`,
      isPrivateView: false,
    };

    const updatedViews = {
      ...profileViews,
      [profileOwnerId]: [newView, ...existingViews].slice(0, 100),
    };

    setProfileViews(updatedViews);
    calculateRepeatVisitors(updatedViews);
    await saveData(updatedViews, vibeLikes);
    
    console.log(`[ProfileViews] Tracked view: ${viewer.username} viewed ${profileOwnerId}`);
  }, [profileViews, vibeLikes, profileViewsEnabled]);

  const getProfileViews = useCallback((userId: string): ProfileView[] => {
    const views = profileViews[userId];
    if (!views || views.length === 0) {
      return [];
    }
    return views;
  }, [profileViews])

  const getProfileViewsCount = useCallback((userId: string, timeRange: 'day' | 'week' | 'month' | 'all' = 'week'): number => {
    const views = getProfileViews(userId);
    const now = Date.now();
    
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };

    return views.filter(v => {
      const viewTime = new Date(v.timestamp).getTime();
      return now - viewTime <= timeRanges[timeRange];
    }).length;
  }, [getProfileViews]);

  const trackVibeLike = useCallback(async (vibeId: string, userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return;
    }

    const existingLikes = vibeLikes[vibeId] || [];
    const alreadyLiked = existingLikes.find(l => l.userId === userId);

    if (alreadyLiked) {
      const updatedLikes = {
        ...vibeLikes,
        [vibeId]: existingLikes.filter(l => l.userId !== userId),
      };
      setVibeLikes(updatedLikes);
      await saveData(profileViews, updatedLikes);
      return;
    }

    const newLike: VibeLike = {
      id: `like_${vibeId}_${userId}_${Date.now()}`,
      vibeId,
      userId,
      username: user.username,
      displayName: user.displayName,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      timestamp: new Date().toISOString(),
    };

    const updatedLikes = {
      ...vibeLikes,
      [vibeId]: [newLike, ...existingLikes],
    };

    setVibeLikes(updatedLikes);
    await saveData(profileViews, updatedLikes);
    
    console.log(`[ProfileViews] Tracked like: ${user.username} liked vibe ${vibeId}`);
  }, [vibeLikes, profileViews]);

  const getVibeLikes = useCallback((vibeId: string): VibeLike[] => {
    const likes = vibeLikes[vibeId];
    if (!likes || likes.length === 0) {
      return [];
    }
    return likes;
  }, [vibeLikes])

  const getFriendsWhoLiked = useCallback((vibeId: string, friendIds: string[]): VibeLike[] => {
    const likes = getVibeLikes(vibeId);
    return likes.filter(like => friendIds.includes(like.userId));
  }, [getVibeLikes]);

  const toggleProfileViewsEnabled = useCallback(async (userId: string, enabled: boolean) => {
    const updatedEnabled = {
      ...profileViewsEnabled,
      [userId]: enabled,
    };

    setProfileViewsEnabled(updatedEnabled);
    await saveData(profileViews, vibeLikes, updatedEnabled);
    
    console.log(`[ProfileViews] Profile views ${enabled ? 'enabled' : 'disabled'} for user ${userId}`);
  }, [profileViewsEnabled, profileViews, vibeLikes]);

  const isProfileViewsEnabled = useCallback((userId: string): boolean => {
    return profileViewsEnabled[userId] !== false;
  }, [profileViewsEnabled]);

  const getRepeatVisitorCount = useCallback((profileOwnerId: string, viewerId: string): number => {
    return repeatVisitors[profileOwnerId]?.[viewerId] || 0;
  }, [repeatVisitors]);

  const getTopRepeatVisitors = useCallback((userId: string, limit: number = 5): Array<{ viewerId: string; count: number }> => {
    const visitors = repeatVisitors[userId] || {};
    return Object.entries(visitors)
      .map(([viewerId, count]) => ({ viewerId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [repeatVisitors]);

  const getNewVisitorsCount = useCallback((userId: string, timeRange: 'day' | 'week' = 'week'): number => {
    const views = getProfileViews(userId);
    const now = Date.now();
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
    };

    return views.filter(v => {
      const viewTime = new Date(v.timestamp).getTime();
      return now - viewTime <= timeRanges[timeRange];
    }).length;
  }, [getProfileViews]);

  return useMemo(() => ({
    profileViews,
    vibeLikes,
    isLoading,
    profileViewsEnabled,
    trackProfileView,
    getProfileViews,
    getProfileViewsCount,
    trackVibeLike,
    getVibeLikes,
    getFriendsWhoLiked,
    toggleProfileViewsEnabled,
    isProfileViewsEnabled,
    getRepeatVisitorCount,
    getTopRepeatVisitors,
    getNewVisitorsCount,
  }), [
    profileViews,
    vibeLikes,
    isLoading,
    profileViewsEnabled,
    trackProfileView,
    getProfileViews,
    getProfileViewsCount,
    trackVibeLike,
    getVibeLikes,
    getFriendsWhoLiked,
    toggleProfileViewsEnabled,
    isProfileViewsEnabled,
    getRepeatVisitorCount,
    getTopRepeatVisitors,
    getNewVisitorsCount,
  ]);
});
