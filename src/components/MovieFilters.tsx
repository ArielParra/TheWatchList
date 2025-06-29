import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, Animated, Platform } from 'react-native';
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

// Componente wrapper para tooltips en web
const TooltipButton = ({ children, tooltip, style, ...props }: any) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (Platform.OS === 'web' && !isMobile && tooltip) {
    return (
      <View style={{ position: 'relative' }}>
        <SecondaryButton 
          {...props}
          style={style}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {children}
        </SecondaryButton>
        {showTooltip && (
          <View style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: [{ translateX: -50 }],
            backgroundColor: '#333',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            marginBottom: 5,
            zIndex: 1000,
            minWidth: 80,
            alignItems: 'center'
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 11, 
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {tooltip}
            </Text>
            <View style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: [{ translateX: -5 }],
              width: 0,
              height: 0,
              borderLeftWidth: 5,
              borderRightWidth: 5,
              borderTopWidth: 5,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: '#333'
            }} />
          </View>
        )}
      </View>
    );
  }
  return <SecondaryButton {...props} style={style}>{children}</SecondaryButton>;
};

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
    if (filters.genre) {
      const translatedGenre = t(`genres.${filters.genre}`);
      console.log(`Active filter genre debug: ${filters.genre} -> ${translatedGenre}`);
      activeFilters.push(translatedGenre !== `genres.${filters.genre}` ? translatedGenre : filters.genre);
    }
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

      {/* Fila 1: Estado, Orden, Géneros (en PC) */}
      <View style={{ 
        flexDirection: isMobile ? 'column' : 'row', 
        gap: 6, 
        marginBottom: 6,
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        {/* Primera subfila: Estado y Orden */}
        <View style={{ 
          flexDirection: 'row', 
          gap: 6, 
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
                fontSize: 12
              }}>
                {t('filters.all')}
              </ButtonText>
            </SecondaryButton>
            
            <TooltipButton 
              onPress={() => setFilters({...filters, watched: true})}
              tooltip={t('movie.watched')}
              style={{ 
                backgroundColor: filters.watched === true ? colors.success : colors.surface,
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 12,
                minHeight: 28,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonText style={{ 
                color: filters.watched === true ? colors.surface : colors.text,
                fontSize: 10,
                lineHeight: 12
              }}>
                ✓
              </ButtonText>
            </TooltipButton>
            
            <TooltipButton 
              onPress={() => setFilters({...filters, watched: false})}
              tooltip={t('movie.pending')}
              style={{ 
                backgroundColor: filters.watched === false ? colors.warning : colors.surface,
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 12,
                minHeight: 28,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonText style={{ 
                color: filters.watched === false ? colors.surface : colors.text,
                fontSize: isMobile ? 8 : 10,
                lineHeight: isMobile ? 10 : 12
              }}>
                ⏳
              </ButtonText>
            </TooltipButton>
          </View>

          {/* Separador */}
          <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />

          {/* Ordenamiento */}
          <View style={{ flexDirection: 'row', gap: 3 }}>
            <TooltipButton 
              onPress={() => setFilters({...filters, sortBy: 'orderNumber'})}
              tooltip={t('filters.orderNumber')}
              style={{ 
                backgroundColor: filters.sortBy === 'orderNumber' ? colors.primary : colors.surface,
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 12,
                minHeight: 28,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonText style={{ 
                color: filters.sortBy === 'orderNumber' ? colors.surface : colors.text,
                fontSize: 10,
                lineHeight: 12
              }}>
                📝
              </ButtonText>
            </TooltipButton>
            
            <TooltipButton 
              onPress={() => setFilters({...filters, sortBy: 'alphabetical'})}
              tooltip={t('filters.alphabetical')}
              style={{ 
                backgroundColor: filters.sortBy === 'alphabetical' ? colors.primary : colors.surface,
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 12,
                minHeight: 28,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonText style={{ 
                color: filters.sortBy === 'alphabetical' ? colors.surface : colors.text,
                fontSize: isMobile ? 8 : 10,
                lineHeight: isMobile ? 10 : 12
              }}>
                🔤
              </ButtonText>
            </TooltipButton>
            
            <TooltipButton 
              onPress={() => setFilters({...filters, sortBy: 'year'})}
              tooltip={t('filters.year')}
              style={{ 
                backgroundColor: filters.sortBy === 'year' ? colors.primary : colors.surface,
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 12,
                minHeight: 28,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonText style={{ 
                color: filters.sortBy === 'year' ? colors.surface : colors.text,
                fontSize: 10,
                lineHeight: 12
              }}>
                📅
              </ButtonText>
            </TooltipButton>
            
            <TooltipButton 
              onPress={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
              tooltip={filters.sortOrder === 'asc' ? t('filters.ascending') : t('filters.descending')}
              style={{ 
                backgroundColor: colors.accent,
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 12,
                minHeight: 28,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonText style={{ 
                color: colors.surface,
                fontSize: 10,
                lineHeight: 12
              }}>
                {filters.sortOrder === 'asc' ? '⬆️' : '⬇️'}
              </ButtonText>
            </TooltipButton>
          </View>

          {/* Limpiar */}
          <TooltipButton 
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
            tooltip={t('filters.clear')}
            style={{ 
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              minHeight: 28,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ButtonText style={{ 
              color: colors.text, 
              fontSize: isMobile ? 8 : 9,
              lineHeight: isMobile ? 10 : 12
            }}>
              🗑️
            </ButtonText>
          </TooltipButton>
        </View>

        {/* Géneros (en PC en la misma fila, en móvil en fila separada) */}
        {!isMobile && (
          <>
            <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={{ maxHeight: 28, flex: 1 }}
            >
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <SecondaryButton 
                  onPress={() => setFilters({...filters, genre: ''})}
                  style={{ 
                    backgroundColor: filters.genre === '' ? colors.primary : colors.surface,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    minHeight: 28,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.genre === '' ? colors.surface : colors.text,
                    fontSize: 9,
                    textAlign: 'center'
                  }}>
                    {t('filters.all')}
                  </ButtonText>
                </SecondaryButton>
                
                {genres.slice(0, 12).map(genre => {
                  const translatedGenre = t(`genres.${genre.name}`);
                  return (
                    <SecondaryButton 
                      key={genre.id}
                      onPress={() => setFilters({...filters, genre: genre.name})}
                      style={{ 
                        backgroundColor: filters.genre === genre.name ? colors.primary : colors.surface,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        minHeight: 28,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <ButtonText style={{ 
                        color: filters.genre === genre.name ? colors.surface : colors.text,
                        fontSize: 9,
                        textAlign: 'center'
                      }}>
                        {translatedGenre !== `genres.${genre.name}` ? translatedGenre : genre.name}
                      </ButtonText>
                    </SecondaryButton>
                  );
                })}
              </View>
            </ScrollView>
          </>
        )}
      </View>

      {/* Géneros en móvil (fila separada) */}
      {isMobile && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 50, marginBottom: 6 }}
          contentContainerStyle={{ paddingVertical: 6 }}
        >
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <SecondaryButton 
              onPress={() => setFilters({...filters, genre: ''})}
              style={{ 
                backgroundColor: filters.genre === '' ? colors.primary : colors.surface,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                minHeight: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonText style={{ 
                color: filters.genre === '' ? colors.surface : colors.text,
                fontSize: 12,
                textAlign: 'center',
                lineHeight: 14
              }}>
                {t('filters.all')}
              </ButtonText>
            </SecondaryButton>
            
            {genres.slice(0, 12).map(genre => {
              const translatedGenre = t(`genres.${genre.name}`);
              console.log(`Genre debug: ${genre.name} -> ${translatedGenre}`);
              return (
                <SecondaryButton 
                  key={genre.id}
                  onPress={() => setFilters({...filters, genre: genre.name})}
                  style={{ 
                    backgroundColor: filters.genre === genre.name ? colors.primary : colors.surface,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 12,
                    minHeight: 40,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ButtonText style={{ 
                    color: filters.genre === genre.name ? colors.surface : colors.text,
                    fontSize: 12,
                    textAlign: 'center',
                    lineHeight: 14
                  }}>
                    {translatedGenre !== `genres.${genre.name}` ? translatedGenre : genre.name}
                  </ButtonText>
                </SecondaryButton>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Fila final: Rating y Año */}
      <View style={{ 
        flexDirection: 'row', 
        gap: 6, 
        marginTop: 6,
        alignItems: 'center'
      }}>
        <Text style={{ 
          color: colors.textSecondary, 
          fontSize: 10,
          minWidth: 40
        }}>
          Filtros:
        </Text>
        
        <SearchInput
          placeholder={isMobile ? "rating" : "⭐ rating"}
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
            width: 80,
            fontSize: 12,
            textAlign: 'center',
            minHeight: 28,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 8,
            color: colors.text
          }}
        />
        
        <SearchInput
          placeholder={isMobile ? "año" : "📅 año"}
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
            width: 80,
            fontSize: 12,
            textAlign: 'center',
            minHeight: 28,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 8,
            color: colors.text
          }}
        />
      </View>
    </FilterContainer>
    </Animated.View>
  );
};
