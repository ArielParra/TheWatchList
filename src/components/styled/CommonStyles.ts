import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Colores del tema claro y moderno
export const colors = {
  primary: '#6366f1',      // Indigo moderno
  secondary: '#8b5cf6',    // Púrpura
  accent: '#06b6d4',       // Cyan
  success: '#10b981',      // Verde
  warning: '#f59e0b',      // Ámbar
  error: '#ef4444',        // Rojo
  background: '#f8fafc',   // Gris muy claro
  surface: '#ffffff',      // Blanco
  text: '#1e293b',         // Gris oscuro
  textSecondary: '#64748b', // Gris medio
  border: '#e2e8f0',       // Gris claro
  shadow: '#64748b20'      // Gris con transparencia
};

// Contenedores principales
export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
`;

export const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.background};
`;

// Header/TopBar
export const TopBar = styled.View`
  background-color: ${colors.surface};
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

export const TopBarRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const TopBarTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.text};
`;

export const TopBarActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

// Search Bar
export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.background};
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid ${colors.border};
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: ${colors.text};
  margin-left: 8px;
`;

// Botones modernos
export const IconButton = styled.TouchableOpacity<{ active?: boolean }>`
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props: { active?: boolean }) => 
    props.active ? colors.primary : colors.background};
  border: 1px solid ${colors.border};
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: 12px 20px;
  border-radius: 10px;
  align-items: center;
  shadow-color: ${colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 4;
`;

export const SecondaryButton = styled.TouchableOpacity`
  background-color: ${colors.surface};
  border: 1.5px solid ${colors.primary};
  padding: 12px 20px;
  border-radius: 10px;
  align-items: center;
`;

// Textos
export const ButtonText = styled.Text<{ secondary?: boolean }>`
  color: ${(props: { secondary?: boolean }) => 
    props.secondary ? colors.primary : colors.surface};
  font-size: 14px;
  font-weight: 600;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${colors.text};
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${colors.textSecondary};
  margin-bottom: 20px;
`;

// Movie Cards 
export const MovieCard = styled.TouchableOpacity<{ showImage: boolean }>`
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: 12px;
  margin: 2px 4px;
  width: ${(props: { showImage: boolean }) => props.showImage ? '150px' : '100%'};
  align-items: center;
  border: 1px solid ${colors.border};
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const MoviePoster = styled.Image`
  width: 100px;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const MovieInfo = styled.View`
  width: 100%;
  align-items: center;
`;

export const MovieTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
  text-align: center;
  margin-bottom: 4px;
  line-height: 18px;
`;

export const MovieDetails = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  text-align: center;
  margin-bottom: 2px;
`;

// Lista minimalista para modo sin imágenes
export const MinimalMovieItem = styled.TouchableOpacity`
  background-color: ${colors.surface};
  border-radius: 8px;
  padding: 8px 12px;
  margin: 2px 4px;
  width: 150px;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${colors.border};
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
  min-height: 50px;
`;  

export const MinimalMovieTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
  flex: 1;
  margin-left: 8px;
  line-height: 18px;
`;

export const MinimalCheckbox = styled.TouchableOpacity<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 2px solid ${(props: { checked: boolean }) => 
    props.checked ? colors.primary : colors.border};
  background-color: ${(props: { checked: boolean }) => 
    props.checked ? colors.primary : 'transparent'};
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

// Lista horizontal para las tarjetas con imágenes
export const MoviesGrid = styled.FlatList`
  padding: 8px 0;
`;

export const MovieListItem = styled.TouchableOpacity`
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin: 4px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${colors.border};
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;


export const MovieListInfo = styled.View`
  flex: 1;
`;

export const MovieListTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 4px;
`;

export const MovieListDetails = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  margin-bottom: 2px;
`;


export const MovieOverview = styled.Text`
  font-size: 13px;
  color: ${colors.textSecondary};
  margin-top: 8px;
  line-height: 18px;
`;

// Checkbox
export const CheckboxContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;

export const Checkbox = styled.View<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid ${(props: { checked: boolean }) => 
    props.checked ? colors.success : colors.border};
  background-color: ${(props: { checked: boolean }) => 
    props.checked ? colors.success : colors.surface};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

export const CheckboxText = styled.Text<{ checked: boolean }>`
  font-size: 16px;
  color: ${(props: { checked: boolean }) => 
    props.checked ? colors.textSecondary : colors.text};
  text-decoration-line: ${(props: { checked: boolean }) => 
    props.checked ? 'line-through' : 'none'};
`;

// Filters
export const FilterContainer = styled.View`
  background-color: ${colors.surface};
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

export const FilterRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const FilterLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 8px;
`;

// Loading y Empty States
export const CenterContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: ${colors.textSecondary};
  text-align: center;
  margin-top: 16px;
`;

// Modal
export const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: ${colors.surface};
  border-radius: 20px;
  padding: 24px;
  margin: 20px;
  max-height: 80%;
  width: ${width - 40}px;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 10px;
  shadow-opacity: 0.25;
  shadow-radius: 20px;
  elevation: 10;
`;

// Modal de detalles de película
export const MovieDetailModal = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const MovieDetailContent = styled.View`
  background-color: ${colors.surface};
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  max-height: 80%;
  width: 90%;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 10px;
  shadow-opacity: 0.3;
  shadow-radius: 20px;
  elevation: 10;
`;

export const MovieDetailHeader = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

export const MovieDetailPoster = styled.Image`
  width: 120px;
  height: 180px;
  border-radius: 12px;
  margin-right: 16px;
`;

export const MovieDetailInfo = styled.View`
  flex: 1;
  justify-content: flex-start;
`;

export const MovieDetailTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 8px;
`;

export const MovieDetailYear = styled.Text`
  font-size: 16px;
  color: ${colors.textSecondary};
  margin-bottom: 4px;
`;

export const MovieDetailRating = styled.Text`
  font-size: 16px;
  color: ${colors.primary};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const MovieDetailGenre = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  margin-bottom: 12px;
`;

export const MovieDetailOverview = styled.Text`
  font-size: 14px;
  color: ${colors.text};
  line-height: 20px;
  margin-bottom: 16px;
`;

export const WatchProvidersContainer = styled.View`
  margin-bottom: 16px;
`;

export const WatchProvidersTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 8px;
`;

export const WatchProvidersList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

export const WatchProviderItem = styled.TouchableOpacity`
  background-color: ${colors.background};
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  flex-direction: row;
  align-items: center;
`;

export const WatchProviderLogo = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 8px;
`;

export const WatchProviderName = styled.Text`
  font-size: 12px;
  color: ${colors.text};
  font-weight: 500;
`;

export const ExternalLinksContainer = styled.View`
  margin-bottom: 16px;
`;

export const ExternalLinksTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 8px;
`;

export const ExternalLinkButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ExternalLinkText = styled.Text`
  color: ${colors.surface};
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: ${colors.background};
  border-radius: 20px;
  padding: 8px;
  border: 1px solid ${colors.border};
`;