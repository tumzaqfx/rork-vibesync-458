import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/theme-store';
import { Sparkles, Compass } from 'lucide-react-native';
import { router } from 'expo-router';

export function CaughtUpMessage() {
  const { colors } = useTheme();

  const handleDiscoverPress = () => {
    router.push('/(tabs)/discover');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.iconContainer}>
        <Sparkles size={32} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>
        You&apos;re all caught up!
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        You&apos;ve seen all the latest vibez from your circle
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleDiscoverPress}
        activeOpacity={0.8}
      >
        <Compass size={18} color="#FFFFFF" />
        <Text style={styles.buttonText}>
          Discover New Vibez
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
