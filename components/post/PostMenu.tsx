import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/theme-store';
import { useAuth } from '@/hooks/auth-store';
import {
  Edit3,
  Trash2,
  Pin,
  MessageCircleOff,
  HeartOff,
  BarChart3,
  Link2,
  Bookmark,
  Share2,
  AlertCircle,
  VolumeX,
  UserX,
  UserPlus,
  UserMinus,
  Mic,
  Video,
  X,
} from 'lucide-react-native';

export interface PostMenuOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
  divider?: boolean;
}

interface PostMenuProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  postAuthorId: string;
  isFollowing?: boolean;
  commentsEnabled?: boolean;
  likesVisible?: boolean;
  isPinned?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onToggleComments?: () => void;
  onToggleLikes?: () => void;
  onViewInsights?: () => void;
  onCopyLink?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onMute?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onBlock?: () => void;
  onVoiceReply?: () => void;
  onRemixVibez?: () => void;
}

export const PostMenu: React.FC<PostMenuProps> = ({
  visible,
  onClose,
  postId,
  postAuthorId,
  isFollowing = false,
  commentsEnabled = true,
  likesVisible = true,
  isPinned = false,
  onEdit,
  onDelete,
  onPin,
  onToggleComments,
  onToggleLikes,
  onViewInsights,
  onCopyLink,
  onSave,
  onShare,
  onReport,
  onMute,
  onFollow,
  onUnfollow,
  onBlock,
  onVoiceReply,
  onRemixVibez,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const isAuthor = user?.id === postAuthorId;

  const authorOptions: PostMenuOption[] = [
    {
      id: 'edit',
      label: 'Edit Post',
      icon: <Edit3 size={20} color={colors.text} />,
      onPress: () => {
        onEdit?.();
        onClose();
      },
    },
    {
      id: 'delete',
      label: 'Delete Post',
      icon: <Trash2 size={20} color={colors.error} />,
      onPress: () => {
        onDelete?.();
        onClose();
      },
      destructive: true,
    },
    {
      id: 'pin',
      label: isPinned ? 'Unpin from Profile' : 'Pin to Profile',
      icon: <Pin size={20} color={colors.text} />,
      onPress: () => {
        onPin?.();
        onClose();
      },
    },
    {
      id: 'toggle-comments',
      label: commentsEnabled ? 'Turn Off Comments' : 'Turn On Comments',
      icon: <MessageCircleOff size={20} color={colors.text} />,
      onPress: () => {
        onToggleComments?.();
        onClose();
      },
    },
    {
      id: 'toggle-likes',
      label: likesVisible ? 'Hide Like Counts' : 'Show Like Counts',
      icon: <HeartOff size={20} color={colors.text} />,
      onPress: () => {
        onToggleLikes?.();
        onClose();
      },
    },
    {
      id: 'insights',
      label: 'View Insights',
      icon: <BarChart3 size={20} color={colors.text} />,
      onPress: () => {
        onViewInsights?.();
        onClose();
      },
      divider: true,
    },
    {
      id: 'copy-link',
      label: 'Copy Link',
      icon: <Link2 size={20} color={colors.text} />,
      onPress: () => {
        onCopyLink?.();
        onClose();
      },
    },
  ];

  const viewerOptions: PostMenuOption[] = [
    {
      id: 'save',
      label: 'Save Post',
      icon: <Bookmark size={20} color={colors.text} />,
      onPress: () => {
        onSave?.();
        onClose();
      },
    },
    {
      id: 'share',
      label: 'Share Post',
      icon: <Share2 size={20} color={colors.text} />,
      onPress: () => {
        onShare?.();
        onClose();
      },
    },
    {
      id: 'copy-link',
      label: 'Copy Link',
      icon: <Link2 size={20} color={colors.text} />,
      onPress: () => {
        onCopyLink?.();
        onClose();
      },
      divider: true,
    },
    {
      id: 'report',
      label: 'Report Post',
      icon: <AlertCircle size={20} color={colors.error} />,
      onPress: () => {
        onReport?.();
        onClose();
      },
      destructive: true,
    },
    {
      id: 'mute',
      label: 'Mute Author',
      icon: <VolumeX size={20} color={colors.text} />,
      onPress: () => {
        onMute?.();
        onClose();
      },
    },
    {
      id: 'follow-toggle',
      label: isFollowing ? 'Unfollow Author' : 'Follow Author',
      icon: isFollowing ? (
        <UserMinus size={20} color={colors.text} />
      ) : (
        <UserPlus size={20} color={colors.text} />
      ),
      onPress: () => {
        if (isFollowing) {
          onUnfollow?.();
        } else {
          onFollow?.();
        }
        onClose();
      },
    },
    {
      id: 'block',
      label: 'Block Author',
      icon: <UserX size={20} color={colors.error} />,
      onPress: () => {
        onBlock?.();
        onClose();
      },
      destructive: true,
    },
  ];

  const specialOptions: PostMenuOption[] = [
    {
      id: 'voice-reply',
      label: 'Reply with Voice',
      icon: <Mic size={20} color={colors.primary} />,
      onPress: () => {
        onVoiceReply?.();
        onClose();
      },
    },
    {
      id: 'remix-vibez',
      label: 'Remix with Vibez',
      icon: <Video size={20} color={colors.primary} />,
      onPress: () => {
        onRemixVibez?.();
        onClose();
      },
    },
  ];

  const options = isAuthor ? authorOptions : [...viewerOptions, ...specialOptions];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
        
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.menuContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {isAuthor ? 'Post Options' : 'Actions'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option, index) => (
                <React.Fragment key={option.id}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      option.destructive && styles.destructiveOption,
                    ]}
                    onPress={option.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionIcon}>{option.icon}</View>
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: option.destructive
                            ? colors.error
                            : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                  {option.divider && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  menuContainer: {
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  destructiveOption: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  optionIcon: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: 20,
  },
});
