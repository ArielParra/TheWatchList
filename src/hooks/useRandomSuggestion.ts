import { useState } from 'react';
import { Movie } from '../types';

export const useRandomSuggestion = () => {
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [suggestedMovie, setSuggestedMovie] = useState<Movie | null>(null);
  const [showNoMoviesError, setShowNoMoviesError] = useState(false);

  const generateRandomSuggestion = (movies: Movie[]) => {
    const unwatchedMovies = movies.filter(movie => !movie.watched);
    
    if (unwatchedMovies.length === 0) {
      setSuggestedMovie(null);
      setShowNoMoviesError(true);
    } else {
      const randomIndex = Math.floor(Math.random() * unwatchedMovies.length);
      setSuggestedMovie(unwatchedMovies[randomIndex]);
      setShowNoMoviesError(false);
    }
    
    setShowRandomModal(true);
  };

  const closeRandomModal = () => {
    setShowRandomModal(false);
    setSuggestedMovie(null);
    setShowNoMoviesError(false);
  };

  const handleWatchNow = (onToggleWatch: (movieId: string, currentStatus: boolean) => Promise<void>) => {
    if (suggestedMovie) {
      onToggleWatch(suggestedMovie.id, suggestedMovie.watched);
      closeRandomModal();
    }
  };

  const handleViewNow = (onViewMovie: (movie: Movie) => void) => {
    if (suggestedMovie) {
      onViewMovie(suggestedMovie);
      closeRandomModal();
    }
  };

  const handleAnotherSuggestion = (movies: Movie[]) => {
    const unwatchedMovies = movies.filter(movie => !movie.watched);
    
    if (unwatchedMovies.length <= 1) {
      // Si solo hay una película o ninguna, mostrar error pero mantener modal abierto
      setSuggestedMovie(null);
      setShowNoMoviesError(true);
      return;
    }
    
    // Filter out the currently suggested movie to avoid repetition
    const otherUnwatchedMovies = unwatchedMovies.filter(
      movie => movie.id !== suggestedMovie?.id
    );
    
    if (otherUnwatchedMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherUnwatchedMovies.length);
      setSuggestedMovie(otherUnwatchedMovies[randomIndex]);
      setShowNoMoviesError(false);
    } else {
      // Fallback: mostrar error
      setSuggestedMovie(null);
      setShowNoMoviesError(true);
    }
  };

  return {
    showRandomModal,
    suggestedMovie,
    showNoMoviesError,
    generateRandomSuggestion,
    closeRandomModal,
    handleWatchNow,
    handleViewNow,
    handleAnotherSuggestion
  };
};
