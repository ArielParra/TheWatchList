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
      // Actualizar optimistamente el estado local primero
      setMovies(prevMovies => 
        prevMovies.map(movie => 
          movie.id === movieId 
            ? { ...movie, watched: !currentStatus }
            : movie
        )
      );

      // Luego actualizar en Firebase
      await updateMovieWatchStatus(movieId, !currentStatus);
      
      // No necesitamos recargar toda la lista, el estado ya está actualizado
    } catch (error) {
      console.error('Error updating watch status:', error);
      
      // Si hay error, revertir el cambio optimista
      setMovies(prevMovies => 
        prevMovies.map(movie => 
          movie.id === movieId 
            ? { ...movie, watched: currentStatus }
            : movie
        )
      );
      
      Alert.alert(t('messages.error'), t('messages.errorUpdating'));
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const addMovieToState = (newMovie: Movie) => {
    setMovies(prevMovies => [...prevMovies, newMovie]);
  };

  return {
    movies,
    loading,
    loadMovies,
    toggleWatchStatus,
    addMovieToState
  };
};
