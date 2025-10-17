import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SectionList } from 'react-native';
import { Stack, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useNotifications } from '@/hooks/notification-store';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Heart, MessageCircle, UserPlus, Radio, Trash2, ArrowLeft } from 'lucide-react-native';
import { Notification } from '@/types';
import { useTheme } from '@/hooks/theme-store';

type NotificationSection = {
  title: string;
  data: Notification[];
};

export default function NotificationsScreen() {
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    createMockNotifications 
  } = useNotifications();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    
    // Create mock notifications if none exist
    if (notifications.length === 0) {
      createMockNotifications();
    }
  }, [isAuthenticated, notifications.length, createMockNotifications]);

  const groupNotificationsByTime = (): NotificationSection[] => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const last7Days: Notification[] = [];
    const last30Days: Notification[] = [];

    notifications.forEach(notification => {
      const notifDate = new Date(notification.createdAt);
      if (notifDate >= sevenDaysAgo) {
        last7Days.push(notification);
      } else if (notifDate >= thirtyDaysAgo) {
        last30Days.push(notification);
      }
    });

    const sections: NotificationSection[] = [];
    if (last7Days.length > 0) {
      sections.push({ title: 'Last 7 days', data: last7Days });
    }
    if (last30Days.length > 0) {
      sections.push({ title: 'Last 30 days', data: last30Days });
    }

    return sections;
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        router.push('/messages');
        break;
      case 'like':
      case 'comment':
        if (notification.actionData?.postId) {
          router.push(`/post/${notification.actionData.postId}`);
        }
        break;
      case 'follow':
        if (notification.actionData?.userId) {
          router.push(`/user/${notification.actionData.userId}`);
        }
        break;
      case 'live':
        router.push('/(tabs)');
        break;
      default:
        break;
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: clearNotifications 
        },
      ]
    );
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${weeks}w`;
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'follow':
        return 'started following you.';
      case 'like':
        return 'liked your post.';
      case 'comment':
        return 'commented on your post.';
      case 'message':
        return 'sent you a message.';
      default:
        return notification.message;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const isFollowNotification = item.type === 'follow';
    
    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <Avatar
          uri={item.actionData?.userAvatar || 'https://i.pravatar.cc/150?img=1'}
          size={44}
        />
        
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationText, { color: colors.text }]}>
            <Text style={styles.notificationUsername}>{item.title}</Text>
            {' '}
            <Text style={{ color: colors.textSecondary }}>{getNotificationText(item)}</Text>
            {' '}
            <Text style={{ color: colors.textSecondary }}>{formatTime(item.createdAt)}</Text>
          </Text>
        </View>
        
        {isFollowNotification && (
          <Button
            title="Follow"
            onPress={() => console.log('Follow user')}
            style={styles.followButton}
            textStyle={styles.followButtonText}
          />
        )}
        
        {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
      </TouchableOpacity>
    );
  };

  const sections = groupNotificationsByTime();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Notifications',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { 
            color: colors.text,
            fontSize: 22,
            fontWeight: 'bold' as const,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)')}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.card }]}>
            <Heart size={48} color={colors.textSecondary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No notifications yet</Text>
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
            When someone likes or comments on your posts, you'll see them here.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          renderSectionHeader={({ section: { title } }) => (
            <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 18,
  },
  notificationUsername: {
    fontWeight: '600' as const,
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    minHeight: 32,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});