import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Radio } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSpill } from '@/hooks/spill-store';
import { useTrending } from '@/hooks/trending-store';

type StartSpillModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function StartSpillModal({ visible, onClose }: StartSpillModalProps) {
  const { startSpill } = useSpill();
  const { trendingTopics } = useTrending();
  const [selectedTopic, setSelectedTopic] = useState<{ id: string; name: string; type: 'hashtag' | 'name' } | null>(null);

  const handleStartSpill = () => {
    if (!selectedTopic) return;

    console.log('[StartSpillModal] Starting spill for topic:', selectedTopic.name);
    const spill = startSpill(selectedTopic.id, selectedTopic.name, selectedTopic.type);
    onClose();
    router.push(`/spill/${spill.id}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#131628', '#2E256E']}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <Text style={styles.title}>💧 Start a Spill</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>Choose a trending topic to discuss</Text>

            <ScrollView style={styles.topicsList} showsVerticalScrollIndicator={false}>
              {trendingTopics.slice(0, 10).map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.topicItem,
                    selectedTopic?.id === topic.id && styles.topicItemSelected,
                  ]}
                  onPress={() => setSelectedTopic({ 
                    id: topic.id, 
                    name: topic.title, 
                    type: topic.hashtag ? 'hashtag' : 'name' 
                  })}
                >
                  <View style={styles.topicLeft}>
                    <View style={styles.radioButton}>
                      {selectedTopic?.id === topic.id && (
                        <Radio size={16} color="#7B61FF" fill="#7B61FF" />
                      )}
                    </View>
                    <View style={styles.topicInfo}>
                      <Text style={styles.topicName}>{topic.title}</Text>
                      <Text style={styles.topicStats}>
                        {formatCount(topic.posts)} posts · {formatCount(topic.engagement)} engaged
                      </Text>
                    </View>
                  </View>
                  <View style={styles.heatBadge}>
                    <Text style={styles.heatText}>🔥 {Math.round(topic.trendingScore)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.startButton, !selectedTopic && styles.startButtonDisabled]}
                onPress={handleStartSpill}
                disabled={!selectedTopic}
              >
                <LinearGradient
                  colors={selectedTopic ? ['#7B61FF', '#A88FFF'] : ['#3A3A3C', '#3A3A3C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startButtonGradient}
                >
                  <Text style={styles.startButtonText}>Start Live Spill</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

function formatCount(count: number | undefined): string {
  if (!count && count !== 0) return '0';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  topicsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  topicItemSelected: {
    borderColor: '#7B61FF',
    backgroundColor: 'rgba(123, 97, 255, 0.1)',
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7B61FF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  topicStats: {
    fontSize: 12,
    color: '#8E8E93',
  },
  heatBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  heatText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FF9500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  startButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
