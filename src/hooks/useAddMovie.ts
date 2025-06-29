import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { TMDBMovie, Movie } from '../types';
import { searchMovies, getGenreName } from '../services/tmdbApi';
import { addMovieToFirestore, getMoviesFromFirestore } from '../services/firebaseService';

export const useAddMovie = (onMovieAdded: (newMovie: Movie) => void) => {
  const { t, i18n } = useTranslation();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');

  const searchMoviesFromAPI = async (customQuery?: string) => {
    const queryToUse = customQuery || addSearchQuery;
    if (!queryToUse.trim()) return;

    try {
      setSearchLoading(true);
      // Usar 'en' para mantener géneros en inglés, serán traducidos por i18n
      const results = await searchMovies(queryToUse, 'en');
      setSearchResults(results.results);
      
      // Si se pasó un query personalizado, actualizar el estado
      if (customQuery) {
        setAddSearchQuery(customQuery);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      Alert.alert(t('messages.error'), t('messages.errorSearching'));
    } finally {
      setSearchLoading(false);
    }
  };

  const checkMovieExists = async (tmdbId: number): Promise<boolean> => {
    try {
      const allMovies = await getMoviesFromFirestore();
      const existsInDB = allMovies.some(movie => movie.tmdbId === tmdbId);
      return existsInDB;
    } catch (error) {
      console.error('Error checking movie existence:', error);
      return false;
    }
  };

  const addMovieToList = async (tmdbMovie: TMDBMovie) => {
    try {
      console.log('🎬 Intentando añadir película:', tmdbMovie.title);
      
      const exists = await checkMovieExists(tmdbMovie.id);
      if (exists) {
        Alert.alert('❗ Película duplicada', 'Esta película ya está en tu lista');
        return;
      }

      console.log('💾 Guardando película en base de datos...');
      const movieId = await addMovieToFirestore(tmdbMovie);
      console.log('✅ Película guardada con ID:', movieId);
      
      // Crear el objeto Movie para actualización optimista
      const newMovie: Movie = {
        id: movieId,
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        year: new Date(tmdbMovie.release_date).getFullYear(),
        genre: tmdbMovie.genre_ids?.length > 0 
          ? tmdbMovie.genre_ids.map(id => getGenreName(id)).join(', ')
          : 'Unknown',
        rating: tmdbMovie.vote_average,
        poster: tmdbMovie.poster_path,
        watched: false,
        orderNumber: Date.now() // Usar timestamp como orderNumber temporal
      };
      
      console.log('🔄 Añadiendo película a la lista local...');
      onMovieAdded(newMovie);
      
      setShowAddModal(false);
      setAddSearchQuery('');
      setSearchResults([]);
      Alert.alert('✅ ¡Éxito!', t('messages.addedToList'));
    } catch (error) {
      console.error('❌ Error añadiendo película:', error);
      Alert.alert(t('messages.error'), t('messages.errorAdding'));
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddSearchQuery('');
    setSearchResults([]);
  };

  return {
    showAddModal,
    setShowAddModal,
    searchResults,
    searchLoading,
    addSearchQuery,
    setAddSearchQuery,
    searchMoviesFromAPI,
    addMovieToList,
    closeAddModal
  };
};
