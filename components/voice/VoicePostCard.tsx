import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import { useTheme } from '@/hooks/theme-store';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { VoiceNotePlayer } from '@/components/ui/VoiceNotePlayer';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface VoicePostCardProps {
  id: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    profileImage?: string;
    isVerified: boolean;
  };
  caption: string;
  voiceNote: {
    url: string;
    duration: number;
    waveform?: number[];
  };
  coverImage?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onMenu?: () => void;
  testID?: string;
}

export const VoicePostCard: React.FC<VoicePostCardProps> = ({
  id,
  author,
  caption,
  voiceNote,
  coverImage,
  likes,
  comments,
  shares,
  timestamp,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onShare,
  onSave,
  onMenu,
  testID,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [saved, setSaved] = useState<boolean>(isSaved);
  const [likeCount, setLikeCount] = useState<number>(likes);
  
  const likeScale = useRef(new Animated.Value(1)).current;
  const saveScale = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(
        newLiked ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
      );
    }

    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onLike?.();
  };

  const handleSave = () => {
    const newSaved = !saved;
    setSaved(newSaved);

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.sequence([
      Animated.timing(saveScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(saveScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSave?.();
  };

  const handleComment = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onComment?.();
  };

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onShare?.();
  };

  const handleMenu = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMenu?.();
  };

  const handleProfilePress = () => {
    router.push(`/user/${author.id}`);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]} testID={testID}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.authorInfo} onPress={handleProfilePress}>
          <Avatar
            source={author.profileImage}
            size={40}
            testID={`${testID}-avatar`}
          />
          <View style={styles.authorText}>
            <View style={styles.authorNameRow}>
              <Text style={[styles.displayName, { color: colors.text }]} numberOfLines={1}>
                {author.displayName}
              </Text>
              {author.isVerified && <VerifiedBadge size={14} />}
            </View>
            <Text style={[styles.username, { color: colors.textSecondary }]} numberOfLines={1}>
              @{author.username} · {timestamp}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMenu} style={styles.menuButton}>
          <MoreHorizontal size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {coverImage && (
          <View style={styles.coverImageContainer}>
            <Image
              source={{ uri: coverImage }}
              style={styles.coverImage}
              resizeMode="cover"
            />
            <View style={[styles.coverOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
          </View>
        )}

        <View style={styles.voicePlayerContainer}>
          <VoiceNotePlayer
            uri={voiceNote.url}
            duration={voiceNote.duration}
            waveform={voiceNote.waveform}
            size="large"
            testID={`${testID}-player`}
          />
        </View>

        {caption && (
          <Text style={[styles.caption, { color: colors.text }]}>
            {caption}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            testID={`${testID}-like-button`}
          >
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Heart
                size={22}
                color={liked ? colors.error : colors.textSecondary}
                fill={liked ? colors.error : 'transparent'}
              />
            </Animated.View>
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {formatNumber(likeCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleComment}
            testID={`${testID}-comment-button`}
          >
            <MessageCircle size={22} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {formatNumber(comments)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            testID={`${testID}-share-button`}
          >
            <Share2 size={22} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {formatNumber(shares)}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          testID={`${testID}-save-button`}
        >
          <Animated.View style={{ transform: [{ scale: saveScale }] }}>
            <Bookmark
              size={22}
              color={saved ? colors.primary : colors.textSecondary}
              fill={saved ? colors.primary : 'transparent'}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  authorText: {
    flex: 1,
    gap: 2,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  displayName: {
    fontSize: 15,
    fontWeight: '700' as const,
    flex: 1,
  },
  username: {
    fontSize: 13,
  },
  menuButton: {
    padding: 4,
  },
  content: {
    gap: 12,
  },
  coverImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  voicePlayerContainer: {
    marginVertical: 4,
  },
  caption: {
    fontSize: 15,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
