import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==',
  fallback = null,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Check WebP support
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Generate optimized srcSet
  const generateSrcSet = imageSrc => {
    if (!imageSrc || imageSrc.startsWith('data:')) return '';

    const webpSupported = supportsWebP();
    const baseUrl = imageSrc.split('?')[0];
    const extension = webpSupported ? 'webp' : imageSrc.split('.').pop();

    // Generate different sizes for responsive images
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    const srcSet = sizes
      .map(size => `${baseUrl}?w=${size}&fmt=${extension} ${size}w`)
      .join(', ');

    return srcSet;
  };

  // Generate WebP srcSet if supported
  const generateWebPSrcSet = imageSrc => {
    if (!imageSrc || imageSrc.startsWith('data:') || !supportsWebP()) return '';

    const baseUrl = imageSrc.split('?')[0];
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    const srcSet = sizes
      .map(size => `${baseUrl}?w=${size}&fmt=webp ${size}w`)
      .join(', ');

    return srcSet;
  };

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  // Update image source when in view
  useEffect(() => {
    if (isInView && src) {
      setCurrentSrc(src);
    }
  }, [isInView, src]);

  // Handle image load
  const handleLoad = e => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  // Handle image error
  const handleError = e => {
    setHasError(true);
    if (fallback) {
      setCurrentSrc(fallback);
    }
    onError?.(e);
  };

  // Generate optimized image attributes
  const imageProps = {
    ref: imgRef,
    alt: alt || '',
    className: `transition-opacity duration-300 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    } ${className}`,
    onLoad: handleLoad,
    onError: handleError,
    ...props,
  };

  // Add width and height if provided
  if (width) imageProps.width = width;
  if (height) imageProps.height = height;

  // Add loading attribute for non-priority images
  if (!priority) {
    imageProps.loading = 'lazy';
  }

  // Generate srcSet for responsive images
  const srcSet = generateSrcSet(currentSrc);
  const webpSrcSet = generateWebPSrcSet(currentSrc);

  return (
    <div className='relative overflow-hidden'>
      {/* WebP source if supported */}
      {webpSrcSet && (
        <picture>
          <source type='image/webp' srcSet={webpSrcSet} sizes={sizes} />
          <img {...imageProps} src={currentSrc} srcSet={srcSet} sizes={sizes} />
        </picture>
      )}

      {/* Fallback image if WebP not supported or no WebP source */}
      {!webpSrcSet && (
        <img {...imageProps} src={currentSrc} srcSet={srcSet} sizes={sizes} />
      )}

      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className='absolute inset-0 bg-gray-200 animate-pulse'
          style={{
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Error state */}
      {hasError && !fallback && (
        <div className='absolute inset-0 bg-gray-100 flex items-center justify-center'>
          <div className='text-center text-gray-500'>
            <svg
              className='w-12 h-12 mx-auto mb-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <p className='text-sm'>Image failed to load</p>
          </div>
        </div>
      )}

      {/* Performance monitoring */}
      {process.env.NODE_ENV === 'development' && (
        <div className='absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded'>
          {isLoaded ? 'Loaded' : 'Loading'}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
