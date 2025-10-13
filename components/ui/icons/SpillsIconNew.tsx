import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

interface SpillsIconNewProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export const SpillsIconNew: React.FC<SpillsIconNewProps> = ({ 
  size = 24, 
  color = '#000', 
  filled = false 
}) => {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <G>
          <Circle cx="12" cy="8" r="6" fill={color} />
          <Path
            d="M12 14C12 14 8 15 8 18C8 20 9.5 22 12 22C14.5 22 16 20 16 18C16 15 12 14 12 14Z"
            fill={color}
          />
          <Circle cx="12" cy="8" r="2.5" fill="#fff" opacity="0.4" />
          <Path
            d="M8 17L10 16L12 17L14 16L16 17"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </G>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G>
        <Circle 
          cx="12" 
          cy="8" 
          r="5.5" 
          stroke={color}
          strokeWidth="2"
        />
        <Path
          d="M12 13.5C12 13.5 8.5 14.5 8.5 17.5C8.5 19.5 10 21.5 12 21.5C14 21.5 15.5 19.5 15.5 17.5C15.5 14.5 12 13.5 12 13.5Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.5 16.5L10.5 15.5L12 16.5L13.5 15.5L15.5 16.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </G>
    </Svg>
  );
};
