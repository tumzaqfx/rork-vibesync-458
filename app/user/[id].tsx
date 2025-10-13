import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Button } from '@/components/ui/Button';
import { PostCard } from '@/components/home/PostCard';
import { ArrowLeft, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react-native';
import { QRCodeShareModal } from '@/components/profile/QRCodeShareModal';
import { ProfileViewsSection } from '@/components/profile/ProfileViewsSection';
import { useProfileViews } from '@/hooks/profile-views-store';
import { mockUsers } from '@/mocks/users';
import { mockPosts } from '@/mocks/posts';
import { User, Post } from '@/types';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, user: currentUser } = useAuth();
  const { trackProfileView, getProfileViews, getProfileViewsCount } = useProfileViews();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    
    const foundUser = mockUsers.find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
      const posts = mockPosts.filter(p => p.author.id === id);
      setUserPosts(posts);
      setIsFollowing(Math.random() > 0.5);
      
      if (currentUser?.id && currentUser.id !== id) {
        trackProfileView(id, currentUser.id);
        console.log(`[UserProfile] Tracked view: ${currentUser.username} viewed ${foundUser.username}`);
      }
    }
  }, [id, isAuthenticated, currentUser, trackProfileView]);

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
    // In a real app, this would call the backend
  };

  const handleMessagePress = () => {
    // Navigate to chat with this user
    router.push(`/chat/user-${id}`);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleLikePress = (postId: string) => {
    console.log('Like pressed for post:', postId);
  };

  const handleCommentPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleSharePress = (postId: string) => {
    console.log('Share pressed for post:', postId);
  };

  const handleShareProfile = () => {
    setShowQRModal(true);
    console.log('[UserProfile] Opening QR code share modal');
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: user.displayName,
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
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.headerShareButton} onPress={handleShareProfile}>
                <Share2 size={22} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerMoreButton}>
                <MoreHorizontal size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar
            uri={user.profileImage}
            size={100}
            style={styles.profileAvatar}
          />
          
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.displayName}>{user.displayName}</Text>
              {user.isVerified && <VerifiedBadge size={20} />}
            </View>
            <Text style={styles.username}>@{user.username}</Text>
            {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
          </View>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => router.push(`/user/${id}/followers`)}
            >
              <Text style={styles.statNumber}>{user.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => router.push(`/user/${id}/following`)}
            >
              <Text style={styles.statNumber}>{user.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
          
          {!isOwnProfile && (
            <View style={styles.actionButtons}>
              <Button
                title={isFollowing ? 'Following' : 'Follow'}
                onPress={handleFollowPress}
                style={[styles.followButton, isFollowing && styles.followingButton]}
                textStyle={isFollowing ? styles.followingButtonText : undefined}
              />
              <TouchableOpacity style={styles.messageButton} onPress={handleMessagePress}>
                <MessageCircle size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {isOwnProfile && (
          <ProfileViewsSection
            views={getProfileViews(user.id)}
            viewsCount={getProfileViewsCount(user.id, 'week')}
            timeRange="week"
          />
        )}
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'media' && styles.activeTab]}
            onPress={() => setActiveTab('media')}
          >
            <Text style={[styles.tabText, activeTab === 'media' && styles.activeTabText]}>
              Media
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        {activeTab === 'posts' && (
          <View style={styles.postsContainer}>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPress={handlePostPress}
                  onLike={handleLikePress}
                  onComment={handleCommentPress}
                  onShare={handleSharePress}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts yet</Text>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'media' && (
          <View style={styles.mediaContainer}>
            <Text style={styles.emptyText}>Media content coming soon</Text>
          </View>
        )}
      </ScrollView>

      <QRCodeShareModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        user={user}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  errorText: {
    color: Colors.text,
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  headerBackButton: {
    marginLeft: 16,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
  },
  headerShareButton: {
    padding: 4,
  },
  headerMoreButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
  },
  profileAvatar: {
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  displayName: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  username: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  bio: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  followButton: {
    flex: 1,
  },
  followingButton: {
    backgroundColor: Colors.cardLight,
  },
  followingButtonText: {
    color: Colors.text,
  },
  messageButton: {
    backgroundColor: Colors.cardLight,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.text,
  },
  postsContainer: {
    paddingTop: 16,
  },
  mediaContainer: {
    padding: 20,
    alignItems: 'center',
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