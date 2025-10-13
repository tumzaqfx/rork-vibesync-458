import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TrendingTopic } from '@/types';
import { Flame } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface BreakingBannerProps {
  topics: TrendingTopic[];
  onTopicPress: (topic: TrendingTopic) => void;
}

export const BreakingBanner: React.FC<BreakingBannerProps> = ({
  topics,
  onTopicPress,
}) => {
  if (topics.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Flame size={16} color="#FF4444" />
        <Text style={styles.headerText}>Breaking Now</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.card}
            onPress={() => onTopicPress(topic)}
            activeOpacity={0.7}
          >
            <Text style={styles.title} numberOfLines={2}>
              {topic.title}
            </Text>
            {topic.hashtag && (
              <Text style={styles.hashtag} numberOfLines={1}>
                {topic.hashtag}
              </Text>
            )}
            <View style={styles.stats}>
              <Text style={styles.statText}>
                {(topic.posts / 1000).toFixed(1)}K posts
              </Text>
              <Text style={styles.velocity}>
                +{topic.velocity.toFixed(0)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FF4444',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 200,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  title: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  hashtag: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  velocity: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#FF4444',
  },
});
