import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/auth-store';
import { useTheme } from '@/hooks/theme-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ThreadedCommentSection } from '@/components/post/ThreadedCommentSection';
import { ArrowLeft, Send, Mic, Heart, MessageCircle, Repeat2, Share2 } from 'lucide-react-native';
import { mockPosts } from '@/mocks/posts';
import { mockComments } from '@/mocks/comments';
import { Post, Comment } from '@/types';
import { HashtagText } from '@/components/hashtag/HashtagText';
import MentionInput from '@/components/tagging/MentionInput';

export default function PostDetailScreen() {
  const { id, scrollToComments } = useLocalSearchParams<{ id: string; scrollToComments?: string }>();
  const commentsRef = useRef<ScrollView>(null);
  const { isAuthenticated, user } = useAuth();
  const { colors } = useTheme();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [repostsCount, setRepostsCount] = useState(0);
  const [showInteractions, setShowInteractions] = useState<'likes' | 'reposts' | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    
    const foundPost = mockPosts.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      const postComments = mockComments.filter(c => c.postId === id);
      setComments(postComments);
      setLikesCount(foundPost.likes);
      setRepostsCount(foundPost.shares);
      
      if (scrollToComments === 'true') {
        setTimeout(() => {
          commentsRef.current?.scrollToEnd({ animated: true });
        }, 300);
      }
    }
  }, [id, isAuthenticated, scrollToComments]);

  const handlePostComment = async () => {
    if (!commentText.trim() || !user) return;
    
    setIsPosting(true);
    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        postId: id || '',
        userId: user.id,
        username: user.username,
        userDisplayName: user.displayName,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        content: commentText,
        timestamp: 'Just now',
        likes: 0,
        isLiked: false,
      };
      
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      Alert.alert('Success', 'Comment posted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setIsPosting(false);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecordingVoice(!isRecordingVoice);
    console.log('Voice recording:', !isRecordingVoice);
  };

  const handleLikePress = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRepostPress = () => {
    setIsReposted(!isReposted);
    setRepostsCount(prev => isReposted ? prev - 1 : prev + 1);
    Alert.alert('Success', isReposted ? 'Repost removed' : 'Post reposted!');
  };

  const handleSharePress = () => {
    Alert.alert('Share', 'Share functionality');
  };



  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleCommentReply = (commentId: string, content: string, isVoice?: boolean, voiceData?: any) => {
    if (!user) return;
    
    const newReply: Comment = {
      id: Date.now().toString(),
      postId: id || '',
      userId: user.id,
      username: user.username,
      userDisplayName: user.displayName,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      content: isVoice ? '' : content,
      voiceNote: isVoice ? voiceData : undefined,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };
    
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      return comment;
    }));
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const handlePostCommentWithVoice = (content: string, isVoice?: boolean, voiceData?: any) => {
    if (!user) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      postId: id || '',
      userId: user.id,
      username: user.username,
      userDisplayName: user.displayName,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      content: isVoice ? '' : content,
      voiceNote: isVoice ? voiceData : undefined,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };
    
    setComments(prev => [newComment, ...prev]);
    Alert.alert('Success', isVoice ? 'Voice comment posted!' : 'Comment posted!');
  };

  if (!post) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Post not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.backButtonText, { color: colors.textInverse }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Post',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerBackButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.headerContainer}>
            <View style={[styles.postHeader, { borderBottomColor: colors.border }]}>
              <TouchableOpacity
                style={styles.userInfo}
                onPress={() => handleUserPress(post.userId)}
              >
                <Avatar uri={post.profileImage} size={48} />
                <View style={styles.nameContainer}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.displayName, { color: colors.text }]}>{post.username}</Text>
                    {post.isVerified && <VerifiedBadge size={16} />}
                  </View>
                  <Text style={[styles.username, { color: colors.textSecondary }]}>@{post.username}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.postContent}>
              <HashtagText text={post.content} style={[styles.contentText, { color: colors.text }]} />
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{post.timestamp}</Text>
            </View>

            <View style={[styles.statsContainer, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={() => setShowInteractions('likes')} style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{likesCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Likes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowInteractions('reposts')} style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{repostsCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reposts</Text>
              </TouchableOpacity>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{post.views}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Views</Text>
              </View>
            </View>

            <View style={[styles.actionsContainer, { borderBottomColor: colors.border }]}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
                <Heart size={22} color={isLiked ? colors.error : colors.textSecondary} fill={isLiked ? colors.error : 'transparent'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                <MessageCircle size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleRepostPress}>
                <Repeat2 size={22} color={isReposted ? colors.success : colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
                <Share2 size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.commentsHeader, { borderTopColor: colors.border }]}>
              <Text style={[styles.commentsTitle, { color: colors.text }]}>Comments ({comments.length})</Text>
            </View>
      </View>

      <ThreadedCommentSection
        comments={comments}
        postAuthorId={post.userId}
        onCommentLike={handleCommentLike}
        onCommentReply={handleCommentReply}
        onUserPress={handleUserPress}
        onPostComment={handlePostCommentWithVoice}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  headerBackButton: {
    marginLeft: 16,
  },
  postHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
  postContent: {
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionButton: {
    padding: 8,
  },
  headerContainer: {
    backgroundColor: 'transparent',
  },
  commentsHeader: {
    padding: 16,
    borderTopWidth: 1,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },

});