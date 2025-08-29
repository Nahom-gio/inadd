import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  breakpoints,
  typography,
  spacing,
  performanceStyles,
  mediaQuery,
} from '../utils/responsive';

import MobileButton from './MobileButton';
import OptimizedImage from './OptimizedImage';

const MobileHero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const videoRef = useRef(null);

  // Intersection Observer for performance optimization
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Check for reduced motion preference and device capabilities
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    // Check for low-end device (simplified check)
    const isLowEnd =
      window.innerWidth <= 768 &&
      (navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4);
    setIsLowEndDevice(isLowEnd);

    // Listen for changes in reduced motion preference
    const handleMotionChange = e => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Handle scroll to section
  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: isReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  // Performance-optimized styles
  const heroStyles = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#000',
    color: 'white',

    // Performance optimizations
    ...performanceStyles.hardwareAccelerated,

    // Low-end device optimizations
    ...(isLowEndDevice && performanceStyles.lowEndDevice),
  };

  const contentStyles = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    padding: `${spacing.xl} ${spacing.md}`,
    maxWidth: '1200px',
    width: '100%',

    // Mobile-first responsive design
    '@media (min-width: 768px)': {
      padding: `${spacing['3xl']} ${spacing.xl}`,
    },
  };

  const titleStyles = {
    fontSize: typography.h1.mobile,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    lineHeight: 1.2,

    // Responsive typography
    '@media (min-width: 768px)': {
      fontSize: typography.h1.tablet,
    },
    '@media (min-width: 1024px)': {
      fontSize: typography.h1.desktop,
    },
    '@media (min-width: 1280px)': {
      fontSize: typography.h1.wide,
    },

    // Animation (simplified for mobile)
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? 'translateY(0)' : 'translateY(20px)',
    transition: isReducedMotion
      ? 'none'
      : 'opacity 0.6s ease, transform 0.6s ease',
  };

  const subtitleStyles = {
    fontSize: typography.body.mobile,
    marginBottom: spacing.xl,
    opacity: 0.9,
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',

    // Responsive typography
    '@media (min-width: 768px)': {
      fontSize: typography.body.tablet,
    },

    // Animation
    opacity: heroInView ? 0.9 : 0,
    transform: heroInView ? 'translateY(0)' : 'translateY(20px)',
    transition: isReducedMotion
      ? 'none'
      : 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
  };

  const buttonContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    alignItems: 'center',

    // Responsive layout
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      justifyContent: 'center',
    },

    // Animation
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? 'translateY(0)' : 'translateY(20px)',
    transition: isReducedMotion
      ? 'none'
      : 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s',
  };

  const videoStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
    opacity: isVideoLoaded ? 0.6 : 0,
    transition: isReducedMotion ? 'none' : 'opacity 0.8s ease',

    // Low-end device optimizations
    ...(isLowEndDevice && {
      filter: 'brightness(0.7)',
      transform: 'scale(1.1)', // Slightly larger to avoid edges
    }),
  };

  const overlayStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  };

  return (
    <section
      ref={heroRef}
      style={heroStyles}
      className='mobile-hero'
      role='banner'
      aria-label='Hero section'
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        style={videoStyles}
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        onLoadedData={handleVideoLoad}
        aria-hidden='true'
      >
        <source src='/bg.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div style={overlayStyles} />

      {/* Content */}
      <div style={contentStyles}>
        <h1 style={titleStyles}>INAD PROMOTION</h1>

        <p style={subtitleStyles}>Experiential Marketing Agency</p>

        <div style={buttonContainerStyles}>
          <MobileButton
            variant='primary'
            size='large'
            onClick={() => scrollToSection('services')}
            fullWidth={window.innerWidth < 640}
          >
            Get Started
          </MobileButton>

          <MobileButton
            variant='outline'
            size='large'
            onClick={() => scrollToSection('portfolio')}
            fullWidth={window.innerWidth < 640}
          >
            View Portfolio
          </MobileButton>
        </div>
      </div>

      {/* Scroll indicator */}
      {heroInView && (
        <div
          style={{
            position: 'absolute',
            bottom: spacing.lg,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            opacity: 0.7,
            animation: isReducedMotion ? 'none' : 'bounce 2s infinite',
          }}
          aria-hidden='true'
        >
          <div
            style={{
              width: '2px',
              height: '30px',
              backgroundColor: 'white',
              borderRadius: '1px',
            }}
          />
        </div>
      )}

      {/* CSS for animations and responsive design */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        .mobile-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #000;
          color: white;
        }

        /* Mobile-first responsive design */
        @media (max-width: ${breakpoints.sm}) {
          .mobile-hero h1 {
            font-size: ${typography.h1.mobile};
            padding: 0 ${spacing.sm};
          }

          .mobile-hero p {
            font-size: ${typography.body.mobile};
            padding: 0 ${spacing.sm};
          }
        }

        @media (min-width: ${breakpoints.md}) {
          .mobile-hero h1 {
            font-size: ${typography.h1.tablet};
          }

          .mobile-hero p {
            font-size: ${typography.body.tablet};
          }
        }

        @media (min-width: ${breakpoints.lg}) {
          .mobile-hero h1 {
            font-size: ${typography.h1.desktop};
          }
        }

        @media (min-width: ${breakpoints.xl}) {
          .mobile-hero h1 {
            font-size: ${typography.h1.wide};
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .mobile-hero * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Low-end device optimizations */
        @media (max-width: 768px) and (max-device-memory: 4gb) {
          .mobile-hero video {
            filter: brightness(0.7);
            transform: scale(1.1);
          }

          .mobile-hero {
            background-color: #1f2937;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .mobile-hero button {
            min-height: 48px;
            min-width: 48px;
          }
        }
      `}</style>
    </section>
  );
};

export default MobileHero;
