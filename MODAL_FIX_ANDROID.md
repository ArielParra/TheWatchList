# Corrección de Fondos Opacos en Modales para Android

## Problema
Los fondos opacos en los modales `AddMovieModal`, `MovieDetailModal` y `RandomSuggestionModal` no funcionaban correctamente en Android.

## Solución Implementada

### 1. Nuevas Propiedades de Modal
Se agregó `statusBarTranslucent={true}` a todos los modales para mejorar la compatibilidad con Android.

### 2. Componente ModalOverlay
Se creó un nuevo componente `ModalOverlay.tsx` que:
- Proporciona un fondo opaco consistente
- Incluye propiedades específicas para Android (`position: absolute`, `zIndex: 1000`)
- Es reutilizable para futuros modales

### 3. Reemplazo de styled-components
Se reemplazó el uso de `ModalContainer` (styled-component) por implementaciones nativas de React Native con `View` y estilos inline para:
- Mejor compatibilidad con Android
- Control más preciso del rendering
- Eliminación de posibles conflictos de z-index

### 4. Archivos Modificados
- `src/components/AddMovieModal.tsx`
- `src/components/MovieDetailModal.tsx` 
- `src/components/RandomSuggestionModal.tsx`
- `src/components/ModalOverlay.tsx` (nuevo)
- `src/components/styled/CommonStyles.ts` (actualizado)

### 5. Características del ModalOverlay
```tsx
// Propiedades para garantizar compatibilidad con Android
{
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
}
```

## Beneficios
- ✅ Fondos opacos funcionan correctamente en Android
- ✅ Mejor consistencia visual entre plataformas
- ✅ Componente reutilizable para futuros modales
- ✅ Código más mantenible y legible
