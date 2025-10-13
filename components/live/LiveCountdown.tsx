import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/colors';

interface LiveCountdownProps {
  onComplete: () => void;
}

export function LiveCountdown({ onComplete }: LiveCountdownProps) {
  const [count, setCount] = useState<number>(3);
  const scaleAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (count > 0) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.countContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.countText}>{count}</Text>
      </Animated.View>
      <Text style={styles.label}>Going Live...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  countContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  countText: {
    fontSize: 64,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  label: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
