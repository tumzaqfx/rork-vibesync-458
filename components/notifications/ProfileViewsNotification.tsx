import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { Eye } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface ProfileViewsNotificationProps {
  count: number;
  recentViewers: {
    id: string;
    username: string;
    displayName: string;
    profileImage?: string;
  }[];
  timeRange: 'day' | 'week';
}

export const ProfileViewsNotification: React.FC<ProfileViewsNotificationProps> = ({
  count,
  recentViewers,
  timeRange,
}) => {
  const handlePress = () => {
    router.push('/profile-views');
  };

  const getTimeRangeText = () => {
    return timeRange === 'day' ? 'today' : 'this week';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Eye size={24} color={Colors.primary} />
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {count} new profile {count === 1 ? 'view' : 'views'} {getTimeRangeText()}
          </Text>
          <Text style={styles.subtitle}>
            {recentViewers.length > 0 && (
              <>
                {recentViewers[0].displayName}
                {recentViewers.length > 1 && ` and ${recentViewers.length - 1} other${recentViewers.length > 2 ? 's' : ''}`}
                {' viewed your profile'}
              </>
            )}
          </Text>
        </View>

        {recentViewers.length > 0 && (
          <View style={styles.avatarsContainer}>
            {recentViewers.slice(0, 3).map((viewer, index) => (
              <View
                key={viewer.id}
                style={[
                  styles.avatarWrapper,
                  { marginLeft: index > 0 ? -12 : 0, zIndex: 3 - index },
                ]}
              >
                <Avatar
                  uri={viewer.profileImage}
                  size={32}
                  borderWidth={2}
                  borderColor={Colors.background}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
