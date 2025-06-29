import { useState, useEffect } from 'react';
import { Movie, MovieFilters } from '../types';

export const useMovieFilters = (movies: Movie[]) => {
  const currentYear = new Date().getFullYear();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState<MovieFilters>({
    genre: '',
    year: '',
    yearRange: { min: 1900, max: currentYear },
    yearFilterType: 'specific',
    watched: null,
    rating: 1,
    ratingRange: { min: 1, max: 10 }, 
    ratingFilterType: 'specific',
    sortBy: 'orderNumber',
    sortOrder: 'asc' 
  });

  const applyFilters = () => {
    let filtered = [...movies];

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por género
    if (filters.genre) {
      filtered = filtered.filter(movie =>
        movie.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    // ✅ Filtro por año mejorado - específico o rango con búsqueda por prefijo
    if (filters.yearFilterType === 'specific' && filters.year) {
      const yearQuery = filters.year;
      
      // Si es un año completo (4 dígitos), buscar exacto
      if (yearQuery.length === 4) {
        filtered = filtered.filter(movie =>
          movie.year.toString() === yearQuery
        );
      } 
      // Si es un prefijo (1-3 dígitos), buscar años que empiecen con ese prefijo
      else if (yearQuery.length >= 1 && yearQuery.length <= 3) {
        filtered = filtered.filter(movie =>
          movie.year.toString().startsWith(yearQuery)
        );
      }
    } else if (filters.yearFilterType === 'range') {
      filtered = filtered.filter(movie =>
        movie.year >= filters.yearRange.min && movie.year <= filters.yearRange.max
      );
    }

    // Filtro por estado visto
    if (filters.watched !== null) {
      filtered = filtered.filter(movie => movie.watched === filters.watched);
    }

    // Filtro por rating - específico o rango
    if (filters.ratingFilterType === 'specific' && filters.rating > 1) {
      filtered = filtered.filter(movie => movie.rating >= filters.rating);
    } else if (filters.ratingFilterType === 'range') {
      filtered = filtered.filter(movie => 
        movie.rating >= filters.ratingRange.min && movie.rating <= filters.ratingRange.max
      );
    }

    // Ordenamiento mejorado con ascendente/descendente
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'orderNumber':
        default:
          comparison = a.orderNumber - b.orderNumber;
          break;
      }
      
      // Aplicar orden ascendente o descendente
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredMovies(filtered);
  };

  // Aplicar filtros cuando cambian
  useEffect(() => {
    applyFilters();
  }, [movies, filters, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredMovies,
    filters,
    setFilters,
    currentYear
  };
};
