import React from 'react';
import { Animated, Platform } from 'react-native';
import UniversalIcon from './UniversalIcon';
import {
  MovieCard as StyledMovieCard,
  MoviePoster,
  MovieInfo,
  MovieTitle,
  MovieDetails,
  CheckboxContainer,
  Checkbox,
  colors
} from './styled/CommonStyles';
import { getImageUrl } from '../services/tmdbApi';
import { Movie } from '../types';
import useHoverAnimation from '../hooks/useHoverAnimation';

interface MovieCardProps {
  item: Movie;
  showImage: boolean;
  onPress: (movie: Movie) => void;
  onToggleWatch: (movieId: string, currentStatus: boolean) => void;
  cardSpacing?: number;
}

export const MovieCardWithImage: React.FC<MovieCardProps> = ({ 
  item, 
  onPress, 
  onToggleWatch,
  cardSpacing = 4
}) => {
  const [hoverStyle, triggerHoverIn, triggerHoverOut] = useHoverAnimation({ 
    scale: 1.1, 
    timing: 200,
    tension: 300,
    friction: 10 
  });

  // Solo aplicar hover en web
  const isWeb = Platform.OS === 'web';

  return (
    <Animated.View style={[{ margin: cardSpacing }, isWeb ? hoverStyle : {}]}>
      <StyledMovieCard 
        showImage={true} 
        onPress={() => onPress(item)}
        {...(isWeb && {
          onMouseEnter: triggerHoverIn,
          onMouseLeave: triggerHoverOut
        })}
      >
        {item.poster && (
          <MoviePoster 
            source={{ uri: getImageUrl(item.poster) }}
            defaultSource={require('../../assets/default.png')}
          />
        )}
        
        <MovieInfo>
          <MovieTitle numberOfLines={2}>{item.title}</MovieTitle>
          <MovieDetails>{item.year}</MovieDetails>
          
          <CheckboxContainer 
            onPress={(e: any) => {
              e.stopPropagation();
              onToggleWatch(item.id, item.watched);
            }}
          >
            <Checkbox checked={item.watched}>
              {item.watched && (
                <UniversalIcon name="checkmark" size={14} color={colors.surface} />
              )}
            </Checkbox>
          </CheckboxContainer>
        </MovieInfo>
      </StyledMovieCard>
    </Animated.View>
  );
};
