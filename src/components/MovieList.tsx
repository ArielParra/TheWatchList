import React from 'react';
import { FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  CenterContainer,
  EmptyText,
  PrimaryButton,
  ButtonText,
  colors
} from './styled/CommonStyles';
import { Movie } from '../types';
import { MovieCardWithImage } from './MovieCard';
import { MinimalMovieItem } from './MinimalMovieItem';

const { width } = Dimensions.get('window');

interface MovieListProps {
  movies: Movie[];
  showImages: boolean;
  onMoviePress: (movie: Movie) => void;
  onToggleWatch: (movieId: string, currentStatus: boolean) => void;
  onAddMovie: () => void;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  showImages,
  onMoviePress,
  onToggleWatch,
  onAddMovie
}) => {
  const { t } = useTranslation();

  // Calcular número de columnas dinámicamente
  const calculateColumns = () => {
    const cardWidth = 158;
    const padding = 16;
    const availableWidth = width - padding;
    const columns = Math.floor(availableWidth / cardWidth);
    return Math.max(2, columns);
  };

  const numColumns = calculateColumns();

  // Componente EmptyState reutilizable
  const EmptyStateComponent = () => (
    <CenterContainer style={{ 
      flex: 1, 
      minHeight: 400,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Ionicons 
        name={showImages ? "film-outline" : "list-outline"} 
        size={64} 
        color={colors.textSecondary} 
      />
      <EmptyText style={{ padding: 16 }}>
        {t('messages.noMovies')}
      </EmptyText>
      <PrimaryButton onPress={onAddMovie}>
        <ButtonText>{t('buttons.addMovie')}</ButtonText>
      </PrimaryButton>
    </CenterContainer>
  );

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <MovieCardWithImage
      item={item}
      showImage={showImages}
      onPress={onMoviePress}
      onToggleWatch={onToggleWatch}
    />
  );

  const renderMinimalItem = ({ item }: { item: Movie }) => (
    <MinimalMovieItem
      item={item}
      onPress={onMoviePress}
      onToggleWatch={onToggleWatch}
    />
  );

  if (showImages) {
    return (
      <FlatList
        key={`grid-mode-${numColumns}`}
        data={movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          padding: 8,
          flexGrow: 1
        }}
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
        ListEmptyComponent={<EmptyStateComponent />}
      />
    );
  }

  return (
    <FlatList
      key={`list-mode-${numColumns}`}
      data={movies}
      renderItem={renderMinimalItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        padding: 8,
        flexGrow: 1
      }}
      columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
      ListEmptyComponent={<EmptyStateComponent />}
    />
  );
};
