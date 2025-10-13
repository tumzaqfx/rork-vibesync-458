import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/hooks/theme-store';
import { Story } from '@/types';
import { Plus, Mic } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StoryCircleProps {
  story?: Story;
  isYourStory?: boolean;
  onPress: () => void;
  testID?: string;
}

export const StoryCircle: React.FC<StoryCircleProps> = ({
  story,
  isYourStory = false,
  onPress,
  testID,
}) => {
  const { colors } = useTheme();

  const getGradientColors = (): [string, string, ...string[]] => {
    if (story?.isLive) {
      return ['#FF0000', '#FF4444', '#FF0000'];
    }
    if (story?.viewed) {
      return ['#C7C7CC', '#C7C7CC'];
    }
    return ['#f58529', '#dd2a7b', '#8134af', '#515bd4'];
  };

  const hasNewContent = !story?.viewed && !isYourStory;

  const isVoiceStory = story?.mediaType === 'voice';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={testID}
      activeOpacity={0.7}
    >
      <View style={styles.storyWrapper}>
        {isYourStory ? (
          <View style={styles.yourStoryContainer}>
            <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
              <Avatar uri={story?.profileImage} size={64} />
            </View>
            <View style={[styles.addButton, { backgroundColor: colors.primary }]}>
              <Plus size={16} color="#FFFFFF" strokeWidth={3} />
            </View>
          </View>
        ) : (
          <View style={styles.storyContainer}>
            {hasNewContent && (
              <View style={styles.pulseRing}>
                <LinearGradient
                  colors={['#f58529', '#dd2a7b', '#8134af', '#515bd4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pulseGradient}
                />
              </View>
            )}
            <LinearGradient
              colors={getGradientColors()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientRing}
            >
              <View style={[styles.innerRing, { backgroundColor: colors.background }]}>
                <Avatar uri={story?.profileImage} size={64} />
              </View>
            </LinearGradient>
            
            {story?.isLive && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
            
            {isVoiceStory && (
              <View style={[styles.voiceBadge, { backgroundColor: colors.primary }]}>
                <Mic size={12} color="#FFFFFF" />
              </View>
            )}
          </View>
        )}
      </View>

      <Text
        style={[styles.username, { color: colors.text }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {isYourStory ? 'Your story' : story?.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 80,
  },
  storyWrapper: {
    marginBottom: 8,
  },
  yourStoryContainer: {
    position: 'relative',
  },
  avatarContainer: {
    borderWidth: 2,
    borderRadius: 36,
    padding: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  storyContainer: {
    position: 'relative',
  },
  gradientRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  innerRing: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -20 }],
    backgroundColor: '#FF0000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000000',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700' as const,
  },
  voiceBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  pulseRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    opacity: 0.25,
    overflow: 'hidden',
    top: -4,
    left: -4,
  },
  pulseGradient: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 12,
    fontWeight: '400' as const,
    textAlign: 'center',
    width: 80,
  },
});
