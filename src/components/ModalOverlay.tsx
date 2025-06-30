import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from './styled/CommonStyles';

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
        },
        style
      ]}
    >
      {children}
    </View>
  );
};
