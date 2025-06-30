import React from 'react';
import { Modal, FlatList, ActivityIndicator, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  ModalContainer,
  ModalContent,
  TopBarRow,
  TopBarTitle,
  IconButton,
  CenterContainer,
  EmptyText,
  MovieCard,
  MoviePoster,
  MovieInfo,
  MovieTitle,
  MovieDetails,
  colors
} from './styled/CommonStyles';
import { ModalOverlay } from './ModalOverlay';
import { TMDBMovie } from '../types';
import { getImageUrl } from '../services/tmdbApi';

interface AddMovieModalProps {
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearch: () => void;
  searchResults: TMDBMovie[];
  loading: boolean;
  onAddMovie: (movie: TMDBMovie) => void;
}

export const AddMovieModal: React.FC<AddMovieModalProps> = ({
  visible,
  onClose,
  searchQuery,
  onSearchChange,
  onSearch,
  searchResults,
  loading,
  onAddMovie
}) => {
  const { t } = useTranslation();

  const handleSubmitSearch = () => {
    if (searchQuery.trim()) {
      onSearch();
    }
  };

  const renderSearchResult = ({ item }: { item: TMDBMovie }) => (
    <View style={{ 
      flex: 1, 
      margin: 4,
      maxWidth: '31%' // Para 3 columnas con espacio para márgenes
    }}>
      <MovieCard 
        showImage={true} 
        style={{ 
          height: 220, // Altura reducida para 3 columnas
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        {item.poster_path && (
          <MoviePoster 
            source={{ uri: getImageUrl(item.poster_path) }}
            defaultSource={require('../../assets/default.png')}
            style={{ 
              height: 100, // Poster más pequeño para 3 columnas
              width: '100%',
              borderRadius: 6,
              marginBottom: 6
            }}
          />
        )}
        
        <MovieInfo style={{ flex: 1, justifyContent: 'space-between', padding: 4 }}>
          <View>
            <MovieTitle numberOfLines={2} style={{ fontSize: 12, marginBottom: 2, lineHeight: 14 }}>
              {item.title}
            </MovieTitle>
            <MovieDetails style={{ fontSize: 10 }}>
              {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
            </MovieDetails>
            <MovieDetails style={{ fontSize: 10 }}>
              ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
            </MovieDetails>
          </View>
          
          <IconButton 
            onPress={() => onAddMovie(item)}
            style={{ 
              alignSelf: 'center', 
              marginTop: 2,
              backgroundColor: colors.primary + '20',
              borderRadius: 16,
              padding: 2
            }}
          >
            <Ionicons name="add" size={14} color={colors.primary} />
          </IconButton>
        </MovieInfo>
      </MovieCard>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <ModalOverlay style={{ padding: 16 }}>
        <ModalContent style={{ maxHeight: '90%' }}>
          <TopBarRow style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%',
            marginBottom: 16
          }}>
            <TopBarTitle style={{ flex: 1 }}>{t('buttons.searchMovies')}</TopBarTitle>
            <IconButton onPress={onClose} style={{
              marginLeft: 'auto',
              backgroundColor: 'transparent',
              borderWidth: 0
            }}>
              <Ionicons name="close" size={24} color={colors.text} />
            </IconButton>
          </TopBarRow>
          
          <View style={{ 
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.border,
            height: 48 // Altura fija para evitar cambios
          }}>
            <TextInput
              placeholder={t('messages.searchMoviePlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={onSearchChange}
              onSubmitEditing={handleSubmitSearch}
              returnKeyType="search"
              autoFocus={false}
              style={{
                flex: 1,
                fontSize: 16,
                color: colors.text,
                marginLeft: 8,
                marginRight: 8,
                height: 24, // Altura fija del input
                paddingVertical: 0, // Sin padding vertical
                paddingHorizontal: 0 // Sin padding horizontal
              }}
            />
            <IconButton onPress={handleSubmitSearch} style={{
              backgroundColor: 'transparent',
              borderWidth: 0,
              padding: 8,
              minWidth: 32,
              minHeight: 32
            }}>
              <Ionicons name="search" size={20} color={colors.primary} />
            </IconButton>
          </View>

          {loading ? (
            <CenterContainer>
              <ActivityIndicator size="large" color={colors.primary} />
            </CenterContainer>
          ) : (
            <FlatList
              key="search-results"
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                padding: 8,
                paddingBottom: 20,
                flexGrow: 1
              }}
              style={{ flex: 1 }}
              columnWrapperStyle={{ 
                justifyContent: 'space-around',
                paddingHorizontal: 2
              }}
              ListEmptyComponent={
                searchQuery ? (
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
      </ModalOverlay>
    </Modal>
  );
};
