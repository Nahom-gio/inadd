import React from 'react';

import { touchTargets, performanceStyles } from '../utils/responsive';

const MobileButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  // Size variants
  const sizeStyles = {
    small: {
      padding: '8px 12px',
      fontSize: '14px',
      minHeight: '36px',
    },
    medium: {
      padding: touchTargets.padding,
      fontSize: touchTargets.fontSize,
      minHeight: touchTargets.minHeight,
    },
    large: {
      padding: '16px 24px',
      fontSize: '18px',
      minHeight: '56px',
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
      color: 'white',
      border: 'none',
      boxShadow: disabled ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      '&:hover': disabled
        ? {}
        : {
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
      color: disabled ? '#9ca3af' : '#374151',
      border: `2px solid ${disabled ? '#d1d5db' : '#d1d5db'}`,
      '&:hover': disabled
        ? {}
        : {
            borderColor: '#9ca3af',
            backgroundColor: '#f9fafb',
          },
    },
    outline: {
      backgroundColor: 'transparent',
      color: disabled ? '#9ca3af' : '#3b82f6',
      border: `2px solid ${disabled ? '#d1d5db' : '#3b82f6'}`,
      '&:hover': disabled
        ? {}
        : {
            backgroundColor: '#eff6ff',
          },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: disabled ? '#9ca3af' : '#374151',
      border: 'none',
      '&:hover': disabled
        ? {}
        : {
            backgroundColor: '#f3f4f6',
          },
    },
  };

  // Base styles with mobile-first approach
  const baseStyles = {
    // Touch-friendly sizing
    minHeight: sizeStyles[size].minHeight,
    minWidth: touchTargets.minWidth,
    padding: sizeStyles[size].padding,
    fontSize: sizeStyles[size].fontSize,
    borderRadius: touchTargets.borderRadius,

    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',

    // Typography
    fontWeight: '500',
    lineHeight: '1.5',
    textAlign: 'center',
    textDecoration: 'none',
    whiteSpace: 'nowrap',

    // Interactions
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',

    // Transitions
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

    // States
    opacity: disabled ? 0.6 : 1,

    // Focus states for accessibility
    outline: 'none',
    '&:focus-visible': {
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
    },

    // Performance optimizations
    ...performanceStyles.hardwareAccelerated,

    // Reduced motion support
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': {
        transform: 'none',
      },
    },

    // Low-end device optimizations
    '@media (max-width: 768px) and (max-device-memory: 4gb)': {
      ...performanceStyles.lowEndDevice,
      '&:hover': {
        transform: 'none',
        boxShadow: 'none',
      },
    },
  };

  // Combine all styles
  const buttonStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  // Handle click with loading state
  const handleClick = e => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`mobile-button mobile-button--${variant} mobile-button--${size} ${
        fullWidth ? 'mobile-button--full-width' : ''
      } ${disabled ? 'mobile-button--disabled' : ''} ${
        loading ? 'mobile-button--loading' : ''
      } ${className}`}
      style={buttonStyles}
      {...props}
    >
      {loading && (
        <svg
          className='mobile-button__spinner'
          style={{
            width: '16px',
            height: '16px',
            marginRight: '8px',
            animation: 'spin 1s linear infinite',
          }}
          viewBox='0 0 24 24'
          fill='none'
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
            strokeLinecap='round'
            strokeDasharray='31.416'
            strokeDashoffset='31.416'
            style={{
              animation: 'dash 1.5s ease-in-out infinite',
            }}
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default MobileButton;
