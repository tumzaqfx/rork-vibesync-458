import React, { useMemo } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PostCard } from '@/components/home/PostCard';
import { mockPosts } from '@/mocks/posts';
import { useAuth } from '@/hooks/auth-store';
import { usePinnedPosts } from '@/hooks/pinned-posts-store';
import { router } from 'expo-router';
import { Pin, PinOff } from 'lucide-react-native';
import { Post } from '@/types';

export default function ProfileScreen() {
  const { user, isAuthenticated } = useAuth();
  const { togglePinPost, isPostPinned, canPinMore, maxPinnedPosts } = usePinnedPosts();
  const [userPosts, setUserPosts] = React.useState(mockPosts);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated]);

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
    router.push('/edit-profile');
  };

  const handleFollowPress = () => {
    console.log('Follow pressed');
  };

  const handleShareProfile = () => {
    console.log('Share profile pressed');
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleChangeCoverPhoto = () => {
    console.log('[Profile] Cover photo change completed');
  };

  const handleChangeProfilePhoto = () => {
    console.log('[Profile] Profile photo change completed');
  };

  const handleLikePress = (postId: string) => {
    console.log('Like pressed for post:', postId);
  };

  const handleCommentPress = (postId: string) => {
    console.log('Comment pressed for post:', postId);
  };

  const handleSharePress = (postId: string) => {
    console.log('Share pressed for post:', postId);
  };

  const handleSavePress = (postId: string) => {
    console.log('Save pressed for post:', postId);
  };

  const handlePinPress = async (postId: string) => {
    const isPinned = isPostPinned(postId);
    
    if (!isPinned && !canPinMore()) {
      Alert.alert(
        'Pin Limit Reached',
        `You can only pin up to ${maxPinnedPosts} posts on your profile.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const success = await togglePinPost(postId);
    if (success) {
      Alert.alert(
        'Success',
        isPinned ? 'Post unpinned from profile' : 'Post pinned to profile',
        [{ text: 'OK' }]
      );
    }
  };

  const handleUserPress = (userId: string) => {
    console.log('User pressed:', userId);
    router.push(`/user/${userId}`);
  };

  const sortedPosts = useMemo(() => {
    const pinned: Post[] = [];
    const regular: Post[] = [];

    userPosts.forEach(post => {
      if (isPostPinned(post.id)) {
        pinned.push(post);
      } else {
        regular.push(post);
      }
    });

    return [...pinned, ...regular];
  }, [userPosts, isPostPinned]);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isPinned = isPostPinned(item.id);
          const prevItem = index > 0 ? sortedPosts[index - 1] : null;
          const showSeparator = prevItem && isPostPinned(prevItem.id) && !isPinned;

          return (
            <View>
              {isPinned && (
                <View style={styles.pinnedBadge}>
                  <Pin size={14} color={Colors.primary} />
                  <Text style={styles.pinnedText}>Pinned Post</Text>
                </View>
              )}
              {showSeparator && <View style={styles.pinnedSeparator} />}
              <PostCard
                post={item}
                onLikePress={handleLikePress}
                onCommentPress={handleCommentPress}
                onSharePress={handleSharePress}
                onSavePress={handleSavePress}
                onUserPress={handleUserPress}
              />
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePinPress(item.id)}
              >
                {isPinned ? (
                  <PinOff size={18} color={Colors.primary} />
                ) : (
                  <Pin size={18} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <ProfileHeader
            user={user}
            isCurrentUser={true}
            onEditProfile={handleEditProfile}
            onFollowPress={handleFollowPress}
            onShareProfile={handleShareProfile}
            onSettingsPress={handleSettingsPress}
            onChangeCoverPhoto={handleChangeCoverPhoto}
            onChangeProfilePhoto={handleChangeProfilePhoto}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  pinnedText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  pinnedSeparator: {
    height: 8,
    backgroundColor: Colors.cardLight,
    marginVertical: 8,
  },
  pinButton: {
    position: 'absolute',
    top: 12,
    right: 48,
    padding: 8,
    zIndex: 10,
  },
});