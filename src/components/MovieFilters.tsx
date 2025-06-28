import React, { useEffect, useRef } from 'react';
import { Text, View, ScrollView, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  FilterContainer,
  SecondaryButton,
  ButtonText,
  SearchInput,
  colors,
  isMobile
} from './styled/CommonStyles';
import { MovieFilters } from '../types';
import { genres } from '../services/tmdbApi';

interface MovieFiltersComponentProps {
  filters: MovieFilters;
  setFilters: (filters: MovieFilters) => void;
  filteredMoviesCount: number;
  currentYear: number;
  showFilters: boolean;
}

export const MovieFiltersComponent: React.FC<MovieFiltersComponentProps> = ({
  filters,
  setFilters,
  filteredMoviesCount,
  currentYear,
  showFilters
}) => {
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showFilters) {
      // Animación de entrada
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Animación de salida
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [showFilters, slideAnim, opacityAnim]);

  if (!showFilters) return null;

  const getActiveFiltersText = () => {
    const activeFilters = [];
    if (filters.watched !== null) activeFilters.push(filters.watched ? 'Vistas' : 'Pendientes');
    if (filters.rating > 1) activeFilters.push(`≥${filters.rating}⭐`);
    if (filters.year) activeFilters.push(`${filters.year}`);
    if (filters.genre) activeFilters.push(filters.genre);
    return activeFilters.length > 0 ? activeFilters.join(' • ') : 'Sin filtros';
  };

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          },
        ],
        opacity: opacityAnim,
      }}
    >
      <FilterContainer style={{ paddingVertical: 8 }}>
      {/* Header compacto con resultados */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 8 
      }}>
        <Text style={{ 
          color: colors.text, 
          fontSize: isMobile ? 14 : 16, 
          fontWeight: '600' 
        }}>
          {filteredMoviesCount} película{filteredMoviesCount !== 1 ? 's' : ''}
        </Text>
        <Text style={{ 
          color: colors.textSecondary, 
          fontSize: isMobile ? 10 : 12,
          maxWidth: '60%' 
        }} numberOfLines={1}>
          {getActiveFiltersText()}
        </Text>
      </View>

      {/* Fila 1: Estado, Orden, Rating */}
      <View style={{ 
        flexDirection: 'row', 
        gap: 6, 
        marginBottom: 6,
        alignItems: 'center'
      }}>
        {/* Estado */}
        <View style={{ flexDirection: 'row', gap: 3 }}>
          <SecondaryButton 
            onPress={() => setFilters({...filters, watched: null})}
            style={{ 
              backgroundColor: filters.watched === null ? colors.primary : colors.surface,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12
            }}
          >
            <ButtonText style={{ 
              color: filters.watched === null ? colors.surface : colors.text,
              fontSize: 10
            }}>
              Todas
            </ButtonText>
          </SecondaryButton>
          
          <SecondaryButton 
            onPress={() => setFilters({...filters, watched: true})}
            style={{ 
              backgroundColor: filters.watched === true ? colors.success : colors.surface,
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 12
            }}
          >
            <ButtonText style={{ 
              color: filters.watched === true ? colors.surface : colors.text,
              fontSize: 10
            }}>
              ✓
            </ButtonText>
          </SecondaryButton>
          
          <SecondaryButton 
            onPress={() => setFilters({...filters, watched: false})}
            style={{ 
              backgroundColor: filters.watched === false ? colors.warning : colors.surface,
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 12
            }}
          >
            <ButtonText style={{ 
              color: filters.watched === false ? colors.surface : colors.text,
              fontSize: 10
            }}>
              ⏳
            </ButtonText>
          </SecondaryButton>
        </View>

        {/* Separador */}
        <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />

        {/* Ordenamiento */}
        <View style={{ flexDirection: 'row', gap: 3 }}>
          <SecondaryButton 
            onPress={() => setFilters({...filters, sortBy: 'orderNumber'})}
            style={{ 
              backgroundColor: filters.sortBy === 'orderNumber' ? colors.primary : colors.surface,
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 12
            }}
          >
            <ButtonText style={{ 
              color: filters.sortBy === 'orderNumber' ? colors.surface : colors.text,
              fontSize: 10
            }}>
              📝
            </ButtonText>
          </SecondaryButton>
          
          <SecondaryButton 
            onPress={() => setFilters({...filters, sortBy: 'alphabetical'})}
            style={{ 
              backgroundColor: filters.sortBy === 'alphabetical' ? colors.primary : colors.surface,
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 12
            }}
          >
            <ButtonText style={{ 
              color: filters.sortBy === 'alphabetical' ? colors.surface : colors.text,
              fontSize: 10
            }}>
              🔤
            </ButtonText>
          </SecondaryButton>
          
          <SecondaryButton 
            onPress={() => setFilters({...filters, sortBy: 'year'})}
            style={{ 
              backgroundColor: filters.sortBy === 'year' ? colors.primary : colors.surface,
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 12
            }}
          >
            <ButtonText style={{ 
              color: filters.sortBy === 'year' ? colors.surface : colors.text,
              fontSize: 10
            }}>
              📅
            </ButtonText>
          </SecondaryButton>
          
          <SecondaryButton 
            onPress={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
            style={{ 
              backgroundColor: colors.accent,
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 12
            }}
          >
            <ButtonText style={{ 
              color: colors.surface,
              fontSize: 10
            }}>
              {filters.sortOrder === 'asc' ? '⬆️' : '⬇️'}
            </ButtonText>
          </SecondaryButton>
        </View>

        {/* Separador */}
        <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />

        {/* Rating y Año compactos lado a lado */}
        <View style={{ flexDirection: 'row', gap: 4, flex: 1 }}>
          <SearchInput
            placeholder="⭐ 1-10"
            placeholderTextColor={colors.textSecondary}
            value={filters.rating > 1 ? filters.rating.toString() : ''}
            onChangeText={(text: string) => {
              if (text === '') {
                setFilters({...filters, rating: 1});
              } else {
                if (/^\d*\.?\d*$/.test(text)) {
                  const value = parseFloat(text);
                  if (!isNaN(value) && value >= 1 && value <= 10) {
                    setFilters({...filters, rating: value});
                  }
                }
              }
            }}
            keyboardType="decimal-pad"
            style={{ 
              flex: 1,
              fontSize: 10,
              textAlign: 'center',
              minHeight: 24,
              marginLeft: 0
            }}
          />
          
          <SearchInput
            placeholder="📅 año"
            placeholderTextColor={colors.textSecondary}
            value={filters.year}
            onChangeText={(text: string) => {
              if (text === '') {
                setFilters({...filters, year: ''});
              } else {
                if (/^\d+$/.test(text) && text.length <= 4) {
                  setFilters({...filters, year: text});
                }
              }
            }}
            keyboardType="number-pad"
            style={{ 
              flex: 1,
              fontSize: 10,
              textAlign: 'center',
              minHeight: 24,
              marginLeft: 0
            }}
          />
        </View>

        {/* Limpiar */}
        <SecondaryButton 
          onPress={() => setFilters({ 
            genre: '', 
            year: '', 
            yearRange: { min: 1900, max: currentYear },
            yearFilterType: 'specific',
            watched: null, 
            rating: 1,
            ratingRange: { min: 1, max: 10 },
            ratingFilterType: 'specific',
            sortBy: 'orderNumber',
            sortOrder: 'asc'
          })}
          style={{ 
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12
          }}
        >
          <ButtonText style={{ color: colors.text, fontSize: 9 }}>
            🗑️
          </ButtonText>
        </SecondaryButton>
      </View>

      {/* Fila 2: Géneros en scroll horizontal */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 28 }}
      >
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <SecondaryButton 
            onPress={() => setFilters({...filters, genre: ''})}
            style={{ 
              backgroundColor: filters.genre === '' ? colors.primary : colors.surface,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12
            }}
          >
            <ButtonText style={{ 
              color: filters.genre === '' ? colors.surface : colors.text,
              fontSize: 9
            }}>
              Todos
            </ButtonText>
          </SecondaryButton>
          
          {genres.slice(0, 12).map(genre => (
            <SecondaryButton 
              key={genre.id}
              onPress={() => setFilters({...filters, genre: genre.name})}
              style={{ 
                backgroundColor: filters.genre === genre.name ? colors.primary : colors.surface,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12
              }}
            >
              <ButtonText style={{ 
                color: filters.genre === genre.name ? colors.surface : colors.text,
                fontSize: 9
              }}>
                {genre.name}
              </ButtonText>
            </SecondaryButton>
          ))}
        </View>
      </ScrollView>
    </FilterContainer>
    </Animated.View>
  );
};
