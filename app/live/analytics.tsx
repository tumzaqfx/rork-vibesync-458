import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Users, Heart, MessageCircle, Share2, UserPlus, TrendingUp } from 'lucide-react-native';
import { LiveAnalytics } from '@/types/live';
import { Colors } from '@/constants/colors';

export default function LiveAnalyticsScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  
  let analytics: LiveAnalytics | null = null;
  try {
    analytics = data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to parse analytics:', error);
  }

  if (!analytics) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Analytics not available</Text>
      </View>
    );
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatWatchTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes}m`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Analytics</Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          style={styles.closeButton}
          testID="close-button"
        >
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Great job! 🎉</Text>
          <Text style={styles.summarySubtitle}>
            Your live session has ended
          </Text>
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Duration</Text>
            <Text style={styles.durationValue}>
              {formatDuration(analytics.duration)}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{analytics.peakViewers}</Text>
            <Text style={styles.statLabel}>Peak Viewers</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{analytics.totalViews}</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Heart size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{analytics.likeCount}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MessageCircle size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{analytics.commentCount}</Text>
            <Text style={styles.statLabel}>Comments</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Share2 size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{analytics.shareCount}</Text>
            <Text style={styles.statLabel}>Shares</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <UserPlus size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{analytics.newFollowers}</Text>
            <Text style={styles.statLabel}>New Followers</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={Colors.text} />
            <Text style={styles.sectionTitle}>Engagement</Text>
          </View>
          <View style={styles.engagementCard}>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Engagement Rate</Text>
              <Text style={styles.engagementValue}>
                {(analytics.engagementRate * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Avg. Watch Time</Text>
              <Text style={styles.engagementValue}>
                {formatWatchTime(analytics.averageWatchTime)}
              </Text>
            </View>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Unique Viewers</Text>
              <Text style={styles.engagementValue}>
                {analytics.uniqueViewers}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.primaryButtonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => console.log('Share analytics')}
          >
            <Share2 size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  durationValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  engagementCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  engagementLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  engagementValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
});
