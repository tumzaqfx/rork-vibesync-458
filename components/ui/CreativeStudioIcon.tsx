import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface CreativeStudioIconProps {
  size?: number;
  color?: string;
}

export const CreativeStudioIcon: React.FC<CreativeStudioIconProps> = ({ size = 24, color = '#fff' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20 L20 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M14 10 L20 16" stroke={color} strokeWidth="2" strokeLinecap="round" />

      <Circle cx="6" cy="6" r="1.5" fill={color} />
      <Circle cx="18" cy="8" r="1.2" fill={color} />
      <Circle cx="10" cy="18" r="1" fill={color} />
    </Svg>
  );
};
