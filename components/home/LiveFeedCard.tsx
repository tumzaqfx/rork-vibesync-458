import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/theme-store';
import { router } from 'expo-router';
import { Eye, Radio } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LiveFeedCardProps {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  title: string;
  thumbnailUrl?: string;
  viewerCount: number;
  startedAt: Date;
}

export function LiveFeedCard({
  id,
  userId,
  username,
  displayName,
  avatar,
  title,
  thumbnailUrl,
  viewerCount,
  startedAt,
}: LiveFeedCardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    router.push(`/live/${id}`);
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getTimeSince = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
    
    if (diff < 60) return 'Just started';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.border }]}>
            <Radio size={48} color={colors.textSecondary} />
          </View>
        )}
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />

        <View style={styles.liveBadge}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        <View style={styles.viewerBadge}>
          <Eye size={14} color="#FFFFFF" />
          <Text style={styles.viewerText}>{formatViewerCount(viewerCount)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={[styles.displayName, { color: colors.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.username, { color: colors.textSecondary }]} numberOfLines={1}>
              @{username} • {getTimeSince()}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  viewerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  viewerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    fontSize: 13,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
});
