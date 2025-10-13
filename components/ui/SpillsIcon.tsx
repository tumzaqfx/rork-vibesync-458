import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface SpillsIconProps {
  size?: number;
  color?: string;
}

export const SpillsIcon: React.FC<SpillsIconProps> = ({ size = 24, color = '#fff' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M12 14V22" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <Circle cx="12" cy="10" r="1.5" fill={color} />
      <Path 
        d="M8 18H16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <Path 
        d="M9 22H15" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Svg>
  );
};
