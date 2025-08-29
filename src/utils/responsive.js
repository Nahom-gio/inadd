// Mobile-first responsive breakpoints
export const breakpoints = {
  xs: '320px', // Small phones
  sm: '576px', // Large phones
  md: '768px', // Tablets
  lg: '1024px', // Small laptops
  xl: '1280px', // Large laptops
  '2xl': '1536px', // Desktop
};

// Touch-friendly sizes (minimum 44px for touch targets)
export const touchTargets = {
  minHeight: '44px',
  minWidth: '44px',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '16px', // Prevents zoom on iOS
};

// Performance optimization constants
export const performance = {
  // Reduce motion for users who prefer it
  reducedMotion: '@media (prefers-reduced-motion: reduce)',

  // Low-end device optimizations
  lowEndDevice: '@media (max-width: 768px) and (max-device-memory: 4gb)',

  // High DPI displays
  highDPI:
    '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

  // Battery saver mode
  batterySaver: '@media (prefers-reduced-data: reduce)',
};

// Responsive spacing scale
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
};

// Z-index scale for proper layering
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
};

// Animation durations optimized for mobile
export const animations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  // Reduced motion versions
  fastReduced: '0ms',
  normalReduced: '0ms',
  slowReduced: '0ms',
};

// Media query helpers
export const mediaQuery = {
  // Mobile first approach
  mobile: `@media (min-width: ${breakpoints.xs})`,
  tablet: `@media (min-width: ${breakpoints.md})`,
  desktop: `@media (min-width: ${breakpoints.lg})`,
  wide: `@media (min-width: ${breakpoints.xl})`,

  // Max width queries for specific device targeting
  mobileOnly: `@media (max-width: ${breakpoints.md})`,
  tabletOnly: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktopOnly: `@media (min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`,
};

// Touch-friendly button styles
export const touchButtonStyles = {
  base: {
    minHeight: touchTargets.minHeight,
    minWidth: touchTargets.minWidth,
    padding: touchTargets.padding,
    fontSize: touchTargets.fontSize,
    borderRadius: touchTargets.borderRadius,
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  },
  primary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#374151',
    border: '2px solid #d1d5db',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: '#9ca3af',
      backgroundColor: '#f9fafb',
    },
  },
};

// Performance optimization styles
export const performanceStyles = {
  // Hardware acceleration for animations
  hardwareAccelerated: {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px',
  },

  // Reduced motion styles
  reducedMotion: {
    transition: 'none',
    animation: 'none',
    transform: 'none',
  },

  // Low-end device optimizations
  lowEndDevice: {
    // Reduce shadows and effects
    boxShadow: 'none',
    filter: 'none',
    backdropFilter: 'none',
    // Simplify animations
    transition: 'opacity 0.2s ease',
    // Reduce image quality for better performance
    imageRendering: 'optimizeSpeed',
  },
};

// Responsive grid system
export const grid = {
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
  gap: {
    mobile: spacing.sm,
    tablet: spacing.md,
    desktop: spacing.lg,
    wide: spacing.xl,
  },
};

// Typography scale optimized for mobile
export const typography = {
  h1: {
    mobile: '1.75rem', // 28px
    tablet: '2.25rem', // 36px
    desktop: '3rem', // 48px
    wide: '3.75rem', // 60px
  },
  h2: {
    mobile: '1.5rem', // 24px
    tablet: '1.875rem', // 30px
    desktop: '2.25rem', // 36px
    wide: '3rem', // 48px
  },
  h3: {
    mobile: '1.25rem', // 20px
    tablet: '1.5rem', // 24px
    desktop: '1.875rem', // 30px
    wide: '2.25rem', // 36px
  },
  body: {
    mobile: '1rem', // 16px
    tablet: '1.125rem', // 18px
    desktop: '1.125rem', // 18px
    wide: '1.125rem', // 18px
  },
  small: {
    mobile: '0.875rem', // 14px
    tablet: '0.875rem', // 14px
    desktop: '0.875rem', // 14px
    wide: '0.875rem', // 14px
  },
};

// Export everything as a single object for easy importing
export default {
  breakpoints,
  touchTargets,
  performance,
  spacing,
  zIndex,
  animations,
  mediaQuery,
  touchButtonStyles,
  performanceStyles,
  grid,
  typography,
};
