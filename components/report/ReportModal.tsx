import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { X, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { useReportBlock } from '@/hooks/report-block-store';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'user' | 'post' | 'comment' | 'vibe' | 'story';
  targetName?: string;
}

export function ReportModal({ visible, onClose, targetId, targetType, targetName }: ReportModalProps) {
  const { colors } = useTheme();
  const { reportContent, getReportReasons } = useReportBlock();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = getReportReasons();

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    const success = await reportContent(targetId, targetType, selectedReason, description);
    setIsSubmitting(false);

    if (success) {
      Alert.alert(
        'Report Submitted',
        'Thank you for helping keep VibeSync safe. We will review your report.',
        [{ text: 'OK', onPress: () => {
          setSelectedReason(null);
          setDescription('');
          onClose();
        }}]
      );
    } else {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.container, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <AlertTriangle size={24} color={colors.error} />
              <Text style={[styles.title, { color: colors.text }]}>
                Report {targetType === 'user' ? 'User' : 'Content'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {targetName && (
            <View style={[styles.targetInfo, { backgroundColor: colors.background }]}>
              <Text style={[styles.targetText, { color: colors.textSecondary }]}>
                Reporting: <Text style={{ color: colors.text, fontWeight: '600' as const }}>{targetName}</Text>
              </Text>
            </View>
          )}

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Why are you reporting this?
            </Text>

            {reasons.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonItem,
                  { borderColor: colors.border },
                  selectedReason === reason.id && { 
                    borderColor: colors.primary,
                    backgroundColor: colors.glass 
                  },
                ]}
                onPress={() => setSelectedReason(reason.id)}
              >
                <View style={styles.reasonContent}>
                  <Text style={[
                    styles.reasonLabel,
                    { color: colors.text },
                    selectedReason === reason.id && { color: colors.primary, fontWeight: '600' as const },
                  ]}>
                    {reason.label}
                  </Text>
                  <Text style={[styles.reasonDescription, { color: colors.textSecondary }]}>
                    {reason.description}
                  </Text>
                </View>
                {selectedReason === reason.id && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
              Additional Details (Optional)
            </Text>
            <TextInput
              style={[
                styles.descriptionInput,
                { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Provide more context about your report..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.disclaimer}>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                Your report is anonymous. We'll review it and take appropriate action according to our Community Guidelines.
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.background }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.error },
                (!selectedReason || isSubmitting) && { opacity: 0.5 },
              ]}
              onPress={handleSubmit}
              disabled={!selectedReason || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  targetInfo: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  targetText: {
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  reasonContent: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  reasonDescription: {
    fontSize: 13,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  descriptionInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 100,
  },
  disclaimer: {
    marginTop: 16,
    marginBottom: 8,
  },
  disclaimerText: {
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
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
