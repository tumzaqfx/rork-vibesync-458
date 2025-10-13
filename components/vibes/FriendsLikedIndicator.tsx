import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Modal, ScrollView } from 'react-native';
import { VibeLike } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface FriendsLikedIndicatorProps {
  friendsWhoLiked: VibeLike[];
  totalLikes: number;
}

export const FriendsLikedIndicator: React.FC<FriendsLikedIndicatorProps> = ({
  friendsWhoLiked,
  totalLikes,
}) => {
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (friendsWhoLiked.length > 0) {
      Animated.sequence([
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(3000),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 20,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [friendsWhoLiked, fadeAnim, slideAnim]);

  if (friendsWhoLiked.length === 0) {
    return null;
  }

  const renderText = () => {
    if (friendsWhoLiked.length === 1) {
      return `${friendsWhoLiked[0].displayName} liked this`;
    } else if (friendsWhoLiked.length === 2) {
      return `${friendsWhoLiked[0].displayName} and ${friendsWhoLiked[1].displayName} liked this`;
    } else {
      const othersCount = friendsWhoLiked.length - 1;
      return `${friendsWhoLiked[0].displayName} and ${othersCount} other${othersCount > 1 ? 's' : ''} liked this`;
    }
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setShowModal(true)}
          activeOpacity={0.9}
        >
          <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
            <View style={styles.avatarsContainer}>
              {friendsWhoLiked.slice(0, 3).map((friend, index) => (
                <View
                  key={friend.id}
                  style={[
                    styles.avatarWrapper,
                    { marginLeft: index > 0 ? -12 : 0, zIndex: 3 - index },
                  ]}
                >
                  <Avatar uri={friend.profileImage} size={24} borderWidth={2} borderColor="#000" />
                </View>
              ))}
            </View>
            <Text style={styles.text} numberOfLines={1}>
              ❤️ {renderText()}
            </Text>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Liked by</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {friendsWhoLiked.map((friend) => (
                <View key={friend.id} style={styles.friendItem}>
                  <Avatar uri={friend.profileImage} size={48} />
                  <View style={styles.friendInfo}>
                    <View style={styles.friendNameRow}>
                      <Text style={styles.friendName}>{friend.displayName}</Text>
                      {friend.isVerified && <VerifiedBadge size={16} />}
                    </View>
                    <Text style={styles.friendUsername}>@{friend.username}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 240,
    left: 16,
    right: 80,
    zIndex: 10,
  },
  touchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600' as const,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  friendName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  friendUsername: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
});
