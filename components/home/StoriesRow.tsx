import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StoryCircle } from './StoryCircle';
import { LiveStoryCircle } from './LiveStoryCircle';
import { Story } from '@/types';
import { useStatus } from '@/hooks/status-store';
import { useLiveStreaming } from '@/hooks/live-streaming-store';
import { useSpill } from '@/hooks/spill-store';
import { UserStatusGroup } from '@/types/status';
import SpillStatusCircle from '@/components/spill/SpillStatusCircle';

interface StoriesRowProps {
  stories: Story[];
  onStoryPress: (storyId: string) => void;
  onCreateStory: () => void;
  testID?: string;
}

export const StoriesRow: React.FC<StoriesRowProps> = ({
  stories,
  onStoryPress,
  onCreateStory,
  testID,
}) => {
  const { statusGroups } = useStatus();
  const { liveSessions } = useLiveStreaming();
  const { activeSpills } = useSpill();

  const handleStatusPress = (userId: string) => {
    router.push(`/status/view/${userId}`);
  };

  const combinedData = [
    ...activeSpills
      .filter(spill => spill.isLive)
      .map(spill => ({
        id: `spill-${spill.id}`,
        type: 'spill' as const,
        spill,
      })),
    ...liveSessions
      .filter(session => session.status === 'live')
      .map(session => ({
        id: `live-${session.id}`,
        type: 'live' as const,
        session,
      })),
    ...statusGroups.map(group => ({
      id: `status-${group.userId}`,
      type: 'status' as const,
      statusGroup: group,
    })),
    ...stories.map(story => ({
      id: `story-${story.id}`,
      type: 'story' as const,
      story,
    })),
  ];

  return (
    <View style={styles.wrapper} testID={testID}>
      <View style={styles.container}>
        <FlatList
          data={combinedData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <StoryCircle isYourStory onPress={onCreateStory} />
          )}
          renderItem={({ item }) => {
            if (item.type === 'spill') {
              return (
                <SpillStatusCircle
                  id={item.spill!.id}
                  name={item.spill!.hostName}
                  avatar={item.spill!.hostAvatar}
                  topicName={item.spill!.topicName}
                  listenerCount={item.spill!.listenerCount}
                />
              );
            }
            if (item.type === 'live') {
              return <LiveStoryCircle session={item.session!} />;
            }
            if (item.type === 'status') {
              const group = item.statusGroup as UserStatusGroup;
              return (
                <StoryCircle
                  story={{
                    id: group.userId,
                    userId: group.userId,
                    username: group.username,
                    profileImage: group.avatar,
                    viewed: !group.hasUnviewed,
                    author: {
                      id: group.userId,
                      username: group.username,
                      displayName: group.username,
                      profileImage: group.avatar,
                      isVerified: group.verified,
                    },
                    content: '',
                    createdAt: group.lastStatusAt,
                  } as Story}
                  onPress={() => handleStatusPress(group.userId)}
                />
              );
            }
            return (
              <StoryCircle
                story={item.story as Story}
                onPress={() => onStoryPress(item.story!.id)}
              />
            );
          }}
          contentContainerStyle={styles.contentContainer}
          snapToInterval={106}
          decelerationRate="fast"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  container: {
    paddingVertical: 8,
  },
  contentContainer: {
    paddingHorizontal: 8,
    gap: 4,
  },
});