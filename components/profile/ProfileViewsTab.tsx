import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Eye, EyeOff, Clock, Repeat, TrendingUp, Info, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileViews } from '@/hooks/profile-views-store';
import { useAuth } from '@/hooks/auth-store';

interface ProfileViewsTabProps {
  userId: string;
}

export const ProfileViewsTab: React.FC<ProfileViewsTabProps> = ({ userId }) => {
  const { user } = useAuth();
  const {
    getProfileViews,
    getProfileViewsCount,
    isProfileViewsEnabled,
    toggleProfileViewsEnabled,
    getRepeatVisitorCount,
    getTopRepeatVisitors,
  } = useProfileViews();

  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const isOwner = user?.id === userId;
  const viewsEnabled = isProfileViewsEnabled(userId);

  const views = useMemo(() => {
    return getProfileViews(userId);
  }, [userId, getProfileViews]);

  const filteredViews = useMemo(() => {
    const now = Date.now();
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };

    return views.filter(v => {
      const viewTime = new Date(v.timestamp).getTime();
      return now - viewTime <= timeRanges[timeRange] && !v.isPrivateView;
    });
  }, [views, timeRange]);

  const stats = useMemo(() => {
    return {
      day: getProfileViewsCount(userId, 'day'),
      week: getProfileViewsCount(userId, 'week'),
      month: getProfileViewsCount(userId, 'month'),
      all: views.length,
    };
  }, [userId, getProfileViewsCount, views]);

  const topRepeatVisitors = useMemo(() => {
    return getTopRepeatVisitors(userId, 3);
  }, [userId, getTopRepeatVisitors]);

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

  const handleToggleViews = async (value: boolean) => {
    if (isOwner) {
      await toggleProfileViewsEnabled(userId, value);
    }
  };

  const handleViewAll = () => {
    router.push('/profile-views');
  };

  if (!isOwner) {
    return (
      <View style={styles.container}>
        <View style={styles.privateContainer}>
          <View style={styles.privateIconContainer}>
            <EyeOff size={48} color={Colors.textSecondary} />
          </View>
          <Text style={styles.privateTitle}>Profile Views are Private</Text>
          <Text style={styles.privateText}>
            Only the profile owner can see who viewed their profile
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.toggleSection}>
        <LinearGradient
          colors={viewsEnabled 
            ? ['rgba(59, 130, 246, 0.15)', 'rgba(6, 182, 212, 0.15)']
            : ['rgba(107, 114, 128, 0.15)', 'rgba(75, 85, 99, 0.15)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.toggleCard}
        >
          <View style={styles.toggleHeader}>
            <View style={styles.toggleIconContainer}>
              {viewsEnabled ? (
                <Eye size={24} color={Colors.primary} />
              ) : (
                <EyeOff size={24} color={Colors.textSecondary} />
              )}
            </View>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Show My Profile Visits</Text>
              <Text style={styles.toggleSubtitle}>
                {viewsEnabled
                  ? 'Your visits are visible to others'
                  : 'Your visits are hidden from others'}
              </Text>
            </View>
            <Switch
              value={viewsEnabled}
              onValueChange={handleToggleViews}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.text}
              ios_backgroundColor={Colors.border}
            />
          </View>

          <View style={styles.infoBox}>
            <Info size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              Turning this OFF hides your visits, but you won&apos;t see who visited your profile either
            </Text>
          </View>
        </LinearGradient>
      </View>

      {!viewsEnabled ? (
        <View style={styles.disabledContainer}>
          <View style={styles.disabledIconContainer}>
            <EyeOff size={48} color={Colors.textSecondary} />
          </View>
          <Text style={styles.disabledTitle}>Profile Views Disabled</Text>
          <Text style={styles.disabledText}>
            Enable profile views to see who visited your profile and let others see when you visit theirs
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <TouchableOpacity
                style={[styles.statCard, timeRange === 'day' && styles.statCardActive]}
                onPress={() => setTimeRange('day')}
                activeOpacity={0.7}
              >
                <Text style={[styles.statNumber, timeRange === 'day' && styles.statNumberActive]}>
                  {stats.day}
                </Text>
                <Text style={[styles.statLabel, timeRange === 'day' && styles.statLabelActive]}>
                  Today
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, timeRange === 'week' && styles.statCardActive]}
                onPress={() => setTimeRange('week')}
                activeOpacity={0.7}
              >
                <Text style={[styles.statNumber, timeRange === 'week' && styles.statNumberActive]}>
                  {stats.week}
                </Text>
                <Text style={[styles.statLabel, timeRange === 'week' && styles.statLabelActive]}>
                  This Week
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, timeRange === 'month' && styles.statCardActive]}
                onPress={() => setTimeRange('month')}
                activeOpacity={0.7}
              >
                <Text style={[styles.statNumber, timeRange === 'month' && styles.statNumberActive]}>
                  {stats.month}
                </Text>
                <Text style={[styles.statLabel, timeRange === 'month' && styles.statLabelActive]}>
                  This Month
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, timeRange === 'all' && styles.statCardActive]}
                onPress={() => setTimeRange('all')}
                activeOpacity={0.7}
              >
                <Text style={[styles.statNumber, timeRange === 'all' && styles.statNumberActive]}>
                  {stats.all}
                </Text>
                <Text style={[styles.statLabel, timeRange === 'all' && styles.statLabelActive]}>
                  All Time
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {topRepeatVisitors.length > 0 && (
            <View style={styles.repeatSection}>
              <View style={styles.sectionHeader}>
                <Repeat size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Top Repeat Visitors</Text>
              </View>
              <View style={styles.repeatList}>
                {topRepeatVisitors.map((visitor) => {
                  const view = views.find(v => v.viewerId === visitor.viewerId);
                  if (!view) return null;

                  return (
                    <TouchableOpacity
                      key={visitor.viewerId}
                      style={styles.repeatItem}
                      onPress={() => handleViewerPress(visitor.viewerId)}
                      activeOpacity={0.7}
                    >
                      <Avatar uri={view.viewerProfileImage} size={48} />
                      <View style={styles.repeatInfo}>
                        <View style={styles.repeatNameRow}>
                          <Text style={styles.repeatName} numberOfLines={1}>
                            {view.viewerDisplayName}
                          </Text>
                          {view.viewerIsVerified && <VerifiedBadge size={16} />}
                        </View>
                        <Text style={styles.repeatUsername} numberOfLines={1}>
                          @{view.viewerUsername}
                        </Text>
                      </View>
                      <View style={styles.repeatBadge}>
                        <Repeat size={14} color={Colors.primary} />
                        <Text style={styles.repeatCount}>{visitor.count}x</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <View style={styles.listHeaderLeft}>
                <TrendingUp size={20} color={Colors.primary} />
                <Text style={styles.listTitle}>
                  {filteredViews.length} {filteredViews.length === 1 ? 'View' : 'Views'}
                </Text>
              </View>
              {filteredViews.length > 5 && (
                <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <ChevronRight size={16} color={Colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {filteredViews.length > 0 ? (
              <View style={styles.viewsList}>
                {filteredViews.slice(0, 10).map((view) => {
                  const repeatCount = getRepeatVisitorCount(userId, view.viewerId);

                  return (
                    <TouchableOpacity
                      key={view.id}
                      style={styles.viewItem}
                      onPress={() => handleViewerPress(view.viewerId)}
                      activeOpacity={0.7}
                    >
                      <Avatar uri={view.viewerProfileImage} size={56} />
                      <View style={styles.viewInfo}>
                        <View style={styles.viewNameRow}>
                          <Text style={styles.viewName} numberOfLines={1}>
                            {view.viewerDisplayName}
                          </Text>
                          {view.viewerIsVerified && <VerifiedBadge size={16} />}
                        </View>
                        <Text style={styles.viewUsername} numberOfLines={1}>
                          @{view.viewerUsername}
                        </Text>
                        <View style={styles.viewMetaRow}>
                          <Clock size={12} color={Colors.textSecondary} />
                          <Text style={styles.viewTime}>{getTimeAgo(view.timestamp)}</Text>
                          {repeatCount > 1 && (
                            <>
                              <View style={styles.metaDivider} />
                              <Repeat size={12} color={Colors.primary} />
                              <Text style={styles.repeatText}>Visited {repeatCount}x</Text>
                            </>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
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
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  toggleSection: {
    padding: 20,
  },
  toggleCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  toggleSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  privateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  privateIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  privateTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  privateText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  disabledContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  disabledIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  statCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statNumber: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statNumberActive: {
    color: Colors.text,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500' as const,
  },
  statLabelActive: {
    color: Colors.text,
  },
  repeatSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  repeatList: {
    gap: 12,
  },
  repeatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  repeatInfo: {
    flex: 1,
  },
  repeatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  repeatName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600' as const,
    flex: 1,
  },
  repeatUsername: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  repeatCount: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  listSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  viewsList: {
    gap: 12,
  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
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
    marginBottom: 6,
  },
  viewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewTime: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textSecondary,
    marginHorizontal: 4,
  },
  repeatText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600' as const,
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
