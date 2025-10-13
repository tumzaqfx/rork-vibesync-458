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

export default function FollowingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, user: currentUser } = useAuth();
  const [following, setFollowing] = useState<User[]>([]);
  const [filteredFollowing, setFilteredFollowing] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    const mockFollowing = mockUsers.filter(u => u.id !== id);
    setFollowing(mockFollowing);
    setFilteredFollowing(mockFollowing);

    const initialStatus: Record<string, boolean> = {};
    mockFollowing.forEach(user => {
      initialStatus[user.id] = true;
    });
    setFollowingStatus(initialStatus);
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFollowing(following);
    } else {
      const filtered = following.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFollowing(filtered);
    }
  }, [searchQuery, following]);

  const handleFollowToggle = (userId: string) => {
    setFollowingStatus(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const renderFollowing = ({ item }: { item: User }) => {
    const isFollowing = followingStatus[item.id];
    const isSelf = currentUser?.id === item.id;
    
    const mutualFollowers = mockUsers.slice(0, Math.floor(Math.random() * 3) + 1);
    const mutualCount = mutualFollowers.length;

    return (
      <TouchableOpacity
        style={styles.followingItem}
        onPress={() => handleUserPress(item.id)}
      >
        <Avatar uri={item.profileImage} size={48} />
        <View style={styles.followingInfo}>
          <View style={styles.followingNameRow}>
            <Text style={styles.followingDisplayName}>{item.displayName}</Text>
            {item.isVerified && <VerifiedBadge size={16} />}
          </View>
          <Text style={styles.followingUsername}>@{item.username}</Text>
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
          title: 'Following',
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
            placeholder="Search following..."
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
        data={filteredFollowing}
        keyExtractor={(item) => item.id}
        renderItem={renderFollowing}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users found' : 'Not following anyone yet'}
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
  followingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  followingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  followingNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  followingDisplayName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  followingUsername: {
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
