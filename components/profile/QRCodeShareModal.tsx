import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Share,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { User } from '@/types';
import { X, Download, Copy, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import QRCode from 'react-native-qrcode-svg';
import { Avatar } from '@/components/ui/Avatar';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

interface QRCodeShareModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const { width } = Dimensions.get('window');
const QR_SIZE = Math.min(width * 0.6, 280);

export const QRCodeShareModal: React.FC<QRCodeShareModalProps> = ({
  visible,
  onClose,
  user,
}) => {
  const [bgColor, setBgColor] = useState<'gradient' | 'white' | 'black'>('gradient');
  const qrRef = useRef<View>(null);

  const profileUrl = `https://vibesync.app/u/${user.username}`;

  const backgroundColors = {
    gradient: ['#3B82F6', '#06B6D4', '#10B981'],
    white: ['#FFFFFF', '#FFFFFF'],
    black: ['#000000', '#000000'],
  };

  const textColor = bgColor === 'white' ? '#000000' : Colors.text;
  const qrBgColor = bgColor === 'white' ? '#FFFFFF' : '#000000';
  const qrFgColor = bgColor === 'white' ? '#000000' : '#FFFFFF';

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(profileUrl);
      Alert.alert('Success', 'Profile link copied to clipboard!');
      console.log('[QRCode] Profile link copied:', profileUrl);
    } catch (error) {
      console.error('[QRCode] Error copying link:', error);
      Alert.alert('Error', 'Failed to copy link. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${user.displayName}'s profile on VibeSync!\n${profileUrl}`,
        url: profileUrl,
        title: `${user.displayName} on VibeSync`,
      });

      if (result.action === Share.sharedAction) {
        console.log('[QRCode] Profile shared successfully');
      }
    } catch (error) {
      console.error('[QRCode] Error sharing:', error);
      Alert.alert('Error', 'Failed to share profile. Please try again.');
    }
  };

  const handleDownload = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not Available', 'Download is not available on web. Please use the share or copy link options.');
        return;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library permissions to save QR code.');
        return;
      }

      if (!qrRef.current) {
        Alert.alert('Error', 'QR code not ready. Please try again.');
        return;
      }

      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('VibeSync', asset, false);

      Alert.alert('Success', 'QR code saved to your gallery!');
      console.log('[QRCode] QR code saved to gallery');
    } catch (error) {
      console.error('[QRCode] Error downloading QR code:', error);
      Alert.alert('Error', 'Failed to save QR code. Please try again.');
    }
  };

  const toggleBackground = () => {
    const colors: ('gradient' | 'white' | 'black')[] = ['gradient', 'white', 'black'];
    const currentIndex = colors.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setBgColor(colors[nextIndex]);
    console.log('[QRCode] Background changed to:', colors[nextIndex]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={80} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Share Profile</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrContainer} ref={qrRef} collapsable={false}>
              <LinearGradient
                colors={backgroundColors[bgColor] as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.qrBackground}
              >
                <View style={styles.qrContent}>
                  <View style={styles.profileInfo}>
                    <Avatar
                      uri={user.profileImage}
                      size={60}
                      borderWidth={3}
                      borderColor={textColor}
                    />
                    <Text style={[styles.displayName, { color: textColor }]}>
                      {user.displayName}
                    </Text>
                    <Text style={[styles.username, { color: textColor, opacity: 0.7 }]}>
                      @{user.username}
                    </Text>
                  </View>

                  <View style={styles.qrCodeWrapper}>
                    <QRCode
                      value={profileUrl}
                      size={QR_SIZE}
                      backgroundColor={qrBgColor}
                      color={qrFgColor}
                      logo={user.profileImage ? { uri: user.profileImage } : undefined}
                      logoSize={QR_SIZE * 0.2}
                      logoBackgroundColor={qrBgColor}
                      logoBorderRadius={QR_SIZE * 0.1}
                    />
                  </View>

                  <Text style={[styles.scanText, { color: textColor, opacity: 0.8 }]}>
                    Scan to view profile
                  </Text>
                  <Text style={[styles.brandText, { color: textColor, opacity: 0.6 }]}>
                    VibeSync
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <TouchableOpacity
              style={styles.bgToggleButton}
              onPress={toggleBackground}
            >
              <Text style={styles.bgToggleText}>
                {bgColor === 'gradient' ? 'Gradient' : bgColor === 'white' ? 'White' : 'Black'} Background
              </Text>
              <Text style={styles.bgToggleHint}>Tap to change</Text>
            </TouchableOpacity>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionGradient}
                >
                  <Share2 size={20} color={Colors.text} />
                  <Text style={styles.actionText}>Share</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
                <View style={styles.actionSecondary}>
                  <Copy size={20} color={Colors.text} />
                  <Text style={styles.actionText}>Copy Link</Text>
                </View>
              </TouchableOpacity>

              {Platform.OS !== 'web' && (
                <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
                  <View style={styles.actionSecondary}>
                    <Download size={20} color={Colors.text} />
                    <Text style={styles.actionText}>Download</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  qrContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  qrBackground: {
    padding: 24,
    alignItems: 'center',
  },
  qrContent: {
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  username: {
    fontSize: 15,
    marginTop: 4,
  },
  qrCodeWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  scanText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bgToggleButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  bgToggleText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  bgToggleHint: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  actionSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.cardLight,
    borderRadius: 16,
  },
  actionText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
