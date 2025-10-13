import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { PostCard } from '@/components/home/PostCard';
import { useTheme } from '@/hooks/theme-store';
import { mockPosts } from '@/mocks/posts';
import { Post } from '@/types';
import { Hash, TrendingUp } from 'lucide-react-native';

export default function HashtagScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const { colors } = useTheme();
  
  // Filter posts that contain the hashtag
  const [hashtagPosts] = useState<Post[]>(
    mockPosts.filter(post => 
      post.content.toLowerCase().includes(`#${tag?.toLowerCase()}`)
    )
  );

  const handleLikePress = (postId: string) => {
    console.log('Like pressed for post:', postId);
  };

  const handleCommentPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleSharePress = (postId: string) => {
    console.log('Share pressed for post:', postId);
  };

  const handleSavePress = (postId: string) => {
    console.log('Save pressed for post:', postId);
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `#${tag}`,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: '#87CEEB' },
        }} 
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View style={styles.hashtagInfo}>
            <View style={styles.hashtagIconContainer}>
              <Hash size={28} color="#87CEEB" />
            </View>
            <View style={styles.hashtagTextContainer}>
              <Text style={[styles.hashtagTitle, { color: '#87CEEB' }]}>#{tag}</Text>
              <Text style={[styles.postCount, { color: colors.textSecondary }]}>
                {hashtagPosts.length} {hashtagPosts.length === 1 ? 'post' : 'posts'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.followHashtagButton}>
            <TrendingUp size={20} color="#87CEEB" />
            <Text style={styles.followHashtagText}>Follow</Text>
          </TouchableOpacity>
        </View>
        
        {hashtagPosts.length > 0 ? (
          <FlatList
            data={hashtagPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onPress={handlePostPress}
                onLike={handleLikePress}
                onComment={handleCommentPress}
                onShare={handleSharePress}
                onSavePress={handleSavePress}
                onUserPress={handleUserPress}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <Hash size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No posts found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Be the first to post with #{tag}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hashtagInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hashtagIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(135, 206, 235, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hashtagTextContainer: {
    flex: 1,
  },
  hashtagTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  followHashtagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 206, 235, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  followHashtagText: {
    color: '#87CEEB',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});