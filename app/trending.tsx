import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTrending } from '@/hooks/trending-store';
import { TrendCard } from '@/components/trending/TrendCard';
import { CategoryTabs } from '@/components/trending/CategoryTabs';
import { BreakingBanner } from '@/components/trending/BreakingBanner';
import { NewTrendsButton } from '@/components/trending/NewTrendsButton';
import { LocationToggle } from '@/components/trending/LocationToggle';
import { TrendingTopic, TrendingFilters } from '@/types';
import { Colors } from '@/constants/colors';
import { Clock, TrendingUp } from 'lucide-react-native';

export default function TrendingScreen() {
  const router = useRouter();
  const {
    topics,
    filters,
    updateFilters,
    refreshTrending,
    loadNewTrends,
    isRefreshing,
    newTrendsCount,
    hasNewTrends,
    getBreakingTopics,
    lastRefresh,
  } = useTrending();

  const breakingTopics = getBreakingTopics();
  const listRef = useRef<FlatList>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hasNewTrends) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [hasNewTrends, pulseAnim]);

  const handleLoadNewTrends = async () => {
    await loadNewTrends();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleLocationChange = (location: string) => {
    console.log('Location changed:', location);
    updateFilters({ location });
  };

  const handleCategoryChange = (category: TrendingFilters['category']) => {
    console.log('Category changed:', category);
    updateFilters({ category });
  };

  const handleTopicPress = (topic: TrendingTopic) => {
    console.log('Topic pressed:', topic.title);
    router.push(`/hashtag/${encodeURIComponent(topic.hashtag || topic.title)}`);
  };

  const formatLastRefresh = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerInfo}>
        <View style={styles.headerLeft}>
          <TrendingUp size={20} color={Colors.primary} />
          <Text style={styles.headerTitle}>Trending Topics</Text>
        </View>
        <LocationToggle
          currentLocation={filters.location || 'global'}
          onLocationChange={handleLocationChange}
        />
      </View>
      
      <View style={styles.subHeader}>
        <View style={styles.lastRefresh}>
          <Clock size={14} color={Colors.textSecondary} />
          <Text style={styles.lastRefreshText}>{formatLastRefresh()}</Text>
        </View>
      </View>

      {breakingTopics.length > 0 && (
        <BreakingBanner topics={breakingTopics} onTopicPress={handleTopicPress} />
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{topics.length}</Text>
          <Text style={styles.statLabel}>Active Topics</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{breakingTopics.length}</Text>
          <Text style={styles.statLabel}>Breaking</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {topics.filter((t) => t.status === 'peaking').length}
          </Text>
          <Text style={styles.statLabel}>Peaking</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        {filters.category === 'for_you'
          ? 'Personalized For You'
          : `${filters.category?.charAt(0).toUpperCase()}${filters.category?.slice(1)} Trends`}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <TrendingUp size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Trending Topics</Text>
      <Text style={styles.emptyDescription}>
        Check back later for trending content in this category
      </Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => refreshTrending(true)}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Trending',
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />

      <CategoryTabs
        activeCategory={filters.category || 'for_you'}
        onCategoryChange={handleCategoryChange}
      />

      <View style={styles.listContainer}>
        <NewTrendsButton
          count={newTrendsCount}
          onPress={handleLoadNewTrends}
          visible={hasNewTrends}
        />

        <FlatList
          ref={listRef}
          data={topics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrendCard topic={item} onPress={handleTopicPress} />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => refreshTrending(true)}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  subHeader: {
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  lastRefresh: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastRefreshText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
