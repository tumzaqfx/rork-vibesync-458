import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Post, User, Message, Notification } from '@/types';

interface BackendState {
  isConnected: boolean;
  isLoading: boolean;
}

const API_BASE_URL = 'https://api.vibesync.app'; // Replace with your actual backend URL

export const [BackendProvider, useBackend] = createContextHook(() => {
  const [state, setState] = useState<BackendState>({
    isConnected: false,
    isLoading: false,
  });
  
  const queryClient = useQueryClient();

  // API Functions
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = await AsyncStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  };

  // Posts
  const createPost = useMutation({
    mutationFn: async (postData: { content: string; mediaType?: string; mediaUrl?: string }) => {
      return apiCall('/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      return apiCall(`/posts/${postId}/like`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Messages
  const sendMessage = useMutation({
    mutationFn: async (messageData: { recipientId: string; content: string; type: 'text' | 'image' | 'audio' }) => {
      return apiCall('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Live Streaming
  const startLiveStream = useMutation({
    mutationFn: async (streamData: { title: string; description?: string; category: string }) => {
      return apiCall('/live/start', {
        method: 'POST',
        body: JSON.stringify(streamData),
      });
    },
  });

  const endLiveStream = useMutation({
    mutationFn: async (streamId: string) => {
      return apiCall(`/live/${streamId}/end`, { method: 'POST' });
    },
  });

  // Notifications
  const markNotificationRead = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiCall(`/notifications/${notificationId}/read`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Music Integration with YouTube API
  const searchMusic = async (query: string) => {
    const YOUTUBE_API_KEY = 'AIzaSyAdAxbKXCnYMY_mtTeclJYMIP-JM20wEYw';
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&maxResults=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search music');
    }
    
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      albumArt: item.snippet.thumbnails.medium.url,
      youtubeId: item.id.videoId,
      duration: 0, // Would need additional API call to get duration
    }));
  };

  const getVideoDetails = async (videoId: string) => {
    const YOUTUBE_API_KEY = 'AIzaSyAdAxbKXCnYMY_mtTeclJYMIP-JM20wEYw';
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get video details');
    }
    
    return response.json();
  };

  return {
    ...state,
    // Mutations
    createPost,
    likePost,
    sendMessage,
    startLiveStream,
    endLiveStream,
    markNotificationRead,
    // Music functions
    searchMusic,
    getVideoDetails,
    // Utility
    apiCall,
  };
});