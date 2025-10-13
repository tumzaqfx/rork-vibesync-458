import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

import { Message, Conversation, MessageDraft, TypingIndicator } from '@/types/messaging';
import { mockConversations, mockMessages } from '@/mocks/messages';
import { useAuth } from './auth-store';

interface DMState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  drafts: Record<string, MessageDraft>;
  typingIndicators: TypingIndicator[];
  selectedConversation: string | null;
}

export const [DMProvider, useDM] = createContextHook(() => {
  const { user } = useAuth();
  
  const [state, setState] = useState<DMState>({
    conversations: [],
    messages: {},
    drafts: {},
    typingIndicators: [],
    selectedConversation: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('dm-data');
      if (stored) {
        const data = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          conversations: data.conversations || mockConversations,
          messages: data.messages || mockMessages,
        }));
      } else {
        setState(prev => ({
          ...prev,
          conversations: mockConversations,
          messages: mockMessages,
        }));
      }
    } catch (error) {
      console.error('[DM] Error loading data:', error);
      setState(prev => ({
        ...prev,
        conversations: mockConversations,
        messages: mockMessages,
      }));
    }
  };

  const saveData = async (conversations: Conversation[], messages: Record<string, Message[]>) => {
    try {
      await AsyncStorage.setItem('dm-data', JSON.stringify({ conversations, messages }));
    } catch (error) {
      console.error('[DM] Error saving data:', error);
    }
  };

  const updateMessageStatus = useCallback((messageId: string, status: Message['status']) => {
    setState(prev => {
      const updatedMessages = { ...prev.messages };
      
      Object.keys(updatedMessages).forEach(convId => {
        updatedMessages[convId] = updatedMessages[convId].map(msg =>
          msg.id === messageId ? { ...msg, status } : msg
        );
      });

      return { ...prev, messages: updatedMessages };
    });
  }, []);

  const sendMessage = useCallback((
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    options?: {
      mediaUrl?: string;
      thumbnailUrl?: string;
      duration?: number;
      fileName?: string;
      fileSize?: number;
      replyTo?: string;
    }
  ) => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-user',
      type,
      content,
      mediaUrl: options?.mediaUrl,
      thumbnailUrl: options?.thumbnailUrl,
      duration: options?.duration,
      fileName: options?.fileName,
      fileSize: options?.fileSize,
      replyTo: options?.replyTo,
      status: 'sending',
      reactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => {
      const conversationMessages = prev.messages[conversationId] || [];
      const updatedMessages = {
        ...prev.messages,
        [conversationId]: [...conversationMessages, newMessage],
      };

      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: newMessage,
            updatedAt: new Date(),
          };
        }
        return conv;
      });

      saveData(updatedConversations, updatedMessages);

      return {
        ...prev,
        conversations: updatedConversations,
        messages: updatedMessages,
        drafts: {
          ...prev.drafts,
          [conversationId]: { conversationId, text: '' },
        },
      };
    });

    setTimeout(() => {
      updateMessageStatus(newMessage.id, 'sent');
      setTimeout(() => updateMessageStatus(newMessage.id, 'delivered'), 1000);
      setTimeout(() => updateMessageStatus(newMessage.id, 'seen'), 2000);
    }, 500);
  }, [user, updateMessageStatus]);

  const addReaction = useCallback((messageId: string, conversationId: string, emoji: string) => {
    if (!user) return;

    setState(prev => {
      const conversationMessages = prev.messages[conversationId] || [];
      const updatedMessages = {
        ...prev.messages,
        [conversationId]: conversationMessages.map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions.find(r => r.userId === 'current-user');
            if (existingReaction) {
              return {
                ...msg,
                reactions: msg.reactions.filter(r => r.userId !== 'current-user'),
              };
            }
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                { userId: 'current-user', emoji, createdAt: new Date() },
              ],
            };
          }
          return msg;
        }),
      };

      return { ...prev, messages: updatedMessages };
    });
  }, [user]);

  const deleteMessage = useCallback((messageId: string, conversationId: string, forEveryone: boolean = false) => {
    setState(prev => {
      const conversationMessages = prev.messages[conversationId] || [];
      const updatedMessages = {
        ...prev.messages,
        [conversationId]: conversationMessages.map(msg => {
          if (msg.id === messageId) {
            if (forEveryone) {
              return { ...msg, deletedForEveryone: true, content: 'This message was deleted' };
            }
            return { ...msg, deletedForMe: true };
          }
          return msg;
        }),
      };

      return { ...prev, messages: updatedMessages };
    });
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });

      return { ...prev, conversations: updatedConversations };
    });
  }, []);

  const togglePin = useCallback((conversationId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, isPinned: !conv.isPinned };
        }
        return conv;
      });

      saveData(updatedConversations, prev.messages);
      return { ...prev, conversations: updatedConversations };
    });
  }, []);

  const toggleMute = useCallback((conversationId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, isMuted: !conv.isMuted };
        }
        return conv;
      });

      saveData(updatedConversations, prev.messages);
      return { ...prev, conversations: updatedConversations };
    });
  }, []);

  const archiveConversation = useCallback((conversationId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, isArchived: true };
        }
        return conv;
      });

      saveData(updatedConversations, prev.messages);
      return { ...prev, conversations: updatedConversations };
    });
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.filter(conv => conv.id !== conversationId);
      const updatedMessages = { ...prev.messages };
      delete updatedMessages[conversationId];

      saveData(updatedConversations, updatedMessages);
      return {
        ...prev,
        conversations: updatedConversations,
        messages: updatedMessages,
      };
    });
  }, []);

  const acceptRequest = useCallback((conversationId: string) => {
    setState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, isRequest: false };
        }
        return conv;
      });

      saveData(updatedConversations, prev.messages);
      return { ...prev, conversations: updatedConversations };
    });
  }, []);

  const declineRequest = useCallback((conversationId: string) => {
    deleteConversation(conversationId);
  }, [deleteConversation]);

  const saveDraft = useCallback((conversationId: string, text: string, replyTo?: string) => {
    setState(prev => ({
      ...prev,
      drafts: {
        ...prev.drafts,
        [conversationId]: { conversationId, text, replyTo },
      },
    }));
  }, []);

  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (!user) return;

    setState(prev => {
      if (isTyping) {
        const indicator: TypingIndicator = {
          conversationId,
          userId: 'current-user',
          timestamp: new Date(),
        };
        return {
          ...prev,
          typingIndicators: [...prev.typingIndicators.filter(t => t.conversationId !== conversationId), indicator],
        };
      } else {
        return {
          ...prev,
          typingIndicators: prev.typingIndicators.filter(t => t.conversationId !== conversationId),
        };
      }
    });
  }, [user]);

  const selectConversation = useCallback((conversationId: string | null) => {
    setState(prev => ({ ...prev, selectedConversation: conversationId }));
    if (conversationId) {
      markAsRead(conversationId);
    }
  }, [markAsRead]);

  const getConversation = useCallback((conversationId: string) => {
    return state.conversations.find(c => c.id === conversationId);
  }, [state.conversations]);

  const getMessages = useCallback((conversationId: string) => {
    return state.messages[conversationId] || [];
  }, [state.messages]);

  const getDraft = useCallback((conversationId: string) => {
    return state.drafts[conversationId];
  }, [state.drafts]);

  const getTypingUsers = useCallback((conversationId: string) => {
    return state.typingIndicators
      .filter(t => t.conversationId === conversationId && t.userId !== 'current-user')
      .map(t => t.userId);
  }, [state.typingIndicators]);

  const getActiveConversations = useCallback(() => {
    return state.conversations
      .filter(c => !c.isArchived && !c.isRequest)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [state.conversations]);

  const getArchivedConversations = useCallback(() => {
    return state.conversations.filter(c => c.isArchived);
  }, [state.conversations]);

  const getMessageRequests = useCallback(() => {
    return state.conversations.filter(c => c.isRequest);
  }, [state.conversations]);

  const getTotalUnreadCount = useCallback(() => {
    return state.conversations
      .filter(c => !c.isArchived && !c.isRequest)
      .reduce((sum, conv) => sum + conv.unreadCount, 0);
  }, [state.conversations]);

  return useMemo(() => ({
    conversations: state.conversations,
    messages: state.messages,
    selectedConversation: state.selectedConversation,
    sendMessage,
    addReaction,
    deleteMessage,
    markAsRead,
    togglePin,
    toggleMute,
    archiveConversation,
    deleteConversation,
    acceptRequest,
    declineRequest,
    saveDraft,
    setTyping,
    selectConversation,
    getConversation,
    getMessages,
    getDraft,
    getTypingUsers,
    getActiveConversations,
    getArchivedConversations,
    getMessageRequests,
    getTotalUnreadCount,
  }), [
    state,
    sendMessage,
    addReaction,
    deleteMessage,
    markAsRead,
    togglePin,
    toggleMute,
    archiveConversation,
    deleteConversation,
    acceptRequest,
    declineRequest,
    saveDraft,
    setTyping,
    selectConversation,
    getConversation,
    getMessages,
    getDraft,
    getTypingUsers,
    getActiveConversations,
    getArchivedConversations,
    getMessageRequests,
    getTotalUnreadCount,
  ]);
});
