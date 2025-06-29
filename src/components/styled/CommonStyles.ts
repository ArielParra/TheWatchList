import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Breakpoints para responsive design
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
};

// Variables base (fallback para styled-components)
export const isMobile = width < breakpoints.mobile;
export const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet;

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

// Header/TopBar con mejor responsividad
export const TopBar = styled.View`
  background-color: ${colors.surface};
  padding: ${isMobile ? '12px 16px' : '16px 24px'};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
  elevation: 3;
  padding-top: ${isMobile ? '16px' : '16px'};
`;

export const TopBarRow = styled.View`
  flex-direction: ${isMobile ? 'column' : 'row'};
  align-items: ${isMobile ? 'flex-start' : 'center'};
  justify-content: space-between;
  margin-bottom: ${isMobile ? '12px' : '16px'};
  gap: ${isMobile ? '12px' : '0px'};
`;

export const TopBarTitle = styled.Text`
  font-size: ${isMobile ? '22px' : '28px'};
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: ${isMobile ? '0px' : '0px'};
  align-self: ${isMobile ? 'center' : 'flex-start'};
`;

export const TopBarActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${isMobile ? '8px' : '12px'};
  flex-wrap: ${isMobile ? 'wrap' : 'nowrap'};
  justify-content: ${isMobile ? 'center' : 'flex-end'};
  width: ${isMobile ? '100%' : 'auto'};
`;

// Search Bar
export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.background};
  border-radius: 12px;
  padding: ${isMobile ? '10px 12px' : '12px 16px'};
  border: 1px solid ${colors.border};
  flex: 1;
  margin-right: ${isMobile ? '8px' : '0px'};
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${isMobile ? '14px' : '16px'};
  color: ${colors.text};
  margin-left: 8px;
  background-color: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 8px 12px;
`;

// Botones modernos
export const IconButton = styled.TouchableOpacity<{ active?: boolean }>`
  padding: ${isMobile ? '8px' : '10px'};
  border-radius: 10px;
  background-color: ${(props: { active?: boolean }) => 
    props.active ? colors.primary : colors.background};
  border: 1px solid ${colors.border};
  min-width: ${isMobile ? '32px' : '36px'};
  min-height: ${isMobile ? '32px' : '36px'};
  align-items: center;
  justify-content: center;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: ${isMobile ? '10px 16px' : '12px 20px'};
  border-radius: 10px;
  align-items: center;
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
  border-radius: 10px;
  padding: 10px;
  width: ${(props: { showImage: boolean }) => props.showImage ? '150px' : '100%'};
  align-items: center;
  border: 1px solid ${colors.border};
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
  position: relative;
  min-height: 60px;
  padding-bottom: 10px;
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
  width: 150px;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${colors.border};
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
  transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out;
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
  transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out;
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
  padding: ${isMobile ? '12px' : '16px'};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
  max-height: ${isMobile ? '70vh' : 'auto'};
  elevation: 2;
`;

export const FilterRow = styled.View`
  margin-bottom: ${isMobile ? '12px' : '16px'};
`;

export const FilterLabel = styled.Text`
  font-size: ${isMobile ? '18px' : '20px'};
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: ${isMobile ? '12px' : '16px'};
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
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: ${isMobile ? '16px' : '20px'};
`;

export const ModalContent = styled.View`
  background-color: ${colors.surface};
  border-radius: 16px;
  padding: ${isMobile ? '20px' : '24px'};
  width: ${isMobile ? '90%' : '85%'};
  max-width: ${isMobile ? '400px' : '600px'};
  max-height: ${isMobile ? '80vh' : '75vh'};
  elevation: 8;
  margin: ${isMobile ? '20px' : '40px'};
`;

// Modal de detalles de película con mejor responsividad
export const MovieDetailModal = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: ${isMobile ? '20px' : '40px'};
`;

export const MovieDetailContent = styled.View`
  background-color: ${colors.surface};
  border-radius: 20px;
  padding: ${isMobile ? '16px' : '20px'};
  max-height: ${isMobile ? '85%' : '80%'};
  width: ${isMobile ? '100%' : '90%'};
  max-width: ${isMobile ? '100%' : '600px'};
  elevation: 10;
`;

export const MovieDetailHeader = styled.View`
  flex-direction: ${isMobile ? 'column' : 'row'};
  margin-bottom: 16px;
  align-items: ${isMobile ? 'center' : 'flex-start'};
  gap: ${isMobile ? '12px' : '16px'};
`;

export const MovieDetailPoster = styled.Image`
  width: ${isMobile ? '100px' : '120px'};
  height: ${isMobile ? '150px' : '180px'};
  border-radius: 12px;
  align-self: ${isMobile ? 'center' : 'flex-start'};
`;

export const MovieDetailInfo = styled.View`
  flex: 1;
  justify-content: flex-start;
`;

export const MovieDetailTitle = styled.Text`
  font-size: ${isMobile ? '18px' : '20px'};
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 8px;
  text-align: ${isMobile ? 'center' : 'left'};
`;

export const MovieDetailYear = styled.Text`
  font-size: ${isMobile ? '14px' : '16px'};
  color: ${colors.textSecondary};
  margin-bottom: 4px;
  text-align: ${isMobile ? 'center' : 'left'};
`;

export const MovieDetailRating = styled.Text`
  font-size: ${isMobile ? '14px' : '16px'};
  color: ${colors.primary};
  font-weight: 600;
  margin-bottom: 8px;
  text-align: ${isMobile ? 'center' : 'left'};
`;

export const MovieDetailGenre = styled.Text`
  font-size: ${isMobile ? '12px' : '14px'};
  color: ${colors.textSecondary};
  margin-bottom: 12px;
  text-align: ${isMobile ? 'center' : 'left'};
`;

export const MovieDetailOverview = styled.Text`
  font-size: ${isMobile ? '13px' : '14px'};
  color: ${colors.text};
  line-height: ${isMobile ? '18px' : '20px'};
  margin-bottom: 16px;
  text-align: justify;
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

// Footer personalizado
export const Footer = styled.View`
  background-color: ${colors.surface};
  padding: ${isMobile ? '4px' : '6px'};
  border-top-width: 1px;
  border-top-color: ${colors.border};
  align-items: center;
  justify-content: center;
`;

export const FooterText = styled.Text`
  font-size: ${isMobile ? '12px' : '14px'};
  color: ${colors.textSecondary};
  text-align: center;
  line-height: ${isMobile ? '16px' : '20px'};
`;

// Botón de sugerencia aleatoria
export const RandomButton = styled.TouchableOpacity`
  background-color: ${colors.accent};
  padding: ${isMobile ? '8px 12px' : '10px 16px'};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  min-width: ${isMobile ? '100px' : '120px'};
  elevation: 2;
`;

export const RandomButtonText = styled.Text`
  color: ${colors.surface};
  font-size: ${isMobile ? '12px' : '14px'};
  font-weight: 600;
  margin-left: 4px;
`;