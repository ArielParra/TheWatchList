import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  MinimalMovieItem as StyledMinimalMovieItem,
  MinimalCheckbox,
  MinimalMovieTitle,
  colors
} from './styled/CommonStyles';
import { Movie } from '../types';

interface MinimalMovieItemProps {
  item: Movie;
  onPress: (movie: Movie) => void;
  onToggleWatch: (movieId: string, currentStatus: boolean) => void;
  cardSpacing?: number;
}

export const MinimalMovieItem: React.FC<MinimalMovieItemProps> = ({ 
  item, 
  onPress, 
  onToggleWatch,
  cardSpacing = 4
}) => (
  <StyledMinimalMovieItem 
    onPress={() => onPress(item)}
    style={{ margin: cardSpacing }}
  >
    <MinimalCheckbox 
      checked={item.watched}
      onPress={(e: any) => {
        e.stopPropagation();
        onToggleWatch(item.id, item.watched);
      }}
    >
      {item.watched && (
        <Ionicons name="checkmark" size={12} color={colors.surface} />
      )}
    </MinimalCheckbox>
    
    <MinimalMovieTitle numberOfLines={2}>{item.title}</MinimalMovieTitle>
  </StyledMinimalMovieItem>
);
