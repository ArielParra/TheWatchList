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
    case 'netflix standard with ads':
      return `https://www.netflix.com/search?q=${query}`;
    case 'amazon prime video':
    case 'amazon prime video with ads':
    case 'paramount amazon channel':
    case 'prime video':
    case 'Max Amazon Channel':
      return `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${query}`;
    case 'disney plus':
    case 'disney+':
      return `https://www.disneyplus.com/es-419/browse/search?q=${query}`;
    case 'max':
    case 'hbo max':
      return `https://play.max.com/search/result?q=${query}`;
    case 'paramount plus':
    case 'paramount plus premium':
    case 'paramount+':
      return `https://www.paramountplus.com/search/?query=${query}`;
    case 'claro video':
      return `https://www.clarovideo.com/mexico/search?q=${query}`;
    case 'vix ':
    case 'vix gratis':
    case 'vix':
      return `https://www.vix.com/es-mx/search?q=${query}`;
    case 'mercado play':
      return `https://play.mercadolibre.com.mx/buscar/${query}`;
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
      return 'es-MX';
    case 'en':
      return 'en-US';
    default:
      return 'en-US';
  }
};

export const searchMovies = async (query: string, language: string = 'en'): Promise<TMDBSearchResponse> => {
  const tmdbLanguage = getTMDBLanguage(language);
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=${tmdbLanguage}&region=MX`
  );
  return response.json();
};

export const getMovieDetails = async (movieId: number, language: string = 'en'): Promise<TMDBMovie> => {
  const tmdbLanguage = getTMDBLanguage(language);
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=${tmdbLanguage}&region=MX`
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

// ✅ Función helper para obtener género traducido
export const getTranslatedGenre = (genreString: string, t: (key: string) => string): string => {
  if (!genreString) return '';
  
  // Primero corregir el formato si está mal
  const fixedGenre = fixGenreFormat(genreString);
  
  // Si contiene múltiples géneros separados por comas
  if (fixedGenre.includes(', ')) {
    return fixedGenre
      .split(', ')
      .map(genre => {
        const trimmedGenre = genre.trim();
        // Verificar si la clave de traducción existe, si no, usar el original
        try {
          return t(`genres.${trimmedGenre}`);
        } catch {
          return trimmedGenre;
        }
      })
      .join(', ');
  }
  
  // Género individual
  try {
    return t(`genres.${fixedGenre}`);
  } catch {
    return fixedGenre;
  }
};

// ✅ Función para arreglar géneros mal formateados (números en lugar de nombres)
export const fixGenreFormat = (genreString: string): string => {
  if (!genreString || genreString === 'noGenre') return 'Unknown';
  
  // Si ya son nombres válidos en inglés, devolverlos tal como están
  if (!genreString.match(/^\d+/) && !genreString.includes('genres.')) {
    return genreString;
  }
  
  // Si contiene "genres." significa que hay problemas de traducción
  if (genreString.includes('genres.')) {
    return genreString
      .split(', ')
      .map(genre => {
        // Extraer el número del formato "genres.18" o usar directamente si es número
        const match = genre.match(/(\d+)/);
        if (match) {
          const genreId = parseInt(match[1]);
          const genreObj = genres.find(g => g.id === genreId);
          return genreObj ? genreObj.name : 'Unknown';
        }
        return genre;
      })
      .join(', ');
  }
  
  // Si son números separados por comas
  if (genreString.match(/^\d+/)) {
    return genreString
      .split(', ')
      .map(idStr => {
        const genreId = parseInt(idStr.trim());
        const genreObj = genres.find(g => g.id === genreId);
        return genreObj ? genreObj.name : 'Unknown';
      })
      .join(', ');
  }
  
  return genreString;
};