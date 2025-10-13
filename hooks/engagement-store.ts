import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useAuth } from './auth-store';

export interface Collection {
  id: string;
  name: string;
  postIds: string[];
  createdAt: string;
}

export interface Revibe {
  id: string;
  postId: string;
  userId: string;
  caption?: string;
  timestamp: string;
}

export interface Like {
  postId: string;
  userId: string;
  timestamp: string;
  isAuthorLike?: boolean;
}

export interface CommentLike {
  commentId: string;
  userId: string;
  timestamp: string;
  isAuthorLike?: boolean;
}

interface EngagementState {
  likes: Like[];
  revibes: Revibe[];
  savedPosts: string[];
  collections: Collection[];
  commentLikes: CommentLike[];
}

const STORAGE_KEY = 'engagement_data';

export const [EngagementProvider, useEngagement] = createContextHook(() => {
  const { user } = useAuth();
  const [state, setState] = useState<EngagementState>({
    likes: [],
    revibes: [],
    savedPosts: [],
    collections: [
      { id: 'default', name: 'Saved', postIds: [], createdAt: new Date().toISOString() }
    ],
    commentLikes: [],
  });

  const loadEngagementData = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setState(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading engagement data:', error);
    }
  }, []);

  useEffect(() => {
    loadEngagementData();
  }, [loadEngagementData]);

  const saveEngagementData = useCallback(async (newState: EngagementState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.error('Error saving engagement data:', error);
    }
  }, []);

  const likePost = useCallback(async (postId: string, postAuthorId: string) => {
    if (!user) return false;

    const isAuthorLike = user.id === postAuthorId;
    const existingLike = state.likes.find(
      like => like.postId === postId && like.userId === user.id
    );

    if (existingLike) {
      const newLikes = state.likes.filter(
        like => !(like.postId === postId && like.userId === user.id)
      );
      await saveEngagementData({ ...state, likes: newLikes });
      return false;
    } else {
      const newLike: Like = {
        postId,
        userId: user.id,
        timestamp: new Date().toISOString(),
        isAuthorLike,
      };
      await saveEngagementData({ ...state, likes: [...state.likes, newLike] });
      return true;
    }
  }, [user, state, saveEngagementData]);

  const revibePost = useCallback(async (postId: string, caption?: string) => {
    if (!user) return false;

    const existingRevibe = state.revibes.find(
      revibe => revibe.postId === postId && revibe.userId === user.id
    );

    if (existingRevibe) {
      const newRevibes = state.revibes.filter(
        revibe => !(revibe.postId === postId && revibe.userId === user.id)
      );
      await saveEngagementData({ ...state, revibes: newRevibes });
      return false;
    } else {
      const newRevibe: Revibe = {
        id: `revibe_${Date.now()}`,
        postId,
        userId: user.id,
        caption,
        timestamp: new Date().toISOString(),
      };
      await saveEngagementData({ ...state, revibes: [...state.revibes, newRevibe] });
      return true;
    }
  }, [user, state, saveEngagementData]);

  const savePost = useCallback(async (postId: string, collectionId: string = 'default') => {
    if (!user) return false;

    const collection = state.collections.find(c => c.id === collectionId);
    if (!collection) return false;

    const isSaved = collection.postIds.includes(postId);

    if (isSaved) {
      const updatedCollections = state.collections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            postIds: c.postIds.filter(id => id !== postId),
          };
        }
        return c;
      });

      const allSavedPosts = updatedCollections.flatMap(c => c.postIds);
      await saveEngagementData({
        ...state,
        collections: updatedCollections,
        savedPosts: allSavedPosts,
      });
      return false;
    } else {
      const updatedCollections = state.collections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            postIds: [...c.postIds, postId],
          };
        }
        return c;
      });

      const allSavedPosts = updatedCollections.flatMap(c => c.postIds);
      await saveEngagementData({
        ...state,
        collections: updatedCollections,
        savedPosts: allSavedPosts,
      });
      return true;
    }
  }, [user, state, saveEngagementData]);

  const createCollection = useCallback(async (name: string) => {
    if (!user) return null;

    const newCollection: Collection = {
      id: `collection_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      postIds: [],
    };

    await saveEngagementData({
      ...state,
      collections: [...state.collections, newCollection],
    });

    return newCollection;
  }, [user, state, saveEngagementData]);

  const deleteCollection = useCallback(async (collectionId: string) => {
    if (collectionId === 'default') return false;

    const updatedCollections = state.collections.filter(c => c.id !== collectionId);
    const allSavedPosts = updatedCollections.flatMap(c => c.postIds);

    await saveEngagementData({
      ...state,
      collections: updatedCollections,
      savedPosts: allSavedPosts,
    });

    return true;
  }, [state, saveEngagementData]);

  const likeComment = useCallback(async (commentId: string, postAuthorId: string) => {
    if (!user) return false;

    const isAuthorLike = user.id === postAuthorId;
    const existingLike = state.commentLikes.find(
      like => like.commentId === commentId && like.userId === user.id
    );

    if (existingLike) {
      const newLikes = state.commentLikes.filter(
        like => !(like.commentId === commentId && like.userId === user.id)
      );
      await saveEngagementData({ ...state, commentLikes: newLikes });
      return false;
    } else {
      const newLike: CommentLike = {
        commentId,
        userId: user.id,
        timestamp: new Date().toISOString(),
        isAuthorLike,
      };
      await saveEngagementData({
        ...state,
        commentLikes: [...state.commentLikes, newLike],
      });
      return true;
    }
  }, [user, state, saveEngagementData]);

  const isPostLiked = useCallback((postId: string) => {
    if (!user) return false;
    return state.likes.some(like => like.postId === postId && like.userId === user.id);
  }, [user, state.likes]);

  const isPostRevibed = useCallback((postId: string) => {
    if (!user) return false;
    return state.revibes.some(revibe => revibe.postId === postId && revibe.userId === user.id);
  }, [user, state.revibes]);

  const isPostSaved = useCallback((postId: string) => {
    return state.savedPosts.includes(postId);
  }, [state.savedPosts]);

  const isCommentLiked = useCallback((commentId: string) => {
    if (!user) return false;
    return state.commentLikes.some(
      like => like.commentId === commentId && like.userId === user.id
    );
  }, [user, state.commentLikes]);

  const getPostLikes = useCallback((postId: string) => {
    return state.likes.filter(like => like.postId === postId);
  }, [state.likes]);

  const getPostRevibes = useCallback((postId: string) => {
    return state.revibes.filter(revibe => revibe.postId === postId);
  }, [state.revibes]);

  const getCommentLikes = useCallback((commentId: string) => {
    return state.commentLikes.filter(like => like.commentId === commentId);
  }, [state.commentLikes]);

  const getSavedPostsByCollection = useCallback((collectionId: string) => {
    const collection = state.collections.find(c => c.id === collectionId);
    return collection?.postIds || [];
  }, [state.collections]);

  return useMemo(() => ({
    likes: state.likes,
    revibes: state.revibes,
    savedPosts: state.savedPosts,
    collections: state.collections,
    commentLikes: state.commentLikes,
    likePost,
    revibePost,
    savePost,
    createCollection,
    deleteCollection,
    likeComment,
    isPostLiked,
    isPostRevibed,
    isPostSaved,
    isCommentLiked,
    getPostLikes,
    getPostRevibes,
    getCommentLikes,
    getSavedPostsByCollection,
  }), [
    state.likes,
    state.revibes,
    state.savedPosts,
    state.collections,
    state.commentLikes,
    likePost,
    revibePost,
    savePost,
    createCollection,
    deleteCollection,
    likeComment,
    isPostLiked,
    isPostRevibed,
    isPostSaved,
    isCommentLiked,
    getPostLikes,
    getPostRevibes,
    getCommentLikes,
    getSavedPostsByCollection,
  ]);
});
