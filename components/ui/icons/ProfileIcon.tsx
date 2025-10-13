import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface ProfileIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({ 
  size = 24, 
  color = '#000', 
  filled = false 
}) => {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" fill={color} />
        <Path
          d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V22H4V20Z"
          fill={color}
        />
        <Circle cx="12" cy="8" r="1.5" fill="#fff" opacity="0.3" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle 
        cx="12" 
        cy="8" 
        r="3.5" 
        stroke={color} 
        strokeWidth="2"
      />
      <Path
        d="M4.5 20C4.5 17.2386 6.73858 15 9.5 15H14.5C17.2614 15 19.5 17.2386 19.5 20V21.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};
