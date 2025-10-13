import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar } from '@/components/ui/SearchBar';
import { UserCard } from '@/components/discover/UserCard';
import PeopleSuggestion from '@/components/discover/PeopleSuggestion';
import { mockUsers } from '@/mocks/users';
import { Colors } from '@/constants/colors';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';
import { TrendingHashtags } from '@/components/hashtag/TrendingHashtags';

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'people' | 'suggestions'>('suggestions');
  const [users] = useState(mockUsers);

  const handleFollowPress = (userId: string) => {
    console.log('Follow pressed for user:', userId);
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search people, music, vibes..."
        style={styles.searchBar}
      />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'suggestions' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('suggestions')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'suggestions' && styles.activeTabText,
            ]}
          >
            Suggestions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'people' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('people')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'people' && styles.activeTabText,
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'suggestions' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <TrendingHashtags />
          <PeopleSuggestion />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onFollowPress={handleFollowPress}
              onUserPress={handleUserPress}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : 'No users found'}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    margin: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  activeTabText: {
    color: Colors.text,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});