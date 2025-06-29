import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { Movie, MovieFilters } from '../types';
import { 
  getMoviesFromFirestore, 
  updateMovieWatchStatus 
} from '../services/firebaseService';

export const useMovies = () => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMovies = async () => {
    try {
      console.log('🔄 Cargando películas...');
      setLoading(true);
      const moviesData = await getMoviesFromFirestore();
      console.log('📋 Películas cargadas:', moviesData.length);
      setMovies(moviesData);
    } catch (error) {
      console.error('❌ Error loading movies:', error);
      Alert.alert(t('messages.error'), t('messages.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchStatus = async (movieId: string, currentStatus: boolean) => {
    try {
      await updateMovieWatchStatus(movieId, !currentStatus);
      await loadMovies();
    } catch (error) {
      console.error('Error updating watch status:', error);
      Alert.alert(t('messages.error'), t('messages.errorUpdating'));
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  return {
    movies,
    loading,
    loadMovies,
    toggleWatchStatus
  };
};
