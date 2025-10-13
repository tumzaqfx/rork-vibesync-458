import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
  });

  useEffect(() => {
    loadNotifications();
  }, []);



  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        const notifications: Notification[] = JSON.parse(stored);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        setState(prev => ({ ...prev, notifications, unreadCount }));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = async (notifications: Notification[]) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const addNotification = (notification: Notification) => {
    setState(prev => {
      const newNotifications = [notification, ...prev.notifications];
      const unreadCount = newNotifications.filter(n => !n.isRead).length;
      saveNotifications(newNotifications);
      return {
        ...prev,
        notifications: newNotifications,
        unreadCount,
      };
    });
  };

  const markAsRead = (notificationId: string) => {
    setState(prev => {
      const updatedNotifications = prev.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
      saveNotifications(updatedNotifications);
      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount,
      };
    });
  };

  const markAllAsRead = () => {
    setState(prev => {
      const updatedNotifications = prev.notifications.map(n => ({ ...n, isRead: true }));
      saveNotifications(updatedNotifications);
      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    });
  };

  const clearNotifications = () => {
    setState(prev => ({ ...prev, notifications: [], unreadCount: 0 }));
    AsyncStorage.removeItem('notifications');
  };

  const handleNotificationPress = (data: any) => {
    console.log('Notification pressed with data:', data);
    // Handle navigation based on notification type
    if (data?.type === 'message') {
      // Navigate to messages
    } else if (data?.type === 'like') {
      // Navigate to post
    } else if (data?.type === 'follow') {
      // Navigate to profile
    }
  };

  const sendLocalNotification = async (title: string, body: string, data?: any) => {
    console.log('Local notification:', { title, body, data });
    addNotification({
      id: Date.now().toString(),
      title,
      message: body,
      type: 'general',
      isRead: false,
      createdAt: new Date().toISOString(),
      userId: data?.userId || 'system',
      actionData: data,
    });
  };

  // Mock notifications for demo
  const createMockNotifications = () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Like',
        message: 'John liked your post',
        type: 'like',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        userId: 'user1',
        actionData: { postId: 'post1' },
      },
      {
        id: '2',
        title: 'New Message',
        message: 'Sarah sent you a message',
        type: 'message',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        userId: 'user2',
        actionData: { conversationId: 'conv1' },
      },
      {
        id: '3',
        title: 'New Follower',
        message: 'Mike started following you',
        type: 'follow',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        userId: 'user3',
        actionData: { userId: 'user3' },
      },
    ];

    setState(prev => {
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;
      return {
        ...prev,
        notifications: mockNotifications,
        unreadCount,
      };
    });
  };

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    sendLocalNotification,
    createMockNotifications,
  };
});