import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface DiscoverIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export const DiscoverIcon: React.FC<DiscoverIconProps> = ({ 
  size = 24, 
  color = '#000', 
  filled = false 
}) => {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" fill={color} />
        <Path
          d="M21 21L16.65 16.65"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Circle cx="11" cy="11" r="3" fill="#fff" opacity="0.3" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle 
        cx="11" 
        cy="11" 
        r="7" 
        stroke={color} 
        strokeWidth="2"
      />
      <Path
        d="M21 21L16.65 16.65"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle 
        cx="11" 
        cy="11" 
        r="2" 
        stroke={color} 
        strokeWidth="1.5"
        opacity="0.5"
      />
    </Svg>
  );
};
