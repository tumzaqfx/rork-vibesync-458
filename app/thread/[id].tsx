import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useThreads } from '@/hooks/thread-store';
import { useTheme } from '@/hooks/theme-store';
import ThreadView from '@/components/thread/ThreadView';
import ThreadComposer from '@/components/thread/ThreadComposer';
import CommentThread from '@/components/thread/CommentThread';

export default function ThreadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getThread, getComments } = useThreads();
  const { colors } = useTheme();
  const [showComposer, setShowComposer] = useState(false);

  const thread = getThread(id);
  const comments = thread ? getComments(thread.rootPostId) : [];

  if (!thread) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Thread',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Thread not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const lastPost = thread.posts[thread.posts.length - 1];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Thread',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThreadView posts={thread.posts} threadId={thread.id} collapsed={false} />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {thread.totalEngagement.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Engagement</Text>
          </View>
          {thread.isTrending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingText}>🔥 Trending</Text>
            </View>
          )}
          {thread.vibeScore > 0 && (
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {thread.vibeScore}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Vibe Score</Text>
            </View>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.commentsHeader}>
          <Text style={[styles.commentsTitle, { color: colors.text }]}>
            Comments ({comments.length})
          </Text>
        </View>

        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentThread key={comment.id} postId={thread.rootPostId} comment={comment} />
          ))
        ) : (
          <View style={styles.emptyComments}>
            <Text style={[styles.emptyCommentsText, { color: colors.textSecondary }]}>
              No comments yet. Be the first to comment!
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowComposer(true)}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <ThreadComposer
        visible={showComposer}
        onClose={() => setShowComposer(false)}
        threadId={thread.id}
        parentPostId={lastPost.id}
        rootPostId={thread.rootPostId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center' as const,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  statsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 24,
  },
  statItem: {
    alignItems: 'center' as const,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  trendingBadge: {
    backgroundColor: '#EF444420',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trendingText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  commentsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  emptyComments: {
    padding: 32,
    alignItems: 'center' as const,
  },
  emptyCommentsText: {
    fontSize: 14,
    textAlign: 'center' as const,
  },
  addButton: {
    position: 'absolute' as const,
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
