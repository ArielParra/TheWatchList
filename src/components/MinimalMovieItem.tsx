import React from 'react';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  MinimalMovieItem as StyledMinimalMovieItem,
  MinimalCheckbox,
  MinimalMovieTitle,
  colors
} from './styled/CommonStyles';
import { Movie } from '../types';
import useHoverAnimation from '../hooks/useHoverAnimation';

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
}) => {
  const [hoverStyle, triggerHoverIn, triggerHoverOut] = useHoverAnimation({ 
    scale: 1.2, 
    timing: 200,
    tension: 300,
    friction: 10 
  });

  return (
    <Animated.View style={[{ margin: cardSpacing }, hoverStyle]}>
      <StyledMinimalMovieItem 
        onPress={() => onPress(item)}
        onMouseEnter={triggerHoverIn}
        onMouseLeave={triggerHoverOut}
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
    </Animated.View>
  );
};
