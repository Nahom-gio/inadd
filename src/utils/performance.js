// Performance utility functions for the INAD PROMOTION website
import React from 'react';

// Lazy loading utilities
export const lazyLoading = {
  // Intersection Observer for lazy loading elements
  createObserver: (callback, options = {}) => {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    };

    return new IntersectionObserver(callback, defaultOptions);
  },

  // Lazy load images
  lazyLoadImage: (imgElement, src, placeholder = null) => {
    if (!imgElement) return;

    const observer = lazyLoading.createObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    observer.observe(imgElement);
  },

  // Lazy load background images
  lazyLoadBackground: (element, backgroundUrl, placeholder = null) => {
    if (!element) return;

    const observer = lazyLoading.createObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.backgroundImage = `url(${backgroundUrl})`;
          el.classList.remove('lazy-bg');
          observer.unobserve(el);
        }
      });
    });

    observer.observe(element);
  },

  // Lazy load videos
  lazyLoadVideo: (videoElement, src, poster = null) => {
    if (!videoElement) return;

    const observer = lazyLoading.createObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.src = src;
          if (poster) video.poster = poster;
          video.classList.remove('lazy-video');
          observer.unobserve(video);
        }
      });
    });

    observer.observe(videoElement);
  },
};

// Debouncing utilities
export const debounce = {
  // Debounce function calls
  debounce: (func, wait, immediate = false) => {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };

      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) func(...args);
    };
  },

  // Debounce scroll events
  debounceScroll: (callback, wait = 16) => {
    return debounce.debounce(callback, wait);
  },

  // Debounce resize events
  debounceResize: (callback, wait = 100) => {
    return debounce.debounce(callback, wait);
  },

  // Debounce input events
  debounceInput: (callback, wait = 300) => {
    return debounce.debounce(callback, wait);
  },

  // Debounce search queries
  debounceSearch: (callback, wait = 500) => {
    return debounce.debounce(callback, wait);
  },
};

// Throttling utilities
export const throttle = {
  // Throttle function calls
  throttle: (func, limit) => {
    let inThrottle;

    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Throttle scroll events
  throttleScroll: (callback, limit = 16) => {
    return throttle.throttle(callback, limit);
  },

  // Throttle resize events
  throttleResize: (callback, limit = 100) => {
    return throttle.throttle(callback, limit);
  },

  // Throttle mouse move events
  throttleMouseMove: (callback, limit = 16) => {
    return throttle.throttle(callback, limit);
  },
};

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image srcset
  generateSrcSet: (baseUrl, widths = [320, 640, 960, 1280, 1920]) => {
    return widths.map(width => `${baseUrl}?w=${width} ${width}w`).join(', ');
  },

  // Generate responsive image sizes
  generateSizes: (
    breakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    }
  ) => {
    return `${Object.entries(breakpoints)
      .map(([breakpoint, width]) => `(min-width: ${width}) ${width}`)
      .join(', ')}, 100vw`;
  },

  // Preload critical images
  preloadImage: (src, as = 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = as;
    document.head.appendChild(link);
  },

  // Preload critical fonts
  preloadFont: (src, type = 'font/woff2') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'font';
    link.type = type;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  },

  // Check if image is cached
  isImageCached: src => {
    const img = new Image();
    img.src = src;
    return img.complete;
  },

  // Optimize image loading
  optimizeImageLoading: (imgElement, options = {}) => {
    const {
      src,
      srcset,
      sizes,
      placeholder,
      lazy = true,
      preload = false,
    } = options;

    if (preload && src) {
      imageOptimization.preloadImage(src);
    }

    if (lazy) {
      imgElement.classList.add('lazy');
      if (placeholder) imgElement.src = placeholder;
      lazyLoading.lazyLoadImage(imgElement, src);
    } else {
      imgElement.src = src;
    }

    if (srcset) imgElement.srcset = srcset;
    if (sizes) imgElement.sizes = sizes;
  },
};

