import React from 'react';
import Svg, { Path, Circle, Polyline, Line, Rect } from 'react-native-svg';

export function Icon({ name, size = 20, color = '#FFFFFF', style }) {
  switch (name) {
    case 'swap':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Path
            d="M7 16V4M7 4L3 8M7 4L11 8"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M17 8V20M17 20L21 16M17 20L13 16"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'chevron-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Polyline
            points="6 9 12 15 18 9"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Circle
            cx="11"
            cy="11"
            r="7"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'refresh':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Path
            d="M23 4v6h-6"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'sun':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2.2" />
          <Line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </Svg>
      );

    case 'moon':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'backspace':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Path
            d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line x1="18" y1="9" x2="12" y2="15" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="12" y1="9" x2="18" y2="15" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </Svg>
      );

    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'star-filled':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Polyline
            points="20 6 9 17 4 12"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'info':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.2" />
          <Line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Circle cx="12" cy="8" r="1" fill={color} />
        </Svg>
      );

    case 'table':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Path
            d="M3 3h18v18H3V3zm0 6h18M3 15h18M9 3v18M15 3v18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'copy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Path
            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M8 2h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'globe':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.2" />
          <Line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Path
            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
            stroke={color}
            strokeWidth="2.2"
          />
        </Svg>
      );

    case 'calculator':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <Rect
            x="4"
            y="2"
            width="16"
            height="20"
            rx="2"
            stroke={color}
            strokeWidth="2.2"
          />
          <Line x1="8" y1="6" x2="16" y2="6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="16" y1="14" x2="16" y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Path
            d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </Svg>
      );

    default:
      return null;
  }
}

