import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Colors } from '@/constants/colors';
import { User } from '@/types';
import { Settings, Camera, Edit2, Check, X, Share2, UserPen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/hooks/auth-store';
import { QRCodeShareModal } from '@/components/profile/QRCodeShareModal';
import { ProfilePictureViewer } from '@/components/profile/ProfilePictureViewer';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser?: boolean;
  onEditProfile: () => void;
  onFollowPress: () => void;
  onShareProfile: () => void;
  onSettingsPress: () => void;
  onChangeCoverPhoto: () => void;
  onChangeProfilePhoto: () => void;
  testID?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isCurrentUser = false,
  onEditProfile,
  onFollowPress,
  onShareProfile,
  onSettingsPress,
  onChangeCoverPhoto,
  onChangeProfilePhoto,
  testID,
}) => {
  const { updateProfileImage, updateCoverImage, updateBio } = useAuth();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio || '');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showProfilePictureViewer, setShowProfilePictureViewer] = useState(false);

  const getVibeLabel = (score: number): string => {
    if (score >= 9) return '✨ Elite Vibes';
    if (score >= 7) return '✨ Vibing Strong';
    if (score >= 4) return '🌱 Growing Vibes';
    return '💫 Low Vibes';
  };

  const handlePickCoverImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change cover photo');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const success = await updateCoverImage(imageUri);
        if (success) {
          Alert.alert('Success', 'Cover photo updated successfully');
          console.log('Cover photo updated successfully');
        } else {
          Alert.alert('Error', 'Failed to update cover photo. Please try again.');
        }
        if (onChangeCoverPhoto) {
          onChangeCoverPhoto();
        }
      }
    } catch (error) {
      console.error('Error picking cover image:', error);
      Alert.alert('Error', 'An error occurred while updating cover photo. Please try again.');
    }
  };

  const handlePickProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change profile picture');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const success = await updateProfileImage(imageUri);
        if (success) {
          Alert.alert('Success', 'Profile picture updated successfully');
          console.log('Profile photo updated successfully');
        } else {
          Alert.alert('Error', 'Failed to update profile picture. Please try again.');
        }
        if (onChangeProfilePhoto) {
          onChangeProfilePhoto();
        }
      }
    } catch (error) {
      console.error('Error picking profile image:', error);
      Alert.alert('Error', 'An error occurred while updating profile picture. Please try again.');
    }
  };

  const handleSaveBio = async () => {
    const success = await updateBio(bioText);
    if (success) {
      console.log('Bio saved successfully:', bioText);
      setIsEditingBio(false);
    } else {
      Alert.alert('Error', 'Failed to save bio. Please try again.');
    }
  };

  const handleCancelBio = () => {
    setBioText(user.bio || '');
    setIsEditingBio(false);
  };

  const handleShareProfile = () => {
    setShowQRModal(true);
    console.log('[ProfileHeader] Opening QR code share modal');
  };



  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.coverContainer}>
        {user.coverImage ? (
          <Image
            source={{ uri: user.coverImage }}
            style={styles.coverImage}
            contentFit="cover"
          />
        ) : (
          <LinearGradient
            colors={['#3B82F6', '#06B6D4', '#10B981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.coverPlaceholder}
          />
        )}
        
        {isCurrentUser && (
          <View style={styles.coverActions}>
            <TouchableOpacity
              style={styles.coverEditButton}
              onPress={handlePickCoverImage}
            >
              <BlurView intensity={80} style={styles.blurButton}>
                <Camera size={18} color={Colors.text} />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={onSettingsPress}
            >
              <BlurView intensity={80} style={styles.blurButton}>
                <Settings size={18} color={Colors.text} />
              </BlurView>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity 
            onPress={() => {
              if (isCurrentUser) {
                handlePickProfileImage();
              } else {
                setShowProfilePictureViewer(true);
              }
            }}
            onLongPress={() => {
              if (user.profileImage) {
                setShowProfilePictureViewer(true);
              }
            }}
          >
            <View style={styles.avatarWrapper}>
              <Avatar
                uri={user.profileImage}
                size={100}
                borderWidth={4}
                borderColor={Colors.background}
              />
              {isCurrentUser && (
                <View style={styles.avatarEditButton}>
                  <Camera size={16} color={Colors.text} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            {user.isVerified && <VerifiedBadge size={20} />}
          </View>
          <Text style={styles.username}>@{user.username}</Text>
          
          {isEditingBio ? (
            <View style={styles.bioEditContainer}>
              <TextInput
                style={styles.bioInput}
                value={bioText}
                onChangeText={setBioText}
                placeholder="Add a bio (max 150 characters)"
                placeholderTextColor={Colors.textSecondary}
                maxLength={150}
                multiline
                autoFocus
              />
              <View style={styles.bioEditActions}>
                <TouchableOpacity onPress={handleCancelBio} style={styles.bioActionButton}>
                  <X size={18} color={Colors.error} />
                  <Text style={styles.bioActionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveBio} style={[styles.bioActionButton, styles.bioSaveButton]}>
                  <Check size={18} color={Colors.success} />
                  <Text style={[styles.bioActionText, styles.bioSaveText]}>Save</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.bioCharCount}>{bioText.length}/150</Text>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={() => isCurrentUser && setIsEditingBio(true)}
              disabled={!isCurrentUser}
            >
              <View style={styles.bioContainer}>
                <Text style={styles.bio}>{bioText || (isCurrentUser ? 'Tap to add bio' : 'No bio yet')}</Text>
                {isCurrentUser && <Edit2 size={14} color={Colors.textSecondary} style={styles.bioEditIcon} />}
              </View>
            </TouchableOpacity>
          )}
          
          {user.vibeScore !== undefined && (
            <View style={styles.vibeScoreContainer}>
              <LinearGradient
                colors={['#3B82F6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.vibeScoreGradient}
              >
                <Text style={styles.vibeScore}>{user.vibeScore.toFixed(1)}/10</Text>
              </LinearGradient>
              <Text style={styles.vibeStatus}>{getVibeLabel(user.vibeScore)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.posts}</Text>
            <Text style={styles.statLabel}>posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.followers}</Text>
            <Text style={styles.statLabel}>followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.following}</Text>
            <Text style={styles.statLabel}>following</Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          {isCurrentUser ? (
            <>
              <TouchableOpacity style={styles.primaryActionButton} onPress={onEditProfile}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <UserPen size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.primaryActionText}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryActionButton} onPress={handleShareProfile}>
                <BlurView intensity={60} style={styles.blurActionButton}>
                  <Share2 size={18} color={Colors.text} />
                  <Text style={styles.secondaryActionText}>Share</Text>
                </BlurView>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryActionButton} onPress={onFollowPress}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.primaryActionText}>Follow</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryActionButton} onPress={handleShareProfile}>
                <BlurView intensity={60} style={styles.blurActionButton}>
                  <Share2 size={18} color={Colors.text} />
                  <Text style={styles.secondaryActionText}>Share Profile</Text>
                </BlurView>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <QRCodeShareModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        user={user}
      />

      {user.profileImage && (
        <ProfilePictureViewer
          visible={showProfilePictureViewer}
          imageUri={user.profileImage}
          onClose={() => setShowProfilePictureViewer(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
  },
  coverActions: {
    position: 'absolute',
    right: 16,
    top: 16,
    flexDirection: 'row',
    gap: 8,
  },
  coverEditButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  settingsButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileInfo: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -50,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  nameContainer: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  displayName: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 24,
  },
  username: {
    color: Colors.textSecondary,
    fontSize: 15,
    marginBottom: 8,
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  bio: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  bioEditIcon: {
    marginLeft: 4,
  },
  bioEditContainer: {
    marginTop: 8,
    backgroundColor: Colors.cardLight,
    borderRadius: 12,
    padding: 12,
  },
  bioInput: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  bioEditActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  bioActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bioSaveButton: {
    backgroundColor: Colors.glass,
  },
  bioActionText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  bioSaveText: {
    color: Colors.success,
  },
  bioCharCount: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  vibeScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  vibeScoreGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  vibeScore: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  vibeStatus: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 20,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryActionButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryActionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActionButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  secondaryActionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});