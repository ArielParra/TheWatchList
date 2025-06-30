import React, { useRef, useEffect, useState } from 'react';
import { FlatList, Platform } from 'react-native';
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
  const { width, isMobile } = useResponsive();
  const flatListRef = useRef<FlatList>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Navegación con teclado para PC
  useEffect(() => {
    if (Platform.OS !== 'web' || isMobile || movies.length === 0) return;
    
    // Validación adicional para asegurar que document existe
    if (typeof document === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => {
            const numColumns = calculateColumns();
            const newIndex = Math.max(0, prev - numColumns);
            scrollToIndex(newIndex);
            return newIndex;
          });
          break;
          
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => {
            const numColumns = calculateColumns();
            const newIndex = Math.min(movies.length - 1, prev + numColumns);
            scrollToIndex(newIndex);
            return newIndex;
          });
          break;
          
        case 'ArrowLeft':
          event.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = Math.max(0, prev - 1);
            scrollToIndex(newIndex);
            return newIndex;
          });
          break;
          
        case 'ArrowRight':
          event.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = Math.min(movies.length - 1, prev + 1);
            scrollToIndex(newIndex);
            return newIndex;
          });
          break;
          
        case 'Home':
          event.preventDefault();
          setSelectedIndex(0);
          scrollToIndex(0);
          break;
          
        case 'End':
          event.preventDefault();
          const lastIndex = movies.length - 1;
          setSelectedIndex(lastIndex);
          scrollToIndex(lastIndex);
          break;
          
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (movies[selectedIndex]) {
            onMoviePress(movies[selectedIndex]);
          }
          break;
      }
    };

    const scrollToIndex = (index: number) => {
      if (!flatListRef.current || index < 0 || index >= movies.length) return;
      
      // Usar scrollToOffset en lugar de scrollToIndex para mejor confiabilidad
      const numColumns = calculateColumns();
      const itemHeight = showImages ? 240 : 80;
      const rowIndex = Math.floor(index / numColumns);
      const offset = rowIndex * itemHeight;
      
      flatListRef.current.scrollToOffset({
        offset,
        animated: true
      });
    };

    // Validar que document existe antes de agregar el listener
    if (typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        if (typeof document !== 'undefined' && document.removeEventListener) {
          document.removeEventListener('keydown', handleKeyDown);
        }
      };
    }
  }, [movies, selectedIndex, isMobile, onMoviePress, showImages]);

  // Resetear índice seleccionado cuando cambian las películas
  useEffect(() => {
    setSelectedIndex(0);
  }, [movies]);

  // Calcular número de columnas dinámicamente
  const calculateColumns = () => {
    const cardWidth = 158; // Ancho de la card (150px + padding + border)
    const minPadding = 16; // Padding mínimo del contenedor
    const availableWidth = width - minPadding;
    const columns = Math.floor(availableWidth / cardWidth);
    return Math.max(2, columns);
  };

  // Calcular espaciado dinámico con límites para móvil
  const calculateSpacing = () => {
    if (isMobile) {
      // En móvil, usar espaciado fijo y compacto
      return showImages ? 3 : 2; // Más compacto para lista, un poco más para cards con imagen
    }
    
    // En tablet/desktop, usar cálculo dinámico
    const cardWidth = 158;
    const minPadding = 16;
    const columns = calculateColumns();
    const totalCardWidth = columns * cardWidth;
    const remainingSpace = width - totalCardWidth - minPadding;
    const spacingBetweenCards = remainingSpace / (columns + 1); // +1 para espacios en los extremos
    return Math.max(6, Math.min(12, spacingBetweenCards)); // Entre 6px y 12px en desktop
  };

  const numColumns = calculateColumns();
  const cardSpacing = calculateSpacing();

  // KeyExtractor optimizado
  const keyExtractor = React.useCallback((item: Movie) => item.id, []);

  // Componente EmptyState reutilizable y optimizado
  const EmptyStateComponent = React.useCallback(() => (
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
  ), [showImages, t, onAddMovie]);

  const renderMovieCard = React.useCallback(({ item, index }: { item: Movie; index: number }) => (
    <MovieCardWithImage
      item={item}
      showImage={showImages}
      onPress={onMoviePress}
      onToggleWatch={onToggleWatch}
      cardSpacing={cardSpacing}
    />
  ), [showImages, onMoviePress, onToggleWatch, cardSpacing]);

  const renderMinimalItem = React.useCallback(({ item, index }: { item: Movie; index: number }) => (
    <MinimalMovieItem
      item={item}
      onPress={onMoviePress}
      onToggleWatch={onToggleWatch}
      cardSpacing={cardSpacing}
    />
  ), [onMoviePress, onToggleWatch, cardSpacing]);

  if (showImages) {
    return (
      <FlatList
        ref={flatListRef}
        key={`grid-mode-${numColumns}`}
        data={movies}
        renderItem={renderMovieCard}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          padding: isMobile ? 2 : cardSpacing / 2,
          flexGrow: 1
        }}
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'center' } : undefined}
        ListEmptyComponent={EmptyStateComponent}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 100
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={20}
        windowSize={10}
      />
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      key={`list-mode-${numColumns}`}
      data={movies}
      renderItem={renderMinimalItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        padding: isMobile ? 2 : cardSpacing / 2,
        flexGrow: 1
      }}
      columnWrapperStyle={numColumns > 1 ? { justifyContent: 'center' } : undefined}
      ListEmptyComponent={EmptyStateComponent}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 100
      }}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={20}
      windowSize={10}
    />
  );
};
