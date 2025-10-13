import React, { useState, useEffect, memo } from 'react';
import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { imageCache } from './image-cache';

interface OptimizedImageProps extends Omit<ExpoImageProps, 'source'> {
  uri: string;
  width?: number;
  height?: number;
  blurhash?: string;
  priority?: 'low' | 'normal' | 'high';
  cachePolicy?: 'memory' | 'disk' | 'memory-disk';
}

const OptimizedImageComponent: React.FC<OptimizedImageProps> = ({
  uri,
  width,
  height,
  blurhash,
  priority = 'normal',
  cachePolicy = 'memory-disk',
  style,
  ...props
}) => {
  const [cachedUri, setCachedUri] = useState<string>(uri);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      if (!uri) {
        setLoading(false);
        return;
      }

      try {
        if (cachePolicy !== 'memory') {
          const cached = await imageCache.get(uri);
          if (cached && mounted) {
            setCachedUri(cached);
          }
        }
      } catch (error) {
        console.warn('[OptimizedImage] Cache load error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (priority === 'high') {
      loadImage();
    } else {
      const timeout = setTimeout(loadImage, priority === 'normal' ? 0 : 100);
      return () => clearTimeout(timeout);
    }

    return () => {
      mounted = false;
    };
  }, [uri, priority, cachePolicy]);

  return (
    <View style={[{ width, height }, style]}>
      <ExpoImage
        source={{ uri: cachedUri }}
        style={[StyleSheet.absoluteFill, style]}
        placeholder={blurhash}
        contentFit="cover"
        transition={200}
        cachePolicy={cachePolicy}
        priority={priority}
        {...props}
      />
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});

export const OptimizedImage = memo(OptimizedImageComponent, (prev, next) => {
  return (
    prev.uri === next.uri &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.priority === next.priority
  );
});
