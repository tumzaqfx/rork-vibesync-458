import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { LiveComment as LiveCommentType } from '@/types/live';
import { Colors } from '@/constants/colors';

interface LiveCommentProps {
  comment: LiveCommentType;
  isPinned?: boolean;
}

export function LiveComment({ comment, isPinned }: LiveCommentProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(isPinned ? 0 : 5000),
      Animated.timing(fadeAnim, {
        toValue: isPinned ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, isPinned]);

  return (
    <Animated.View
      style={[
        styles.container,
        isPinned && styles.pinnedContainer,
        { opacity: fadeAnim },
      ]}
    >
      <Image source={{ uri: comment.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.username} numberOfLines={1}>
          {comment.username}
        </Text>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
      {isPinned && (
        <View style={styles.pinnedBadge}>
          <Text style={styles.pinnedText}>📌</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  pinnedContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  pinnedBadge: {
    marginLeft: 8,
  },
  pinnedText: {
    fontSize: 16,
  },
});
