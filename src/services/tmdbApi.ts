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

// ✅ Proveedores de streaming permitidos
export const allowedProviders = [
  'Netflix',
  'Amazon Prime Video',
  'Amazon Prime Video with Ads',
  'Prime Video',
  'Claro video',
  'Disney Plus',
  'Disney+',
  'ViX ',
  'Max',
  'HBO Max',
  'ViX gratis',
  'Mercado Play',
  'Paramount Plus',
  'Paramount+',
  'Pluto TV'
];

// ✅ Función para verificar si un proveedor está permitido
export const isProviderAllowed = (providerName: string): boolean => {
  return allowedProviders.some(allowed => 
    providerName.toLowerCase().includes(allowed.toLowerCase()) || 
    allowed.toLowerCase().includes(providerName.toLowerCase())
  );
};

// ✅ Función para obtener URL específica del proveedor
export const getProviderUrl = (providerName: string, movieTitle: string): string => {
  const query = encodeURIComponent(movieTitle);
  
  switch (providerName.toLowerCase()) {
    case 'netflix':
      return `https://www.netflix.com/search?q=${query}`;
    case 'amazon prime video':
    case 'amazon prime video with ads':
    case 'prime video':
      return `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${query}`;
    case 'disney plus':
    case 'disney+':
      return `https://www.disneyplus.com/search?q=${query}`;
    case 'max':
    case 'hbo max':
      return `https://www.max.com/search?q=${query}`;
    case 'paramount plus':
    case 'paramount+':
      return `https://www.paramountplus.com/search/?query=${query}`;
    case 'claro video':
      return `https://www.clarovideo.com/mexico/buscar?q=${query}`;
    case 'vix ':
    case 'vix gratis':
    case 'vix':
      return `https://www.vix.com/es-mx/search?q=${query}`;
    case 'mercado play':
      return `https://play.mercadolibre.com.mx/search?q=${query}`;
    case 'pluto tv':
      return `https://pluto.tv/es/search?term=${query}`;
    default:
      return `https://www.google.com/search?q=${query}+${providerName}+streaming`;
  }
};

import { TMDBSearchResponse, TMDBMovie, WatchProvidersResponse, WatchProvider } from '../types';

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