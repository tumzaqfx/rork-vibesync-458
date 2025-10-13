import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Users,
  Heart,
  Gift,
  UserPlus,
  MoreVertical,
  Send,
  Smile,
  Share2,
  Sparkles,
} from 'lucide-react-native';
import { useLiveStreaming } from '@/hooks/live-streaming-store';
import { useAuth } from '@/hooks/auth-store';
import { LiveCountdown } from '@/components/live/LiveCountdown';
import { LiveComment } from '@/components/live/LiveComment';
import { LiveReaction } from '@/components/live/LiveReaction';
import { LiveReaction as LiveReactionType } from '@/types/live';
import { Colors } from '@/constants/colors';
import { LIVE_GIFTS } from '@/mocks/live-gifts';

const { width, height } = Dimensions.get('window');

export default function LiveRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const {
    activeSession,
    currentViewingSession,
    comments,
    isHosting,
    endLive,
    joinLive,
    leaveLive,
    addComment,
    addLike,
  } = useLiveStreaming();

  const session = isHosting ? activeSession : currentViewingSession;
  const isHost = session?.hostId === user?.id;

  const [showCountdown, setShowCountdown] = useState<boolean>(
    session?.status === 'countdown'
  );
  const [commentText, setCommentText] = useState<string>('');
  const [reactions, setReactions] = useState<LiveReactionType[]>([]);
  const [showGiftPicker, setShowGiftPicker] = useState<boolean>(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const cameraRef = useRef<any>(null);

  const filters = [
    { id: 'none', name: 'None' },
    { id: 'vivid', name: 'Vivid' },
    { id: 'warm', name: 'Warm' },
    { id: 'cool', name: 'Cool' },
    { id: 'bw', name: 'B&W' },
  ];

  useEffect(() => {
    if (isHost && !cameraPermission?.granted) {
      requestCameraPermission();
    }

    if (!isHost && id) {
      joinLive(id);
    }

    return () => {
      if (!isHost && id) {
        leaveLive(id);
      }
    };
  }, [id, isHost, joinLive, leaveLive, cameraPermission, requestCameraPermission]);

  useEffect(() => {
    if (session?.status === 'live') {
      setShowCountdown(false);
    }
  }, [session?.status]);

  const handleEndLive = async () => {
    const analytics = await endLive();
    if (analytics) {
      router.push({
        pathname: '/live/analytics' as any,
        params: { data: JSON.stringify(analytics) },
      });
    } else {
      router.back();
    }
  };

  const handleSendComment = () => {
    if (commentText.trim() && session) {
      addComment(session.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleReaction = (type: LiveReactionType['type']) => {
    if (!session) return;

    const newReaction: LiveReactionType = {
      id: Date.now().toString(),
      type,
      x: Math.random() * (width - 50),
      y: 0,
      timestamp: Date.now(),
    };

    setReactions((prev) => [...prev, newReaction]);
    addLike(session.id);
  };

  const handleRemoveReaction = (id: string) => {
    setReactions((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSendGift = (giftId: string) => {
    console.log('Send gift:', giftId);
    setShowGiftPicker(false);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    setShowFilters(false);
    Alert.alert('Filter Applied', `${filters.find(f => f.id === filterId)?.name} filter applied`);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareOption = (option: string) => {
    setShowShareModal(false);
    Alert.alert('Share', `Sharing via ${option}`);
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Live session not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {showCountdown && (
        <LiveCountdown onComplete={() => setShowCountdown(false)} />
      )}

      <View style={styles.videoContainer}>
        {isHost && cameraPermission?.granted ? (
          <View style={styles.cameraWrapper}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
            />
            {selectedFilter !== 'none' && (
              <View 
                style={[styles.filterOverlay, getFilterStyle(selectedFilter)]} 
                pointerEvents="none"
              />
            )}
          </View>
        ) : (
          <View style={styles.placeholderVideo}>
            <Text style={styles.placeholderText}>📹 Live Stream</Text>
            <Text style={styles.placeholderSubtext}>
              {isHost ? 'Camera permission required' : 'Viewing live stream'}
            </Text>
          </View>
        )}
      </View>

      <SafeAreaView style={styles.overlay} edges={['top']}>
        <View style={styles.topBar}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
            <View style={styles.viewerCount}>
              <Users size={16} color="#FFFFFF" />
              <Text style={styles.viewerCountText}>{session.viewerCount}</Text>
            </View>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleShare}
              testID="share-button"
            >
              <Share2 size={22} color="#FFFFFF" />
            </TouchableOpacity>
            {isHost && (
              <>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowFilters(!showFilters)}
                  testID="filter-button"
                >
                  <Sparkles size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowOptionsMenu(true)}
                  testID="menu-button"
                >
                  <MoreVertical size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={isHost ? () => {
                Alert.alert(
                  'End Live',
                  'Are you sure you want to end this live session?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'End Live', style: 'destructive', onPress: handleEndLive },
                  ]
                );
              } : () => router.back()}
              testID="close-button"
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.middleContent}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.commentsContainer}
            contentContainerStyle={styles.commentsContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {comments.map((comment) => (
              <LiveComment
                key={comment.id}
                comment={comment}
                isPinned={comment.isPinned}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.sideActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleReaction('heart')}
              testID="like-button"
            >
              <Heart size={26} color="#FFFFFF" fill="#FFFFFF" style={styles.actionIcon} />
              <Text style={styles.actionCount}>{session.likeCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log('Show viewers')}
              testID="viewers-button"
            >
              <Users size={26} color="#FFFFFF" style={styles.actionIcon} />
              <Text style={styles.actionCount}>{session.viewerCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowGiftPicker(true)}
              testID="gift-button"
            >
              <Gift size={26} color="#FFFFFF" style={styles.actionIcon} />
            </TouchableOpacity>

            {isHost && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => console.log('Invite co-host')}
                testID="invite-button"
              >
                <UserPlus size={26} color="#FFFFFF" style={styles.actionIcon} />
              </TouchableOpacity>
            )}
          </View>

          {session.commentsEnabled && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.commentInputContainer}
            >
              <View style={styles.commentInputWrapper}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={commentText}
                  onChangeText={setCommentText}
                  onSubmitEditing={handleSendComment}
                  returnKeyType="send"
                  testID="comment-input"
                />
                <TouchableOpacity
                  style={styles.emojiButton}
                  onPress={() => console.log('Open emoji picker')}
                >
                  <Smile size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendComment}
                  disabled={!commentText.trim()}
                  testID="send-button"
                >
                  <Send
                    size={20}
                    color={commentText.trim() ? Colors.primary : '#666'}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}

          {showFilters && isHost && (
            <View style={styles.filtersContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterButton,
                      selectedFilter === filter.id && styles.filterButtonActive,
                    ]}
                    onPress={() => handleFilterSelect(filter.id)}
                  >
                    <Text style={styles.filterButtonText}>{filter.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </SafeAreaView>

      {reactions.map((reaction) => (
        <LiveReaction
          key={reaction.id}
          reaction={reaction}
          onComplete={() => handleRemoveReaction(reaction.id)}
        />
      ))}

      <Modal
        visible={showGiftPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGiftPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.giftPickerContainer}>
            <View style={styles.giftPickerHeader}>
              <Text style={styles.giftPickerTitle}>Send a Gift</Text>
              <TouchableOpacity onPress={() => setShowGiftPicker(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.giftGrid}>
              {LIVE_GIFTS.map((gift) => (
                <TouchableOpacity
                  key={gift.id}
                  style={styles.giftItem}
                  onPress={() => handleSendGift(gift.id)}
                >
                  <Text style={styles.giftIcon}>{gift.icon}</Text>
                  <Text style={styles.giftName}>{gift.name}</Text>
                  <Text style={styles.giftValue}>{gift.value} coins</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareModalContainer}>
            <View style={styles.shareModalHeader}>
              <Text style={styles.shareModalTitle}>Share Live Stream</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.shareOptions}>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('Copy Link')}
              >
                <View style={styles.shareOptionIcon}>
                  <Text style={styles.shareOptionEmoji}>🔗</Text>
                </View>
                <Text style={styles.shareOptionText}>Copy Link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('Share to Story')}
              >
                <View style={styles.shareOptionIcon}>
                  <Text style={styles.shareOptionEmoji}>📸</Text>
                </View>
                <Text style={styles.shareOptionText}>Share to Story</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('Send in DM')}
              >
                <View style={styles.shareOptionIcon}>
                  <Text style={styles.shareOptionEmoji}>💬</Text>
                </View>
                <Text style={styles.shareOptionText}>Send in DM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('Share External')}
              >
                <View style={styles.shareOptionIcon}>
                  <Text style={styles.shareOptionEmoji}>📤</Text>
                </View>
                <Text style={styles.shareOptionText}>More Options</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showOptionsMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowOptionsMenu(false)}
        >
          <View style={styles.optionsMenuContainer}>
            {isHost ? (
              <>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setShowOptionsMenu(false);
                    toggleCameraFacing();
                  }}
                >
                  <Text style={styles.optionIcon}>🔄</Text>
                  <Text style={styles.optionText}>Switch Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setShowOptionsMenu(false);
                    Alert.alert('Mic Settings', 'Adjust microphone settings');
                  }}
                >
                  <Text style={styles.optionIcon}>🎤</Text>
                  <Text style={styles.optionText}>Adjust Mic</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setShowOptionsMenu(false);
                    router.push('/live/analytics' as any);
                  }}
                >
                  <Text style={styles.optionIcon}>📊</Text>
                  <Text style={styles.optionText}>View Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionItem, styles.optionItemDanger]}
                  onPress={() => {
                    setShowOptionsMenu(false);
                    Alert.alert(
                      'End Live',
                      'Are you sure you want to end this live session?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Yes, End Live', style: 'destructive', onPress: handleEndLive },
                      ]
                    );
                  }}
                >
                  <Text style={styles.optionIcon}>🔴</Text>
                  <Text style={[styles.optionText, styles.optionTextDanger]}>End Stream</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setShowOptionsMenu(false);
                    Alert.alert('Report', 'Report live stream coming soon');
                  }}
                >
                  <Text style={styles.optionIcon}>⚠️</Text>
                  <Text style={styles.optionText}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionItem, styles.optionItemDanger]}
                  onPress={() => {
                    setShowOptionsMenu(false);
                    Alert.alert('Block', 'Block user coming soon');
                  }}
                >
                  <Text style={styles.optionIcon}>🚫</Text>
                  <Text style={[styles.optionText, styles.optionTextDanger]}>Block User</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const getFilterStyle = (filterId: string) => {
  switch (filterId) {
    case 'vivid':
      return { backgroundColor: 'rgba(255, 100, 100, 0.15)' };
    case 'warm':
      return { backgroundColor: 'rgba(255, 200, 100, 0.2)' };
    case 'cool':
      return { backgroundColor: 'rgba(100, 150, 255, 0.2)' };
    case 'bw':
      return { backgroundColor: 'rgba(128, 128, 128, 0.3)' };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholderVideo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  liveText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginRight: 12,
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewerCountText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 20,
  },
  filtersContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  middleContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commentsContainer: {
    maxHeight: 300,
  },
  commentsContent: {
    paddingBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 56,
    gap: 16,
  },
  sideActions: {
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  commentInputContainer: {
    flex: 1,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  emojiButton: {
    padding: 4,
  },
  sendButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  giftPickerContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
  },
  giftPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  giftPickerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  giftGrid: {
    padding: 16,
  },
  giftItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 12,
  },
  giftIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  giftName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  giftValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  optionsMenuContainer: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 16,
    minWidth: 220,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  optionItemDanger: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionIcon: {
    fontSize: 20,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#FFFFFF',
  },
  optionTextDanger: {
    color: '#EF4444',
  },
  shareModalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.5,
  },
  shareModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  shareModalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  shareOption: {
    width: '22%',
    alignItems: 'center',
    gap: 8,
  },
  shareOptionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareOptionEmoji: {
    fontSize: 28,
  },
  shareOptionText: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
});
