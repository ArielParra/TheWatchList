export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  poster: string;
  watched: boolean;
  tmdbId: number;
  orderNumber: number; 
}

export interface MovieFilters {
  genre: string;
  year: string; 
  yearRange: { min: number; max: number }; 
  yearFilterType: 'specific' | 'range'; 
  watched: boolean | null;
  rating: number; 
  ratingRange: { min: number; max: number }; 
  ratingFilterType: 'specific' | 'range';
  sortBy: 'orderNumber' | 'alphabetical' | 'year';
  sortOrder: 'asc' | 'desc'; 
}

export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  vote_average: number;
  poster_path: string;
  overview: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProvidersResponse {
  results: {
    [countryCode: string]: {
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

export interface TMDBSearchResponse {
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}