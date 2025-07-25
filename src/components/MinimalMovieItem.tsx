import React from 'react';
import { Animated, Platform } from 'react-native';
import UniversalIcon from './UniversalIcon';
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

  // Solo aplicar hover en web
  const isWeb = Platform.OS === 'web';

  return (
    <Animated.View style={[{ margin: cardSpacing }, isWeb ? hoverStyle : {}]}>
      <StyledMinimalMovieItem 
        onPress={() => onPress(item)}
        {...(isWeb && {
          onMouseEnter: triggerHoverIn,
          onMouseLeave: triggerHoverOut
        })}
      >
        <MinimalCheckbox 
          checked={item.watched}
          onPress={(e: any) => {
            e.stopPropagation();
            onToggleWatch(item.id, item.watched);
          }}
        >
          {item.watched && (
            <UniversalIcon name="checkmark" size={12} color={colors.surface} />
          )}
        </MinimalCheckbox>
        
        <MinimalMovieTitle numberOfLines={2}>{item.title}</MinimalMovieTitle>
      </StyledMinimalMovieItem>
    </Animated.View>
  );
};
