import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSpill } from '@/hooks/spill-store';
import { Spill } from '@/types/spill';

export default function SuggestedSpills() {
  const { getSuggestedSpills } = useSpill();
  const suggestedSpills = getSuggestedSpills();

  if (suggestedSpills.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💧 Live Spills</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/spills')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestedSpills.map((spill) => (
          <SpillCard key={spill.id} spill={spill} />
        ))}
      </ScrollView>
    </View>
  );
}

type SpillCardProps = {
  spill: Spill;
};

function SpillCard({ spill }: SpillCardProps) {
  const handlePress = () => {
    console.log('[SuggestedSpills] Opening spill:', spill.id);
    router.push(`/spill/${spill.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} testID={`suggested-spill-${spill.id}`}>
      <LinearGradient
        colors={['#131628', '#2E256E', '#7B61FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.liveBadge}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.listenerCount}>👥 {formatListenerCount(spill.listenerCount)}</Text>
        </View>

        <Text style={styles.topicName}>{spill.topicName}</Text>
        <Text style={styles.topicDescription}>People are spilling tea about {spill.topicName}</Text>

        <View style={styles.hostsContainer}>
          <View style={styles.avatarStack}>
            <Image source={{ uri: spill.hostAvatar }} style={styles.hostAvatar} contentFit="cover" />
            {spill.cohosts.slice(0, 2).map((cohost, index) => (
              <Image 
                key={cohost.id} 
                source={{ uri: cohost.avatar }} 
                style={[styles.cohostAvatar, { left: 20 + (index * 15) }]} 
                contentFit="cover" 
              />
            ))}
          </View>
          <View style={styles.hostInfo}>
            <Text style={styles.hostName} numberOfLines={1}>
              {spill.hostName}
              {spill.cohosts.length > 0 && ` +${spill.cohosts.length}`}
            </Text>
            <Text style={styles.hostLabel}>Host</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.joinButton} onPress={handlePress}>
          <Text style={styles.joinButtonText}>Join Spill</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function formatListenerCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#7B61FF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 280,
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FF3B30',
  },
  listenerCount: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  topicName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  topicDescription: {
    fontSize: 13,
    color: '#A88FFF',
    marginBottom: 16,
  },
  hostsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarStack: {
    flexDirection: 'row',
    position: 'relative' as const,
    width: 60,
    height: 32,
    marginRight: 12,
  },
  hostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#131628',
    position: 'absolute' as const,
    left: 0,
  },
  cohostAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#131628',
    position: 'absolute' as const,
    top: 2,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  hostLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  joinButton: {
    backgroundColor: '#7B61FF',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
