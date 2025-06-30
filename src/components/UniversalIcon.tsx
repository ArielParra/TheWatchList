import React from 'react';
import { Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Definimos los iconos que usamos en la app
export type IconName = 
  | 'search'
  | 'close'
  | 'add'
  | 'checkmark'
  | 'checkmark-circle'
  | 'square-outline'
  | 'checkbox-outline'
  | 'checkbox'
  | 'filter'
  | 'filter-outline'
  | 'random'
  | 'shuffle'
  | 'star'
  | 'star-outline'
  | 'play'
  | 'eye'
  | 'eye-outline'
  | 'calendar'
  | 'time'
  | 'list'
  | 'grid'
  | 'heart'
  | 'heart-outline'
  | 'share'
  | 'menu'
  | 'settings'
  | 'arrow-back'
  | 'arrow-forward'
  | 'chevron-down'
  | 'chevron-up'
  | 'refresh'
  | 'image'
  | 'image-outline';

interface UniversalIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}

// SVG paths para iconos comunes (más profesional que emojis)
const getSVGIcon = (name: IconName, size: number, color: string) => {
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case 'search':
      return (
        <svg {...svgProps}>
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      );
    case 'close':
      return (
        <svg {...svgProps}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      );
    case 'add':
      return (
        <svg {...svgProps}>
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      );
    case 'checkmark':
      return (
        <svg {...svgProps}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      );
    case 'checkmark-circle':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="9,12 12,15 22,5"/>
        </svg>
      );
    case 'square-outline':
      return (
        <svg {...svgProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        </svg>
      );
    case 'checkbox':
      return (
        <svg {...svgProps} fill={color}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <polyline points="9,12 12,15 22,5" stroke="white" strokeWidth="2"/>
        </svg>
      );
    case 'filter':
      return (
        <svg {...svgProps}>
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
        </svg>
      );
    case 'filter-outline':
      return (
        <svg {...svgProps}>
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
        </svg>
      );
    case 'image':
      return (
        <svg {...svgProps} fill={color}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      );
    case 'image-outline':
      return (
        <svg {...svgProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      );
    case 'star':
      return (
        <svg {...svgProps} fill={color}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      );
    case 'star-outline':
      return (
        <svg {...svgProps}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      );
    case 'eye':
      return (
        <svg {...svgProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      );
    case 'shuffle':
    case 'random':
      return (
        <svg {...svgProps}>
          <polyline points="16,3 21,3 21,8"/>
          <line x1="4" y1="20" x2="21" y2="3"/>
          <polyline points="21,16 21,21 16,21"/>
          <line x1="15" y1="15" x2="21" y2="21"/>
          <line x1="4" y1="4" x2="9" y2="9"/>
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...svgProps}>
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      );
    case 'chevron-up':
      return (
        <svg {...svgProps}>
          <polyline points="18,15 12,9 6,15"/>
        </svg>
      );
    case 'time':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );
  }
};

export const UniversalIcon: React.FC<UniversalIconProps> = ({ 
  name, 
  size = 24, 
  color = '#000000', 
  style 
}) => {
  if (Platform.OS === 'web') {
    // Para web, usar SVG personalizado
    return (
      <div style={{ display: 'inline-block', ...style }}>
        {getSVGIcon(name, size, color)}
      </div>
    );
  }

  // Para React Native nativo, usar Ionicons normalmente
  return (
    <Ionicons 
      name={name as any} 
      size={size} 
      color={color} 
      style={style} 
    />
  );
};

export default UniversalIcon;
