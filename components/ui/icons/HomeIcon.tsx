import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface HomeIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export const HomeIcon: React.FC<HomeIconProps> = ({ 
  size = 24, 
  color = '#000', 
  filled = false 
}) => {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2.5L2 10.5V21.5C2 22.05 2.45 22.5 3 22.5H9V15.5H15V22.5H21C21.55 22.5 22 22.05 22 21.5V10.5L12 2.5Z"
          fill={color}
        />
        <Circle cx="12" cy="12" r="1.5" fill="#fff" opacity="0.3" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L3 10.5V21C3 21.55 3.45 22 4 22H9V15H15V22H20C20.55 22 21 21.55 21 21V10.5L12 3Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 22V15H15V22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