// Animation performance utilities
export const animationPerformance = {
  // Check if element is in viewport
  isInViewport: element => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Optimize animations with requestAnimationFrame
  animateWithRAF: callback => {
    let animationId;

    const animate = () => {
      callback();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  },

  // Pause animations when not visible
  pauseAnimationsWhenHidden: element => {
    if (!element) return;

    const observer = lazyLoading.createObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.style.animationPlayState = 'running';
        } else {
          element.style.animationPlayState = 'paused';
        }
      });
    });

    observer.observe(element);
    return observer;
  },

  // Reduce motion for performance
  reduceMotion: element => {
    if (!element) return;

    element.style.animationDuration = '0.01ms';
    element.style.transitionDuration = '0.01ms';
  },
};

// Memory management utilities
export const memoryManagement = {
  // Cleanup event listeners
  cleanupEventListeners: (element, events = []) => {
    if (!element) return;

    events.forEach(event => {
      element.removeEventListener(event.type, event.handler);
    });
  },

  // Cleanup observers
  cleanupObservers: (observers = []) => {
    observers.forEach(observer => {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    });
  },

  // Cleanup timeouts
  cleanupTimeouts: (timeouts = []) => {
    timeouts.forEach(timeoutId => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });
  },

  // Cleanup intervals
  cleanupIntervals: (intervals = []) => {
    intervals.forEach(intervalId => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });
  },
};

// Bundle optimization utilities
export const bundleOptimization = {
  // Dynamic imports for code splitting
  dynamicImport: (importFn, fallback = null) => {
    return importFn().catch(() => fallback);
  },

  // Lazy load components
  lazyLoadComponent: (importFn, fallback = null) => {
    return React.lazy(() => importFn().catch(() => fallback));
  },

  // Preload critical chunks
  preloadChunk: chunkName => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `/static/js/${chunkName}.js`;
    document.head.appendChild(link);
  },
};

// Network optimization utilities
export const networkOptimization = {
  // Check connection speed
  getConnectionSpeed: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
    return null;
  },

  // Adjust quality based on connection
  adjustQualityForConnection: (defaultQuality = 'high') => {
    const connection = networkOptimization.getConnectionSpeed();

    if (!connection) return defaultQuality;

    if (connection.saveData) return 'low';
    if (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g'
    )
      return 'low';
    if (connection.effectiveType === '3g') return 'medium';

    return defaultQuality;
  },

  // Preconnect to external domains
  preconnect: domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  },

  // DNS prefetch
  dnsPrefetch: domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  },
};

// Performance monitoring utilities
export const performanceMonitoring = {
  // Measure function execution time
  measureExecution: (fn, name = 'Function') => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },

  // Measure component render time
  measureRender: componentName => {
    const start = performance.now();

    return () => {
      const end = performance.now();
      console.log(`${componentName} rendered in ${end - start} milliseconds`);
    };
  },

  // Monitor memory usage
  getMemoryUsage: () => {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  },

  // Monitor frame rate
  monitorFrameRate: callback => {
    let frameCount = 0;
    let lastTime = performance.now();

    const countFrames = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        callback(fps);
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(countFrames);
    };

    requestAnimationFrame(countFrames);
  },
};

