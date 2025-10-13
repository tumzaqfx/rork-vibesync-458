import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { useTheme } from '@/hooks/theme-store';

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
}

export function AnimatedLogo({ size = 'medium' }: AnimatedLogoProps) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const innerPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Aqua pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Float animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    // Inner pulse animation
    const innerPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(innerPulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(innerPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    floatAnimation.start();
    innerPulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      floatAnimation.stop();
      innerPulseAnimation.stop();
    };
  }, []);

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  const sizeStyles = {
    small: { fontSize: 16, iconSize: 20 },
    medium: { fontSize: 20, iconSize: 24 },
    large: { fontSize: 28, iconSize: 32 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Main gradient background */}
        <Animated.View
          style={[
            styles.mainGradient,
            {
              width: currentSize.iconSize + 12,
              height: currentSize.iconSize + 12,
              borderRadius: (currentSize.iconSize + 12) * 0.3,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        
        {/* Floating overlay */}
        <Animated.View
          style={[
            styles.floatingOverlay,
            {
              width: currentSize.iconSize + 12,
              height: currentSize.iconSize + 12,
              borderRadius: (currentSize.iconSize + 12) * 0.3,
              transform: [{ translateY: floatTranslate }],
            },
          ]}
        />
        
        {/* Inner white circle with gradient dot */}
        <View style={[
          styles.innerCircle,
          {
            width: currentSize.iconSize * 0.5,
            height: currentSize.iconSize * 0.5,
            borderRadius: currentSize.iconSize * 0.25,
          }
        ]}>
          <Animated.View
            style={[
              styles.innerDot,
              {
                width: currentSize.iconSize * 0.25,
                height: currentSize.iconSize * 0.25,
                borderRadius: currentSize.iconSize * 0.125,
                transform: [{ scale: innerPulseAnim }],
              },
            ]}
          />
        </View>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.logoText, { fontSize: currentSize.fontSize, color: '#00CED1' }]}>VibeSync</Text>
        <Text style={[styles.logoSubtext, { fontSize: currentSize.fontSize * 0.5, color: colors.textSecondary }]}>
          Connect & Experience
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainGradient: {
    position: 'absolute',
    backgroundColor: '#00CED1', // Aqua color
    shadowColor: '#00CED1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingOverlay: {
    position: 'absolute',
    backgroundColor: '#40E0D0', // Lighter aqua
    opacity: 0.8,
  },
  innerCircle: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  innerDot: {
    backgroundColor: '#3B82F6',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logoText: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoSubtext: {
    fontWeight: '500',
    marginTop: -2,
  },
});