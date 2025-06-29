import React from 'react';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../hooks/useResponsive';
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
  const { width } = useResponsive();

  // Calcular número de columnas dinámicamente
  const calculateColumns = () => {
    const cardWidth = 158; // Ancho de la card (150px + padding + border)
    const minPadding = 16; // Padding mínimo del contenedor
    const availableWidth = width - minPadding;
    const columns = Math.floor(availableWidth / cardWidth);
    return Math.max(2, columns);
  };

  // Calcular espaciado dinámico
  const calculateSpacing = () => {
    const cardWidth = 158;
    const minPadding = 16;
    const columns = calculateColumns();
    const totalCardWidth = columns * cardWidth;
    const remainingSpace = width - totalCardWidth - minPadding;
    const spacingBetweenCards = remainingSpace / (columns + 1); // +1 para espacios en los extremos
    return Math.max(4, spacingBetweenCards); // Mínimo 4px de espaciado
  };

  const numColumns = calculateColumns();
  const cardSpacing = calculateSpacing();

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
      cardSpacing={cardSpacing}
    />
  );

  const renderMinimalItem = ({ item }: { item: Movie }) => (
    <MinimalMovieItem
      item={item}
      onPress={onMoviePress}
      onToggleWatch={onToggleWatch}
      cardSpacing={cardSpacing}
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
          padding: cardSpacing / 2,
          flexGrow: 1
        }}
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'center' } : undefined}
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
        padding: cardSpacing / 2,
        flexGrow: 1
      }}
      columnWrapperStyle={numColumns > 1 ? { justifyContent: 'center' } : undefined}
      ListEmptyComponent={<EmptyStateComponent />}
    />
  );
};
