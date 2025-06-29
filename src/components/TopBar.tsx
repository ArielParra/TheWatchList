import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  TopBar as StyledTopBar,
  TopBarRow,
  TopBarTitle,
  TopBarActions,
  SearchContainer,
  SearchInput,
  IconButton,
  RandomButton,
  RandomButtonText,
  colors
} from './styled/CommonStyles';
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
    <StyledTopBar>
      <TopBarRow>
        <TopBarTitle>🎬TheWatchList📝</TopBarTitle>
        <TopBarActions>
          <LanguageSelector />
          
          <RandomButton onPress={handleRandomSuggestion}>
            <Ionicons name="shuffle" size={16} color={colors.surface} />
            <RandomButtonText>{t('topBar.randomSuggestion')}</RandomButtonText>
          </RandomButton>
          
          <IconButton 
            active={showImages}
            onPress={onToggleImages}
          >
            <Ionicons 
              name={showImages ? "image" : "image-outline"} 
              size={20} 
              color={showImages ? colors.surface : colors.primary} 
            />
          </IconButton>
          
          <IconButton 
            active={showFilters}
            onPress={onToggleFilters}
          >
            <Ionicons 
              name={showFilters ? "filter" : "filter-outline"} 
              size={20} 
              color={showFilters ? colors.surface : colors.primary} 
            />
          </IconButton>
          
          <IconButton onPress={onAddMovie}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </IconButton>
        </TopBarActions>
      </TopBarRow>
      
      {/* Search Bar */}
      <SearchContainer>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <SearchInput
          placeholder={t('messages.searchPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </SearchContainer>
    </StyledTopBar>
  );
};
