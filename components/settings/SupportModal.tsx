import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { X, Send } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'contact' | 'bug' | 'feedback';
}

export default function SupportModal({ visible, onClose, type }: SupportModalProps) {
  const { colors } = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const getTitle = () => {
    switch (type) {
      case 'contact': return 'Contact Support';
      case 'bug': return 'Report a Bug';
      case 'feedback': return 'Submit Feedback';
      default: return 'Support';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'bug': return 'Describe the bug you encountered...';
      case 'feedback': return 'Share your feedback with us...';
      default: return 'How can we help you?';
    }
  };

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Success',
      'Your message has been sent. We\'ll get back to you soon!',
      [
        {
          text: 'OK',
          onPress: () => {
            setSubject('');
            setMessage('');
            setEmail('');
            onClose();
          },
        },
      ]
    );
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
            <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.cardLight, color: colors.text }]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Subject</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.cardLight, color: colors.text }]}
                  placeholder="Brief description"
                  placeholderTextColor={colors.textSecondary}
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Message</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.cardLight, color: colors.text }]}
                  placeholder={getPlaceholder()}
                  placeholderTextColor={colors.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>

              {type === 'bug' && (
                <View style={[styles.infoBox, { backgroundColor: colors.glass }]}>
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    Please include steps to reproduce the bug and any error messages you saw.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
              >
                <Send size={18} color={colors.textInverse} />
                <Text style={[styles.submitText, { color: colors.textInverse }]}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 15,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 15,
    minHeight: 150,
  },
  infoBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
