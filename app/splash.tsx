import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';
import { Colors } from '@/constants/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/auth-store';
import { useTheme } from '@/hooks/theme-store';

export default function SplashScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        try {
          if (isAuthenticated) {
            router.replace('/(tabs)');
          } else {
            router.replace('/auth');
          }
        } catch (error) {
          console.warn('Navigation error:', error);
          // Retry navigation after a short delay
          setTimeout(() => {
            try {
              if (isAuthenticated) {
                router.replace('/(tabs)');
              } else {
                router.replace('/auth');
              }
            } catch (retryError) {
              console.error('Retry navigation failed:', retryError);
            }
          }, 500);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/k7tu86i3z6m51kdeomv1w' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: colors.text }]}>VibeSync</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Connect & Experience</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 320,
    height: 320,
    marginBottom: 32,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500' as const,
  },
});