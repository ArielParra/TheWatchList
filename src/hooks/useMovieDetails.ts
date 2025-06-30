import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Movie, TMDBMovie, WatchProvidersResponse } from '../types';
import { getMovieDetails, getWatchProviders } from '../services/tmdbApi';

export const useMovieDetails = () => {
  const { t, i18n } = useTranslation();
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<TMDBMovie | null>(null);
  const [watchProviders, setWatchProviders] = useState<WatchProvidersResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openMovieDetails = async (movie: Movie) => {
    try {
      setSelectedMovie(movie);
      setShowDetailModal(true);
      setDetailLoading(true);

      // Obtener detalles completos de TMDB - usar idioma actual para descripción localizada
      const details = await getMovieDetails(movie.tmdbId, i18n.language);
      setMovieDetails(details);

      // Obtener proveedores de streaming - usar idioma actual para localización
      const providers = await getWatchProviders(movie.tmdbId, i18n.language);
      setWatchProviders(providers);

      setDetailLoading(false);
    } catch (error) {
      console.error('Error loading movie details:', error);
      setDetailLoading(false);
      Alert.alert(t('messages.error'), 'Error loading movie details');
    }
  };

  const closeMovieDetails = () => {
    setShowDetailModal(false);
    setSelectedMovie(null);
    setMovieDetails(null);
    setWatchProviders(null);
  };

  // Efecto para recargar detalles cuando cambia el idioma
  useEffect(() => {
    if (selectedMovie && showDetailModal) {
      // Recargar detalles cuando cambia el idioma
      const reloadDetails = async () => {
        try {
          setDetailLoading(true);
          const details = await getMovieDetails(selectedMovie.tmdbId, i18n.language);
          setMovieDetails(details);
          const providers = await getWatchProviders(selectedMovie.tmdbId, i18n.language);
          setWatchProviders(providers);
          setDetailLoading(false);
        } catch (error) {
          console.error('Error reloading movie details:', error);
          setDetailLoading(false);
        }
      };
      
      reloadDetails();
    }
  }, [i18n.language, selectedMovie?.tmdbId, showDetailModal]);

  return {
    showDetailModal,
    selectedMovie,
    movieDetails,
    watchProviders,
    detailLoading,
    openMovieDetails,
    closeMovieDetails
  };
};
