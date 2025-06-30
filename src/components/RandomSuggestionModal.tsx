import React from 'react';
import { Modal, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import UniversalIcon from './UniversalIcon';
import {
  ModalContainer,
  ModalContent,
  Title,
  PrimaryButton,
  SecondaryButton,
  ButtonText,
  CloseButton,
  MoviePoster,
  MovieTitle,
  MovieDetails,
  colors
} from './styled/CommonStyles';
import { ModalOverlay } from './ModalOverlay';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdbApi';

interface RandomSuggestionModalProps {
  visible: boolean;
  onClose: () => void;
  suggestedMovie: Movie | null;
  onWatchNow: () => void;
  onAnotherSuggestion: () => void;
  showNoMoviesError: boolean; // ✅ Nueva prop para controlar el estado de error
}

export const RandomSuggestionModal: React.FC<RandomSuggestionModalProps> = ({
  visible,
  onClose,
  suggestedMovie,
  onWatchNow,
  onAnotherSuggestion,
  showNoMoviesError
}) => {
  const { t } = useTranslation();

  // ✅ Modal de error cuando no hay películas sin ver disponibles
  if (showNoMoviesError || (!suggestedMovie && visible)) {
    return (
      <Modal 
        visible={visible} 
        transparent 
        animationType="fade" 
        onRequestClose={onClose}
        statusBarTranslucent={true}
      >
        <ModalOverlay style={{ padding: 16 }}>
          <ModalContent>
            <CloseButton onPress={onClose}>
              <UniversalIcon name="close" size={20} color={colors.text} />
            </CloseButton>
            
            <Title style={{ textAlign: 'center', marginTop: 20 }}>
              {t('randomSuggestion.title')}
            </Title>
            
            <MovieDetails style={{ 
              textAlign: 'center', 
              marginVertical: 20,
              fontSize: 16 
            }}>
              {t('randomSuggestion.noUnwatchedMovies')}
            </MovieDetails>
            
            <PrimaryButton onPress={onClose} style={{ marginTop: 20 }}>
              <ButtonText>OK</ButtonText>
            </PrimaryButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    );
  }

  // ✅ Verificación de seguridad para suggestedMovie
  if (!suggestedMovie) {
    return null;
  }

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <ModalOverlay style={{ padding: 16 }}>
        <ModalContent>
          <CloseButton onPress={onClose}>
            <UniversalIcon name="close" size={20} color={colors.text} />
          </CloseButton>
          
          <Title style={{ textAlign: 'center', marginTop: 20 }}>
            {t('randomSuggestion.title')}
          </Title>
          
          <MovieDetails style={{ 
            textAlign: 'center', 
            marginVertical: 16,
            fontSize: 16 
          }}>
            {t('randomSuggestion.suggestion')}
          </MovieDetails>

          {/* Movie Poster and Info */}
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            {suggestedMovie.poster && (
              <MoviePoster
                source={{ uri: getImageUrl(suggestedMovie.poster) }}
                style={{ marginBottom: 16 }}
                defaultSource={require('../../assets/default.png')}
              />
            )}
            
            <MovieTitle style={{ 
              fontSize: 18, 
              textAlign: 'center',
              marginBottom: 8 
            }}>
              {suggestedMovie.title}
            </MovieTitle>
            
            {suggestedMovie.year && (
              <MovieDetails style={{ textAlign: 'center' }}>
                {suggestedMovie.year}
              </MovieDetails>
            )}
            
            {suggestedMovie.rating > 1 && (
              <MovieDetails style={{ 
                textAlign: 'center',
                color: colors.primary,
                fontWeight: '600'
              }}>
                ⭐ {suggestedMovie.rating.toFixed(1)}/10
              </MovieDetails>
            )}
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <View style={{ flex: 1 }}>
              <PrimaryButton onPress={onWatchNow}>
                <ButtonText>{t('randomSuggestion.watchNow')}</ButtonText>
              </PrimaryButton>
            </View>
            
            <View style={{ flex: 1 }}>
              <SecondaryButton onPress={onAnotherSuggestion}>
                <ButtonText secondary>{t('randomSuggestion.anotherSuggestion')}</ButtonText>
              </SecondaryButton>
            </View>
          </View>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
