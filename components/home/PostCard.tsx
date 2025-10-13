import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { Video, ResizeMode } from 'expo-av';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { PostMenu } from '@/components/post/PostMenu';
import { RevibeSheet } from '@/components/engagement/RevibeSheet';
import { SaveSheet } from '@/components/engagement/SaveSheet';
import { CommentDrawer } from '@/components/engagement/CommentDrawer';
import { ShareSheet } from '@/components/engagement/ShareSheet';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import { useEngagement } from '@/hooks/engagement-store';
import { Post } from '@/types';
import { Heart, MessageCircle, Repeat2, Bookmark, MoreHorizontal, Eye } from 'lucide-react-native';
import { VoiceNotePlayer } from '@/components/ui/VoiceNotePlayer';
import { router } from 'expo-router';
import { mockComments } from '@/mocks/comments';


interface PostCardProps {
  post: Post;
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
  onSharePress?: (postId: string) => void;
  onSavePress?: (postId: string) => void;
  onUserPress?: (userId: string) => void;
  onPress?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  showFullContent?: boolean;
  testID?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\\.0$/, '') + 'K';
  }
  return num.toString();
};

const parseTextWithLinks = (text: string, colors: any) => {
  const parts: React.ReactNode[] = [];
  const regex = /(#\w+|@\w+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Text key={`text-${lastIndex}`} style={{ color: colors.text }}>
          {text.slice(lastIndex, match.index)}
        </Text>
      );
    }

    const isHashtag = match[0].startsWith('#');
    const isUsername = match[0].startsWith('@');
    
    parts.push(
      <TouchableOpacity
        key={`link-${match.index}`}
        onPress={() => {
          if (match && isHashtag) {
            const hashtag = match[0].slice(1);
            console.log('Navigate to hashtag:', hashtag);
            router.push(`/hashtag/${hashtag}`);
          } else if (match && isUsername) {
            const username = match[0].slice(1);
            console.log('Navigate to user:', username);
            router.push(`/user/${username}`);
          }
        }}
      >
        <Text style={{ color: isHashtag ? '#1DA1F2' : colors.primary, fontWeight: '600' }}>
          {match[0]}
        </Text>
      </TouchableOpacity>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Text key={`text-${lastIndex}`} style={{ color: colors.text }}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  return parts.length > 0 ? parts : [<Text key="full-text" style={{ color: colors.text }}>{text}</Text>];
};

