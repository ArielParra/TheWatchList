import React, { useState, useEffect } from 'react';
import { 
  FlatList, 
  Modal, 
  Alert, 
  ActivityIndicator, 
  Text,
  View,
  Dimensions,
  Linking,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import './src/i18n';

import {
  SafeContainer,
  Container,
  TopBar,
  TopBarRow,
  TopBarTitle,
  TopBarActions,
  SearchContainer,
  SearchInput,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  ButtonText,
  MovieCard,
  MoviePoster,
  MovieInfo,
  MovieTitle,
  MovieDetails,
  MinimalMovieItem,
  MinimalMovieTitle,
  MinimalCheckbox,
  CheckboxContainer,
  Checkbox,
  CheckboxText,
  FilterContainer,
  FilterRow,
  FilterLabel,
  CenterContainer,
  EmptyText,
  ModalContainer,
  ModalContent,
  MovieDetailModal,
  MovieDetailContent,
  MovieDetailHeader,
  MovieDetailPoster,
  MovieDetailInfo,
  MovieDetailTitle,
  MovieDetailYear,
  MovieDetailRating,
  MovieDetailGenre,
  MovieDetailOverview,
  WatchProvidersContainer,
  WatchProvidersTitle,
  WatchProvidersList,
  WatchProviderItem,
  WatchProviderLogo,
  WatchProviderName,
  ExternalLinksContainer,
  ExternalLinksTitle,
  ExternalLinkButton,
  ExternalLinkText,
  CloseButton,
  colors
} from './src/components/styled/CommonStyles';

import { Movie, TMDBMovie, MovieFilters, WatchProvidersResponse } from './src/types';
import { searchMovies, getImageUrl, genres, getMovieDetails, getWatchProviders } from './src/services/tmdbApi';
import { 
  getMoviesFromFirestore, 
  addMovieToFirestore, 
  updateMovieWatchStatus,
  deleteMovieFromFirestore 
} from './src/services/firebaseService';

import LanguageSelector from './src/components/LanguageSelector';

const { width } = Dimensions.get('window');

export default function App() {
  const { t, i18n } = useTranslation();
  
  // Estados principales
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para añadir películas
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');

  // Estados para modal de detalles
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<TMDBMovie | null>(null);
  const [watchProviders, setWatchProviders] = useState<WatchProvidersResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Generar años desde 1900 hasta el año actual
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i).reverse();

  // Estados de filtros actualizados
  // Estados de filtros actualizados
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


  // Calcular número de columnas dinámicamente
  const calculateColumns = () => {
    const cardWidth = 158;
    const padding = 16;
    const availableWidth = width - padding;
    const columns = Math.floor(availableWidth / cardWidth);
    return Math.max(2, columns);
  };

  const numColumns = calculateColumns();

  // Cargar películas al iniciar
  useEffect(() => {
    loadMovies();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    applyFilters();
  }, [movies, filters, searchQuery]);

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

    // Filtro por año - específico o rango
    if (filters.yearFilterType === 'specific' && filters.year) {
      filtered = filtered.filter(movie =>
        movie.year.toString() === filters.year
      );
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

    // ✅ ORDENAMIENTO mejorado con ascendente/descendente
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

  const searchMoviesFromAPI = async () => {
    if (!addSearchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const results = await searchMovies(addSearchQuery, i18n.language);
      setSearchResults(results.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      Alert.alert(t('messages.error'), t('messages.errorSearching'));
    } finally {
      setSearchLoading(false);
    }
  };

  // Verificación mejorada de duplicados
  const checkMovieExists = async (tmdbId: number): Promise<boolean> => {
    try {
      const existsInLocal = movies.some(movie => movie.tmdbId === tmdbId);
      if (existsInLocal) {
        return true;
      }

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
      
      console.log('🔄 Recargando lista de películas...');
      await loadMovies();
      
      setShowAddModal(false);
      setAddSearchQuery('');
      setSearchResults([]);
      Alert.alert('✅ ¡Éxito!', t('messages.addedToList'));
    } catch (error) {
      console.error('❌ Error añadiendo película:', error);
      Alert.alert(t('messages.error'), t('messages.errorAdding'));
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

  // Funciones para el modal de detalles
  const openMovieDetails = async (movie: Movie) => {
    try {
      setSelectedMovie(movie);
      setShowDetailModal(true);
      setDetailLoading(true);

      // Obtener detalles completos de TMDB
      const details = await getMovieDetails(movie.tmdbId, i18n.language);
      setMovieDetails(details);

      // Obtener proveedores de streaming
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

  const openExternalLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'Cannot open this link');
    }
  };

  const searchMovieOnline = (movieTitle: string, platform: string) => {
    const query = encodeURIComponent(`${movieTitle} ${new Date().getFullYear()}`);
    let url = '';
    
    switch (platform) {
      case 'google':
        url = `https://www.google.com/search?q=${query}+watch+online`;
        break;
      case 'yesmovies':
        url = `https://yesmovies.ag/search/${query}`;
        break;
      default:
        url = `https://www.google.com/search?q=${query}`;
    }
    
    openExternalLink(url);
  };

  // Tarjetas verticales con imágenes
  const renderMovieCardWithImage = ({ item }: { item: Movie }) => (
    <MovieCard showImage={true} onPress={() => openMovieDetails(item)}>
      {item.poster && (
        <MoviePoster 
          source={{ uri: getImageUrl(item.poster) }}
          defaultSource={require('./assets/icon.png')}
        />
      )}
      
      <MovieInfo>
        <MovieTitle numberOfLines={2}>{item.title}</MovieTitle>
        <MovieDetails>{item.year}</MovieDetails>
        <MovieDetails>⭐ {item.rating.toFixed(1)}</MovieDetails>
        <MovieDetails>#{item.orderNumber}</MovieDetails>
        
        <CheckboxContainer 
          onPress={(e: any) => {
            e.stopPropagation();
            toggleWatchStatus(item.id, item.watched);
          }}
        >
          <Checkbox checked={item.watched}>
            {item.watched && (
              <Ionicons name="checkmark" size={14} color={colors.surface} />
            )}
          </Checkbox>
        </CheckboxContainer>
      </MovieInfo>
    </MovieCard>
  );

  // Lista minimalista sin imágenes
  const renderMinimalMovieItem = ({ item }: { item: Movie }) => (
    <MinimalMovieItem onPress={() => openMovieDetails(item)}>
      <MinimalCheckbox 
        checked={item.watched}
        onPress={(e: any) => {
          e.stopPropagation();
          toggleWatchStatus(item.id, item.watched);
        }}
      >
        {item.watched && (
          <Ionicons name="checkmark" size={12} color={colors.surface} />
        )}
      </MinimalCheckbox>
      
      <MinimalMovieTitle numberOfLines={2}>{item.title}</MinimalMovieTitle>
    </MinimalMovieItem>
  );

  const renderSearchResult = ({ item }: { item: TMDBMovie }) => (
    <MovieCard showImage={true}>
      {item.poster_path && (
        <MoviePoster 
          source={{ uri: getImageUrl(item.poster_path) }}
          defaultSource={require('./assets/icon.png')}
        />
      )}
      
      <MovieInfo>
        <MovieTitle numberOfLines={2}>{item.title}</MovieTitle>
        <MovieDetails>
          {new Date(item.release_date).getFullYear()}
        </MovieDetails>
        <MovieDetails>⭐ {item.vote_average.toFixed(1)}</MovieDetails>
      </MovieInfo>
      
      <IconButton onPress={() => addMovieToList(item)}>
        <Ionicons name="add" size={20} color={colors.primary} />
      </IconButton>
    </MovieCard>
  );

  // Componente EmptyState reutilizable
  const EmptyStateComponent = () => (
    <CenterContainer>
      <Ionicons 
        name={showImages ? "film-outline" : "list-outline"} 
        size={64} 
        color={colors.textSecondary} 
      />
      <EmptyText>
        {searchQuery ? t('messages.noResults') : t('messages.noMovies')}
      </EmptyText>
      <PrimaryButton onPress={() => setShowAddModal(true)}>
        <ButtonText>{t('buttons.addMovie')}</ButtonText>
      </PrimaryButton>
    </CenterContainer>
  );

  if (loading) {
    return (
      <SafeContainer>
        <CenterContainer>
          <ActivityIndicator size="large" color={colors.primary} />
          <EmptyText>{t('messages.loading')}</EmptyText>
        </CenterContainer>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Container>
        {/* Top Bar */}
        <TopBar>
          <TopBarRow>
            <TopBarTitle>🎬TheWatchList</TopBarTitle>
            <TopBarActions>
              <LanguageSelector />
              
              <IconButton 
                active={showImages}
                onPress={() => setShowImages(!showImages)}
              >
                <Ionicons 
                  name={showImages ? "image" : "image-outline"} 
                  size={20} 
                  color={showImages ? colors.surface : colors.primary} 
                />
              </IconButton>
              
              <IconButton 
                active={showFilters}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Ionicons 
                  name={showFilters ? "filter" : "filter-outline"} 
                  size={20} 
                  color={showFilters ? colors.surface : colors.primary} 
                />
              </IconButton>
              
              <IconButton onPress={() => setShowAddModal(true)}>
                <Ionicons name="add" size={20} color={colors.primary} />
              </IconButton>
            </TopBarActions>
          </TopBarRow>
          
          {/* Search Bar */}
          <SearchContainer>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <SearchInput
              placeholder={t('messages.searchPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </SearchContainer>
        </TopBar>

        {/* Filters */}
        {showFilters && (
          <FilterContainer>
            <FilterLabel>{t('filters.title')}</FilterLabel>
            
            {/* ✅ ACTUALIZADO: Filtro por orden con ascendente/descendente */}
            <FilterRow>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                {t('filters.sortBy')}
              </Text>
              
              {/* Selector de criterio de ordenamiento */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                <SecondaryButton 
                  onPress={() => setFilters({...filters, sortBy: 'orderNumber'})}
                  style={{ 
                    backgroundColor: filters.sortBy === 'orderNumber' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.sortBy === 'orderNumber' ? colors.surface : colors.text,
                    fontSize: 12
                  }}>
                    📝 {t('filters.byOrder')}
                  </ButtonText>
                </SecondaryButton>
                
                <SecondaryButton 
                  onPress={() => setFilters({...filters, sortBy: 'alphabetical'})}
                  style={{ 
                    backgroundColor: filters.sortBy === 'alphabetical' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.sortBy === 'alphabetical' ? colors.surface : colors.text,
                    fontSize: 12
                  }}>
                    🔤 {t('filters.byAlphabet')}
                  </ButtonText>
                </SecondaryButton>
                
                <SecondaryButton 
                  onPress={() => setFilters({...filters, sortBy: 'year'})}
                  style={{ 
                    backgroundColor: filters.sortBy === 'year' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.sortBy === 'year' ? colors.surface : colors.text,
                    fontSize: 12
                  }}>
                    📅 {t('filters.byYear')}
                  </ButtonText>
                </SecondaryButton>
              </View>
              
              {/* ✅ NUEVO: Selector de orden ascendente/descendente */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <SecondaryButton 
                  onPress={() => setFilters({...filters, sortOrder: 'asc'})}
                  style={{ 
                    backgroundColor: filters.sortOrder === 'asc' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flex: 1
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.sortOrder === 'asc' ? colors.surface : colors.text,
                    fontSize: 12,
                    textAlign: 'center'
                  }}>
                    ⬆️ {t('filters.ascending')}
                  </ButtonText>
                </SecondaryButton>
                
                <SecondaryButton 
                  onPress={() => setFilters({...filters, sortOrder: 'desc'})}
                  style={{ 
                    backgroundColor: filters.sortOrder === 'desc' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flex: 1
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.sortOrder === 'desc' ? colors.surface : colors.text,
                    fontSize: 12,
                    textAlign: 'center'
                  }}>
                    ⬇️ {t('filters.descending')}
                  </ButtonText>
                </SecondaryButton>
              </View>
            </FilterRow>
            
     {/* Filtro por género con dropdown */}
            <FilterRow>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                {t('filters.genre')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <SecondaryButton 
                  onPress={() => setFilters({...filters, genre: ''})}
                  style={{ 
                    backgroundColor: filters.genre === '' ? colors.primary : colors.surface,
                    paddingHorizontal: 8,
                    paddingVertical: 4
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.genre === '' ? colors.surface : colors.text,
                    fontSize: 10
                  }}>
                    {t('filters.all')}
                  </ButtonText>
                </SecondaryButton>
                
                {genres.map(genre => (
                  <SecondaryButton 
                    key={genre.id}
                    onPress={() => setFilters({...filters, genre: genre.name})}
                    style={{ 
                      backgroundColor: filters.genre === genre.name ? colors.primary : colors.surface,
                      paddingHorizontal: 8,
                      paddingVertical: 4
                    }}
                  >
                    <ButtonText style={{ 
                      color: filters.genre === genre.name ? colors.surface : colors.text,
                      fontSize: 10
                    }}>
                      {genre.name}
                    </ButtonText>
                  </SecondaryButton>
                ))}
              </View>
            </FilterRow>
             {/* Filtro por estado de visto */}
            <FilterRow>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                {t('filters.status')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <SecondaryButton 
                  onPress={() => setFilters({...filters, watched: null})}
                  style={{ 
                    backgroundColor: filters.watched === null ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    minWidth: 80
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.watched === null ? colors.surface : colors.text,
                    fontSize: 12
                  }}>
                    {t('filters.all')}
                  </ButtonText>
                </SecondaryButton>
                
                <SecondaryButton 
                  onPress={() => setFilters({...filters, watched: true})}
                  style={{ 
                    backgroundColor: filters.watched === true ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    minWidth: 80
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.watched === true ? colors.surface : colors.text,
                    fontSize: 12
                  }}>
                    ✅ {t('filters.watched')}
                  </ButtonText>
                </SecondaryButton>
                
                <SecondaryButton 
                  onPress={() => setFilters({...filters, watched: false})}
                  style={{ 
                    backgroundColor: filters.watched === false ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    minWidth: 80
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.watched === false ? colors.surface : colors.text,
                    fontSize: 12
                  }}>
                    ⏳ {t('filters.pending')}
                  </ButtonText>
                </SecondaryButton>
              </View>
            </FilterRow>

            {/* ✅ NUEVO: Filtro por rating con toggle específico/rango */}
            <FilterRow>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                {t('filters.rating')}
              </Text>
              
              {/* Toggle entre rating específico y rango */}
              <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
                <SecondaryButton 
                  onPress={() => setFilters({...filters, ratingFilterType: 'specific'})}
                  style={{ 
                    backgroundColor: filters.ratingFilterType === 'specific' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flex: 1
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.ratingFilterType === 'specific' ? colors.surface : colors.text,
                    fontSize: 12,
                    textAlign: 'center'
                  }}>
                    ⭐ {t('filters.minRating')}
                  </ButtonText>
                </SecondaryButton>
                
                <SecondaryButton 
                  onPress={() => setFilters({...filters, ratingFilterType: 'range'})}
                  style={{ 
                    backgroundColor: filters.ratingFilterType === 'range' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flex: 1
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.ratingFilterType === 'range' ? colors.surface : colors.text,
                    fontSize: 12,
                    textAlign: 'center'
                  }}>
                    📊 {t('filters.ratingRange')}
                  </ButtonText>
                </SecondaryButton>
              </View>

              {/* Input para rating específico (mínimo) */}
              {filters.ratingFilterType === 'specific' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 12 }}>{t('filters.minimum')}:</Text>
                  <SearchInput
                    placeholder="1-10"
                    placeholderTextColor={colors.textSecondary}
                    value={filters.rating > 1 ? filters.rating.toString() : ''}
                    onChangeText={(text:string) => {
                      const value = parseFloat(text);
                      if (!isNaN(value) && value >= 1 && value <= 10) {
                        setFilters({...filters, rating: value});
                      } else if (text === '') {
                        setFilters({...filters, rating: 1});
                      }
                    }}
                    keyboardType="numeric"
                    style={{ 
                      flex: 1,
                      fontSize: 14,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      textAlign: 'center'
                    }}
                  />
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>⭐ {t('filters.orHigher')}</Text>
                </View>
              ) : (
                /* Input boxes para rango de rating */
                <View>
                  <Text style={{ 
                    color: colors.text, 
                    fontSize: 12, 
                    marginBottom: 8,
                    textAlign: 'center'
                  }}>
                    ⭐{filters.ratingRange.min} - ⭐{filters.ratingRange.max}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.textSecondary, fontSize: 11, marginBottom: 4 }}>
                        {t('filters.from')}:
                      </Text>
                      <SearchInput
                        placeholder="1"
                        placeholderTextColor={colors.textSecondary}
                        value={filters.ratingRange.min.toString()}
                        onChangeText={(text:string) => {
                          const value = parseFloat(text);
                          if (!isNaN(value) && value >= 1 && value <= 10) {
                            setFilters({
                              ...filters, 
                              ratingRange: { 
                                ...filters.ratingRange, 
                                min: Math.min(value, filters.ratingRange.max)
                              }
                            });
                          }
                        }}
                        keyboardType="numeric"
                        style={{ 
                          fontSize: 14,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          textAlign: 'center'
                        }}
                      />
                    </View>
                    
                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 16 }}>-</Text>
                    
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.textSecondary, fontSize: 11, marginBottom: 4 }}>
                        {t('filters.to')}:
                      </Text>
                      <SearchInput
                        placeholder="10"
                        placeholderTextColor={colors.textSecondary}
                        value={filters.ratingRange.max.toString()}
                        onChangeText={(text:string) => {
                          const value = parseFloat(text);
                          if (!isNaN(value) && value >= 1 && value <= 10) {
                            setFilters({
                              ...filters, 
                              ratingRange: { 
                                ...filters.ratingRange, 
                                max: Math.max(value, filters.ratingRange.min)
                              }
                            });
                          }
                        }}
                        keyboardType="numeric"
                        style={{ 
                          fontSize: 14,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          textAlign: 'center'
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </FilterRow>

            {/* ✅ NUEVO: Filtro por año con toggle específico/rango e input boxes */}
            <FilterRow>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                {t('filters.year')}
              </Text>
              
              {/* Toggle entre año específico y rango */}
              <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
                <SecondaryButton 
                  onPress={() => setFilters({...filters, yearFilterType: 'specific'})}
                  style={{ 
                    backgroundColor: filters.yearFilterType === 'specific' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flex: 1
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.yearFilterType === 'specific' ? colors.surface : colors.text,
                    fontSize: 12,
                    textAlign: 'center'
                  }}>
                    📅 {t('filters.specificYear')}
                  </ButtonText>
                </SecondaryButton>
                
                <SecondaryButton 
                  onPress={() => setFilters({...filters, yearFilterType: 'range'})}
                  style={{ 
                    backgroundColor: filters.yearFilterType === 'range' ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flex: 1
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.yearFilterType === 'range' ? colors.surface : colors.text,
                    fontSize: 12,
                    textAlign: 'center'
                  }}>
                    📊 {t('filters.yearRange')}
                  </ButtonText>
                </SecondaryButton>
              </View>

              {/* Input para año específico */}
              {filters.yearFilterType === 'specific' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 12 }}>{t('filters.year')}:</Text>
                  <SearchInput
                    placeholder="ej. 2023"
                    placeholderTextColor={colors.textSecondary}
                    value={filters.year}
                    onChangeText={(text:string) => {
                      // Solo permitir números y validar año razonable
                      const value = parseInt(text);
                      if (!isNaN(value) && value >= 1900 && value <= currentYear) {
                        setFilters({...filters, year: text});
                      } else if (text === '') {
                        setFilters({...filters, year: ''});
                      }
                    }}
                    keyboardType="numeric"
                    style={{ 
                      flex: 1,
                      fontSize: 14,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      textAlign: 'center'
                    }}
                  />
                  <SecondaryButton 
                    onPress={() => setFilters({...filters, year: ''})}
                    style={{ 
                      backgroundColor: colors.surface,
                      paddingHorizontal: 8,
                      paddingVertical: 6
                    }}
                  >
                    <ButtonText style={{ color: colors.text, fontSize: 10 }}>
                      {t('filters.clear')}
                    </ButtonText>
                  </SecondaryButton>
                </View>
              ) : (
                /* Input boxes para rango de años */
                <View>
                  <Text style={{ 
                    color: colors.text, 
                    fontSize: 12, 
                    marginBottom: 8,
                    textAlign: 'center'
                  }}>
                    📅{filters.yearRange.min} - 📅{filters.yearRange.max}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.textSecondary, fontSize: 11, marginBottom: 4 }}>
                        {t('filters.from')}:
                      </Text>
                      <SearchInput
                        placeholder="1900"
                        placeholderTextColor={colors.textSecondary}
                        value={filters.yearRange.min.toString()}
                        onChangeText={(text:string) => {
                          const value = parseInt(text);
                          if (!isNaN(value) && value >= 1900 && value <= currentYear) {
                            setFilters({
                              ...filters, 
                              yearRange: { 
                                ...filters.yearRange, 
                                min: Math.min(value, filters.yearRange.max)
                              }
                            });
                          }
                        }}
                        keyboardType="numeric"
                        style={{ 
                          fontSize: 14,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          textAlign: 'center'
                        }}
                      />
                    </View>
                    
                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 16 }}>-</Text>
                    
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.textSecondary, fontSize: 11, marginBottom: 4 }}>
                        {t('filters.to')}:
                      </Text>
                      <SearchInput
                        placeholder={currentYear.toString()}
                        placeholderTextColor={colors.textSecondary}
                        value={filters.yearRange.max.toString()}
                        onChangeText={(text:string) => {
                          const value = parseInt(text);
                          if (!isNaN(value) && value >= 1900 && value <= currentYear) {
                            setFilters({
                              ...filters, 
                              yearRange: { 
                                ...filters.yearRange, 
                                max: Math.max(value, filters.yearRange.min)
                              }
                            });
                          }
                        }}
                        keyboardType="numeric"
                        style={{ 
                          fontSize: 14,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          textAlign: 'center'
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </FilterRow>

            {/* Botón para limpiar filtros */}
            <FilterRow>
              <SecondaryButton 
                onPress={() => setFilters({ 
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
                })}
                style={{ 
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  alignSelf: 'center'
                }}
              >
                <ButtonText style={{ color: colors.text, fontSize: 14 }}>
                  🗑️ {t('filters.clear')}
                </ButtonText>
              </SecondaryButton>
            </FilterRow>


            {/* Contador de resultados */}
            <FilterRow>
              <Text style={{ 
                color: colors.textSecondary, 
                fontSize: 12, 
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                {filteredMovies.length} {t('filters.results')} 
                ({t(`filters.${filters.sortBy}`)} {filters.sortOrder === 'asc' ? '⬆️' : '⬇️'})
                {filters.ratingFilterType === 'range' && 
                  ` (⭐${filters.ratingRange.min}-${filters.ratingRange.max})`
                }
                {filters.yearFilterType === 'range' && 
                  ` (📅${filters.yearRange.min}-${filters.yearRange.max})`
                }
              </Text>
            </FilterRow>
          </FilterContainer>
        )}


        {/* Movies List */}
        {showImages ? (
          <FlatList
            key={`grid-mode-${numColumns}`}
            data={filteredMovies}
            renderItem={renderMovieCardWithImage}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 8 }}
            columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
            ListEmptyComponent={<EmptyStateComponent />}
          />
        ) : (
          <FlatList
            key={`list-mode-${numColumns}`}
            data={filteredMovies}
            renderItem={renderMinimalMovieItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 8 }}
            columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
            ListEmptyComponent={<EmptyStateComponent />}
          />
        )}

        {/* Movie Details Modal */}
        <Modal
          visible={showDetailModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeMovieDetails}
        >
          <MovieDetailModal>
            <MovieDetailContent>
              <CloseButton onPress={closeMovieDetails}>
                <Ionicons name="close" size={20} color={colors.text} />
              </CloseButton>

              {detailLoading ? (
                <CenterContainer>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <EmptyText>{t('messages.loading')}</EmptyText>
                </CenterContainer>
              ) : selectedMovie && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <MovieDetailHeader>
                    <MovieDetailPoster 
                      source={{ 
                        uri: selectedMovie.poster ? getImageUrl(selectedMovie.poster) : undefined 
                      }}
                      defaultSource={require('./assets/icon.png')}
                    />
                    <MovieDetailInfo>
                      <MovieDetailTitle numberOfLines={3}>{selectedMovie.title}</MovieDetailTitle>
                      <MovieDetailYear>{selectedMovie.year}</MovieDetailYear>
                      <MovieDetailRating>⭐ {selectedMovie.rating.toFixed(1)}/10</MovieDetailRating>
                      <MovieDetailGenre>
                        {movieDetails?.genres?.map((genre: any) => genre.name).join(', ') || selectedMovie.genre}
                      </MovieDetailGenre>
                      
                      <CheckboxContainer 
                        onPress={() => toggleWatchStatus(selectedMovie.id, selectedMovie.watched)}
                      >
                        <Checkbox checked={selectedMovie.watched}>
                          {selectedMovie.watched && (
                            <Ionicons name="checkmark" size={14} color={colors.surface} />
                          )}
                        </Checkbox>
                        <CheckboxText>
                          {selectedMovie.watched ? t('movie.watched') : t('movie.pending')}
                        </CheckboxText>
                      </CheckboxContainer>
                    </MovieDetailInfo>
                  </MovieDetailHeader>

                  {movieDetails?.overview && (
                    <>
                      <WatchProvidersTitle>{t('movie.overview')}</WatchProvidersTitle>
                      <MovieDetailOverview>{movieDetails.overview}</MovieDetailOverview>
                    </>
                  )}

                  {/* Watch Providers */}
                  <WatchProvidersContainer>
                    <WatchProvidersTitle>{t('movie.whereToWatch')}</WatchProvidersTitle>
                    
                    {watchProviders?.results?.US || watchProviders?.results?.ES ? (
                      <>
                        {/* Streaming */}
                        {(watchProviders.results.US?.flatrate || watchProviders.results.ES?.flatrate) && (
                          <>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                              {t('movie.streamingOn')}
                            </Text>
                            <WatchProvidersList>
                              {(watchProviders.results.US?.flatrate || watchProviders.results.ES?.flatrate || []).map((provider: any) => (
                                <WatchProviderItem key={provider.provider_id}>
                                  <WatchProviderLogo 
                                    source={{ uri: getImageUrl(provider.logo_path) }}
                                  />
                                  <WatchProviderName>{provider.provider_name}</WatchProviderName>
                                </WatchProviderItem>
                              ))}
                            </WatchProvidersList>
                          </>
                        )}

                        {/* Rent */}
                        {(watchProviders.results.US?.rent || watchProviders.results.ES?.rent) && (
                          <>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                              {t('movie.rentOn')}
                            </Text>
                            <WatchProvidersList>
                              {(watchProviders.results.US?.rent || watchProviders.results.ES?.rent || []).map((provider: any) => (
                                <WatchProviderItem key={provider.provider_id}>
                                  <WatchProviderLogo 
                                    source={{ uri: getImageUrl(provider.logo_path) }}
                                  />
                                  <WatchProviderName>{provider.provider_name}</WatchProviderName>
                                </WatchProviderItem>
                              ))}
                            </WatchProvidersList>
                          </>
                        )}
                      </>
                    ) : (
                      <EmptyText>{t('movie.noProviders')}</EmptyText>
                    )}
                  </WatchProvidersContainer>

                  {/* External Search Links */}
                  <ExternalLinksContainer>
                    <ExternalLinksTitle>{t('movie.searchOnline')}</ExternalLinksTitle>
                    
                    <ExternalLinkButton
                      onPress={() => movieDetails && searchMovieOnline(movieDetails.title, 'google')}
                    >
                      <Ionicons name="search" size={16} color={colors.surface} />
                      <ExternalLinkText>{t('movie.searchGoogle')}</ExternalLinkText>
                    </ExternalLinkButton>
                    
                    <ExternalLinkButton
                      onPress={() => movieDetails && searchMovieOnline(movieDetails.title, 'yesmovies')}
                      style={{ backgroundColor: colors.secondary }}
                    >
                      <Ionicons name="play" size={16} color={colors.surface} />
                      <ExternalLinkText>{t('movie.searchYesMovies')}</ExternalLinkText>
                    </ExternalLinkButton>
                  </ExternalLinksContainer>
                </ScrollView>
              )}
            </MovieDetailContent>
          </MovieDetailModal>
        </Modal>

        {/* Add Movie Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <ModalContainer>
            <ModalContent>
              <TopBarRow>
                <TopBarTitle>{t('buttons.searchMovies')}</TopBarTitle>
                <IconButton onPress={() => setShowAddModal(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </IconButton>
              </TopBarRow>
              
              <SearchContainer>
                <Ionicons name="search" size={20} color={colors.textSecondary} />
                <SearchInput
                  placeholder={t('messages.searchMoviePlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  value={addSearchQuery}
                  onChangeText={setAddSearchQuery}
                  onSubmitEditing={searchMoviesFromAPI}
                />
                <IconButton onPress={searchMoviesFromAPI}>
                  <Ionicons name="search" size={20} color={colors.primary} />
                </IconButton>
              </SearchContainer>

              {searchLoading ? (
                <CenterContainer>
                  <ActivityIndicator size="large" color={colors.primary} />
                </CenterContainer>
              ) : (
                <FlatList
                  key="search-results"
                  data={searchResults}
                  renderItem={renderSearchResult}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 8 }}
                  columnWrapperStyle={{ justifyContent: 'space-around' }}
                  ListEmptyComponent={
                    addSearchQuery ? (
                      <CenterContainer>
                        <EmptyText>{t('messages.noResults')}</EmptyText>
                      </CenterContainer>
                    ) : (
                      <CenterContainer>
                        <EmptyText>{t('messages.addMovieText')}</EmptyText>
                      </CenterContainer>
                    )
                  }
                />
              )}
            </ModalContent>
          </ModalContainer>
        </Modal>

        <StatusBar style="dark" />
      </Container>
    </SafeContainer>
  );
}