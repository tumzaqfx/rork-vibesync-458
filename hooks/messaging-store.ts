import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

import { Message, Conversation, User } from '@/types';
import { useAuth } from './auth-store';
import { SecurityUtils } from '@/utils/security';
import { OfflineQueue } from '@/utils/offline-cache';
import { ErrorTracker } from '@/utils/performance';

interface MessagingState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  unreadCount: number;
  screenshotProtectionEnabled: boolean;
  screenshotAttempts: Map<string, number>;
}

export const [MessagingProvider, useMessaging] = createContextHook(() => {
  const { user } = useAuth();
  
  const [state, setState] = useState<MessagingState>({
    conversations: [],
    activeConversation: null,
    unreadCount: 0,
    screenshotProtectionEnabled: false,
    screenshotAttempts: new Map(),
  });

  useEffect(() => {
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    try {
      const stored = await AsyncStorage.getItem('conversations');
      if (stored) {
        const decrypted = await SecurityUtils.decryptData(stored);
        const conversations: Conversation[] = JSON.parse(decrypted);
        const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
        setState(prev => ({ ...prev, conversations, unreadCount }));
        console.log('[Messaging] Conversations loaded and decrypted');
      } else {
        createMockConversations();
      }
    } catch (error) {
      console.error('[Messaging] Error loading conversations:', error);
      ErrorTracker.trackError(error as Error);
      createMockConversations();
    }
  };

  const saveConversations = async (conversations: Conversation[]) => {
    try {
      const encrypted = await SecurityUtils.encryptData(JSON.stringify(conversations));
      await AsyncStorage.setItem('conversations', encrypted);
      console.log('[Messaging] Conversations saved securely');
    } catch (error) {
      console.error('[Messaging] Error saving conversations:', error);
      ErrorTracker.trackError(error as Error);
    }
  };

  const sendMessage = async (
    conversationId: string, 
    content: string, 
    type: 'text' | 'image' | 'audio' | 'video' | 'voice' = 'text',
    options?: {
      isViewOnce?: boolean;
      allowReplay?: boolean;
      maxReplays?: number;
      mediaUrl?: string;
      duration?: number;
    }
  ) => {
    if (!user) return;

    try {
      const encryptedContent = await SecurityUtils.encryptData(content);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        recipientId: '',
        content: encryptedContent,
        type,
        timestamp: new Date().toISOString(),
        isRead: false,
        isViewOnce: options?.isViewOnce,
        allowReplay: options?.allowReplay,
        maxReplays: options?.maxReplays,
        replayCount: 0,
        mediaUrl: options?.mediaUrl,
        duration: options?.duration,
        isExpired: false,
        screenshotAttempts: [],
      };

      await OfflineQueue.enqueue({
        type: 'SEND_MESSAGE',
        payload: { conversationId, message: newMessage },
        timestamp: Date.now(),
      });

      setState(prev => {
        const updatedConversations = prev.conversations.map(conv => {
          if (conv.id === conversationId) {
            const updatedConv = {
              ...conv,
              lastMessage: newMessage,
              updatedAt: newMessage.timestamp,
            };
            return updatedConv;
          }
          return conv;
        });

        saveConversations(updatedConversations);
        return { ...prev, conversations: updatedConversations };
      });

      console.log('[Messaging] Message sent and encrypted', options?.isViewOnce ? '(View Once)' : '');
    } catch (error) {
      console.error('[Messaging] Error sending message:', error);
      ErrorTracker.trackError(error as Error, { conversationId });
    }
  };

  const markConversationAsRead = (conversationId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      );
      const unreadCount = updatedConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      
      saveConversations(updatedConversations);
      return {
        ...prev,
        conversations: updatedConversations,
        unreadCount,
      };
    });
  };

  const setActiveConversation = (conversation: Conversation | null) => {
    setState(prev => ({ ...prev, activeConversation: conversation }));
    if (conversation) {
      markConversationAsRead(conversation.id);
    }
  };

  const createConversation = (participant: User): Conversation => {
    if (!user) throw new Error('User not authenticated');

    const newConversation: Conversation = {
      id: Date.now().toString(),
      participants: [user, participant],
      lastMessage: {
        id: '',
        senderId: '',
        recipientId: '',
        content: '',
        type: 'text',
        timestamp: new Date().toISOString(),
        isRead: true,
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => {
      const updatedConversations = [newConversation, ...prev.conversations];
      saveConversations(updatedConversations);
      return { ...prev, conversations: updatedConversations };
    });

    return newConversation;
  };

  const createMockConversations = () => {
    if (!user) return;

    const mockConversations: Conversation[] = [
      {
        id: '1',
        participants: [
          user,
          {
            id: 'user2',
            username: 'sarah_music',
            displayName: 'Sarah Johnson',
            profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            isVerified: true,
            followers: 1200,
            following: 450,
            followersCount: 1200,
            followingCount: 450,
            posts: 89,
          }
        ],
        lastMessage: {
          id: 'msg1',
          senderId: 'user2',
          recipientId: user.id,
          content: 'Hey! Love your latest post about that new track 🎵',
          type: 'text',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          isRead: false,
        },
        unreadCount: 2,
        updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: '2',
        participants: [
          user,
          {
            id: 'user3',
            username: 'mike_beats',
            displayName: 'Mike Rodriguez',
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            isVerified: false,
            followers: 890,
            following: 320,
            followersCount: 890,
            followingCount: 320,
            posts: 156,
          }
        ],
        lastMessage: {
          id: 'msg2',
          senderId: user.id,
          recipientId: 'user3',
          content: 'Thanks for the collaboration idea!',
          type: 'text',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          isRead: true,
        },
        unreadCount: 0,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ];

    const unreadCount = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    setState(prev => ({ ...prev, conversations: mockConversations, unreadCount }));
    saveConversations(mockConversations);
  };

  const markMessageAsViewed = (messageId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.lastMessage.id === messageId) {
          return {
            ...conv,
            lastMessage: {
              ...conv.lastMessage,
              viewedAt: new Date().toISOString(),
              replayCount: (conv.lastMessage.replayCount || 0) + 1,
            },
          };
        }
        return conv;
      });
      
      saveConversations(updatedConversations);
      return { ...prev, conversations: updatedConversations };
    });
    console.log('[Messaging] Message marked as viewed:', messageId);
  };

  const markMessageAsExpired = (messageId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.lastMessage.id === messageId) {
          return {
            ...conv,
            lastMessage: {
              ...conv.lastMessage,
              isExpired: true,
            },
          };
        }
        return conv;
      });
      
      saveConversations(updatedConversations);
      return { ...prev, conversations: updatedConversations };
    });
    console.log('[Messaging] Message marked as expired:', messageId);
  };

  const recordScreenshotAttempt = (messageId: string, attempterId: string) => {
    setState(prev => {
      const attempts = new Map(prev.screenshotAttempts);
      const currentCount = attempts.get(messageId) || 0;
      attempts.set(messageId, currentCount + 1);

      const updatedConversations = prev.conversations.map(conv => {
        if (conv.lastMessage.id === messageId) {
          const screenshotAttempts = conv.lastMessage.screenshotAttempts || [];
          return {
            ...conv,
            lastMessage: {
              ...conv.lastMessage,
              screenshotAttempts: [
                ...screenshotAttempts,
                {
                  timestamp: new Date().toISOString(),
                  attempterId,
                },
              ],
            },
          };
        }
        return conv;
      });
      
      saveConversations(updatedConversations);
      console.log('[Messaging] Screenshot attempt recorded for message:', messageId);
      
      return { 
        ...prev, 
        conversations: updatedConversations,
        screenshotAttempts: attempts,
      };
    });
  };

  const setScreenshotProtection = (enabled: boolean) => {
    setState(prev => ({ ...prev, screenshotProtectionEnabled: enabled }));
    console.log('[Messaging] Screenshot protection:', enabled ? 'enabled' : 'disabled');
  };

  return {
    conversations: state.conversations,
    activeConversation: state.activeConversation,
    unreadCount: state.unreadCount,
    screenshotProtectionEnabled: state.screenshotProtectionEnabled,
    sendMessage,
    markConversationAsRead,
    setActiveConversation,
    createConversation,
    createMockConversations,
    markMessageAsViewed,
    markMessageAsExpired,
    recordScreenshotAttempt,
    setScreenshotProtection,
  };
});