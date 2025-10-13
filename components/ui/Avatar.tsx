import React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';
import { User } from 'lucide-react-native';

interface AvatarProps {
  uri?: string | null;
  source?: string | null;
  size?: number;
  style?: ViewStyle;
  borderColor?: string;
  borderWidth?: number;
  testID?: string;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  source,
  size = 40,
  style,
  borderColor = Colors.primary,
  borderWidth = 0,
  testID,
  onPress,
}) => {
  const imageUri = uri || source;
  
  const content = (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: borderWidth,
          borderColor: borderColor,
        },
        style,
      ]}
      testID={testID}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.image,
            {
              width: size - borderWidth * 2,
              height: size - borderWidth * 2,
              borderRadius: (size - borderWidth * 2) / 2,
            },
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size - borderWidth * 2,
              height: size - borderWidth * 2,
              borderRadius: (size - borderWidth * 2) / 2,
            },
          ]}
        >
          <User size={size / 2} color={Colors.textSecondary} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: Colors.cardLight,
  },
  placeholder: {
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});