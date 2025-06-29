import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import './src/i18n';

import {
  SafeContainer,
  Container,
  CenterContainer,
  EmptyText,
  colors
} from './src/components/styled/CommonStyles';

import { Movie } from './src/types';
import { TopBar } from './src/components/TopBar';
import { MovieFiltersComponent } from './src/components/MovieFilters';
import { MovieList } from './src/components/MovieList';
import { AddMovieModal } from './src/components/AddMovieModal';
import { MovieDetailModalComponent } from './src/components/MovieDetailModal';
import { RandomSuggestionModal } from './src/components/RandomSuggestionModal';
import { AppFooter } from './src/components/AppFooter';
import { useMovies } from './src/hooks/useMovies';
import { useMovieFilters } from './src/hooks/useMovieFilters';
import { useAddMovie } from './src/hooks/useAddMovie';
import { useMovieDetails } from './src/hooks/useMovieDetails';
import { useRandomSuggestion } from './src/hooks/useRandomSuggestion';

export default function App() {
  const { t } = useTranslation();
  
  // Estados de UI
  const [showImages, setShowImages] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Hooks personalizados
  const { movies, loading, loadMovies, toggleWatchStatus } = useMovies();
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredMovies, 
    filters, 
    setFilters, 
    currentYear 
  } = useMovieFilters(movies);
  
  const {
    showAddModal,
    setShowAddModal,
    searchResults,
    searchLoading,
    addSearchQuery,
    setAddSearchQuery,
    searchMoviesFromAPI,
    addMovieToList,
    closeAddModal
  } = useAddMovie(loadMovies);

  const {
    showDetailModal,
    selectedMovie,
    movieDetails,
    watchProviders,
    detailLoading,
    openMovieDetails,
    closeMovieDetails
  } = useMovieDetails();

  const {
    showRandomModal,
    suggestedMovie,
    showNoMoviesError,
    generateRandomSuggestion,
    closeRandomModal,
    handleWatchNow,
    handleViewNow,
    handleAnotherSuggestion
  } = useRandomSuggestion();

  // Handlers
  const handleMoviePress = (movie: Movie) => {
    openMovieDetails(movie);
  };

  const handleToggleImages = () => setShowImages(!showImages);
  const handleToggleFilters = () => setShowFilters(!showFilters);
  const handleAddMovie = () => {
    setShowAddModal(true);
    // Si hay un query de búsqueda, buscarlo automáticamente en el modal
    if (searchQuery.trim()) {
      // Ejecutar búsqueda después de un pequeño delay para asegurar que el modal esté abierto
      setTimeout(() => {
        searchMoviesFromAPI(searchQuery);
      }, 100);
    }
  };
  const handleRandomSuggestion = () => generateRandomSuggestion(movies);
  const handleViewNowFromModal = () => handleViewNow(openMovieDetails);
  const handleAnotherSuggestionFromModal = () => handleAnotherSuggestion(movies);

  if (loading) {
    return (
      <SafeContainer>
        <CenterContainer>
          <ActivityIndicator size="large" color={colors.primary} />
          <EmptyText>{t('messages.loading')}</EmptyText>
        </CenterContainer>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Container>
        {/* Top Bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showImages={showImages}
          onToggleImages={handleToggleImages}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
          onAddMovie={handleAddMovie}
          movies={movies}
          onRandomSuggestion={handleRandomSuggestion}
        />

        {/* Filters */}
        <MovieFiltersComponent
          filters={filters}
          setFilters={setFilters}
          filteredMoviesCount={filteredMovies.length}
          currentYear={currentYear}
          showFilters={showFilters}
        />

        {/* Movies List */}
        <MovieList
          movies={filteredMovies}
          showImages={showImages}
          onMoviePress={handleMoviePress}
          onToggleWatch={toggleWatchStatus}
          onAddMovie={handleAddMovie}
        />

        {/* Add Movie Modal */}
        <AddMovieModal
          visible={showAddModal}
          onClose={closeAddModal}
          searchQuery={addSearchQuery}
          onSearchChange={setAddSearchQuery}
          onSearch={searchMoviesFromAPI}
          searchResults={searchResults}
          loading={searchLoading}
          onAddMovie={addMovieToList}
        />

        {/* Movie Detail Modal */}
        <MovieDetailModalComponent
          visible={showDetailModal}
          selectedMovie={selectedMovie}
          movieDetails={movieDetails}
          watchProviders={watchProviders}
          loading={detailLoading}
          onClose={closeMovieDetails}
          onToggleWatch={toggleWatchStatus}
        />

        {/* Random Suggestion Modal */}
        <RandomSuggestionModal
          visible={showRandomModal}
          onClose={closeRandomModal}
          suggestedMovie={suggestedMovie}
          onWatchNow={handleViewNowFromModal}
          onAnotherSuggestion={handleAnotherSuggestionFromModal}
          showNoMoviesError={showNoMoviesError}
        />

        {/* Footer */}
        <AppFooter />

        <StatusBar style="dark" />
      </Container>
    </SafeContainer>
  );
}
