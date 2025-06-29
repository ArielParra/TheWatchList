import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
};

interface ResponsiveData {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useResponsive = (): ResponsiveData => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
      isDesktop: width >= breakpoints.tablet,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        isMobile: window.width < breakpoints.mobile,
        isTablet: window.width >= breakpoints.mobile && window.width < breakpoints.tablet,
        isDesktop: window.width >= breakpoints.tablet,
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};
