import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Text, TouchableOpacity, Animated, Platform, ScrollView } from 'react-native';
import { StoriesRow } from '@/components/home/StoriesRow';
import { PostCard } from '@/components/home/PostCard';
import { QuickVibe } from '@/components/home/QuickVibe';
import { NewPostsButton } from '@/components/home/NewPostsButton';
import { CaughtUpMessage } from '@/components/home/CaughtUpMessage';
import { SuggestedFriendsRow } from '@/components/discover/SuggestedFriendsRow';

import SponsoredPost from '@/components/ads/SponsoredPost';
import { mockStories } from '@/mocks/stories';
import { sponsoredAds } from '@/mocks/ads';
import { mockVoicePosts } from '@/mocks/voice-posts';
import { useTheme } from '@/hooks/theme-store';
import { useVoicePosts } from '@/hooks/voice-posts-store';
import { useTrending } from '@/hooks/trending-store';
import { useFeed } from '@/hooks/feed-store';
import { router } from 'expo-router';
import { TrendingPost, VoicePost } from '@/types';
import { VoicePostCard } from '@/components/voice/VoicePostCard';
import { TrendingUp, Flame, MapPin, Hash, Globe, MapPinned, Music, Video, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { FloatingActionMenu } from '@/components/home/FloatingActionMenu';
import { LiveFeedCard } from '@/components/home/LiveFeedCard';
import SuggestedSpills from '@/components/spill/SuggestedSpills';
import { trpc } from '@/lib/trpc';
import { VibePostCard } from '@/components/vibepost/VibePostCard';
import { useVibePosts } from '@/hooks/vibepost-store';
import { VibePost } from '@/types/vibepost';

export default function HomeScreen() {
  console.log('[HomeScreen] Rendering home screen');
  const { colors } = useTheme();
  const { 
    topics,
    trendingPosts, 
    refreshTrending, 
    isRefreshing: isTrendingRefreshing,
    filters,
    updateFilters,
    getBreakingTopics
  } = useTrending();
  const { posts: feedPosts, isRefreshing: isFeedRefreshing, refreshFeed, newPostsCount, hasNewPosts, loadNewPosts, addPost } = useFeed();
  const { voicePosts, likeVoicePost, saveVoicePost, incrementShares } = useVoicePosts();
  const { vibePosts } = useVibePosts();
  const liveStreamsQuery = trpc.live.list.useQuery({ limit: 10 });
  const [stories] = useState(mockStories);
  const [ads] = useState(sponsoredAds);
  const [displayVoicePosts] = useState(mockVoicePosts);
  const [feedMode, setFeedMode] = useState<'for_you' | 'trending'>('for_you');
  const [trendingCategory, setTrendingCategory] = useState<typeof filters.category>('for_you');
  const [showNewPostsButton, setShowNewPostsButton] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollYValue = useRef(0);
  const refreshIconRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hasNewPosts && newPostsCount > 0 && scrollYValue.current > 100) {
      setShowNewPostsButton(true);
    } else {
      setShowNewPostsButton(false);
    }
  }, [hasNewPosts, newPostsCount]);

  const onRefresh = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const animation = Animated.loop(
      Animated.timing(refreshIconRotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    animation.start();

    if (feedMode === 'trending') {
      await refreshTrending();
    } else {
      await refreshFeed();
    }

    animation.stop();
    refreshIconRotation.setValue(0);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [feedMode, refreshTrending, refreshFeed, refreshIconRotation]);
  
  const displayPosts = useMemo(() => {
    const posts = feedMode === 'trending' ? trendingPosts.slice(0, 10) : feedPosts;
    const liveStreams = liveStreamsQuery.data || [];
    
    const postsWithAds: any[] = [];
    let voicePostIndex = 0;
    let vibePostIndex = 0;
    let liveStreamIndex = 0;
    
    if (feedMode === 'for_you' && liveStreams.length > 0 && liveStreamIndex < liveStreams.length) {
      postsWithAds.push({ ...liveStreams[liveStreamIndex], isLiveStream: true });
      liveStreamIndex++;
    }
    
    posts.forEach((post, index) => {
      postsWithAds.push(post);
      
      if (feedMode === 'for_you') {
        if (index === 1 && displayVoicePosts[voicePostIndex]) {
          postsWithAds.push({ ...displayVoicePosts[voicePostIndex], isVoicePost: true });
          voicePostIndex++;
        } else if (index === 2 && vibePosts[vibePostIndex]) {
          postsWithAds.push({ ...vibePosts[vibePostIndex], isVibePost: true });
          vibePostIndex++;
        } else if (index === 3 && ads[0]) {
          postsWithAds.push({ ...ads[0], isAd: true });
        } else if (index === 4 && liveStreams.length > liveStreamIndex) {
          postsWithAds.push({ ...liveStreams[liveStreamIndex], isLiveStream: true });
          liveStreamIndex++;
        } else if (index === 5 && displayVoicePosts[voicePostIndex]) {
          postsWithAds.push({ ...displayVoicePosts[voicePostIndex], isVoicePost: true });
          voicePostIndex++;
        } else if (index === 7 && vibePosts[vibePostIndex]) {
          postsWithAds.push({ ...vibePosts[vibePostIndex], isVibePost: true });
          vibePostIndex++;
        } else if (index === 8 && ads[1]) {
          postsWithAds.push({ ...ads[1], isAd: true });
        } else if (index === 10 && displayVoicePosts[voicePostIndex]) {
          postsWithAds.push({ ...displayVoicePosts[voicePostIndex], isVoicePost: true });
          voicePostIndex++;
        } else if (index === 11 && vibePosts[vibePostIndex]) {
          postsWithAds.push({ ...vibePosts[vibePostIndex], isVibePost: true });
          vibePostIndex++;
        } else if (index === 12 && liveStreams.length > liveStreamIndex) {
          postsWithAds.push({ ...liveStreams[liveStreamIndex], isLiveStream: true });
          liveStreamIndex++;
        } else if (index === 14 && ads[2]) {
          postsWithAds.push({ ...ads[2], isAd: true });
        }
      }
    });
    
    return postsWithAds;
  }, [feedMode, trendingPosts, feedPosts, ads, displayVoicePosts, vibePosts, liveStreamsQuery.data]);

  const handleLoadNewPosts = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    await loadNewPosts();
    setShowNewPostsButton(false);
    
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [loadNewPosts]);

  const handleStoryPress = useCallback((storyId: string) => {
    router.push(`/story/${storyId}`);
  }, []);

  const handleCreateStory = useCallback(() => {
    router.push('/status/create');
  }, []);

  const handleLikePress = useCallback((postId: string) => {
    console.log('Like pressed for post:', postId);
  }, []);

  const handleCommentPress = useCallback((postId: string) => {
    router.push(`/post/${postId}`);
  }, []);

  const handleSharePress = useCallback((postId: string) => {
    console.log('Share pressed for post:', postId);
  }, []);

  const handlePostPress = useCallback((postId: string) => {
    router.push(`/post/${postId}`);
  }, []);

  const handleVibePost = useCallback(async (content: string, attachments?: any[]) => {
    console.log('New vibe posted:', content, 'with attachments:', attachments);
    await addPost(content, attachments);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [addPost]);

  const isRefreshing = feedMode === 'trending' ? isTrendingRefreshing : isFeedRefreshing;

  const handleVoiceLike = useCallback((postId: string) => {
    likeVoicePost(postId);
  }, [likeVoicePost]);

  const handleVoiceSave = useCallback((postId: string) => {
    saveVoicePost(postId);
  }, [saveVoicePost]);

  const handleVoiceShare = useCallback((postId: string) => {
    incrementShares(postId);
    console.log('Share voice post:', postId);
  }, [incrementShares]);

  const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
    if (item.isAd) {
      return <SponsoredPost key={`ad-${item.id}`} ad={item} />;
    }
    
    if (item.isLiveStream) {
      return (
        <LiveFeedCard
          key={`live-${item.id}`}
          id={item.id}
          userId={item.userId}
          username={item.username || 'liveuser'}
          displayName={item.displayName || 'Live User'}
          avatar={item.avatar || 'https://i.pravatar.cc/150'}
          title={item.title}
          thumbnailUrl={item.thumbnailUrl}
          viewerCount={item.viewerCount}
          startedAt={new Date(item.startedAt)}
        />
      );
    }
    
    if (item.isVoicePost) {
      const voicePost = item as VoicePost;
      return (
        <VoicePostCard
          key={`voice-${voicePost.id}`}
          id={voicePost.id}
          author={voicePost.author}
          caption={voicePost.caption}
          voiceNote={voicePost.voiceNote}
          coverImage={voicePost.coverImage}
          likes={voicePost.likes}
          comments={voicePost.comments}
          shares={voicePost.shares}
          timestamp={voicePost.timestamp}
          isLiked={voicePost.isLiked}
          isSaved={voicePost.isSaved}
          onLike={() => handleVoiceLike(voicePost.id)}
          onComment={() => handleCommentPress(voicePost.id)}
          onShare={() => handleVoiceShare(voicePost.id)}
          onSave={() => handleVoiceSave(voicePost.id)}
        />
      );
    }
    
    if (item.isVibePost) {
      const vibePost = item as VibePost;
      return (
        <View key={`vibe-${vibePost.id}`} style={{ paddingHorizontal: 16 }}>
          <VibePostCard post={vibePost} autoplay={false} />
        </View>
      );
    }
    
    const trendingPost = item as TrendingPost;
    const isTrending = 'trendingScore' in item;
    const shouldShowSuggestions = feedMode === 'for_you' && (index === 10 || index === 25 || index === 40);
    
    return (
      <View key={item.id}>
        {shouldShowSuggestions && <SuggestedFriendsRow maxSuggestions={10} />}
        {isTrending && trendingPost.trendingRank === 1 && (
          <View style={[styles.trendingBanner, { backgroundColor: colors.card }]}>
            <Flame size={16} color={colors.error} />
            <Text style={[styles.trendingBannerText, { color: colors.text }]}>
              Trending Now
            </Text>
          </View>
        )}
        <PostCard
          post={item}
          onPress={handlePostPress}
          onLike={handleLikePress}
          onComment={handleCommentPress}
          onShare={handleSharePress}
        />
        {isTrending && (
          <View style={[styles.trendingIndicator, { backgroundColor: colors.card }]}>
            <TrendingUp size={14} color={colors.primary} />
            <Text style={[styles.trendingIndicatorText, { color: colors.textSecondary }]}>
              #{trendingPost.trendingRank} Trending • {trendingPost.trendingScore.toFixed(1)} score • {trendingPost.velocity.toFixed(1)}x velocity
            </Text>
          </View>
        )}
      </View>
    );
  }, [colors, feedMode, handlePostPress, handleLikePress, handleCommentPress, handleSharePress, handleVoiceLike, handleVoiceSave, handleVoiceShare]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        scrollYValue.current = event.nativeEvent.contentOffset.y;
      },
    }
  );

  const ListHeaderComponent = useMemo(() => (
    <View>
      <StoriesRow
        stories={stories}
        onStoryPress={handleStoryPress}
        onCreateStory={handleCreateStory}
      />
      {feedMode === 'for_you' && <SuggestedSpills />}
      <View style={[styles.feedModeSelector, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.feedModeButton,
            feedMode === 'for_you' && [styles.feedModeButtonActive, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setFeedMode('for_you')}
        >
          <Text
            style={[
              styles.feedModeButtonText,
              { color: feedMode === 'for_you' ? colors.text : colors.textSecondary },
              feedMode === 'for_you' && styles.feedModeButtonTextActive,
            ]}
          >
            For You
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.feedModeButton,
            feedMode === 'trending' && [styles.feedModeButtonActive, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setFeedMode('trending')}
        >
          <Flame size={16} color={feedMode === 'trending' ? colors.error : colors.textSecondary} />
          <Text
            style={[
              styles.feedModeButtonText,
              { color: feedMode === 'trending' ? colors.text : colors.textSecondary },
              feedMode === 'trending' && styles.feedModeButtonTextActive,
            ]}
          >
            Trending
          </Text>
        </TouchableOpacity>
      </View>
      {feedMode === 'trending' && (
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                trendingCategory === 'for_you' && [styles.categoryChipActive, { backgroundColor: colors.primary }],
              ]}
              onPress={() => {
                setTrendingCategory('for_you');
                updateFilters({ category: 'for_you' });
              }}
            >
              <Flame size={16} color={trendingCategory === 'for_you' ? colors.textInverse : colors.text} />
              <Text style={[
                styles.categoryChipText,
                trendingCategory === 'for_you' && [styles.categoryChipTextActive, { color: colors.textInverse }],
              ]}>For You</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryChip,
                trendingCategory === 'global' && [styles.categoryChipActive, { backgroundColor: colors.primary }],
              ]}
              onPress={() => {
                setTrendingCategory('global');
                updateFilters({ category: 'global' });
              }}
            >
              <Globe size={16} color={trendingCategory === 'global' ? colors.textInverse : colors.text} />
              <Text style={[
                styles.categoryChipText,
                trendingCategory === 'global' && [styles.categoryChipTextActive, { color: colors.textInverse }],
              ]}>Global</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryChip,
                trendingCategory === 'local' && [styles.categoryChipActive, { backgroundColor: colors.primary }],
              ]}
              onPress={() => {
                setTrendingCategory('local');
                updateFilters({ category: 'local' });
              }}
            >
              <MapPinned size={16} color={trendingCategory === 'local' ? colors.textInverse : colors.text} />
              <Text style={[
                styles.categoryChipText,
                trendingCategory === 'local' && [styles.categoryChipTextActive, { color: colors.textInverse }],
              ]}>Local</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryChip,
                trendingCategory === 'music' && [styles.categoryChipActive, { backgroundColor: colors.primary }],
              ]}
              onPress={() => {
                setTrendingCategory('music');
                updateFilters({ category: 'music' });
              }}
            >
              <Music size={16} color={trendingCategory === 'music' ? colors.textInverse : colors.text} />
              <Text style={[
                styles.categoryChipText,
                trendingCategory === 'music' && [styles.categoryChipTextActive, { color: colors.textInverse }],
              ]}>Music</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryChip,
                trendingCategory === 'content' && [styles.categoryChipActive, { backgroundColor: colors.primary }],
              ]}
              onPress={() => {
                setTrendingCategory('content');
                updateFilters({ category: 'content' });
              }}
            >
              <Video size={16} color={trendingCategory === 'content' ? colors.textInverse : colors.text} />
              <Text style={[
                styles.categoryChipText,
                trendingCategory === 'content' && [styles.categoryChipTextActive, { color: colors.textInverse }],
              ]}>Content</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryChip,
                trendingCategory === 'events' && [styles.categoryChipActive, { backgroundColor: colors.primary }],
              ]}
              onPress={() => {
                setTrendingCategory('events');
                updateFilters({ category: 'events' });
              }}
            >
              <Calendar size={16} color={trendingCategory === 'events' ? colors.textInverse : colors.text} />
              <Text style={[
                styles.categoryChipText,
                trendingCategory === 'events' && [styles.categoryChipTextActive, { color: colors.textInverse }],
              ]}>Events</Text>
            </TouchableOpacity>
          </ScrollView>
          
          <View style={[styles.trendingHeader, { backgroundColor: colors.card }]}>
            <Text style={[styles.trendingHeaderTitle, { color: colors.text }]}>🔥 What&apos;s Happening</Text>
            <Text style={[styles.trendingHeaderSubtitle, { color: colors.textSecondary }]}>
              {trendingCategory === 'for_you' ? 'Personalized trending topics' : 
               trendingCategory === 'global' ? 'Worldwide trends' :
               trendingCategory === 'local' ? 'Trending near you' :
               trendingCategory === 'music' ? 'Trending music & artists' :
               trendingCategory === 'content' ? 'Viral content & videos' :
               'Upcoming & live events'}
            </Text>
          </View>
          
          {topics.slice(0, 5).map((item) => {
            const statusEmoji = item.status === 'breaking' ? '🔥' : item.status === 'peaking' ? '📈' : item.status === 'fading' ? '📉' : '⚡';
            const statusColor = item.status === 'breaking' ? colors.error : item.status === 'peaking' ? colors.success : colors.textSecondary;
            
            return (
              <TouchableOpacity 
                key={item.id}
                style={[styles.trendingItem, { backgroundColor: colors.card }]}
                onPress={() => {
                  if (item.hashtag) {
                    router.push(`/hashtag/${item.hashtag.slice(1)}`);
                  }
                }}
              >
                <View style={styles.trendingItemHeader}>
                  <View style={styles.trendingItemInfo}>
                    <View style={styles.trendingItemMeta}>
                      <MapPin size={12} color={colors.textSecondary} />
                      <Text style={[styles.trendingLocation, { color: colors.textSecondary }]}>{item.location}</Text>
                      <Text style={[styles.trendingCategory, { color: colors.textSecondary }]}>• {item.category}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusEmoji} {item.status}</Text>
                      </View>
                    </View>
                    <View style={styles.trendingItemTitle}>
                      <TrendingUp size={16} color={colors.primary} />
                      <Text style={[styles.trendingTitle, { color: colors.text }]}>{item.title}</Text>
                    </View>
                    {item.description && (
                      <Text style={[styles.trendingDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                    {item.hashtag && (
                      <View style={styles.hashtagContainer}>
                        <Hash size={14} color={colors.primary} />
                        <Text style={[styles.hashtag, { color: colors.primary }]}>{item.hashtag.slice(1)}</Text>
                      </View>
                    )}
                    <View style={styles.trendingStatsRow}>
                      <Text style={[styles.trendingStats, { color: colors.textSecondary }]}>
                        {item.posts.toLocaleString()} posts • {(item.engagement / 1000).toFixed(1)}K interactions
                      </Text>
                      <View style={styles.velocityBadge}>
                        <TrendingUp size={12} color={colors.primary} />
                        <Text style={[styles.velocityText, { color: colors.primary }]}>
                          {item.velocity.toFixed(1)}x
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          
          <TouchableOpacity 
            style={[styles.viewAllButton, { backgroundColor: colors.card }]}
            onPress={() => router.push('/trending')}
          >
            <Text style={[styles.viewAllButtonText, { color: colors.primary }]}>View All Trending Topics</Text>
            <TrendingUp size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  ), [stories, handleStoryPress, handleCreateStory, colors, feedMode, trendingCategory, topics, updateFilters]);

  const ListFooterComponent = useMemo(() => (
    displayPosts.length > 0 && feedMode === 'for_you' ? <CaughtUpMessage /> : null
  ), [displayPosts.length, feedMode]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {newPostsCount > 0 && (
        <NewPostsButton
          count={newPostsCount}
          onPress={handleLoadNewPosts}
          visible={showNewPostsButton && feedMode === 'for_you'}
        />
      )}
      <FlatList
        ref={flatListRef}
        data={displayPosts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            title="Pull to refresh"
            titleColor={colors.textSecondary}
          />
        }
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={5}
        windowSize={10}
      />
      <FloatingActionMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 100,
  },
  feedModeSelector: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 8,
  },
  feedModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  feedModeButtonActive: {
    borderBottomWidth: 2,
  },
  feedModeButtonText: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  feedModeButtonTextActive: {
    fontWeight: '700' as const,
  },
  trendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    gap: 8,
  },
  trendingBannerText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  trendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 6,
    gap: 6,
  },
  trendingIndicatorText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  categoryScroll: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#1DA1F2',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  categoryChipTextActive: {
    fontWeight: '600' as const,
  },
  trendingHeader: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  trendingHeaderTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  trendingHeaderSubtitle: {
    fontSize: 14,
  },
  trendingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  trendingItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trendingItemInfo: {
    flex: 1,
  },
  trendingItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trendingLocation: {
    fontSize: 12,
    marginLeft: 4,
  },
  trendingCategory: {
    fontSize: 12,
    textTransform: 'capitalize' as const,
    marginLeft: 4,
  },
  trendingItemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  hashtagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hashtag: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  trendingStats: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  trendingDescription: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  trendingStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  velocityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  velocityText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    gap: 8,
  },
  viewAllButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
