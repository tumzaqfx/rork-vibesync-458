import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Flame, Users, Clock, Search as SearchIcon, Plus, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { useSpill } from '@/hooks/spill-store';
import { Spill } from '@/types/spill';

export default function SpillsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { activeSpills, scheduledSpills, joinSpill } = useSpill();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'trending' | 'new' | 'scheduled'>('trending');

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredSpills = useMemo(() => {
    let spills = activeSpills.filter(s => s.isLive);

    if (searchQuery) {
      spills = spills.filter(s => 
        s.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.hostName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter === 'trending') {
      return spills.sort((a, b) => b.listenerCount - a.listenerCount);
    } else if (selectedFilter === 'new') {
      return spills.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    }

    return spills;
  }, [activeSpills, searchQuery, selectedFilter]);

  const handleJoinSpill = (spillId: string) => {
    joinSpill(spillId);
    router.push(`/spill/${spillId}`);
  };

  const handleStartSpill = () => {
    router.push('/spill/start');
  };

  const formatListenerCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const renderSpillCard = (spill: Spill) => {
    const isHot = spill.listenerCount > 1000;

    return (
      <TouchableOpacity
        key={spill.id}
        style={[styles.spillCard, { backgroundColor: colors.card }]}
        onPress={() => handleJoinSpill(spill.id)}
        activeOpacity={0.8}
      >
        <View style={styles.spillHeader}>
          <View style={styles.spillTitleRow}>
            {isHot && (
              <View style={[styles.hotBadge, { backgroundColor: colors.error }]}>
                <Flame size={12} color="#FFFFFF" />
              </View>
            )}
            <Text style={[styles.spillTopic, { color: colors.text }]} numberOfLines={1}>
              {spill.topicName}
            </Text>
          </View>
          <View style={[styles.liveIndicator, { backgroundColor: colors.error }]}>
            <View style={styles.livePulse} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.spillInfo}>
          <View style={styles.hostInfo}>
            <View style={[styles.hostAvatar, { backgroundColor: colors.border }]}>
              <Text style={[styles.hostInitial, { color: colors.text }]}>
                {spill.hostName[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.hostDetails}>
              <Text style={[styles.hostName, { color: colors.text }]} numberOfLines={1}>
                {spill.hostName}
              </Text>
              <Text style={[styles.spillTime, { color: colors.textSecondary }]}>
                Started {getTimeAgo(spill.startedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.spillStats}>
            <View style={styles.statItem}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.text }]}>
                {formatListenerCount(spill.listenerCount)}
              </Text>
            </View>
          </View>
        </View>

        {spill.cohosts.length > 0 && (
          <View style={styles.cohostsRow}>
            <Text style={[styles.cohostsLabel, { color: colors.textSecondary }]}>
              with {spill.cohosts.map(c => c.name).join(', ')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border, paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Spills</Text>
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={handleStartSpill}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <SearchIcon size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search spills..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'trending' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedFilter('trending')}
          >
            <TrendingUp size={16} color={selectedFilter === 'trending' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[
              styles.filterText,
              { color: selectedFilter === 'trending' ? '#FFFFFF' : colors.textSecondary }
            ]}>
              Trending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'new' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedFilter('new')}
          >
            <Flame size={16} color={selectedFilter === 'new' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[
              styles.filterText,
              { color: selectedFilter === 'new' ? '#FFFFFF' : colors.textSecondary }
            ]}>
              New
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'scheduled' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedFilter('scheduled')}
          >
            <Clock size={16} color={selectedFilter === 'scheduled' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[
              styles.filterText,
              { color: selectedFilter === 'scheduled' ? '#FFFFFF' : colors.textSecondary }
            ]}>
              Scheduled
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {selectedFilter === 'scheduled' ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Spills</Text>
            {scheduledSpills.length === 0 ? (
              <View style={styles.emptyState}>
                <Clock size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No scheduled spills yet
                </Text>
              </View>
            ) : (
              scheduledSpills.map((scheduled) => (
                <View
                  key={scheduled.id}
                  style={[styles.scheduledCard, { backgroundColor: colors.card }]}
                >
                  <View style={styles.scheduledHeader}>
                    <Text style={[styles.scheduledTopic, { color: colors.text }]}>
                      {scheduled.topicName}
                    </Text>
                    <View style={[styles.scheduledBadge, { backgroundColor: colors.primary + '20' }]}>
                      <Clock size={12} color={colors.primary} />
                      <Text style={[styles.scheduledBadgeText, { color: colors.primary }]}>
                        Scheduled
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.scheduledHost, { color: colors.textSecondary }]}>
                    Hosted by {scheduled.hostName}
                  </Text>
                  <Text style={[styles.scheduledTime, { color: colors.text }]}>
                    {scheduled.scheduledFor.toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.section}>
            {filteredSpills.length === 0 ? (
              <View style={styles.emptyState}>
                <Users size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {searchQuery ? 'No spills found' : 'No live spills right now'}
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  {searchQuery ? 'Try a different search' : 'Be the first to start one!'}
                </Text>
              </View>
            ) : (
              filteredSpills.map(renderSpillCard)
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  spillCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  spillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  spillTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  hotBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spillTopic: {
    fontSize: 18,
    fontWeight: '700' as const,
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  spillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostInitial: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  spillTime: {
    fontSize: 13,
  },
  spillStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  cohostsRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  cohostsLabel: {
    fontSize: 13,
    fontStyle: 'italic' as const,
  },
  scheduledCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  scheduledHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scheduledTopic: {
    fontSize: 17,
    fontWeight: '700' as const,
    flex: 1,
  },
  scheduledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  scheduledBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  scheduledHost: {
    fontSize: 14,
    marginBottom: 4,
  },
  scheduledTime: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
});
