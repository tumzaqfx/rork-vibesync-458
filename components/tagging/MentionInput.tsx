import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  TextInputProps,
} from 'react-native';
import { User } from '@/types';
import { useTagging } from '@/hooks/tagging-store';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

type MentionInputProps = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  onMentionSelect?: (user: User) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
};

export default function MentionInput({
  value,
  onChangeText,
  onMentionSelect,
  placeholder = 'Write a comment...',
  multiline = false,
  maxLength,
  ...props
}: MentionInputProps) {
  const { searchUsers } = useTagging();
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [mentionStart, setMentionStart] = useState<number>(-1);
  const inputRef = useRef<TextInput>(null);

  const handleTextChange = useCallback((text: string) => {
    onChangeText(text);

    const cursorPosition = text.length;
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      if (!textAfterAt.includes(' ') && textAfterAt.length > 0) {
        const results = searchUsers(textAfterAt);
        if (results.length > 0) {
          setSuggestions(results);
          setMentionStart(lastAtIndex);
          setShowSuggestions(true);
          return;
        }
      }
    }

    setShowSuggestions(false);
    setSuggestions([]);
    setMentionStart(-1);
  }, [onChangeText, searchUsers]);

  const handleSelectUser = useCallback((user: User) => {
    if (mentionStart === -1) return;

    const beforeMention = value.substring(0, mentionStart);
    const afterMention = value.substring(value.length);
    const newText = `${beforeMention}@${user.username} ${afterMention}`;

    onChangeText(newText);
    setShowSuggestions(false);
    setSuggestions([]);
    setMentionStart(-1);

    if (onMentionSelect) {
      onMentionSelect(user);
    }

    inputRef.current?.focus();
  }, [value, mentionStart, onChangeText, onMentionSelect]);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor="#666"
        multiline={multiline}
        maxLength={maxLength}
        {...props}
      />

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectUser(item)}
              >
                <Avatar uri={item.avatar || item.profileImage} size={36} />
                <View style={styles.suggestionInfo}>
                  <View style={styles.suggestionNameRow}>
                    <Text style={styles.suggestionUsername}>@{item.username}</Text>
                    {(item.verified || item.isVerified) && (
                      <VerifiedBadge size={12} />
                    )}
                  </View>
                  <Text style={styles.suggestionDisplayName}>
                    {item.name || item.displayName}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative' as const,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#fff',
    minHeight: 40,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  suggestionsContainer: {
    position: 'absolute' as const,
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  suggestionUsername: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
  },
  suggestionDisplayName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
