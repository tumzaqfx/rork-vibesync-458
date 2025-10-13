import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Colors } from '@/constants/colors';
import { User } from '@/types';

interface UserCardProps {
  user: User;
  onFollowPress: (userId: string) => void;
  onUserPress: (userId: string) => void;
  testID?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onFollowPress,
  onUserPress,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.userInfo}>
        <View>
          <Avatar
            uri={user.profileImage}
            size={50}
          />
        </View>
        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            {user.isVerified && <VerifiedBadge size={14} />}
          </View>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          {user.location && (
            <Text style={styles.location}>{user.location}</Text>
          )}
        </View>
      </View>
      <Button
        title="Follow"
        onPress={() => onFollowPress(user.id)}
        variant="outline"
        size="small"
        style={styles.followButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  displayName: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  username: {
    color: Colors.primary,
    fontSize: 14,
    marginTop: 2,
  },
  bio: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  location: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  followButton: {
    minWidth: 80,
  },
});