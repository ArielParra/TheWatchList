import React from 'react';
import { Modal, ScrollView, Linking, Alert, TouchableOpacity, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  MovieDetailModal as MovieDetailModalContainer,
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
  CenterContainer,
  EmptyText,
  colors
} from './styled/CommonStyles';
import { Movie, TMDBMovie, WatchProvidersResponse } from '../types';
import { getImageUrl, isProviderAllowed, getProviderUrl } from '../services/tmdbApi';
import { ActivityIndicator } from 'react-native';

interface MovieDetailModalProps {
  visible: boolean;
  selectedMovie: Movie | null;
  movieDetails: TMDBMovie | null;
  watchProviders: WatchProvidersResponse | null;
  loading: boolean;
  onClose: () => void;
  onToggleWatch: (movieId: string, currentStatus: boolean) => void;
}

export const MovieDetailModalComponent: React.FC<MovieDetailModalProps> = ({
  visible,
  selectedMovie,
  movieDetails,
  watchProviders,
  loading,
  onClose,
  onToggleWatch
}) => {
  const { t } = useTranslation();

  const watchProvidersCountry = process.env.EXPO_PUBLIC_WATCH_PROVIDERS_COUNTRY || 'US';

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

  // ✅ Función para manejar click en proveedor usando URLs específicas
  const handleProviderClick = async (providerName: string) => {
    if (!selectedMovie) {
      Alert.alert('Error', 'No movie selected');
      return;
    }
    
    try {
      const url = getProviderUrl(providerName, selectedMovie.title);
      console.log(`Opening ${providerName} for "${selectedMovie.title}": ${url}`);
      
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      console.error('Error opening provider link:', error);
      Alert.alert('Error', `Failed to open ${providerName}`);
    }
  };

  // ✅ Función para filtrar y obtener solo los proveedores permitidos
  const getFilteredProviders = (providers: any[]) => {
    return providers.filter(provider => isProviderAllowed(provider.provider_name));
  };

  const searchMovieOnline = (movieTitle: string, releaseDate: string, platform: string) => {
    const year = new Date(releaseDate).getFullYear();
    const query = encodeURIComponent(`${movieTitle} ${year}`);
    let url = '';
    
    switch (platform) {
      case 'google':
        url = `https://www.google.com/search?q=${query}`;
        break;
      case 'other':
        url = `https://${process.env.EXPO_PUBLIC_OTHER_URL}/search/v2?s=${query}`;
        break;
      default:
        url = `https://www.google.com/search?q=${query}`;
    }
    
    openExternalLink(url);
  };

  if (!selectedMovie) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <MovieDetailModalContainer>
        <MovieDetailContent>
      <TouchableOpacity 
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 999,
              backgroundColor: colors.surface,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color={colors.text} />
          </TouchableOpacity>

          {loading ? (
            <CenterContainer>
              <ActivityIndicator size="large" color={colors.primary} />
              <EmptyText>{t('messages.loading')}</EmptyText>
            </CenterContainer>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header con poster y info básica */}
              <MovieDetailHeader>
                {selectedMovie.poster && (
                  <MovieDetailPoster 
                    source={{ uri: getImageUrl(selectedMovie.poster) }}
                    defaultSource={require('../../assets/icon.png')}
                  />
                )}
                
                <MovieDetailInfo>
                  <MovieDetailTitle numberOfLines={3}>
                    {selectedMovie.title}
                  </MovieDetailTitle>
                  <MovieDetailYear>{selectedMovie.year}</MovieDetailYear>
                  <MovieDetailRating>⭐ {selectedMovie.rating.toFixed(1)}</MovieDetailRating>
                  <MovieDetailGenre>{selectedMovie.genre}</MovieDetailGenre>
                  
                  {/* Indicador de estado (solo visual) */}
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    marginTop: 12,
                    backgroundColor: selectedMovie.watched ? colors.success : colors.warning,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    alignSelf: 'flex-start'
                  }}>
                    <Ionicons 
                      name={selectedMovie.watched ? "checkmark-circle" : "time"} 
                      size={16} 
                      color={colors.surface} 
                    />
                    <Text style={{
                      color: colors.surface,
                      fontSize: 12,
                      fontWeight: '600',
                      marginLeft: 6
                    }}>
                      {selectedMovie.watched ? t('movie.watched') : t('movie.pending')}
                    </Text>
                  </View>
                </MovieDetailInfo>
              </MovieDetailHeader>

              {/* Sinopsis */}
              {movieDetails?.overview && (
                <MovieDetailOverview>
                  {movieDetails.overview}
                </MovieDetailOverview>
              )}

              {/* Contenedor horizontal para proveedores y enlaces */}
              <View style={{ 
                flexDirection: 'row', 
                gap: 16, 
                marginBottom: 16,
                flexWrap: 'wrap' 
              }}>
                {/* ✅ Proveedores de streaming filtrados */}
                {watchProviders?.results?.[watchProvidersCountry] && (
                  <View style={{ flex: 3, minWidth: 250 }}>
                    <WatchProvidersContainer>
                      <WatchProvidersTitle>
                        📺 {t('movieDetails.whereToWatch')}
                      </WatchProvidersTitle>
                      
                      {(() => {
                        const countryProviders = watchProviders.results[watchProvidersCountry];
                        
                        // Obtener proveedores filtrados de todas las categorías
                        const flatrateBase = countryProviders.flatrate ? getFilteredProviders(countryProviders.flatrate) : [];
                        const adsFiltered = countryProviders.ads ? getFilteredProviders(countryProviders.ads) : [];
                        const flatrateFiltered = [...flatrateBase, ...adsFiltered];
                        const hasAnyProviders = flatrateFiltered.length > 0;
                        
                        if (!hasAnyProviders) {
                          return (
                            <EmptyText style={{ fontSize: 14, marginTop: 8, textAlign: 'center' }}>
                              {t('movieDetails.noProviders')}
                            </EmptyText>
                          );
                        }
                        
                        return (
                          <>
                            {/* Suscripción (Streaming) */}
                            {flatrateFiltered.length > 0 && (
                              <>
                                <WatchProvidersTitle style={{ fontSize: 14, marginBottom: 8, color: colors.textSecondary }}>
                                </WatchProvidersTitle>
                                <WatchProvidersList>
                                  {flatrateFiltered
                                    .sort((a, b) => (a.display_priority || 99) - (b.display_priority || 99))
                                    .map((provider) => (
                                    <TouchableOpacity
                                      key={provider.provider_id}
                                      onPress={() => handleProviderClick(provider.provider_name)}
                                      activeOpacity={0.7}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 8,
                                        marginVertical: 4,
                                        backgroundColor: colors.surface,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: colors.border,
                                      }}
                                    >
                                      <WatchProviderLogo 
                                        source={{ uri: getImageUrl(provider.logo_path) }}
                                      />
                                      <WatchProviderName>{provider.provider_name}</WatchProviderName>
                                    </TouchableOpacity>
                                  ))}
                                </WatchProvidersList>
                              </>
                            )}
                            {/* ads */}

                            
                          </>
                        );
                      })()}
                    </WatchProvidersContainer>
                  </View>
                )}

                {/* Enlaces externos para buscar la película */}
                <View style={{ flex: 1, minWidth: 200 }}>
                  <ExternalLinksContainer>
                    <ExternalLinksTitle>
                      🔍 {t('movieDetails.searchOnline')}
                    </ExternalLinksTitle>
                    
                    <ExternalLinkButton 
                      onPress={() => searchMovieOnline(
                        selectedMovie.title, 
                        movieDetails?.release_date || `${selectedMovie.year}-01-01`, 
                        'google'
                      )}
                    >
                      <Ionicons name="search" size={16} color={colors.surface} />
                      <ExternalLinkText>{t('movieDetails.searchGoogle')}</ExternalLinkText>
                    </ExternalLinkButton>

                    <ExternalLinkButton 
                      onPress={() => searchMovieOnline(
                        selectedMovie.title, 
                        movieDetails?.release_date || `${selectedMovie.year}-01-01`, 
                        'other'
                      )}
                      style={{ backgroundColor: colors.secondary }}
                    >
                      <Ionicons name="play" size={16} color={colors.surface} />
                      <ExternalLinkText>{t('movieDetails.searchOther')}</ExternalLinkText>
                    </ExternalLinkButton>
                  </ExternalLinksContainer>
                </View>
              </View>
            </ScrollView>
          )}
        </MovieDetailContent>
      </MovieDetailModalContainer>
    </Modal>
  );
};
