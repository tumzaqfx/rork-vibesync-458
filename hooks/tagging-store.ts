import { useState, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageTag, Mention, TagSettings, PendingTag, TagAnalytics } from '@/types/tag';
import { User } from '@/types';
import { users } from '@/mocks/users';

const TAG_SETTINGS_KEY = 'tag_settings';
const PENDING_TAGS_KEY = 'pending_tags';

export const [TaggingProvider, useTagging] = createContextHook(() => {
  const [tagSettings, setTagSettings] = useState<TagSettings>({
    whoCanTagMe: 'everyone',
    reviewTagsBeforeShowing: false,
  });
  const [pendingTags, setPendingTags] = useState<PendingTag[]>([]);
  const [tagAnalytics, setTagAnalytics] = useState<TagAnalytics>({
    totalTags: 0,
    profileVisitsFromTags: 0,
    topTaggers: [],
    tagsByVerifiedUsers: 0,
    vibeScoreFromTags: 0,
  });

  const loadSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(TAG_SETTINGS_KEY);
      if (stored) {
        setTagSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load tag settings:', error);
    }
  }, []);

  const saveSettings = useCallback(async (settings: TagSettings) => {
    try {
      await AsyncStorage.setItem(TAG_SETTINGS_KEY, JSON.stringify(settings));
      setTagSettings(settings);
    } catch (error) {
      console.error('Failed to save tag settings:', error);
    }
  }, []);

  const loadPendingTags = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PENDING_TAGS_KEY);
      if (stored) {
        const tags = JSON.parse(stored);
        setPendingTags(tags.map((tag: PendingTag) => ({
          ...tag,
          timestamp: new Date(tag.timestamp),
        })));
      }
    } catch (error) {
      console.error('Failed to load pending tags:', error);
    }
  }, []);

  const searchUsers = useCallback((query: string): User[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return users
      .filter(user => 
        user.username.toLowerCase().includes(lowerQuery) ||
        (user.name && user.name.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 10);
  }, []);

  const canUserTagMe = useCallback((userId: string): boolean => {
    if (tagSettings.whoCanTagMe === 'everyone') return true;
    if (tagSettings.whoCanTagMe === 'no-one') return false;
    
    const user = users.find(u => u.id === userId);
    return user?.isFollowing || false;
  }, [tagSettings.whoCanTagMe]);

  const addTag = useCallback(async (
    postId: string,
    postImage: string,
    postType: 'post' | 'vibe' | 'story',
    tag: ImageTag,
    taggedByUserId: string
  ) => {
    const canTag = canUserTagMe(taggedByUserId);
    
    if (!canTag) {
      throw new Error('This user cannot tag you');
    }

    if (tagSettings.reviewTagsBeforeShowing) {
      const taggedByUser = users.find(u => u.id === taggedByUserId);
      if (!taggedByUser) return;

      const pendingTag: PendingTag = {
        id: Date.now().toString(),
        postId,
        postImage,
        postType,
        taggedBy: {
          userId: taggedByUser.id,
          username: taggedByUser.username,
          avatar: taggedByUser.avatar || '',
          verified: taggedByUser.verified || false,
        },
        position: tag.position,
        timestamp: new Date(),
        status: 'pending',
      };

      const updated = [...pendingTags, pendingTag];
      setPendingTags(updated);
      await AsyncStorage.setItem(PENDING_TAGS_KEY, JSON.stringify(updated));
    }

    console.log('Tag added:', { postId, tag, requiresReview: tagSettings.reviewTagsBeforeShowing });
  }, [tagSettings, pendingTags, canUserTagMe]);

  const approveTag = useCallback(async (tagId: string) => {
    const updated = pendingTags.map(tag =>
      tag.id === tagId ? { ...tag, status: 'approved' as const } : tag
    );
    setPendingTags(updated);
    await AsyncStorage.setItem(PENDING_TAGS_KEY, JSON.stringify(updated));
    
    setTagAnalytics(prev => ({
      ...prev,
      totalTags: prev.totalTags + 1,
    }));
  }, [pendingTags]);

  const rejectTag = useCallback(async (tagId: string) => {
    const updated = pendingTags.map(tag =>
      tag.id === tagId ? { ...tag, status: 'rejected' as const } : tag
    );
    setPendingTags(updated);
    await AsyncStorage.setItem(PENDING_TAGS_KEY, JSON.stringify(updated));
  }, [pendingTags]);

  const removeTag = useCallback(async (postId: string, tagId: string) => {
    console.log('Removing tag:', { postId, tagId });
  }, []);

  const parseMentions = useCallback((text: string): Mention[] => {
    const mentions: Mention[] = [];
    const regex = /@(\w+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const username = match[1];
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      
      if (user) {
        mentions.push({
          userId: user.id,
          username: user.username,
          avatar: user.avatar || '',
          verified: user.verified || false,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }
    }

    return mentions;
  }, []);

  const updateAnalytics = useCallback((update: Partial<TagAnalytics>) => {
    setTagAnalytics(prev => ({ ...prev, ...update }));
  }, []);

  return {
    tagSettings,
    pendingTags: pendingTags.filter(t => t.status === 'pending'),
    tagAnalytics,
    loadSettings,
    saveSettings,
    loadPendingTags,
    searchUsers,
    canUserTagMe,
    addTag,
    approveTag,
    rejectTag,
    removeTag,
    parseMentions,
    updateAnalytics,
  };
});
