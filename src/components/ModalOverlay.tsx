import React from 'react';
import { View, ViewStyle, Dimensions } from 'react-native';
import { colors } from './styled/CommonStyles';

const { height: screenHeight } = Dimensions.get('window');

interface ModalOverlayProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

/**
 * Componente para el fondo opaco de los modales
 * Soluciona problemas de transparencia en Android
 */
export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  children,
  style,
  backgroundColor = 'rgba(0, 0, 0, 0.5)'
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          minHeight: screenHeight, // Asegurar altura completa en Android
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};
