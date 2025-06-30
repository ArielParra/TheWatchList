import React from 'react';
import { View, Text } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from './styled/CommonStyles';

interface ResponsiveTopBarProps {
  children: React.ReactNode;
}

export const ResponsiveTopBar: React.FC<ResponsiveTopBarProps> = ({ children }) => {
  const { isMobile } = useResponsive();

  return (
    <View style={{
      backgroundColor: colors.surface,
      padding: isMobile ? 12 : 16,
      paddingHorizontal: isMobile ? 16 : 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      elevation: 10,
      zIndex: 1000,
      paddingTop: isMobile ? 16 : 16,
    }}>
      {children}
    </View>
  );
};

interface ResponsiveTopBarRowProps {
  children: React.ReactNode;
}

export const ResponsiveTopBarRow: React.FC<ResponsiveTopBarRowProps> = ({ children }) => {
  const { isMobile } = useResponsive();

  return (
    <View style={{
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      marginBottom: isMobile ? 12 : 16,
      gap: isMobile ? 12 : 0,
    }}>
      {children}
    </View>
  );
};

interface ResponsiveTopBarTitleProps {
  children: React.ReactNode;
}

export const ResponsiveTopBarTitle: React.FC<ResponsiveTopBarTitleProps> = ({ children }) => {
  const { isMobile } = useResponsive();

  return (
    <Text style={{
      fontSize: isMobile ? 22 : 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 0,
      alignSelf: isMobile ? 'center' : 'flex-start',
    }}>
      {children}
    </Text>
  );
};

interface ResponsiveTopBarActionsProps {
  children: React.ReactNode;
}

export const ResponsiveTopBarActions: React.FC<ResponsiveTopBarActionsProps> = ({ children }) => {
  const { isMobile } = useResponsive();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: isMobile ? 8 : 12,
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      justifyContent: isMobile ? 'center' : 'flex-end',
      width: isMobile ? '100%' : 'auto',
    }}>
      {children}
    </View>
  );
};
