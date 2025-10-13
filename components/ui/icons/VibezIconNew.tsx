import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

interface VibezIconNewProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export const VibezIconNew: React.FC<VibezIconNewProps> = ({ 
  size = 24, 
  color = '#000', 
  filled = false 
}) => {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <G>
          <Path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={color}
          />
          <Circle cx="12" cy="12" r="3" fill="#fff" opacity="0.2" />
          <Path
            d="M12 8L13 10.5L15.5 11L13 12L12 14.5L11 12L8.5 11L11 10.5L12 8Z"
            fill="#fff"
            opacity="0.4"
          />
        </G>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle 
        cx="12" 
        cy="12" 
        r="2" 
        stroke={color} 
        strokeWidth="1.5"
        opacity="0.5"
      />
    </Svg>
  );
};
