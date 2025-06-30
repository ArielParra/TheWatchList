import React from 'react';
import { Modal, ScrollView, Linking, Alert, TouchableOpacity, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../hooks/useResponsive';
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
import { ModalOverlay } from './ModalOverlay';
import { Movie, TMDBMovie, WatchProvidersResponse } from '../types';
import { getImageUrl, isProviderAllowed, getProviderUrl, getTranslatedGenre } from '../services/tmdbApi';
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
  const { isMobile } = useResponsive();

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
      statusBarTranslucent={true}
    >
      <ModalOverlay style={{ padding: isMobile ? 20 : 40 }}>
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
              {/* Header con poster y info básica - Responsive */}
              <View style={{
                flexDirection: isMobile ? 'column' : 'row',
                marginBottom: 20,
                alignItems: isMobile ? 'stretch' : 'flex-start',
                gap: isMobile ? 16 : 20,
              }}>
                {selectedMovie.poster && (
                  <View style={{
                    alignItems: isMobile ? 'center' : 'flex-start',
                    marginBottom: isMobile ? 12 : 0,
                  }}>
                    <MovieDetailPoster 
                      source={{ uri: getImageUrl(selectedMovie.poster) }}
                      defaultSource={require('../../assets/default.png')}
                      style={{
                        width: isMobile ? 120 : 140,
                        height: isMobile ? 180 : 210,
                        borderRadius: 12,
                      }}
                    />
                  </View>
                )}
                
                <View style={{
                  flex: 1,
                  alignItems: isMobile ? 'center' : 'flex-start',
                  paddingHorizontal: isMobile ? 8 : 0,
                }}>
                  <Text style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: '700',
                    color: colors.text,
                    marginBottom: 8,
                    textAlign: isMobile ? 'center' : 'left',
                    lineHeight: isMobile ? 24 : 28,
                  }} numberOfLines={3}>
                    {selectedMovie.title}
                  </Text>
                  
                  <Text style={{
                    fontSize: isMobile ? 16 : 18,
                    color: colors.textSecondary,
                    marginBottom: 6,
                    textAlign: isMobile ? 'center' : 'left',
                  }}>
                    {selectedMovie.year}
                  </Text>
                  
                  <Text style={{
                    fontSize: isMobile ? 16 : 18,
                    color: colors.primary,
                    fontWeight: '600',
                    marginBottom: 8,
                    textAlign: isMobile ? 'center' : 'left',
                  }}>
                    ⭐ {selectedMovie.rating.toFixed(1)}
                  </Text>
                  
                  <Text style={{
                    fontSize: isMobile ? 14 : 16,
                    color: colors.textSecondary,
                    marginBottom: 16,
                    textAlign: isMobile ? 'center' : 'left',
                  }}>
                    {getTranslatedGenre(selectedMovie.genre, t)}
                  </Text>
                  
                  {/* Indicador de estado */}
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    backgroundColor: selectedMovie.watched ? colors.success : colors.warning,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    alignSelf: isMobile ? 'center' : 'flex-start'
                  }}>
                    <Ionicons 
                      name={selectedMovie.watched ? "checkmark-circle" : "time"} 
                      size={18} 
                      color={colors.surface} 
                    />
                    <Text style={{
                      color: colors.surface,
                      fontSize: 14,
                      fontWeight: '600',
                      marginLeft: 8
                    }}>
                      {selectedMovie.watched ? t('movie.watched') : t('movie.pending')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Sinopsis */}
              {movieDetails?.overview && (
                <View style={{
                  marginBottom: 20,
                  paddingHorizontal: isMobile ? 8 : 0,
                }}>
                  <Text style={{
                    fontSize: isMobile ? 14 : 15,
                    color: colors.text,
                    lineHeight: isMobile ? 20 : 22,
                    textAlign: 'justify',
                  }}>
                    {movieDetails.overview}
                  </Text>
                </View>
              )}

              {/* Contenedor responsive para proveedores y enlaces */}
              <View style={{ 
                flexDirection: isMobile ? 'column' : 'row', 
                gap: isMobile ? 16 : 20, 
                marginBottom: 20,
                paddingHorizontal: isMobile ? 8 : 0,
              }}>
                {/* ✅ Proveedores de streaming filtrados */}
                {watchProviders?.results?.[watchProvidersCountry] && (
                  <View style={{ flex: isMobile ? undefined : 3, minWidth: isMobile ? undefined : 250 }}>
                    <View style={{ marginBottom: 16 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: 12,
                        textAlign: isMobile ? 'center' : 'left',
                      }}>
                        📺 {t('movieDetails.whereToWatch')}
                      </Text>
                      
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
                    </View>
                  </View>
                )}

                {/* Enlaces externos para buscar la película */}
                <View style={{ flex: isMobile ? undefined : 1, minWidth: isMobile ? undefined : 200 }}>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.text,
                      marginBottom: 12,
                      textAlign: isMobile ? 'center' : 'left',
                    }}>
                      🔍 {t('movieDetails.searchOnline')}
                    </Text>
                    
                    <TouchableOpacity 
                      onPress={() => searchMovieOnline(
                        selectedMovie.title, 
                        movieDetails?.release_date || `${selectedMovie.year}-01-01`, 
                        'google'
                      )}
                      style={{
                        backgroundColor: colors.primary,
                        padding: 12,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="search" size={16} color={colors.surface} />
                      <Text style={{
                        color: colors.surface,
                        fontSize: 14,
                        fontWeight: '600',
                        marginLeft: 8,
                      }}>
                        {t('movieDetails.searchGoogle')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => searchMovieOnline(
                        selectedMovie.title, 
                        movieDetails?.release_date || `${selectedMovie.year}-01-01`, 
                        'other'
                      )}
                      style={{
                        backgroundColor: colors.secondary,
                        padding: 12,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="play" size={16} color={colors.surface} />
                      <Text style={{
                        color: colors.surface,
                        fontSize: 14,
                        fontWeight: '600',
                        marginLeft: 8,
                      }}>
                        {t('movieDetails.searchOther')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </MovieDetailContent>
      </ModalOverlay>
    </Modal>
  );
};
