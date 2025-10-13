import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';
import { User } from '@/types';

export default function FollowersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, user: currentUser } = useAuth();
  const [followers, setFollowers] = useState<User[]>([]);
  const [filteredFollowers, setFilteredFollowers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    const mockFollowers = mockUsers.filter(u => u.id !== id);
    setFollowers(mockFollowers);
    setFilteredFollowers(mockFollowers);

    const initialStatus: Record<string, boolean> = {};
    mockFollowers.forEach(user => {
      initialStatus[user.id] = Math.random() > 0.5;
    });
    setFollowingStatus(initialStatus);
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFollowers(followers);
    } else {
      const filtered = followers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFollowers(filtered);
    }
  }, [searchQuery, followers]);

  const handleFollowToggle = (userId: string) => {
    setFollowingStatus(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const renderFollower = ({ item }: { item: User }) => {
    const isFollowing = followingStatus[item.id];
    const isSelf = currentUser?.id === item.id;
    
    const mutualFollowers = mockUsers.slice(0, Math.floor(Math.random() * 3) + 1);
    const mutualCount = mutualFollowers.length;

    return (
      <TouchableOpacity
        style={styles.followerItem}
        onPress={() => handleUserPress(item.id)}
      >
        <Avatar uri={item.profileImage} size={48} />
        <View style={styles.followerInfo}>
          <View style={styles.followerNameRow}>
            <Text style={styles.followerDisplayName}>{item.displayName}</Text>
            {item.isVerified && <VerifiedBadge size={16} />}
          </View>
          <Text style={styles.followerUsername}>@{item.username}</Text>
          {mutualCount > 0 && (
            <Text style={styles.mutualText}>
              Followed by {mutualFollowers[0].username}
              {mutualCount > 1 && ` & ${mutualCount - 1} other${mutualCount > 2 ? 's' : ''}`}
            </Text>
          )}
        </View>
        {!isSelf && (
          <Button
            title={isFollowing ? 'Following' : 'Follow'}
            onPress={() => handleFollowToggle(item.id)}
            style={[
              styles.followButton,
              isFollowing && styles.followingButton
            ]}
            textStyle={[
              styles.followButtonText,
              isFollowing && styles.followingButtonText
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Followers',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackButton}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search followers..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredFollowers}
        keyExtractor={(item) => item.id}
        renderItem={renderFollower}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No followers found' : 'No followers yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBackButton: {
    marginLeft: 16,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  listContent: {
    paddingVertical: 8,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  followerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  followerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  followerDisplayName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  followerUsername: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 2,
  },
  mutualText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 100,
  },
  followingButton: {
    backgroundColor: Colors.cardLight,
  },
  followButtonText: {
    fontSize: 14,
  },
  followingButtonText: {
    color: Colors.text,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