const PostCardComponent: React.FC<PostCardProps> = ({
  post,
  onLikePress,
  onCommentPress,
  onSharePress,
  onSavePress,
  onUserPress,
  onPress,
  onLike,
  onComment,
  onShare,
  showFullContent = false,
  testID,
}) => {
  const { colors } = useTheme();
  useAuth();
  const {
    likePost,
    isPostLiked,
    isPostRevibed,
    isPostSaved,
    getPostLikes,
    getPostRevibes,
  } = useEngagement();
  
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [revibeSheetVisible, setRevibeSheetVisible] = useState<boolean>(false);
  const [saveSheetVisible, setSaveSheetVisible] = useState<boolean>(false);
  const [commentDrawerVisible, setCommentDrawerVisible] = useState<boolean>(false);
  const [shareSheetVisible, setShareSheetVisible] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const likeAnim = useRef(new Animated.Value(1)).current;
  const revibeAnim = useRef(new Animated.Value(1)).current;
  const saveAnim = useRef(new Animated.Value(1)).current;

  const isLiked = isPostLiked(post.id);
  const isRevibed = isPostRevibed(post.id);
  const isSaved = isPostSaved(post.id);
  const likesCount = post.likes + getPostLikes(post.id).length;
  const revibesCount = post.shares + getPostRevibes(post.id).length;

  const animateButton = (animValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(animValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = async () => {
    animateButton(likeAnim);
    await likePost(post.id, post.userId);
    onLikePress?.(post.id);
    onLike?.(post.id);
  };

  const handleRevibe = () => {
    animateButton(revibeAnim);
    setRevibeSheetVisible(true);
  };

  const handleSave = () => {
    animateButton(saveAnim);
    setSaveSheetVisible(true);
  };

  const handleComment = () => {
    router.push(`/post/${post.id}?scrollToComments=true`);
    onCommentPress?.(post.id);
    onComment?.(post.id);
  };

  const handleEdit = () => {
    console.log('Edit post:', post.id);
    Alert.alert('Edit Post', 'Edit functionality coming soon');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete post:', post.id);
          },
        },
      ]
    );
  };

  const handlePin = () => {
    console.log('Pin post:', post.id);
    Alert.alert('Success', 'Post pinned to profile');
  };

  const handleToggleComments = () => {
    console.log('Toggle comments:', post.id);
    Alert.alert('Success', 'Comments toggled');
  };

  const handleToggleLikes = () => {
    console.log('Toggle likes visibility:', post.id);
    Alert.alert('Success', 'Like counts visibility toggled');
  };

  const handleViewInsights = () => {
    console.log('View insights:', post.id);
    Alert.alert('Insights', `Views: ${post.views}\\nLikes: ${likesCount}\\nComments: ${post.comments}\\nRevibes: ${revibesCount}`);
  };

  const handleCopyLink = async () => {
    const link = `vibesync://post/${post.id}`;
    await Clipboard.setStringAsync(link);
    Alert.alert('Success', 'Link copied to clipboard');
  };

  const handleSharePost = () => {
    setShareSheetVisible(true);
  };

  const handleReport = () => {
    Alert.alert(
      'Report Post',
      'Why are you reporting this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Spam', onPress: () => console.log('Report: Spam') },
        { text: 'Inappropriate', onPress: () => console.log('Report: Inappropriate') },
        { text: 'Harassment', onPress: () => console.log('Report: Harassment') },
      ]
    );
  };

  const handleMute = () => {
    console.log('Mute author:', post.userId);
    Alert.alert('Success', `You won't see posts from @${post.username}`);
  };

  const handleFollow = () => {
    setIsFollowing(true);
    console.log('Follow author:', post.userId);
    Alert.alert('Success', `You are now following @${post.username}`);
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    console.log('Unfollow author:', post.userId);
    Alert.alert('Success', `You unfollowed @${post.username}`);
  };

  const handleBlock = () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block @${post.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            console.log('Block author:', post.userId);
            Alert.alert('Success', `@${post.username} has been blocked`);
          },
        },
      ]
    );
  };

  const handleVoiceReply = () => {
    console.log('Voice reply to post:', post.id);
    Alert.alert('Voice Reply', 'Voice reply feature coming soon');
  };

  const handleRemixVibez = () => {
    console.log('Remix with Vibez:', post.id);
    router.push('/studio/video-editor');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]} testID={testID}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => {
            router.push(`/user/${post.userId}`);
            onUserPress?.(post.userId);
          }}
        >
          <Avatar uri={post.profileImage} size={40} />
          <View style={styles.nameContainer}>
            <View style={styles.nameRow}>
              <Text style={[styles.username, { color: colors.text }]}>@{post.username}</Text>
              {post.isVerified && <VerifiedBadge size={14} />}
            </View>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{post.timestamp}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setMenuVisible(true)}
        >
          <MoreHorizontal size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        activeOpacity={0.95}
        onPress={() => {
          router.push(`/post/${post.id}`);
          onPress?.(post.id);
        }}
      >
        <View style={styles.content}>
          {parseTextWithLinks(post.content, colors)}
        </View>
      </TouchableOpacity>

      {post.voiceNote && (
        <View style={styles.voiceNoteContainer}>
          <VoiceNotePlayer
            uri={post.voiceNote.url}
            duration={post.voiceNote.duration}
            waveform={post.voiceNote.waveform}
            size="medium"
          />
        </View>
      )}

      {post.image && (
        <TouchableOpacity 
          activeOpacity={0.95}
          onPress={() => {
            router.push(`/post/${post.id}`);
            onPress?.(post.id);
          }}
        >
          <Image
            source={{ uri: post.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        </TouchableOpacity>
      )}

      {post.video && (
        <TouchableOpacity 
          activeOpacity={0.95}
          onPress={() => {
            router.push(`/post/${post.id}`);
            onPress?.(post.id);
          }}
        >
          <Video
            source={{ uri: post.video }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={false}
          />
        </TouchableOpacity>
      )}

      <View style={styles.actions}>
        <View style={styles.actionGroup}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
          >
            <Animated.View style={{ transform: [{ scale: likeAnim }] }}>
              <Heart
                size={22}
                color={isLiked ? colors.error : colors.textSecondary}
                fill={isLiked ? colors.error : 'transparent'}
              />
            </Animated.View>
            <Text style={[styles.actionText, { color: isLiked ? colors.error : colors.textSecondary }]}>
              {formatNumber(likesCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleComment}
          >
            <MessageCircle size={22} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>{formatNumber(post.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRevibe}
          >
            <Animated.View style={{ transform: [{ scale: revibeAnim }] }}>
              <Repeat2
                size={22}
                color={isRevibed ? colors.success : colors.textSecondary}
              />
            </Animated.View>
            <Text style={[styles.actionText, { color: isRevibed ? colors.success : colors.textSecondary }]}>
              {formatNumber(revibesCount)}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButton}>
            <Eye size={22} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {formatNumber(post.views)}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleSave}>
          <Animated.View style={{ transform: [{ scale: saveAnim }] }}>
            <Bookmark 
              size={22} 
              color={isSaved ? colors.primary : colors.textSecondary}
              fill={isSaved ? colors.primary : 'transparent'}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <PostMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        postId={post.id}
        postAuthorId={post.userId}
        isFollowing={isFollowing}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPin={handlePin}
        onToggleComments={handleToggleComments}
        onToggleLikes={handleToggleLikes}
        onViewInsights={handleViewInsights}
        onCopyLink={handleCopyLink}
        onSave={handleSave}
        onShare={handleSharePost}
        onReport={handleReport}
        onMute={handleMute}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onBlock={handleBlock}
        onVoiceReply={handleVoiceReply}
        onRemixVibez={handleRemixVibez}
      />

      <RevibeSheet
        visible={revibeSheetVisible}
        onClose={() => setRevibeSheetVisible(false)}
        post={post}
        onRevibe={(postId, caption) => {
          console.log('Revibed post:', postId, caption);
          onSharePress?.(postId);
          onShare?.(postId);
        }}
      />

      <SaveSheet
        visible={saveSheetVisible}
        onClose={() => setSaveSheetVisible(false)}
        postId={post.id}
        onSave={(postId, collectionId) => {
          console.log('Saved post to collection:', postId, collectionId);
          onSavePress?.(postId);
        }}
      />

      <CommentDrawer
        visible={commentDrawerVisible}
        onClose={() => setCommentDrawerVisible(false)}
        post={post}
        comments={mockComments.filter(c => c.postId === post.id)}
        onComment={(postId, content, isVoice) => {
          console.log('Posted comment:', postId, content, isVoice);
          onPress?.(postId);
        }}
      />

      <ShareSheet
        visible={shareSheetVisible}
        onClose={() => setShareSheetVisible(false)}
        content={post}
        contentType="post"
      />
    </View>
  );
};

PostCardComponent.displayName = 'PostCard';

export const PostCard = React.memo(PostCardComponent);

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
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
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 12,
  },
  video: {
    width: '100%',
    height: 400,
    marginBottom: 12,
    backgroundColor: '#000',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  voiceNoteContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
});
