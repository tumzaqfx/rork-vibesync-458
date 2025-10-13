import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface FAQModalProps {
  visible: boolean;
  onClose: () => void;
}

const FAQS: FAQ[] = [
  {
    category: 'Account',
    question: 'How do I create an account?',
    answer: 'Tap "Sign Up" on the login screen, enter your details, and follow the verification steps. You can also sign up using Google, Facebook, or Apple.',
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Go to Settings > Change Password, or use "Forgot Password" on the login screen. You\'ll receive a verification code via email.',
  },
  {
    category: 'Account',
    question: 'How do I get verified?',
    answer: 'Verified badges are given to notable public figures, celebrities, and brands. Submit a verification request through Settings > Account.',
  },
  {
    category: 'Privacy',
    question: 'Who can see my posts?',
    answer: 'You can control post visibility in Settings > Privacy. Choose between Public (everyone), Friends Only, or Private.',
  },
  {
    category: 'Privacy',
    question: 'How do I block someone?',
    answer: 'Go to their profile, tap the menu icon, and select "Block User". They won\'t be able to see your content or contact you.',
  },
  {
    category: 'Privacy',
    question: 'What is screenshot protection?',
    answer: 'Screenshot protection prevents others from taking screenshots of your messages. You\'ll be notified if someone attempts to screenshot.',
  },
  {
    category: 'Features',
    question: 'What are Vibes?',
    answer: 'Vibes are short-form video content similar to reels. Create engaging videos with music, filters, and effects.',
  },
  {
    category: 'Features',
    question: 'How do voice posts work?',
    answer: 'Voice posts let you share audio messages up to 60 seconds. Tap the microphone icon when creating a post.',
  },
  {
    category: 'Features',
    question: 'What is VibeScore?',
    answer: 'VibeScore is your engagement rating based on interactions, content quality, and community participation. Higher scores unlock features.',
  },
  {
    category: 'Messaging',
    question: 'What are View Once messages?',
    answer: 'View Once messages disappear after being opened once. Perfect for sensitive content you don\'t want saved.',
  },
  {
    category: 'Messaging',
    question: 'Can I make voice/video calls?',
    answer: 'Yes! Open any conversation and tap the phone or video icon to start a call.',
  },
  {
    category: 'Content',
    question: 'How do I report inappropriate content?',
    answer: 'Tap the menu icon on any post and select "Report". Choose the reason and submit. Our team reviews all reports.',
  },
  {
    category: 'Content',
    question: 'Can I edit posts after publishing?',
    answer: 'Yes, tap the menu icon on your post and select "Edit". You have 24 hours to edit after posting.',
  },
  {
    category: 'Technical',
    question: 'Why is the app running slow?',
    answer: 'Try clearing cache in Settings > Data & Storage > Clear Cache. Also ensure you have the latest app version.',
  },
  {
    category: 'Technical',
    question: 'How do I enable notifications?',
    answer: 'Go to Settings > Notifications and toggle on the types of notifications you want to receive.',
  },
];

export default function FAQModal({ visible, onClose }: FAQModalProps) {
  const { colors } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = Array.from(new Set(FAQS.map(faq => faq.category)));

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
            <Text style={[styles.title, { color: colors.text }]}>Frequently Asked Questions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <View key={category} style={styles.categorySection}>
                <Text style={[styles.categoryTitle, { color: colors.primary }]}>{category}</Text>
                {FAQS.filter(faq => faq.category === category).map((faq, index) => {
                  const globalIndex = FAQS.indexOf(faq);
                  const isExpanded = expandedIndex === globalIndex;

                  return (
                    <TouchableOpacity
                      key={globalIndex}
                      style={[styles.faqItem, { backgroundColor: colors.cardLight }]}
                      onPress={() => setExpandedIndex(isExpanded ? null : globalIndex)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.questionRow}>
                        <Text style={[styles.question, { color: colors.text }]}>{faq.question}</Text>
                        {isExpanded ? (
                          <ChevronUp size={20} color={colors.textSecondary} />
                        ) : (
                          <ChevronDown size={20} color={colors.textSecondary} />
                        )}
                      </View>
                      {isExpanded && (
                        <Text style={[styles.answer, { color: colors.textSecondary }]}>{faq.answer}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <View style={[styles.contactBox, { backgroundColor: colors.glass }]}>
              <Text style={[styles.contactTitle, { color: colors.text }]}>Still have questions?</Text>
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                Contact our support team at support@vibesync.com
              </Text>
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
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  categorySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  faqItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  question: {
    fontSize: 15,
    fontWeight: '600' as const,
    flex: 1,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  contactBox: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
