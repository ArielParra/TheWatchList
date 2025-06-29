import React from 'react';
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

interface MovieCardProps {
  item: Movie;
  showImage: boolean;
  onPress: (movie: Movie) => void;
  onToggleWatch: (movieId: string, currentStatus: boolean) => void;
}

export const MovieCardWithImage: React.FC<MovieCardProps> = ({ 
  item, 
  onPress, 
  onToggleWatch 
}) => (
  <StyledMovieCard showImage={true} onPress={() => onPress(item)}>
    {item.poster && (
      <MoviePoster 
        source={{ uri: getImageUrl(item.poster) }}
        defaultSource={require('../../assets/icon.png')}
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
);
