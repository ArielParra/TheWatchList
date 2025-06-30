import { useRef, useCallback } from 'react';
import { Animated, Platform } from 'react-native';

interface UseHoverAnimationProps {
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  timing?: number;
  tension?: number;
  friction?: number;
}

function useHoverAnimation({
  x = 0,
  y = 0,
  rotation = 0,
  scale = 1,
  tension = 300,
  friction = 10,
}: UseHoverAnimationProps = {}) {
  // Use native driver only on native platforms, not on web
  const useNativeDriver = Platform.OS !== 'web';
  
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const triggerHoverIn = useCallback(() => {
    // Animate to the hovered state
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: x,
        tension,
        friction,
        useNativeDriver,
      }),
      Animated.spring(translateY, {
        toValue: y,
        tension,
        friction,
        useNativeDriver,
      }),
      Animated.spring(rotateValue, {
        toValue: rotation,
        tension,
        friction,
        useNativeDriver,
      }),
      Animated.spring(scaleValue, {
        toValue: scale,
        tension,
        friction,
        useNativeDriver,
      }),
    ]).start();
  }, [x, y, rotation, scale, tension, friction, translateX, translateY, rotateValue, scaleValue, useNativeDriver]);

  const triggerHoverOut = useCallback(() => {
    // Reset to original state
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        tension,
        friction,
        useNativeDriver,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension,
        friction,
        useNativeDriver,
      }),
      Animated.spring(rotateValue, {
        toValue: 0,
        tension,
        friction,
        useNativeDriver,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension,
        friction,
        useNativeDriver,
      }),
    ]).start();
  }, [tension, friction, translateX, translateY, rotateValue, scaleValue, useNativeDriver]);

  const animatedStyle = {
    transform: [
      { translateX },
      { translateY },
      { 
        rotate: rotateValue.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        })
      },
      { scale: scaleValue },
    ],
  };

  return [animatedStyle, triggerHoverIn, triggerHoverOut] as const;
}

export default useHoverAnimation;
