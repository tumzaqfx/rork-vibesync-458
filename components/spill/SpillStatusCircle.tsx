import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';

type SpillStatusCircleProps = {
  id: string;
  name: string;
  avatar: string;
  topicName: string;
  listenerCount: number;
};

export default function SpillStatusCircle({ id, name, avatar, topicName, listenerCount }: SpillStatusCircleProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handlePress = () => {
    console.log('[SpillStatusCircle] Opening spill:', id);
    router.push(`/spill/${id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} testID={`spill-status-${id}`}>
      <Animated.View style={[styles.ringContainer, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={['#7B61FF', '#A88FFF', '#7B61FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ring}
        >
          <View style={styles.innerRing}>
            <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>💧</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.topic} numberOfLines={1}>{topicName}</Text>
        <Text style={styles.listeners}>{formatListenerCount(listenerCount)}</Text>
      </View>
    </TouchableOpacity>
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
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  ringContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 6,
  },
  ring: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#131628',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  badge: {
    position: 'absolute' as const,
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7B61FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#131628',
  },
  badgeText: {
    fontSize: 12,
  },
  name: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  infoContainer: {
    alignItems: 'center',
  },
  topic: {
    fontSize: 10,
    color: '#7B61FF',
    fontWeight: '500' as const,
  },
  listeners: {
    fontSize: 9,
    color: '#8E8E93',
    marginTop: 1,
  },
});
