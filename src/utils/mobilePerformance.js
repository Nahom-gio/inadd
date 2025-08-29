// Mobile performance monitoring utility
class MobilePerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.cleanupFunctions = [];
    this.isLowEndDevice = this.detectLowEndDevice();
    this.isReducedMotion = this.detectReducedMotion();
    this.memoryCheckInterval = null;
    this.batteryCheckInterval = null;
    this.intersectionObserver = null;
    this.init();
  }

  // Detect low-end device capabilities
  detectLowEndDevice() {
    // Check device memory
    const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

    // Check CPU cores
    const hasLowCPU =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    // Check connection speed
    const hasSlowConnection =
      navigator.connection &&
      (navigator.connection.effectiveType === 'slow-2g' ||
        navigator.connection.effectiveType === '2g' ||
        navigator.connection.effectiveType === '3g');

    // Check screen size (smaller screens often indicate lower-end devices)
    const hasSmallScreen = window.innerWidth <= 768;

    return hasLowMemory || hasLowCPU || hasSlowConnection || hasSmallScreen;
  }

  // Detect reduced motion preference
  detectReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Initialize performance monitoring
  init() {
    this.setupPerformanceObserver();
    this.setupNetworkObserver();
    this.setupBatteryObserver();
    this.setupMemoryObserver();
    this.setupIntersectionObserver();
  }

  // Monitor Core Web Vitals
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.logMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported:', e);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.logMetric('FID', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported:', e);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.logMetric('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported:', e);
      }
    }
  }

  // Monitor network conditions
  setupNetworkObserver() {
    if ('connection' in navigator) {
      const connection = navigator.connection;

      this.metrics.network = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };

      // Listen for network changes
      const handleNetworkChange = () => {
        this.metrics.network = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        };
        this.logMetric('Network Change', this.metrics.network);
      };

      connection.addEventListener('change', handleNetworkChange);

      // Store cleanup function
      this.cleanupFunctions.push(() => {
        connection.removeEventListener('change', handleNetworkChange);
      });
    }
  }

  // Monitor battery status (if available)
  setupBatteryObserver() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        this.metrics.battery = {
          level: battery.level,
          charging: battery.charging,
        };

        const handleBatteryLevelChange = () => {
          this.metrics.battery.level = battery.level;
          this.logMetric('Battery Level', battery.level);
        };

        const handleBatteryChargingChange = () => {
          this.metrics.battery.charging = battery.charging;
          this.logMetric('Battery Charging', battery.charging);
        };

        battery.addEventListener('levelchange', handleBatteryLevelChange);
        battery.addEventListener('chargingchange', handleBatteryChargingChange);

        // Store cleanup functions
        this.cleanupFunctions.push(() => {
          battery.removeEventListener('levelchange', handleBatteryLevelChange);
          battery.removeEventListener(
            'chargingchange',
            handleBatteryChargingChange
          );
        });
      });
    }
  }

  // Monitor memory usage (if available)
  setupMemoryObserver() {
    if ('memory' in performance) {
      const memory = performance.memory;

      // Check memory every 30 seconds instead of continuously to prevent memory leaks
      this.memoryCheckInterval = setInterval(() => {
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

        // Only store memory data if usage is high to prevent memory accumulation
        if (memoryUsage > 0.7) {
          this.metrics.memory = {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            usage: memoryUsage,
          };

          // Warn if memory usage is high
          if (memoryUsage > 0.8) {
            this.logMetric('High Memory Usage', memoryUsage);
          }
        }
      }, 30000); // 30 seconds
    }
  }

  // Monitor intersection for performance optimization
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      // Monitor elements entering viewport for lazy loading optimization
      this.intersectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Element is now visible, could trigger lazy loading
              this.logMetric('Element Visible', entry.target.tagName);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );
    }
  }

  // Log performance metrics with memory management
  logMetric(name, value) {
    const timestamp = Date.now();
    const metric = {
      name,
      value,
      timestamp,
      deviceInfo: {
        isLowEnd: this.isLowEndDevice,
        isReducedMotion: this.isReducedMotion,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
    };

    // Store metric with size limits to prevent memory leaks
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }

    // Keep only last 50 entries for each metric to prevent memory accumulation
    if (this.metrics[name].length >= 50) {
      this.metrics[name].shift();
    }

    this.metrics[name].push(metric);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric - ${name}:`, value);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    }

    // Trigger performance warnings
    this.checkPerformanceWarnings(name, value);
  }

  // Check for performance issues and provide recommendations
  checkPerformanceWarnings(name, value) {
    const warnings = [];

    // LCP warnings
    if (name === 'LCP' && value > 2500) {
      warnings.push({
        type: 'warning',
        message:
          'LCP is above 2.5s threshold. Consider optimizing images and reducing render-blocking resources.',
        metric: 'LCP',
        value,
        threshold: 2500,
      });
    }

    // FID warnings
    if (name === 'FID' && value > 100) {
      warnings.push({
        type: 'warning',
        message:
          'FID is above 100ms threshold. Consider reducing JavaScript execution time.',
        metric: 'FID',
        value,
        threshold: 100,
      });
    }

    // CLS warnings
    if (name === 'CLS' && value > 0.1) {
      warnings.push({
        type: 'warning',
        message: 'CLS is above 0.1 threshold. Consider fixing layout shifts.',
        metric: 'CLS',
        value,
        threshold: 0.1,
      });
    }

    // Memory warnings
    if (name === 'High Memory Usage' && value > 0.9) {
      warnings.push({
        type: 'error',
        message:
          'Memory usage is critically high. Consider implementing memory cleanup.',
        metric: 'Memory Usage',
        value,
        threshold: 0.9,
      });
    }

    // Log warnings
    warnings.forEach(warning => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Performance Warning - ${warning.message}`, warning);
      }
    });

    return warnings;
  }

  // Send metrics to analytics service
  sendToAnalytics(metric) {
    // In production, send to your analytics service
    // Example: Google Analytics, Mixpanel, etc.
    try {
      // Simulate sending to analytics
      if (window.gtag) {
        window.gtag('event', 'performance_metric', {
          metric_name: metric.name,
          metric_value: metric.value,
          device_low_end: metric.deviceInfo.isLowEnd,
          reduced_motion: metric.deviceInfo.isReducedMotion,
        });
      }
    } catch (error) {
      console.warn('Failed to send metric to analytics:', error);
    }
  }

  // Get current performance score
  getPerformanceScore() {
    const scores = {
      lcp: this.getLCPScore(),
      fid: this.getFIDScore(),
      cls: this.getCLSScore(),
    };

    const averageScore =
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Object.keys(scores).length;

    return {
      overall: Math.round(averageScore),
      lcp: scores.lcp,
      fid: scores.fid,
      cls: scores.cls,
      isLowEndDevice: this.isLowEndDevice,
      recommendations: this.getRecommendations(scores),
    };
  }

  // Calculate individual metric scores
  getLCPScore() {
    const lcp = this.metrics.lcp || 0;
    if (lcp <= 2500) return 100;
    if (lcp <= 4000) return 75;
    if (lcp <= 6000) return 50;
    return 25;
  }

  getFIDScore() {
    const fid = this.metrics.fid || 0;
    if (fid <= 100) return 100;
    if (fid <= 300) return 75;
    if (fid <= 500) return 50;
    return 25;
  }

  getCLSScore() {
    const cls = this.metrics.cls || 0;
    if (cls <= 0.1) return 100;
    if (cls <= 0.25) return 75;
    if (cls <= 0.5) return 50;
    return 25;
  }

  // Get performance recommendations
  getRecommendations(scores) {
    const recommendations = [];

    if (scores.lcp < 75) {
      recommendations.push(
        'Optimize images and reduce render-blocking resources'
      );
    }

    if (scores.fid < 75) {
      recommendations.push(
        'Reduce JavaScript execution time and break up long tasks'
      );
    }

    if (scores.cls < 75) {
      recommendations.push(
        'Fix layout shifts by reserving space for dynamic content'
      );
    }

    if (this.isLowEndDevice) {
      recommendations.push(
        'Consider implementing progressive enhancement for low-end devices'
      );
    }

    return recommendations;
  }

  // Cleanup observers and intervals to prevent memory leaks
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

    // Disconnect intersection observer
    if (this.intersectionObserver) {
      try {
        this.intersectionObserver.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect intersection observer:', error);
      }
    }

    // Clear intervals
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }

    if (this.batteryCheckInterval) {
      clearInterval(this.batteryCheckInterval);
      this.batteryCheckInterval = null;
    }

    // Execute cleanup functions
    if (this.cleanupFunctions) {
      this.cleanupFunctions.forEach(cleanupFn => {
        try {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        } catch (error) {
          console.warn('Failed to execute cleanup function:', error);
        }
      });
    }

    // Clear stored data
    this.observers = [];
    this.cleanupFunctions = [];
    this.metrics = {};

    if (process.env.NODE_ENV === 'development') {
      console.log('Mobile performance monitoring destroyed and cleaned up');
    }
  }

  // Get all metrics
  getMetrics() {
    return this.metrics;
  }

  // Get device capabilities
  getDeviceCapabilities() {
    return {
      isLowEndDevice: this.isLowEndDevice,
      isReducedMotion: this.isReducedMotion,
      network: this.metrics.network,
      memory: this.metrics.memory,
      battery: this.metrics.battery,
    };
  }
}

// Create singleton instance
const performanceMonitor = new MobilePerformanceMonitor();

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

// Export the instance and class
export default performanceMonitor;
export { MobilePerformanceMonitor };
