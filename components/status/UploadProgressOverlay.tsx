import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { CheckCircle, XCircle, Loader, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/theme-store';
import { StatusUploadProgress } from '@/types/status';

interface UploadProgressOverlayProps {
  uploads: StatusUploadProgress[];
  onDismiss?: (statusId: string) => void;
  onRetry?: (statusId: string) => void;
}

export default function UploadProgressOverlay({ 
  uploads, 
  onDismiss,
  onRetry 
}: UploadProgressOverlayProps) {
  const { colors } = useTheme();

  if (uploads.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {uploads.map((upload) => (
        <UploadProgressCard
          key={upload.statusId}
          upload={upload}
          onDismiss={onDismiss}
          onRetry={onRetry}
        />
      ))}
    </View>
  );
}

interface UploadProgressCardProps {
  upload: StatusUploadProgress;
  onDismiss?: (statusId: string) => void;
  onRetry?: (statusId: string) => void;
}

function UploadProgressCard({ upload, onDismiss, onRetry }: UploadProgressCardProps) {
  const { colors } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: upload.progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [upload.progress]);

  useEffect(() => {
    if (upload.status === 'success') {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onDismiss?.(upload.statusId);
        });
      }, 2000);
    }
  }, [upload.status]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const getStatusIcon = () => {
    switch (upload.status) {
      case 'success':
        return <CheckCircle size={24} color="#4ECDC4" />;
      case 'error':
        return <XCircle size={24} color="#FF6B6B" />;
      case 'processing':
        return <Loader size={24} color="#667eea" />;
      default:
        return <Loader size={24} color="#667eea" />;
    }
  };

  const getStatusText = () => {
    switch (upload.status) {
      case 'uploading':
        return `Uploading... ${upload.progress}%`;
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Status uploaded successfully!';
      case 'error':
        return upload.error || 'Upload failed';
      default:
        return 'Uploading...';
    }
  };

  const getStatusColor = () => {
    switch (upload.status) {
      case 'success':
        return '#4ECDC4';
      case 'error':
        return '#FF6B6B';
      default:
        return '#667eea';
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { 
          backgroundColor: colors.card,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          {getStatusIcon()}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.statusText, { color: colors.text }]}>
            {getStatusText()}
          </Text>
          
          {upload.status === 'uploading' && (
            <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { 
                    width: progressWidth,
                    backgroundColor: getStatusColor(),
                  },
                ]}
              />
            </View>
          )}

          {upload.status === 'error' && onRetry && (
            <TouchableOpacity
              onPress={() => onRetry(upload.statusId)}
              style={[styles.retryButton, { backgroundColor: '#667eea' }]}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>

        {(upload.status === 'error' || upload.status === 'success') && onDismiss && (
          <TouchableOpacity
            onPress={() => onDismiss(upload.statusId)}
            style={styles.closeButton}
          >
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {upload.status === 'success' && (
        <View style={styles.successOverlay}>
          <LinearGradient
            colors={['rgba(78, 205, 196, 0.1)', 'rgba(78, 205, 196, 0)']}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute' as const,
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden' as const,
  },
  cardContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start' as const,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  closeButton: {
    padding: 4,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none' as const,
  },
});
