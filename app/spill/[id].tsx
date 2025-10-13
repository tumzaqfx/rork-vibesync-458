import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic, MicOff, Hand, Heart, Share2, X } from 'lucide-react-native';
import { useSpill } from '@/hooks/spill-store';

const REACTIONS = ['❤️', '😂', '😱', '🔥', '👏', '💯'];

export default function SpillRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { currentSpill, joinSpill, leaveSpill, isMuted, toggleMute, hasRequestedMic, requestMic, sendReaction, sendComment } = useSpill();
  const [comment, setComment] = useState<string>('');
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);

  useEffect(() => {
    if (id) {
      joinSpill(id);
    }
    return () => {
      leaveSpill();
    };
  }, [id, joinSpill, leaveSpill]);

  const handleLeave = () => {
    leaveSpill();
    router.back();
  };

  const handleReaction = (emoji: string) => {
    sendReaction(emoji);
    const reactionId = `reaction-${Date.now()}`;
    setFloatingReactions(prev => [...prev, { id: reactionId, emoji, x: Math.random() * 300 }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== reactionId));
    }, 3000);
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      sendComment(comment);
      setComment('');
    }
  };

  if (!currentSpill) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Spill...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#0B0D1A', '#1A1535', '#2E256E']}
        style={styles.container}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.liveBadge}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.listenerCount}>👥 {formatListenerCount(currentSpill.listenerCount)}</Text>
          </View>
          <TouchableOpacity onPress={handleLeave} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topicSection}>
            <Text style={styles.topicName}>{currentSpill.topicName}</Text>
            <Text style={styles.topicSubtitle}>Live Discussion</Text>
          </View>

          <View style={styles.hostsSection}>
            <Text style={styles.sectionTitle}>Hosts & Speakers</Text>
            <View style={styles.participantsGrid}>
              <ParticipantAvatar
                avatar={currentSpill.hostAvatar}
                name={currentSpill.hostName}
                role="Host"
                isSpeaking={true}
              />
              {currentSpill.cohosts.map((cohost) => (
                <ParticipantAvatar
                  key={cohost.id}
                  avatar={cohost.avatar}
                  name={cohost.name}
                  role="Co-host"
                  isSpeaking={cohost.isSpeaking}
                />
              ))}
              {currentSpill.participants
                .filter(p => p.role === 'speaker')
                .map((speaker) => (
                  <ParticipantAvatar
                    key={speaker.id}
                    avatar={speaker.avatar}
                    name={speaker.name}
                    role="Speaker"
                    isSpeaking={speaker.isSpeaking}
                  />
                ))}
            </View>
          </View>

          <View style={styles.audienceSection}>
            <Text style={styles.sectionTitle}>Audience</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.audienceGrid}>
                {currentSpill.participants
                  .filter(p => p.role === 'listener')
                  .slice(0, 20)
                  .map((listener) => (
                    <Image
                      key={listener.id}
                      source={{ uri: listener.avatar }}
                      style={styles.audienceAvatar}
                      contentFit="cover"
                    />
                  ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Live Comments</Text>
            {currentSpill.comments.slice(-5).map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {floatingReactions.map((reaction) => (
          <FloatingReaction key={reaction.id} emoji={reaction.emoji} x={reaction.x} />
        ))}

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#8E8E93"
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={handleSendComment}
              returnKeyType="send"
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, isMuted ? styles.mutedButton : styles.activeButton]} 
              onPress={toggleMute}
            >
              {isMuted ? <MicOff size={20} color="#FFFFFF" /> : <Mic size={20} color="#FFFFFF" />}
            </TouchableOpacity>

            {!hasRequestedMic && (
              <TouchableOpacity style={styles.actionButton} onPress={requestMic}>
                <Hand size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setShowReactions(!showReactions)}
            >
              <Heart size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {showReactions && (
            <View style={styles.reactionsBar}>
              {REACTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.reactionButton}
                  onPress={() => handleReaction(emoji)}
                >
                  <Text style={styles.reactionEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </LinearGradient>
    </>
  );
}

type ParticipantAvatarProps = {
  avatar: string;
  name: string;
  role: string;
  isSpeaking: boolean;
};

function ParticipantAvatar({ avatar, name, role, isSpeaking }: ParticipantAvatarProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSpeaking) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isSpeaking, pulseAnim]);

  return (
    <View style={styles.participantContainer}>
      <Animated.View style={[styles.participantAvatarContainer, { transform: [{ scale: pulseAnim }] }]}>
        {isSpeaking && (
          <View style={styles.speakingRing} />
        )}
        <Image source={{ uri: avatar }} style={styles.participantAvatar} contentFit="cover" />
      </Animated.View>
      <Text style={styles.participantName} numberOfLines={1}>{name}</Text>
      <Text style={styles.participantRole}>{role}</Text>
    </View>
  );
}

type FloatingReactionProps = {
  emoji: string;
  x: number;
};

function FloatingReaction({ emoji, x }: FloatingReactionProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -300,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  return (
    <Animated.Text
      style={[
        styles.floatingReaction,
        {
          left: x,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

function formatListenerCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0D1A',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#FF3B30',
  },
  listenerCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topicSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  topicName: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  topicSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  hostsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  participantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  participantContainer: {
    alignItems: 'center',
    width: 80,
  },
  participantAvatarContainer: {
    position: 'relative' as const,
    marginBottom: 8,
  },
  speakingRing: {
    position: 'absolute' as const,
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#7B61FF',
  },
  participantAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  participantName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  participantRole: {
    fontSize: 10,
    color: '#8E8E93',
  },
  audienceSection: {
    marginBottom: 32,
  },
  audienceGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  audienceAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentsSection: {
    marginBottom: 32,
  },
  commentItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#7B61FF',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(11, 13, 26, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  commentInputContainer: {
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  activeButton: {
    backgroundColor: '#7B61FF',
  },
  reactionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
  },
  reactionButton: {
    padding: 8,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  floatingReaction: {
    position: 'absolute' as const,
    bottom: 200,
    fontSize: 32,
  },
});
