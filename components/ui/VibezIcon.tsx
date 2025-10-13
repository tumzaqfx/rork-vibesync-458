import React from 'react';
import Svg, { Rect, Polygon } from 'react-native-svg';

interface VibezIconProps {
  size?: number;
  color?: string;
}

export const VibezIcon: React.FC<VibezIconProps> = ({ size = 24, color = '#fff' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="5" fill={color} rx="1" />
      <Polygon points="9,3 12,8 15,3" fill="#000" opacity="0.3" />
      
      <Rect x="3" y="9" width="18" height="12" stroke={color} strokeWidth="2" rx="2" fill="none" />
      
      <Polygon points="10,12 16,15 10,18" fill={color} />
    </Svg>
  );
};
