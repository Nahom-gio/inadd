import { motion } from 'framer-motion';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  FaChevronDown,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

const Hero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const videoRef = useRef(null);
  const scrollButtonRef = useRef(null);
  const observerRef = useRef(null);

  // Memoize expensive calculations
  const videoControls = useMemo(
    () => ({
      play: () => {
        if (videoRef.current) {
          videoRef.current.play();
        }
      },
      pause: () => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      mute: () => {
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
      },
      unmute: () => {
        if (videoRef.current) {
          videoRef.current.muted = false;
        }
      },
    }),
    []
  );

  // Optimize video loading with intersection observer
  useEffect(() => {
    if (!videoRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);

        // Only load video when it's about to be visible
        if (entry.isIntersecting && !isVideoLoaded) {
          const video = videoRef.current;
          if (video) {
            // Set video attributes for performance
            video.setAttribute(
              'aria-label',
              'Background video showing INAD PROMOTION events and activities'
            );
            video.setAttribute('aria-hidden', 'true');

            // Preload metadata only for better performance
            video.preload = 'metadata';

            // Optimize video settings
            video.playsInline = true;
            video.muted = true;
            video.loop = true;
            video.autoplay = true;

            // Add loading state
            video.addEventListener('loadstart', () => {
              video.style.opacity = '0';
            });

            video.addEventListener('canplay', () => {
              video.style.opacity = '1';
              video.style.transition = 'opacity 0.5s ease-in-out';
            });

            // Handle video loading errors gracefully
            video.addEventListener('error', () => {
              console.warn(
                'Video failed to load, falling back to poster image'
              );
              video.style.display = 'none';
            });
          }
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Increased margin for earlier loading
    );

    observerRef.current.observe(videoRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVideoLoaded]);

  // Optimize video controls with useCallback
  const handleVideoToggle = useCallback(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoControls.pause();
      } else {
        videoControls.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  }, [isVideoPlaying, videoControls]);

  const handleMuteToggle = useCallback(() => {
    if (videoRef.current) {
      if (isVideoMuted) {
        videoControls.unmute();
      } else {
        videoControls.mute();
      }
      setIsVideoMuted(!isVideoMuted);
    }
  }, [isVideoMuted, videoControls]);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  // Optimize scroll function with useCallback
  const scrollToNext = useCallback(() => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
      // Return focus to the scroll button after scrolling
      setTimeout(() => {
        if (scrollButtonRef.current) {
          scrollButtonRef.current.focus();
        }
      }, 1000);
    }
  }, []);

  // Optimize keyboard handler with useCallback
  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToNext();
      }
    },
    [scrollToNext]
  );

  // Memoize contact scroll function
  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Memoize portfolio scroll function
  const scrollToPortfolio = useCallback(() => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <section
      id='home'
      className='relative h-screen flex items-center justify-center overflow-hidden w-full layout-stable'
      role='banner'
      aria-label='Hero section - Welcome to INAD PROMOTION'
    >
      {/* Video Background - Always render for accessibility */}
      <div className='absolute inset-0 w-full h-full' role='presentation'>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controlsList='nodownload nofullscreen noremoteplayback'
          className={`w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            isIntersecting ? 'opacity-100' : 'opacity-0'
          }`}
          poster='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1920&h=1080&fit=crop&auto=format&q=75'
          onLoadedData={handleVideoLoad}
          style={{
            touchAction: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
          }}
          aria-label='Background video showing INAD PROMOTION events and activities'
        >
          <source src='/bg.mp4' type='video/mp4' />
          <track
            kind='captions'
            src='/captions.vtt'
            srcLang='en'
            label='English'
            default
          />
          <p className='sr-only'>
            Your browser does not support the video tag. This video shows
            various INAD PROMOTION events and activities.
          </p>
        </video>

        {/* Video Controls for Accessibility - Only show when video is loaded */}
        {isVideoLoaded && (
          <div className='absolute top-4 right-4 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity duration-300'>
            <button
              onClick={handleVideoToggle}
              className='p-2 bg-dark-800/80 text-white rounded-full hover:bg-dark-700/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 transition-all duration-300'
              aria-label={
                isVideoPlaying
                  ? 'Pause background video'
                  : 'Play background video'
              }
              aria-pressed={!isVideoPlaying}
            >
              {isVideoPlaying ? (
                <FaPause className='w-4 h-4' />
              ) : (
                <FaPlay className='w-4 h-4' />
              )}
            </button>
            <button
              onClick={handleMuteToggle}
              className='p-2 bg-dark-800/80 text-white rounded-full hover:bg-dark-700/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 transition-all duration-300'
              aria-label={
                isVideoMuted
                  ? 'Unmute background video'
                  : 'Mute background video'
              }
              aria-pressed={isVideoMuted}
            >
              {isVideoMuted ? (
                <FaVolumeMute className='w-4 h-4' />
              ) : (
                <FaVolumeUp className='w-4 h-4' />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div
        className='absolute inset-0 bg-dark-900/60 backdrop-blur-sm'
        role='presentation'
        aria-hidden='true'
      />

      {/* Content */}
      <div className='relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full mobile-stable-layout'>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight mobile-text-stable'
          aria-level='1'
        >
          We Create
          <span className='block gradient-text'>Experiences</span>
          That Matter
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 mobile-text-stable'
          aria-label='Description of INAD PROMOTION services'
        >
          Transform your brand with immersive experiential marketing that
          captivates, engages, and leaves lasting impressions on your audience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2 w-full mobile-stable-layout'
          role='group'
          aria-label='Call to action buttons'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className='btn-primary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 mobile-fixed-dimensions focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900'
            onClick={scrollToContact}
            aria-label='Start your project - Contact us to begin working together'
          >
            Start Your Project
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className='btn-secondary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 mobile-fixed-dimensions focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900'
            onClick={scrollToPortfolio}
            aria-label='View our work - See examples of our projects and campaigns'
          >
            View Our Work
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className='absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 mobile-fixed-dimensions'
        role='navigation'
        aria-label='Scroll to next section'
      >
        <motion.button
          ref={scrollButtonRef}
          onClick={scrollToNext}
          onKeyDown={handleKeyDown}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className='text-white hover:text-primary-400 transition-colors duration-300 mobile-fixed-dimensions focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 rounded-full p-2'
          aria-label='Scroll down to learn more about INAD PROMOTION'
          aria-describedby='scroll-description'
        >
          <FaChevronDown className='text-xl sm:text-2xl' />
          <span id='scroll-description' className='sr-only'>
            Click or press Enter to scroll down to the next section
          </span>
        </motion.button>
      </motion.div>

      {/* Skip to main content link for screen readers */}
      <a
        href='#about'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-500 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900'
        onClick={e => {
          e.preventDefault();
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Skip to main content
      </a>
    </section>
  );
};

export default Hero;
