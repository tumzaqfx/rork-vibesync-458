import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, ScrollView, Switch, Platform } from 'react-native';
import { Lock, Image as ImageIcon, Video, Mic, RotateCcw, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { BlurView } from 'expo-blur';

interface ViewOnceComposerProps {
  visible: boolean;
  onClose: () => void;
  onSend: (options: ViewOnceOptions) => void;
}

export interface ViewOnceOptions {
  type: 'image' | 'video' | 'voice';
  allowReplay: boolean;
  maxReplays: number;
}

export function ViewOnceComposer({ visible, onClose, onSend }: ViewOnceComposerProps) {
  const { colors, isDark } = useTheme();
  const [selectedType, setSelectedType] = useState<'image' | 'video' | 'voice'>('image');
  const [allowReplay, setAllowReplay] = useState(false);
  const [maxReplays, setMaxReplays] = useState(1);

  const handleSend = () => {
    onSend({
      type: selectedType,
      allowReplay,
      maxReplays: allowReplay ? maxReplays : 0,
    });
    onClose();
  };

  const mediaTypes = [
    { type: 'image' as const, icon: ImageIcon, label: 'Photo', emoji: '📷' },
    { type: 'video' as const, icon: Video, label: 'Video', emoji: '🎥' },
    { type: 'voice' as const, icon: Mic, label: 'Voice', emoji: '🎤' },
  ];

  const replayOptions = [1, 2, 3];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {Platform.OS === 'web' ? (
            <View style={[styles.content, { backgroundColor: colors.card }]}>
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View style={[styles.lockBadge, { backgroundColor: colors.primary }]}>
                  <Lock size={16} color={colors.text} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Send View Once</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Media Type</Text>
                <View style={styles.mediaTypeGrid}>
                  {mediaTypes.map((media) => {
                    const Icon = media.icon;
                    const isSelected = selectedType === media.type;
                    return (
                      <TouchableOpacity
                        key={media.type}
                        style={[
                          styles.mediaTypeCard,
                          { backgroundColor: colors.cardLight },
                          isSelected && { 
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                            borderWidth: 2,
                          }
                        ]}
                        onPress={() => setSelectedType(media.type)}
                      >
                        <Text style={styles.mediaEmoji}>{media.emoji}</Text>
                        <Icon 
                          size={24} 
                          color={isSelected ? colors.text : colors.textSecondary} 
                        />
                        <Text style={[
                          styles.mediaLabel,
                          { color: isSelected ? colors.text : colors.textSecondary }
                        ]}>
                          {media.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.replaySection}>
                  <View style={styles.replaySectionHeader}>
                    <View style={styles.replayIconContainer}>
                      <RotateCcw size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 2 }]}>
                        Allow Replay
                      </Text>
                      <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                        Let recipient view the message multiple times
                      </Text>
                    </View>
                    <Switch
                      value={allowReplay}
                      onValueChange={setAllowReplay}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={colors.text}
                    />
                  </View>

                  {allowReplay && (
                    <View style={styles.replayOptionsContainer}>
                      <Text style={[styles.replayOptionsLabel, { color: colors.textSecondary }]}>
                        Maximum replays
                      </Text>
                      <View style={styles.replayOptionsGrid}>
                        {replayOptions.map((count) => (
                          <TouchableOpacity
                            key={count}
                            style={[
                              styles.replayOption,
                              { backgroundColor: colors.cardLight },
                              maxReplays === count && { 
                                backgroundColor: colors.primary,
                                borderColor: colors.primary,
                                borderWidth: 2,
                              }
                            ]}
                            onPress={() => setMaxReplays(count)}
                          >
                            <Text style={[
                              styles.replayOptionText,
                              { color: maxReplays === count ? colors.text : colors.textSecondary }
                            ]}>
                              {count}x
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                <View style={[styles.infoBox, { backgroundColor: colors.glass }]}>
                  <Lock size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    {allowReplay 
                      ? `Recipient can view this ${maxReplays} time${maxReplays > 1 ? 's' : ''}, then it will be deleted`
                      : 'Message will be deleted after one view'}
                  </Text>
                </View>
              </ScrollView>

              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: colors.cardLight }]}
                  onPress={onClose}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: colors.primary }]}
                  onPress={handleSend}
                >
                  <Lock size={18} color={colors.text} />
                  <Text style={[styles.sendButtonText, { color: colors.text }]}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <BlurView intensity={isDark ? 80 : 40} tint={isDark ? 'dark' : 'light'} style={styles.content}>
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View style={[styles.lockBadge, { backgroundColor: colors.primary }]}>
                  <Lock size={16} color={colors.text} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Send View Once</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Media Type</Text>
                <View style={styles.mediaTypeGrid}>
                  {mediaTypes.map((media) => {
                    const Icon = media.icon;
                    const isSelected = selectedType === media.type;
                    return (
                      <TouchableOpacity
                        key={media.type}
                        style={[
                          styles.mediaTypeCard,
                          { backgroundColor: colors.cardLight },
                          isSelected && { 
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                            borderWidth: 2,
                          }
                        ]}
                        onPress={() => setSelectedType(media.type)}
                      >
                        <Text style={styles.mediaEmoji}>{media.emoji}</Text>
                        <Icon 
                          size={24} 
                          color={isSelected ? colors.text : colors.textSecondary} 
                        />
                        <Text style={[
                          styles.mediaLabel,
                          { color: isSelected ? colors.text : colors.textSecondary }
                        ]}>
                          {media.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.replaySection}>
                  <View style={styles.replaySectionHeader}>
                    <View style={styles.replayIconContainer}>
                      <RotateCcw size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 2 }]}>
                        Allow Replay
                      </Text>
                      <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                        Let recipient view the message multiple times
                      </Text>
                    </View>
                    <Switch
                      value={allowReplay}
                      onValueChange={setAllowReplay}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={colors.text}
                    />
                  </View>

                  {allowReplay && (
                    <View style={styles.replayOptionsContainer}>
                      <Text style={[styles.replayOptionsLabel, { color: colors.textSecondary }]}>
                        Maximum replays
                      </Text>
                      <View style={styles.replayOptionsGrid}>
                        {replayOptions.map((count) => (
                          <TouchableOpacity
                            key={count}
                            style={[
                              styles.replayOption,
                              { backgroundColor: colors.cardLight },
                              maxReplays === count && { 
                                backgroundColor: colors.primary,
                                borderColor: colors.primary,
                                borderWidth: 2,
                              }
                            ]}
                            onPress={() => setMaxReplays(count)}
                          >
                            <Text style={[
                              styles.replayOptionText,
                              { color: maxReplays === count ? colors.text : colors.textSecondary }
                            ]}>
                              {count}x
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                <View style={[styles.infoBox, { backgroundColor: colors.glass }]}>
                  <Lock size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    {allowReplay 
                      ? `Recipient can view this ${maxReplays} time${maxReplays > 1 ? 's' : ''}, then it will be deleted`
                      : 'Message will be deleted after one view'}
                  </Text>
                </View>
              </ScrollView>

              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: colors.cardLight }]}
                  onPress={onClose}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: colors.primary }]}
                  onPress={handleSend}
                >
                  <Lock size={18} color={colors.text} />
                  <Text style={[styles.sendButtonText, { color: colors.text }]}>Continue</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '85%',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    gap: 12,
  },
  lockBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    maxHeight: 500,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 13,
  },
  mediaTypeGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  mediaTypeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 8,
  },
  mediaEmoji: {
    fontSize: 32,
  },
  mediaLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  divider: {
    height: 1,
    marginVertical: 24,
  },
  replaySection: {
    marginBottom: 24,
  },
  replaySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  replayIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replayOptionsContainer: {
    marginTop: 16,
  },
  replayOptionsLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  replayOptionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  replayOption: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  replayOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
