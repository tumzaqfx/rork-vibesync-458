import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';
import { ShareSheet } from '@/components/engagement/ShareSheet';
import { mockPosts } from '@/mocks/posts';
import { mockVibes } from '@/mocks/vibes';
import { Share2, Music, Video } from 'lucide-react-native';

export default function ShareDemoScreen() {
  const { colors } = useTheme();
  const [shareSheetVisible, setShareSheetVisible] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [contentType, setContentType] = useState<'post' | 'vibe' | 'song'>('post');

  const handleSharePost = () => {
    setSelectedContent(mockPosts[0]);
    setContentType('post');
    setShareSheetVisible(true);
  };

  const handleShareVibe = () => {
    setSelectedContent(mockVibes[0]);
    setContentType('vibe');
    setShareSheetVisible(true);
  };

  const handleShareSong = () => {
    setSelectedContent({
      id: 'song-1',
      title: 'Summer Nights',
      artist: 'The Weeknd',
      content: 'Summer Nights - The Weeknd',
    });
    setContentType('song');
    setShareSheetVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Share Demo',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.text }]}>
            VibeSync Share Content Flow
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Test the unique share sheet with VibeStreak indicators, multi-select, and Quick Vibe reactions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Features
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                VibeStreak flame badges for friends you&apos;ve interacted with in the last 7 days
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Multi-select friends with glowing borders
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Quick Vibe reactions (🔥, 😂, 💜, ✨) for instant sharing
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Content preview box showing thumbnail and caption
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Search bar to quickly find friends
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Horizontal scroll of frequent contacts at the top
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Try It Out
          </Text>

          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: colors.primary }]}
            onPress={handleSharePost}
            activeOpacity={0.8}
          >
            <Share2 size={24} color="#FFF" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>Share a Post</Text>
              <Text style={styles.buttonSubtitle}>
                Share a text post with images
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: '#FF6B35' }]}
            onPress={handleShareVibe}
            activeOpacity={0.8}
          >
            <Video size={24} color="#FFF" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>Share a Vibe</Text>
              <Text style={styles.buttonSubtitle}>
                Share a short video reel
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: '#10B981' }]}
            onPress={handleShareSong}
            activeOpacity={0.8}
          >
            <Music size={24} color="#FFF" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>Share a Song</Text>
              <Text style={styles.buttonSubtitle}>
                Share a music track
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How It Works
          </Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>
                Tap any share button above to open the share sheet
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>
                Search or scroll to find friends (look for flame badges!)
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>
                Select multiple friends by tapping their avatars
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>
                Toggle Quick Vibe and pick a reaction, or write a custom message
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>
                Tap the send button to share with all selected friends
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {selectedContent && (
        <ShareSheet
          visible={shareSheetVisible}
          onClose={() => setShareSheetVisible(false)}
          content={selectedContent}
          contentType={contentType}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    gap: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 4,
  },
});
