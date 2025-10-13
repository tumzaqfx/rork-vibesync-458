import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';
import { User } from 'lucide-react-native';
import { OptimizedImage } from '@/utils/optimized-image';

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

const AvatarComponent: React.FC<AvatarProps> = ({
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
        <OptimizedImage
          uri={imageUri}
          width={size - borderWidth * 2}
          height={size - borderWidth * 2}
          style={[
            styles.image,
            {
              width: size - borderWidth * 2,
              height: size - borderWidth * 2,
              borderRadius: (size - borderWidth * 2) / 2,
            },
          ]}
          priority="high"
          cachePolicy="memory-disk"
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

export const Avatar = memo(AvatarComponent, (prev, next) => {
  return (
    prev.uri === next.uri &&
    prev.source === next.source &&
    prev.size === next.size &&
    prev.borderWidth === next.borderWidth
  );
});

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

export default Avatar;