import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useTagging } from '@/hooks/tagging-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

export default function TagReviewScreen() {
  const { pendingTags, approveTag, rejectTag } = useTagging();

  const handleApprove = async (tagId: string) => {
    await approveTag(tagId);
  };

  const handleReject = async (tagId: string) => {
    await rejectTag(tagId);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Review Tags',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }}
      />

      {pendingTags.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Pending Tags</Text>
          <Text style={styles.emptyText}>
            You&apos;ll see tags here when someone tags you in a post
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendingTags}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.tagItem}>
              <TouchableOpacity
                style={styles.tagContent}
                onPress={() => {
                  if (item.postType === 'post') {
                    router.push(`/post/${item.postId}`);
                  } else if (item.postType === 'vibe') {
                    router.push(`/post/${item.postId}`);
                  } else if (item.postType === 'story') {
                    router.push(`/story/${item.postId}`);
                  }
                }}
              >
                <Image
                  source={{ uri: item.postImage }}
                  style={styles.postThumbnail}
                />
                <View style={styles.tagInfo}>
                  <View style={styles.userRow}>
                    <Avatar uri={item.taggedBy.avatar} size={32} />
                    <View style={styles.userInfo}>
                      <View style={styles.userNameRow}>
                        <Text style={styles.username}>
                          @{item.taggedBy.username}
                        </Text>
                        {item.taggedBy.verified && <VerifiedBadge size={12} />}
                      </View>
                      <Text style={styles.tagAction}>
                        tagged you in a {item.postType}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.timestamp}>
                    {formatTime(item.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(item.id)}
                >
                  <X size={20} color="#fff" />
                  <Text style={styles.actionText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(item.id)}
                >
                  <Check size={20} color="#fff" />
                  <Text style={styles.actionText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  tagItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tagContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  postThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  tagInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
  },
  tagAction: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  rejectButton: {
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  approveButton: {},
  actionText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
