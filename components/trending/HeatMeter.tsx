import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Flame } from 'lucide-react-native';

interface HeatMeterProps {
  velocity: number;
  status: 'breaking' | 'peaking' | 'stable' | 'fading';
}

export const HeatMeter: React.FC<HeatMeterProps> = ({ velocity, status }) => {
  const flameAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'breaking' || status === 'peaking') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(flameAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [status, flameAnim, scaleAnim]);

  const getHeatLevel = () => {
    if (velocity > 15) return 3;
    if (velocity > 10) return 2;
    if (velocity > 5) return 1;
    return 0;
  };

  const getFlameColor = () => {
    switch (status) {
      case 'breaking':
        return '#FF4444';
      case 'peaking':
        return '#FFA500';
      case 'stable':
        return '#4ECDC4';
      case 'fading':
        return '#888888';
    }
  };

  const heatLevel = getHeatLevel();
  const flameColor = getFlameColor();

  const opacity = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <View style={styles.container}>
      {[...Array(3)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor:
                index < heatLevel ? flameColor : 'rgba(136, 136, 136, 0.2)',
            },
          ]}
        />
      ))}
      {(status === 'breaking' || status === 'peaking') && (
        <Animated.View
          style={[
            styles.flameContainer,
            {
              opacity,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Flame size={12} color={flameColor} fill={flameColor} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
    position: 'relative',
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  flameContainer: {
    position: 'absolute',
    right: -16,
    top: -2,
  },
});
