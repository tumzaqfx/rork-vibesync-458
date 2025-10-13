import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useTheme } from '@/hooks/theme-store';
import { useDiscovery } from '@/hooks/discovery-store';
import { router } from 'expo-router';
import { MapPin, Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const CARD_WIDTH = 140;
const CARD_SPACING = 12;

interface SuggestedFriendsRowProps {
  maxSuggestions?: number;
}

export const SuggestedFriendsRow: React.FC<SuggestedFriendsRowProps> = ({ maxSuggestions = 10 }) => {
  const { colors } = useTheme();
  const { getHybridSuggestions } = useDiscovery();
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    return getHybridSuggestions().slice(0, maxSuggestions);
  }, [getHybridSuggestions, maxSuggestions]);

  const handleFollow = useCallback((userId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/user/${userId}`);
  }, []);

  const getReasonLabel = useCallback((suggestion: any) => {
    if (suggestion.isContact) {
      return 'From Contacts';
    }
    if (suggestion.distance && suggestion.mutualCount) {
      return `${suggestion.distance}km • ${suggestion.mutualCount} mutuals`;
    }
    if (suggestion.distance) {
      return `${suggestion.distance}km away`;
    }
    if (suggestion.mutualCount) {
      return `${suggestion.mutualCount} mutual${suggestion.mutualCount > 1 ? 's' : ''}`;
    }
    return 'Suggested for you';
  }, []);

  const getSuggestionTypeLabel = useCallback(() => {
    const types = new Set(suggestions.map(s => s.primaryReason));
    if (types.has('contact')) return 'Contacts on VibeSync';
    if (types.has('proximity') && types.has('mutual')) return 'Nearby Vibes • Mutuals';
    if (types.has('proximity')) return 'Nearby Vibes';
    if (types.has('mutual')) return 'Mutual Connections';
    return 'Suggested for You';
  }, [suggestions]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Suggested Friends</Text>
          <View style={styles.headerBadge}>
            {suggestions.some(s => s.primaryReason === 'proximity') && (
              <MapPin size={12} color={colors.primary} />
            )}
            {suggestions.some(s => s.primaryReason === 'mutual') && (
              <Users size={12} color={colors.primary} />
            )}
            <Text style={[styles.headerBadgeText, { color: colors.primary }]}>
              {getSuggestionTypeLabel()}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
      >
        {suggestions.map((suggestion, index) => {
          const isFollowed = followedUsers.has(suggestion.user.id);
          
          return (
            <TouchableOpacity
              key={suggestion.user.id}
              style={[
                styles.card,
                { backgroundColor: colors.card },
                index === 0 && styles.firstCard,
              ]}
              onPress={() => handleUserPress(suggestion.user.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={styles.avatarContainer}>
                  <Avatar uri={suggestion.user.profileImage} size={80} />
                  {suggestion.user.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <VerifiedBadge size={16} />
                    </View>
                  )}
                </View>

                <View style={styles.userInfo}>
                  <Text
                    style={[styles.displayName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {suggestion.user.displayName}
                  </Text>
                  <Text
                    style={[styles.username, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    @{suggestion.user.username}
                  </Text>
                </View>

                <View style={[styles.reasonBadge, { backgroundColor: colors.background }]}>
                  <Text
                    style={[styles.reasonText, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {getReasonLabel(suggestion)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleFollow(suggestion.user.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isFollowed ? [colors.card, colors.card] : ['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.followButtonGradient,
                      isFollowed && { borderWidth: 1, borderColor: colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.followButtonText,
                        { color: isFollowed ? colors.text : '#FFFFFF' },
                      ]}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: CARD_SPACING,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  firstCard: {
    marginLeft: 0,
  },
  cardContent: {
    padding: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  displayName: {
    fontSize: 14,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  username: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  reasonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  reasonText: {
    fontSize: 10,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  followButton: {
    width: '100%',
  },
  followButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
});
