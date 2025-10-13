import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

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
        <Path
          d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z"
          fill={color}
        />
        <Ellipse
          cx="12"
          cy="18"
          rx="8"
          ry="4"
          fill={color}
          opacity="0.7"
        />
        <Circle cx="12" cy="10" r="2" fill="#fff" opacity="0.3" />
        <Path
          d="M6 17C6 17 7 15 9 15C11 15 11.5 17 13 17C14.5 17 15 15 17 15C19 15 20 17 20 17"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Ellipse
        cx="12"
        cy="18"
        rx="7.5"
        ry="3.5"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M6 17C6 17 7 15.5 9 15.5C11 15.5 11.5 17 13 17C14.5 17 15 15.5 17 15.5C19 15.5 20 17 20 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </Svg>
  );
};
