import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { X, Hash, Users, Clock, Mic } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { useSpill } from '@/hooks/spill-store';

export default function StartSpillScreen() {
  const { colors } = useTheme();
  const { startSpill } = useSpill();
  const [topicName, setTopicName] = useState('');
  const [topicType, setTopicType] = useState<'hashtag' | 'name'>('name');

  const handleStartSpill = () => {
    if (!topicName.trim()) {
      Alert.alert('Error', 'Please enter a topic name');
      return;
    }

    const spill = startSpill(
      `topic-${Date.now()}`,
      topicType === 'hashtag' ? `#${topicName.replace('#', '')}` : topicName,
      topicType
    );

    router.replace(`/spill/${spill.id}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Start a Spill</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Mic size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Start a live audio conversation
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Share your thoughts, debate topics, or just chat with your community in real-time
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Topic Type</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: colors.card },
                topicType === 'name' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setTopicType('name')}
            >
              <Users size={20} color={topicType === 'name' ? '#FFFFFF' : colors.textSecondary} />
              <Text style={[
                styles.typeText,
                { color: topicType === 'name' ? '#FFFFFF' : colors.textSecondary }
              ]}>
                General Topic
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: colors.card },
                topicType === 'hashtag' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setTopicType('hashtag')}
            >
              <Hash size={20} color={topicType === 'hashtag' ? '#FFFFFF' : colors.textSecondary} />
              <Text style={[
                styles.typeText,
                { color: topicType === 'hashtag' ? '#FFFFFF' : colors.textSecondary }
              ]}>
                Hashtag
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Topic Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder={topicType === 'hashtag' ? 'Enter hashtag (without #)' : 'What do you want to talk about?'}
            placeholderTextColor={colors.textSecondary}
            value={topicName}
            onChangeText={setTopicName}
            autoFocus
            maxLength={60}
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {topicName.length}/60
          </Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Your spill will start immediately
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                You can invite co-hosts and speakers once the spill is live
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={handleStartSpill}
        >
          <Mic size={20} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Spill</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  typeText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  charCount: {
    fontSize: 13,
    textAlign: 'right',
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600' as const,
  },
});
