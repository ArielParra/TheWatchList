import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { changeLanguage } from '../i18n';
import { colors } from './styled/CommonStyles';

const LanguageContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.background};
  border-radius: 8px;
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

const LanguageButton = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  background-color: ${(props: { active: boolean }) => 
    props.active ? colors.primary : 'transparent'};
`;

const LanguageText = styled.Text<{ active: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props: { active: boolean }) => 
    props.active ? colors.surface : colors.textSecondary};
  margin-left: 4px;
`;

const FlagText = styled.Text`
  font-size: 14px;
`;

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language);
  };

  return (
    <LanguageContainer>
      <LanguageButton 
        active={currentLanguage === 'es'}
        onPress={() => handleLanguageChange('es')}
      >
        <FlagText>🇲🇽</FlagText>
        <LanguageText active={currentLanguage === 'es'}>ES</LanguageText>
      </LanguageButton>
      
      <LanguageButton 
        active={currentLanguage === 'en'}
        onPress={() => handleLanguageChange('en')}
      >
        <FlagText>🇺🇸</FlagText>
        <LanguageText active={currentLanguage === 'en'}>EN</LanguageText>
      </LanguageButton>
    </LanguageContainer>
  );
};

export default LanguageSelector;