import { useState, useEffect } from 'react';
import { getScreenSize, BREAKPOINTS } from '../utils/helpers';

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState(getScreenSize());
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      setWindowSize(newSize);
      setScreenSize(getScreenSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize === 'xs' || screenSize === 'sm';
  const isTablet = screenSize === 'md';
  const isDesktop = screenSize === 'lg' || screenSize === 'xl' || screenSize === 'xxl';

  const isSmallScreen = windowSize.width < parseInt(BREAKPOINTS.md);
  const isMediumScreen = windowSize.width >= parseInt(BREAKPOINTS.md) && windowSize.width < parseInt(BREAKPOINTS.lg);
  const isLargeScreen = windowSize.width >= parseInt(BREAKPOINTS.lg);

  return {
    screenSize,
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen
  };
};