import React, { Suspense, lazy, ComponentType } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

function DefaultFallback() {
  return (
    <View style={styles.fallbackContainer}>
      <ActivityIndicator size="large" color="#8B5CF6" />
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const LazyPostCard = lazyLoad(() => import('@/components/home/PostCard').then(m => ({ default: (m as any).default || m as any })));
export const LazyUserCard = lazyLoad(() => import('@/components/discover/UserCard').then(m => ({ default: (m as any).default || m as any })));
export const LazyStoryCircle = lazyLoad(() => import('@/components/home/StoryCircle').then(m => ({ default: (m as any).default || m as any })));
