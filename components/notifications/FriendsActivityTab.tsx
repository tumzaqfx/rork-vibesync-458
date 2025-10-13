import React, { useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Heart, MessageCircle, Share2, UserPlus } from 'lucide-react-native';
import { FriendActivity } from '@/types';
import { mockUsers } from '@/mocks/users';
import { mockVibes } from '@/mocks/vibes';
import { mockPosts } from '@/mocks/posts';

const generateMockFriendActivities = (): FriendActivity[] => {
  const activities: FriendActivity[] = [];
  const friends = mockUsers.slice(0, 5);
  const activityTypes: FriendActivity['activityType'][] = ['like', 'comment', 'share', 'follow'];
  
  friends.forEach((friend, index) => {
    const hoursAgo = index * 2;
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    const isVibe = Math.random() > 0.5;
    const content = isVibe 
      ? mockVibes[Math.floor(Math.random() * mockVibes.length)]
      : mockPosts[Math.floor(Math.random() * mockPosts.length)];
    
    activities.push({
      id: `activity_${friend.id}_${Date.now()}_${index}`,
      friendId: friend.id,
      friendUsername: friend.username,
      friendDisplayName: friend.displayName,
      friendProfileImage: friend.profileImage,
      friendIsVerified: friend.isVerified,
      activityType,
      contentId: content.id,
      contentType: isVibe ? 'vibe' : 'post',
      timestamp,
      contentPreview: {
        thumbnailUrl: isVibe ? (content as any).thumbnailUrl : (content as any).image,
        caption: isVibe ? (content as any).caption : (content as any).content,
      },
    });
  });
  
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const FriendsActivityTab: React.FC = () => {
  const activities = useMemo(() => generateMockFriendActivities(), []);

  const getActivityIcon = (type: FriendActivity['activityType']) => {
    switch (type) {
      case 'like':
        return <Heart size={16} color={Colors.error} fill={Colors.error} />;
      case 'comment':
        return <MessageCircle size={16} color={Colors.primary} />;
      case 'share':
        return <Share2 size={16} color={Colors.success} />;
      case 'follow':
        return <UserPlus size={16} color={Colors.primary} />;
    }
  };

  const getActivityText = (activity: FriendActivity): string => {
    switch (activity.activityType) {
      case 'like':
        return `liked a ${activity.contentType}`;
      case 'comment':
        return `commented on a ${activity.contentType}`;
      case 'share':
        return `shared a ${activity.contentType}`;
      case 'follow':
        return 'started following someone';
      default:
        return 'had activity';
    }
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = Date.now();
    const activityTime = new Date(timestamp).getTime();
    const diff = now - activityTime;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  const handleActivityPress = (activity: FriendActivity) => {
    if (activity.activityType === 'follow') {
      router.push(`/user/${activity.friendId}`);
    } else if (activity.contentType === 'vibe') {
      router.push('/(tabs)/vibez');
    } else {
      router.push(`/post/${activity.contentId}`);
    }
  };

  const handleFriendPress = (friendId: string) => {
    router.push(`/user/${friendId}`);
  };

  const renderActivity = ({ item }: { item: FriendActivity }) => (
    <TouchableOpacity
      style={styles.activityItem}
      onPress={() => handleActivityPress(item)}
      activeOpacity={0.7}
    >
      <TouchableOpacity onPress={() => handleFriendPress(item.friendId)}>
        <Avatar uri={item.friendProfileImage} size={48} />
      </TouchableOpacity>

      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <TouchableOpacity
            style={styles.friendNameContainer}
            onPress={() => handleFriendPress(item.friendId)}
          >
            <Text style={styles.friendName}>{item.friendDisplayName}</Text>
            {item.friendIsVerified && <VerifiedBadge size={14} />}
          </TouchableOpacity>
          <Text style={styles.activityTime}>{getTimeAgo(item.timestamp)}</Text>
        </View>

        <View style={styles.activityDescription}>
          <View style={styles.activityIconContainer}>
            {getActivityIcon(item.activityType)}
          </View>
          <Text style={styles.activityText}>{getActivityText(item)}</Text>
        </View>

        {item.contentPreview && item.activityType !== 'follow' && (
          <View style={styles.contentPreview}>
            {item.contentPreview.thumbnailUrl && (
              <Image
                source={{ uri: item.contentPreview.thumbnailUrl }}
                style={styles.previewImage}
              />
            )}
            <Text style={styles.previewCaption} numberOfLines={2}>
              {item.contentPreview.caption}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderActivity}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No friend activity yet</Text>
            <Text style={styles.emptySubtext}>
              When your friends like, comment, or share content, you&apos;ll see it here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingVertical: 8,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  friendNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  friendName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  activityTime: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  activityDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  contentPreview: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.cardLight,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
  previewCaption: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
