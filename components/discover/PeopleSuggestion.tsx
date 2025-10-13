import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Users, Contact, Sparkles, ChevronDown, MoreVertical, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DiscoverySuggestion, DistanceFilter } from '@/types';
import { useDiscovery } from '@/hooks/discovery-store';
import { Avatar } from '@/components/ui/Avatar';
import { Colors } from '@/constants/colors';

const DISTANCE_FILTERS: { label: string; value: DistanceFilter }[] = [
  { label: '1km', value: '1km' },
  { label: '5km', value: '5km' },
  { label: '20km', value: '20km' },
  { label: 'City', value: 'city' },
];

export default function PeopleSuggestion() {
  const router = useRouter();
  const {
    distanceFilter,
    setDistanceFilter,
    getHybridSuggestions,
    syncContacts,
    isLoadingContacts,
    requestLocationPermission,
    requestContactsPermission,
  } = useDiscovery();

  const [suggestions, setSuggestions] = useState<DiscoverySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'proximity' | 'mutual' | 'contact'>('all');
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [showMenuForUser, setShowMenuForUser] = useState<string | null>(null);

  const loadSuggestions = useCallback(() => {
    setIsLoading(true);
    const results = getHybridSuggestions();
    setSuggestions(results);
    setIsLoading(false);
  }, [getHybridSuggestions]);

  const handleSyncContacts = async () => {
    await requestContactsPermission();
    await syncContacts();
    loadSuggestions();
  };

  const handleEnableLocation = async () => {
    await requestLocationPermission();
    loadSuggestions();
  };

  const filteredSuggestions = suggestions.filter((s) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'proximity') return s.primaryReason === 'proximity' || s.primaryReason === 'hybrid';
    if (activeTab === 'mutual') return s.primaryReason === 'mutual' || s.primaryReason === 'hybrid';
    if (activeTab === 'contact') return s.isContact;
    return true;
  });

  useEffect(() => {
    loadSuggestions();
  }, [distanceFilter, loadSuggestions]);

  const getPrimaryReasonText = (suggestion: DiscoverySuggestion): string => {
    if (suggestion.isContact) return 'From contacts';
    if (suggestion.distance) return `${suggestion.distance}km away`;
    if (suggestion.mutualCount) return `${suggestion.mutualCount} mutual`;
    return 'Suggested for you';
  };

  const getMutualText = (suggestion: DiscoverySuggestion): string | null => {
    if (suggestion.metadata.mutualFollowers && suggestion.metadata.mutualFollowers.length > 0) {
      const first = suggestion.metadata.mutualFollowers[0].displayName;
      if (suggestion.mutualCount && suggestion.mutualCount > 1) {
        const second = suggestion.metadata.mutualFollowers[1]?.displayName;
        if (second) {
          return `Followed by ${first} and ${second}`;
        }
        return `Followed by ${first} and ${suggestion.mutualCount - 1} other${suggestion.mutualCount - 1 > 1 ? 's' : ''}`;
      }
      return `Followed by ${first}`;
    }
    return null;
  };

  const handleFollowToggle = (userId: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleMenuAction = (userId: string, action: 'hide' | 'report') => {
    console.log(`${action} user:`, userId);
    setShowMenuForUser(null);
    if (action === 'hide') {
      setSuggestions(prev => prev.filter(s => s.user.id !== userId));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover People</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
          <ChevronDown size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Distance</Text>
            <View style={styles.filterOptions}>
              {DISTANCE_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={[
                    styles.filterChip,
                    distanceFilter === filter.value && styles.filterChipActive,
                  ]}
                  onPress={() => setDistanceFilter(filter.value)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      distanceFilter === filter.value && styles.filterChipTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEnableLocation}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Enable Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSyncContacts}
              disabled={isLoadingContacts}
            >
              {isLoadingContacts ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Contact size={16} color={Colors.primary} />
              )}
              <Text style={styles.actionButtonText}>Sync Contacts</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'proximity' && styles.tabActive]}
          onPress={() => setActiveTab('proximity')}
        >
          <MapPin size={14} color={activeTab === 'proximity' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'proximity' && styles.tabTextActive]}>
            Nearby
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mutual' && styles.tabActive]}
          onPress={() => setActiveTab('mutual')}
        >
          <Users size={14} color={activeTab === 'mutual' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'mutual' && styles.tabTextActive]}>
            Mutual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && styles.tabActive]}
          onPress={() => setActiveTab('contact')}
        >
          <Contact size={14} color={activeTab === 'contact' ? Colors.success : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'contact' && styles.tabTextActive]}>
            Contacts
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.suggestionsList} showsVerticalScrollIndicator={false}>
          {filteredSuggestions.map((suggestion, index) => {
            const isFollowed = followedUsers.has(suggestion.user.id);
            const mutualText = getMutualText(suggestion);
            
            return (
              <View key={suggestion.user.id}>
                <TouchableOpacity
                  style={styles.suggestionRow}
                  onPress={() => router.push(`/user/${suggestion.user.id}`)}
                  activeOpacity={0.7}
                >
                  <Avatar
                    source={suggestion.user.profileImage}
                    size={50}
                  />
                  
                  <View style={styles.userInfoColumn}>
                    <View style={styles.nameRowCompact}>
                      <Text style={styles.displayNameCompact} numberOfLines={1}>
                        {suggestion.user.displayName}
                      </Text>
                      {suggestion.user.isVerified && (
                        <View style={styles.verifiedBadgeContainer}>
                          <Check size={10} color={Colors.text} strokeWidth={3} />
                        </View>
                      )}
                    </View>
                    <Text style={styles.suggestionInfo} numberOfLines={1}>
                      {mutualText || getPrimaryReasonText(suggestion)}
                    </Text>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[
                        styles.followButtonCompact,
                        isFollowed && styles.followingButton
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(suggestion.user.id);
                      }}
                      activeOpacity={0.8}
                    >
                      {isFollowed ? (
                        <View style={styles.followingButtonContent}>
                          <Text style={styles.followingButtonText}>Following</Text>
                        </View>
                      ) : (
                        <LinearGradient
                          colors={['#667eea', '#764ba2']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.followButtonGradientCompact}
                        >
                          <Text style={styles.followButtonTextCompact}>Follow</Text>
                        </LinearGradient>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        setShowMenuForUser(showMenuForUser === suggestion.user.id ? null : suggestion.user.id);
                      }}
                    >
                      <MoreVertical size={18} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {showMenuForUser === suggestion.user.id && (
                  <View style={styles.menuDropdown}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleMenuAction(suggestion.user.id, 'hide')}
                    >
                      <Text style={styles.menuItemText}>Hide suggestion</Text>
                    </TouchableOpacity>
                    <View style={styles.menuDivider} />
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleMenuAction(suggestion.user.id, 'report')}
                    >
                      <Text style={[styles.menuItemText, styles.menuItemDanger]}>Report user</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {index < filteredSuggestions.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
          {filteredSuggestions.length === 0 && (
            <View style={styles.emptyState}>
              <Sparkles size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No suggestions found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters or sync contacts</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.card,
    borderRadius: 16,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  filtersContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  filterChipTextActive: {
    color: Colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  tabTextActive: {
    color: Colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  userInfoColumn: {
    flex: 1,
    gap: 2,
  },
  nameRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  displayNameCompact: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  verifiedBadgeContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionInfo: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  followButtonCompact: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  followButtonGradientCompact: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  followButtonTextCompact: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  followingButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  followingButtonContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  followingButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  menuButton: {
    padding: 4,
  },
  menuDropdown: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  menuItemDanger: {
    color: Colors.error,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 78,
    opacity: 0.1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
