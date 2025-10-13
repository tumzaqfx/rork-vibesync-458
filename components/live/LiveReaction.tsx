import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { LiveReaction as LiveReactionType } from '@/types/live';

interface LiveReactionProps {
  reaction: LiveReactionType;
  onComplete: () => void;
}

const REACTION_EMOJIS = {
  heart: '❤️',
  fire: '🔥',
  clap: '👏',
  wow: '😮',
  laugh: '😂',
};

export function LiveReaction({ reaction, onComplete }: LiveReactionProps) {
  const translateYRef = useRef<Animated.Value>(new Animated.Value(0));
  const opacityRef = useRef<Animated.Value>(new Animated.Value(1));

  const translateY = translateYRef.current;
  const opacity = opacityRef.current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -300,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, [translateY, opacity, onComplete]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: reaction.x,
          bottom: reaction.y,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.emoji}>{REACTION_EMOJIS[reaction.type]}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  emoji: {
    fontSize: 32,
  },
});
