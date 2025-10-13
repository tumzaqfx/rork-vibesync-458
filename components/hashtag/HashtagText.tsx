import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';

interface HashtagTextProps {
  text: string;
  style?: any;
  onUserPress?: (username: string) => void;
  onHashtagPress?: (hashtag: string) => void;
}

export const HashtagText: React.FC<HashtagTextProps> = ({
  text,
  style,
  onUserPress,
  onHashtagPress,
}) => {
  const { colors } = useTheme();

  const parseTextWithLinks = (inputText: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /(#\w+|@\w+)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(inputText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <Text key={`text-${lastIndex}`} style={[styles.normalText, { color: colors.text }, style]}>
            {inputText.slice(lastIndex, match.index)}
          </Text>
        );
      }

      const isHashtag = match[0].startsWith('#');
      const isUsername = match[0].startsWith('@');

      parts.push(
        <TouchableOpacity
          key={`link-${match.index}`}
          onPress={() => {
            if (match && isHashtag) {
              const hashtag = match[0].slice(1);
              if (onHashtagPress) {
                onHashtagPress(hashtag);
              } else {
                router.push(`/hashtag/${hashtag}`);
              }
            } else if (match && isUsername) {
              const username = match[0].slice(1);
              if (onUserPress) {
                onUserPress(username);
              } else {
                router.push(`/user/${username}`);
              }
            }
          }}
        >
          <Text
            style={[
              styles.linkText,
              {
                color: isHashtag ? '#1DA1F2' : colors.primary,
              },
              style,
            ]}
          >
            {match[0]}
          </Text>
        </TouchableOpacity>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < inputText.length) {
      parts.push(
        <Text key={`text-${lastIndex}`} style={[styles.normalText, { color: colors.text }, style]}>
          {inputText.slice(lastIndex)}
        </Text>
      );
    }

    return parts.length > 0 ? parts : [
      <Text key="full-text" style={[styles.normalText, { color: colors.text }, style]}>
        {inputText}
      </Text>
    ];
  };

  return <Text style={styles.container}>{parseTextWithLinks(text)}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  normalText: {
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});
