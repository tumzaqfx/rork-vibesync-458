import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/hooks/theme-store';
import { Sparkles } from 'lucide-react-native';

interface SmartRefreshControlProps {
  refreshing: boolean;
}

export function SmartRefreshControl({ refreshing }: SmartRefreshControlProps) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (refreshing) {
      fadeAnim.setValue(1);
      
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 2,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        pulseAnim.setValue(1);
        rotateAnim.setValue(0);
      });
    }
  }, [refreshing, pulseAnim, rotateAnim, fadeAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  if (!refreshing) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        }
      ]}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: pulseAnim },
              { rotate },
            ],
          },
        ]}
      >
        <Sparkles size={24} color={colors.primary} />
      </Animated.View>
      <Text style={[styles.text, { color: colors.text }]}>
        Refreshing Vibez...
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
