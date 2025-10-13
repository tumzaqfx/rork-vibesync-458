import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface VerifiedBadgeProps {
  size?: number;
  testID?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 16,
  testID,
}) => {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      testID={testID}
    >
      <Check size={size * 0.6} color={Colors.text} strokeWidth={3} />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});