import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useProfileViews } from '@/hooks/profile-views-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ArrowLeft, Eye, Clock, TrendingUp, Users, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileView } from '@/types';

type TimeRange = 'day' | 'week' | 'month' | 'all';
type FilterType = 'all' | 'verified' | 'recent';

export default function ProfileViewsScreen() {
  const { user, isAuthenticated } = useAuth();
  const { getProfileViews, getProfileViewsCount } = useProfileViews();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated]);

  const views = useMemo(() => {
    if (!user) return [];
    return getProfileViews(user.id);
  }, [user, getProfileViews]);

  const filteredViews = useMemo(() => {
    let filtered = [...views];

    const now = Date.now();
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };

    filtered = filtered.filter(v => {
      const viewTime = new Date(v.timestamp).getTime();
      return now - viewTime <= timeRanges[timeRange];
    });

    if (filterType === 'verified') {
      filtered = filtered.filter(v => v.viewerIsVerified);
    } else if (filterType === 'recent') {
      const last24h = Date.now() - 24 * 60 * 60 * 1000;
      filtered = filtered.filter(v => new Date(v.timestamp).getTime() > last24h);
    }

    return filtered.filter(v => !v.isPrivateView);
  }, [views, timeRange, filterType]);

  const stats = useMemo(() => {
    if (!user) return { day: 0, week: 0, month: 0, all: 0 };
    return {
      day: getProfileViewsCount(user.id, 'day'),
      week: getProfileViewsCount(user.id, 'week'),
      month: getProfileViewsCount(user.id, 'month'),
      all: views.length,
    };
  }, [user, getProfileViewsCount, views]);

  const getTimeAgo = (timestamp: string): string => {
    const now = Date.now();
    const viewTime = new Date(timestamp).getTime();
    const diff = now - viewTime;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const handleViewerPress = (viewerId: string) => {
    router.push(`/user/${viewerId}`);
  };

  const renderViewItem = ({ item }: { item: ProfileView }) => (
    <TouchableOpacity
      style={styles.viewItem}
      onPress={() => handleViewerPress(item.viewerId)}
      activeOpacity={0.7}
    >
      <Avatar uri={item.viewerProfileImage} size={56} />
      <View style={styles.viewInfo}>
        <View style={styles.viewNameRow}>
          <Text style={styles.viewName} numberOfLines={1}>
            {item.viewerDisplayName}
          </Text>
          {item.viewerIsVerified && <VerifiedBadge size={16} />}
        </View>
        <Text style={styles.viewUsername} numberOfLines={1}>
          @{item.viewerUsername}
        </Text>
        <View style={styles.timeContainer}>
          <Clock size={12} color={Colors.textSecondary} />
          <Text style={styles.timeText}>{getTimeAgo(item.timestamp)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Stack.Screen
        options={{
          title: 'Profile Views',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text, fontWeight: '700' as const },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackButton}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View style={styles.statsSection}>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.15)', 'rgba(6, 182, 212, 0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsGradient}
          >
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Calendar size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statNumber}>{stats.day}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statNumber}>{stats.week}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Users size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statNumber}>{stats.month}</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Eye size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statNumber}>{stats.all}</Text>
                <Text style={styles.statLabel}>All Time</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.filtersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            <Text style={styles.filterLabel}>Time:</Text>
            {(['day', 'week', 'month', 'all'] as TimeRange[]).map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.filterChip,
                  timeRange === range && styles.filterChipActive,
                ]}
                onPress={() => setTimeRange(range)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    timeRange === range && styles.filterChipTextActive,
                  ]}
                >
                  {range === 'day' ? 'Today' : range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'All'}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.filterDivider} />

            <Text style={styles.filterLabel}>Filter:</Text>
            {(['all', 'verified', 'recent'] as FilterType[]).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  filterType === filter && styles.filterChipActive,
                ]}
                onPress={() => setFilterType(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterType === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter === 'all' ? 'All' : filter === 'verified' ? 'Verified' : 'Recent'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {filteredViews.length} {filteredViews.length === 1 ? 'View' : 'Views'}
            </Text>
            <Text style={styles.listSubtitle}>
              People who viewed your profile
            </Text>
          </View>

          {filteredViews.length > 0 ? (
            <View style={styles.viewsList}>
              {filteredViews.map((view) => (
                <View key={view.id}>
                  {renderViewItem({ item: view })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Eye size={48} color={Colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No views yet</Text>
              <Text style={styles.emptyText}>
                {timeRange === 'day'
                  ? 'No one has viewed your profile today'
                  : timeRange === 'week'
                  ? 'No one has viewed your profile this week'
                  : timeRange === 'month'
                  ? 'No one has viewed your profile this month'
                  : 'No one has viewed your profile yet'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBackButton: {
    marginLeft: 16,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    padding: 20,
  },
  statsGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500' as const,
  },
  filtersSection: {
    backgroundColor: Colors.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filtersContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600' as const,
    marginRight: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  filterChipTextActive: {
    color: Colors.text,
  },
  filterDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  listSection: {
    flex: 1,
    paddingTop: 20,
  },
  listHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  listSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  viewsList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  viewInfo: {
    flex: 1,
  },
  viewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  viewName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600' as const,
    flex: 1,
  },
  viewUsername: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
