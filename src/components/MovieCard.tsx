import React from 'react';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

  return (
    <Animated.View style={[{ margin: cardSpacing }, hoverStyle]}>
      <StyledMovieCard 
        showImage={true} 
        onPress={() => onPress(item)}
        onMouseEnter={triggerHoverIn}
        onMouseLeave={triggerHoverOut}
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
                <Ionicons name="checkmark" size={14} color={colors.surface} />
              )}
            </Checkbox>
          </CheckboxContainer>
        </MovieInfo>
      </StyledMovieCard>
    </Animated.View>
  );
};
