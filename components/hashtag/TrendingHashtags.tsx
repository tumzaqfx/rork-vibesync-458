import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';
import { Hash, TrendingUp } from 'lucide-react-native';

interface TrendingHashtag {
  tag: string;
  count: number;
  trending: boolean;
}

const mockTrendingHashtags: TrendingHashtag[] = [
  { tag: 'vibesync', count: 12500, trending: true },
  { tag: 'music', count: 8900, trending: true },
  { tag: 'art', count: 7200, trending: false },
  { tag: 'photography', count: 6800, trending: true },
  { tag: 'travel', count: 5400, trending: false },
  { tag: 'food', count: 4900, trending: false },
  { tag: 'fitness', count: 4200, trending: true },
  { tag: 'fashion', count: 3800, trending: false },
];

export const TrendingHashtags: React.FC = () => {
  const { colors } = useTheme();

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  const handleHashtagPress = (tag: string) => {
    router.push(`/hashtag/${tag}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={20} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Trending Hashtags</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mockTrendingHashtags.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.hashtagCard,
              { backgroundColor: colors.cardLight, borderColor: colors.border }
            ]}
            onPress={() => handleHashtagPress(item.tag)}
          >
            <View style={styles.hashtagHeader}>
              <View style={[styles.hashtagIcon, { backgroundColor: 'rgba(135, 206, 235, 0.15)' }]}>
                <Hash size={18} color="#87CEEB" />
              </View>
              {item.trending && (
                <View style={styles.trendingBadge}>
                  <TrendingUp size={12} color="#FF6B6B" />
                </View>
              )}
            </View>
            <Text style={[styles.hashtagTag, { color: '#87CEEB' }]}>#{item.tag}</Text>
            <Text style={[styles.hashtagCount, { color: colors.textSecondary }]}>
              {formatCount(item.count)} posts
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  hashtagCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  hashtagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  hashtagIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hashtagTag: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  hashtagCount: {
    fontSize: 12,
    fontWeight: '500',
  },
});
