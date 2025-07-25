import React from 'react';
import { useTranslation } from 'react-i18next';
import UniversalIcon from './UniversalIcon';
import {
  SearchContainer,
  SearchInput,
  IconButton,
  RandomButton,
  RandomButtonText,
  colors
} from './styled/CommonStyles';
import { 
  ResponsiveTopBar,
  ResponsiveTopBarRow, 
  ResponsiveTopBarTitle,
  ResponsiveTopBarActions 
} from './ResponsiveTopBar';
import LanguageSelector from './LanguageSelector';
import { Movie } from '../types';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  showImages: boolean;
  onToggleImages: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onAddMovie: () => void;
  movies: Movie[];
  onRandomSuggestion: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  showImages,
  onToggleImages,
  showFilters,
  onToggleFilters,
  onAddMovie,
  movies,
  onRandomSuggestion
}) => {
  const { t } = useTranslation();

  const handleRandomSuggestion = () => {
    onRandomSuggestion();
  };

  return (
    <ResponsiveTopBar>
      <ResponsiveTopBarRow>
        <ResponsiveTopBarTitle>🎬TheWatchList📝</ResponsiveTopBarTitle>
        <ResponsiveTopBarActions>
          <LanguageSelector />
          
          <RandomButton onPress={handleRandomSuggestion}>
            <UniversalIcon name="shuffle" size={16} color={colors.surface} />
            <RandomButtonText>{t('topBar.randomSuggestion')}</RandomButtonText>
          </RandomButton>
          
          <IconButton 
            active={showImages}
            onPress={onToggleImages}
          >
            <UniversalIcon 
              name={showImages ? "image-outline" : "image-outline"} 
              size={20} 
              color={showImages ? colors.surface : colors.primary} 
            />
          </IconButton>
          
          <IconButton 
            active={showFilters}
            onPress={onToggleFilters}
          >
            <UniversalIcon 
              name={showFilters ? "filter" : "filter-outline"} 
              size={20} 
              color={showFilters ? colors.surface : colors.primary} 
            />
          </IconButton>
          
          <IconButton onPress={onAddMovie}>
            <UniversalIcon name="add" size={20} color={colors.primary} />
          </IconButton>
        </ResponsiveTopBarActions>
      </ResponsiveTopBarRow>
      
      {/* Search Bar */}
      <SearchContainer>
        <UniversalIcon name="search" size={20} color={colors.textSecondary} />
        <SearchInput
          placeholder={t('messages.searchPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </SearchContainer>
    </ResponsiveTopBar>
  );
};
