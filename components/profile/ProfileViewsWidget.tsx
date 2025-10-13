import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Eye, TrendingUp } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileViewsWidgetProps {
  viewsCount: number;
  timeRange?: 'day' | 'week' | 'month';
  trend?: 'up' | 'down' | 'neutral';
  trendPercentage?: number;
}

export const ProfileViewsWidget: React.FC<ProfileViewsWidgetProps> = ({
  viewsCount,
  timeRange = 'week',
  trend = 'neutral',
  trendPercentage = 0,
}) => {
  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'day':
        return 'today';
      case 'week':
        return 'this week';
      case 'month':
        return 'this month';
      default:
        return 'this week';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return Colors.success;
      case 'down':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const handlePress = () => {
    router.push('/profile-views');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.1)', 'rgba(6, 182, 212, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <Eye size={24} color={Colors.primary} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.count}>{viewsCount}</Text>
            {trendPercentage > 0 && (
              <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor()}20` }]}>
                <TrendingUp size={12} color={getTrendColor()} />
                <Text style={[styles.trendText, { color: getTrendColor() }]}>
                  {trendPercentage}%
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.label}>Profile views {getTimeRangeText()}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  count: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700' as const,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
