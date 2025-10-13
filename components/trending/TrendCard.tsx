import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { TrendingTopic } from '@/types';
import { TrendingUp, Music, Video, Calendar, MapPin, Globe } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { HeatMeter } from './HeatMeter';

interface TrendCardProps {
  topic: TrendingTopic;
  onPress: (topic: TrendingTopic) => void;
}

const getCategoryIcon = (category: TrendingTopic['category']) => {
  switch (category) {
    case 'music':
      return Music;
    case 'content':
      return Video;
    case 'events':
      return Calendar;
    case 'local':
      return MapPin;
    case 'global':
      return Globe;
    default:
      return TrendingUp;
  }
};

const getCategoryColor = (category: TrendingTopic['category']) => {
  switch (category) {
    case 'music':
      return '#FF6B9D';
    case 'content':
      return '#C77DFF';
    case 'events':
      return '#FFA500';
    case 'local':
      return '#4ECDC4';
    case 'global':
      return '#3B82F6';
    default:
      return Colors.primary;
  }
};

const getStatusBadge = (status: TrendingTopic['status']) => {
  switch (status) {
    case 'breaking':
      return { text: '🔥 Breaking', color: '#FF4444' };
    case 'peaking':
      return { text: '📈 Peaking', color: '#FFA500' };
    case 'fading':
      return { text: '📉 Fading', color: '#888' };
    case 'stable':
      return { text: '✨ Stable', color: '#4ECDC4' };
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const TrendCard: React.FC<TrendCardProps> = ({ topic, onPress }) => {
  const CategoryIcon = getCategoryIcon(topic.category);
  const categoryColor = getCategoryColor(topic.category);
  const statusBadge = getStatusBadge(topic.status);
  
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    if (topic.status === 'breaking') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [slideAnim, fadeAnim, borderAnim, topic.status]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, '#FF4444'],
  });

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.container,
          topic.status === 'breaking' && {
            borderColor: borderColor as any,
            borderWidth: 2,
          },
        ]}
        onPress={() => onPress(topic)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
            <CategoryIcon size={20} color={categoryColor} />
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: statusBadge.color + '20' }]}>
              <Text style={[styles.statusText, { color: statusBadge.color }]}>
                {statusBadge.text}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {topic.title}
          </Text>
          {topic.hashtag && (
            <Text style={[styles.hashtag, { color: categoryColor }]}>
              {topic.hashtag}
            </Text>
          )}
          {topic.description && (
            <Text style={styles.description} numberOfLines={2}>
              {topic.description}
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <Text style={styles.statText}>
              {formatNumber(topic.posts)} posts
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.statText}>
              +{topic.velocity.toFixed(1)}% velocity
            </Text>
          </View>
          <View style={styles.rightFooter}>
            <HeatMeter velocity={topic.velocity} status={topic.status} />
            {topic.location && (
              <View style={styles.location}>
                <MapPin size={12} color={Colors.textSecondary} />
                <Text style={styles.locationText}>{topic.location}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.scoreBar}>
          <View
            style={[
              styles.scoreBarFill,
              {
                width: `${topic.trendingScore}%`,
                backgroundColor: categoryColor,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  hashtag: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  separator: {
    marginHorizontal: 8,
    color: Colors.textSecondary,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scoreBar: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