// Performance monitoring utility for tracking Core Web Vitals and other metrics

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.isInitialized = false;
    this.cleanupFunctions = [];
    this.memoryCheckInterval = null;
    this.frameRateMonitor = null;
  }

  // Initialize performance monitoring
  init() {
    if (this.isInitialized) return;

    try {
      this.setupWebVitals();
      this.setupPerformanceObserver();
      this.setupResourceTiming();
      this.setupUserTiming();
      this.setupMemoryMonitoring();
      this.isInitialized = true;

      if (process.env.NODE_ENV === 'development') {
        console.log('Performance monitoring initialized');
      }
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
    }
  }

  // Setup Core Web Vitals monitoring
  setupWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP monitoring failed:', error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.reportMetric('FID', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID monitoring failed:', error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.cls = clsValue;
              this.reportMetric('CLS', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS monitoring failed:', error);
      }
    }
  }

  // Setup Performance Observer for other metrics
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      try {
        // Navigation timing
        const navigationObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
              this.metrics.navigation = {
                dns: entry.domainLookupEnd - entry.domainLookupStart,
                tcp: entry.connectEnd - entry.connectStart,
                ttfb: entry.responseStart - entry.requestStart,
                domContentLoaded:
                  entry.domContentLoadedEventEnd - entry.navigationStart,
                loadComplete: entry.loadEventEnd - entry.navigationStart,
              };
              this.reportMetric('Navigation', this.metrics.navigation);
            }
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);

        // Paint timing
        const paintObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'first-paint') {
              this.metrics.fp = entry.startTime;
              this.reportMetric('FP', entry.startTime);
            }
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.reportMetric('FCP', entry.startTime);
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('Performance observer setup failed:', error);
      }
    }
  }

  // Setup resource timing monitoring
  setupResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (
              entry.initiatorType === 'img' ||
              entry.initiatorType === 'video'
            ) {
              // Limit stored resources to prevent memory leaks
              if (!this.metrics.resources) {
                this.metrics.resources = [];
              }

              // Keep only last 50 resource entries
              if (this.metrics.resources.length >= 50) {
                this.metrics.resources.shift();
              }

              this.metrics.resources.push({
                name: entry.name,
                type: entry.initiatorType,
                duration: entry.duration,
                size: entry.transferSize || 0,
              });
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource timing monitoring failed:', error);
      }
    }
  }

  // Setup custom user timing
  setupUserTiming() {
    // Monitor React component render times
    if (
      window.React &&
      window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    ) {
      this.monitorReactPerformance();
    }
  }

  // Monitor React performance
  monitorReactPerformance() {
    try {
      const originalRender =
        window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
          .Reconciler;
      if (originalRender && originalRender.performWork) {
        const originalPerformWork = originalRender.performWork;
        originalRender.performWork = function (...args) {
          const start = performance.now();
          const result = originalPerformWork.apply(this, args);
          const duration = performance.now() - start;

          if (duration > 16) {
            // Longer than one frame (16.67ms)
            this.reportMetric('ReactWork', duration);
          }

          return result;
        }.bind(this);

        // Store cleanup function
        this.cleanupFunctions.push(() => {
          if (originalRender && originalRender.performWork) {
            originalRender.performWork = originalPerformWork;
          }
        });
      }
    } catch (error) {
      console.warn('React performance monitoring failed:', error);
    }
  }

  // Setup memory monitoring with cleanup
  setupMemoryMonitoring() {
    if ('memory' in performance) {
      // Check memory every 30 seconds instead of continuously
      this.memoryCheckInterval = setInterval(() => {
        const memory = performance.memory;
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

        // Only store memory data if usage is high to prevent memory leaks
        if (memoryUsage > 0.7) {
          this.metrics.memory = {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            usage: memoryUsage,
          };
          this.reportMetric('Memory Usage', memoryUsage);
        }
      }, 30000); // 30 seconds
    }
  }

  // Report metric to analytics
  reportMetric(name, value) {
    try {
      // Limit stored metrics to prevent memory leaks
      if (!this.metrics[name]) {
        this.metrics[name] = [];
      }

      // Keep only last 100 entries for each metric
      if (this.metrics[name].length >= 100) {
        this.metrics[name].shift();
      }

      this.metrics[name].push({
        value,
        timestamp: Date.now(),
      });

      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_metric', {
          metric_name: name,
          metric_value: value,
          page_location: window.location.href,
        });
      }

      // Send to custom analytics endpoint
      this.sendToAnalytics(name, value);

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance Metric - ${name}:`, value);
      }
    } catch (error) {
      console.warn('Failed to report metric:', error);
    }
  }

  // Send metrics to analytics endpoint
  async sendToAnalytics(name, value) {
    try {
      const data = {
        metric: name,
        value,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        connection: navigator.connection
          ? {
              effectiveType: navigator.connection.effectiveType,
              downlink: navigator.connection.downlink,
              rtt: navigator.connection.rtt,
            }
          : null,
      };

      // Use fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.warn('Failed to send performance data:', error);
      }
    }
  }

  // Get current metrics
  getMetrics() {
    return { ...this.metrics };
  }

  // Get Core Web Vitals
  getCoreWebVitals() {
    return {
      lcp: this.metrics.lcp,
      fid: this.metrics.fid,
      cls: this.metrics.cls,
      fcp: this.metrics.fcp,
    };
  }

  // Check if metrics meet thresholds
  checkThresholds() {
    const thresholds = {
      lcp: 2500, // 2.5 seconds
      fid: 100, // 100 milliseconds
      cls: 0.1, // 0.1
      fcp: 1800, // 1.8 seconds
    };

    const results = {};
    Object.keys(thresholds).forEach(metric => {
      if (this.metrics[metric] !== undefined) {
        results[metric] = {
          value: this.metrics[metric],
          threshold: thresholds[metric],
          passed: this.metrics[metric] <= thresholds[metric],
        };
      }
    });

    return results;
  }

  // Measure custom timing
  measure(name, fn) {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.metrics[name] = duration;
    this.reportMetric(name, duration);

    return result;
  }

  // Measure async operations
  async measureAsync(name, fn) {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    this.metrics[name] = duration;
    this.reportMetric(name, duration);

    return result;
  }

  // Cleanup observers and intervals
  destroy() {
    // Disconnect all observers
    this.observers.forEach(observer => {
      try {
        if (observer && typeof observer.disconnect === 'function') {
          observer.disconnect();
        }
      } catch (error) {
        console.warn('Failed to disconnect observer:', error);
      }
    });

    // Clear intervals
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }

    if (this.frameRateMonitor) {
      cancelAnimationFrame(this.frameRateMonitor);
      this.frameRateMonitor = null;
    }

    // Execute cleanup functions
    this.cleanupFunctions.forEach(cleanupFn => {
      try {
        if (typeof cleanupFn === 'function') {
          cleanupFn();
        }
      } catch (error) {
        console.warn('Failed to execute cleanup function:', error);
      }
    });

    // Clear stored data
    this.observers = [];
    this.cleanupFunctions = [];
    this.metrics = {};
    this.isInitialized = false;

    if (process.env.NODE_ENV === 'development') {
      console.log('Performance monitoring destroyed and cleaned up');
    }
  }

  // Cleanup method for component unmounting
  cleanup() {
    this.destroy();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceMonitor.init();
    });
  } else {
    performanceMonitor.init();
  }
}

// Cleanup on page unload to prevent memory leaks
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.destroy();
  });

  // Also cleanup on page hide for mobile devices
  window.addEventListener('pagehide', () => {
    performanceMonitor.destroy();
  });
}

// Export functions for easy use
export const initPerformanceMonitoring = () => performanceMonitor.init();
export const getPerformanceMetrics = () => performanceMonitor.getMetrics();
export const getCoreWebVitals = () => performanceMonitor.getCoreWebVitals();
export const checkPerformanceThresholds = () =>
  performanceMonitor.checkThresholds();
export const measurePerformance = (name, fn) =>
  performanceMonitor.measure(name, fn);
export const measureAsyncPerformance = (name, fn) =>
  performanceMonitor.measureAsync(name, fn);
export const destroyPerformanceMonitoring = () => performanceMonitor.destroy();
export const cleanupPerformanceMonitoring = () => performanceMonitor.cleanup();

export default performanceMonitor;
