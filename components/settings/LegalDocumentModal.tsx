import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';

interface LegalDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function LegalDocumentModal({ visible, onClose, title, content }: LegalDocumentModalProps) {
  const { colors } = useTheme();

  const getDocumentContent = () => {
    switch (title) {
      case 'Terms of Service':
        return `Last Updated: January 1, 2025

1. Acceptance of Terms
By accessing and using VibeSync, you accept and agree to be bound by the terms and provision of this agreement.

2. Use License
Permission is granted to temporarily download one copy of the materials on VibeSync for personal, non-commercial transitory viewing only.

3. User Content
You retain all rights to the content you post on VibeSync. By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content.

4. Privacy
Your use of VibeSync is also governed by our Privacy Policy.

5. Prohibited Uses
You may not use VibeSync:
- For any unlawful purpose
- To harass, abuse, or harm another person
- To impersonate or attempt to impersonate VibeSync or another user
- To upload viruses or malicious code

6. Account Termination
We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms.

7. Limitation of Liability
VibeSync shall not be liable for any indirect, incidental, special, consequential or punitive damages.

8. Changes to Terms
We reserve the right to modify these terms at any time. We will notify users of any changes.

9. Contact Us
If you have any questions about these Terms, please contact us at legal@vibesync.com`;

      case 'Privacy Policy':
        return `Last Updated: January 1, 2025

1. Information We Collect
We collect information you provide directly to us, including:
- Account information (username, email, password)
- Profile information (bio, profile picture, cover image)
- Content you post (posts, comments, messages)
- Usage data (interactions, preferences)

2. How We Use Your Information
We use the information we collect to:
- Provide, maintain, and improve our services
- Personalize your experience
- Send you technical notices and support messages
- Respond to your comments and questions
- Protect against fraud and abuse

3. Information Sharing
We do not sell your personal information. We may share your information:
- With your consent
- To comply with legal obligations
- With service providers who assist us
- In connection with a merger or acquisition

4. Data Security
We implement appropriate security measures to protect your information. However, no method of transmission over the Internet is 100% secure.

5. Your Rights
You have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your account and data
- Export your data
- Opt-out of marketing communications

6. Cookies and Tracking
We use cookies and similar tracking technologies to track activity and hold certain information.

7. Children's Privacy
Our service is not intended for children under 13. We do not knowingly collect information from children under 13.

8. International Data Transfers
Your information may be transferred to and maintained on servers located outside of your jurisdiction.

9. Changes to Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any changes.

10. Contact Us
For privacy-related questions, contact us at privacy@vibesync.com`;

      case 'Community Guidelines':
        return `Last Updated: January 1, 2025

Welcome to VibeSync! Our community guidelines help create a safe and positive environment for everyone.

1. Be Respectful
- Treat others with kindness and respect
- No hate speech, harassment, or bullying
- Respect different opinions and perspectives

2. Authentic Content
- Post original content or give proper credit
- No impersonation or fake accounts
- Be honest and transparent

3. Safety First
- No violence, threats, or dangerous content
- No self-harm or suicide content
- Report concerning behavior

4. Privacy Matters
- Respect others' privacy
- Don't share personal information without consent
- No doxxing or stalking

5. Legal Compliance
- No illegal activities or content
- Respect intellectual property rights
- Follow local laws and regulations

6. Appropriate Content
- No nudity or sexual content
- No graphic violence or gore
- Age-appropriate content only

7. Spam and Manipulation
- No spam or fake engagement
- No misleading information
- No manipulation of features

8. Reporting Violations
If you see content that violates these guidelines:
- Use the report feature
- Block or mute problematic accounts
- Contact our support team

9. Consequences
Violations may result in:
- Content removal
- Account warnings
- Temporary suspension
- Permanent ban

10. Appeals
If you believe your content was removed in error, you can appeal the decision through our support system.

Together, we can build a vibrant and safe community!`;

      case 'Copyright / DMCA Policy':
        return `Last Updated: January 1, 2025

VibeSync respects the intellectual property rights of others and expects users to do the same.

1. Copyright Infringement Notification
If you believe your copyrighted work has been infringed, please provide:
- Your contact information
- Description of the copyrighted work
- Location of the infringing material
- A statement of good faith belief
- A statement of accuracy under penalty of perjury
- Your physical or electronic signature

2. DMCA Agent Contact
Send notifications to:
DMCA Agent
VibeSync Inc.
Email: dmca@vibesync.com

3. Counter-Notification
If you believe your content was removed in error, you may file a counter-notification including:
- Your contact information
- Identification of removed content
- Statement under penalty of perjury
- Consent to jurisdiction
- Your physical or electronic signature

4. Repeat Infringer Policy
We will terminate accounts of repeat infringers in appropriate circumstances.

5. Fair Use
We respect fair use and will consider fair use defenses in appropriate cases.

6. Response Time
We aim to respond to valid DMCA notices within 24-48 hours.

7. False Claims
Submitting false copyright claims may result in legal liability.

8. Music and Audio
Special considerations apply to music and audio content. We work with rights holders to ensure proper licensing.

9. User Responsibility
Users are responsible for ensuring they have rights to content they upload.

10. Questions
For copyright questions, contact copyright@vibesync.com`;

      default:
        return content;
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
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.documentText, { color: colors.text }]}>
              {getDocumentContent()}
            </Text>
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
    padding: 20,
  },
  documentText: {
    fontSize: 15,
    lineHeight: 24,
    whiteSpace: 'pre-wrap' as any,
  },
});
