const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

import { TMDBSearchResponse, TMDBMovie, WatchProvidersResponse } from '../types';

// Función helper para obtener el código de idioma para TMDB
const getTMDBLanguage = (language: string): string => {
  switch (language) {
    case 'es':
      return 'es-ES';
    case 'en':
      return 'en-US';
    default:
      return 'en-US';
  }
};

export const searchMovies = async (query: string, language: string = 'en'): Promise<TMDBSearchResponse> => {
  const tmdbLanguage = getTMDBLanguage(language);
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=${tmdbLanguage}`
  );
  return response.json();
};

export const getMovieDetails = async (movieId: number, language: string = 'en'): Promise<TMDBMovie> => {
  const tmdbLanguage = getTMDBLanguage(language);
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=${tmdbLanguage}`
  );
  return response.json();
};

export const getImageUrl = (posterPath: string): string => {
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};

export const getWatchProviders = async (movieId: number, language: string = 'en'): Promise<WatchProvidersResponse> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
    );
    return response.json();
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return { results: {} };
  }
};

export const getGenreName = (genreId: number): string => {
  const genre = genres.find(g => g.id === genreId);
  return genre ? genre.name : 'Unknown';
};