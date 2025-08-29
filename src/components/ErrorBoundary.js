import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
    this.maxRetries = 3;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Generate unique error ID for tracking
    const errorId = `error-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Enhanced error logging with more context
    const errorReport = {
      errorId,
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      componentStack: errorInfo?.componentStack || '',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer,
      performance: performance?.navigation
        ? {
            type: performance.navigation.type,
            redirectCount: performance.navigation.redirectCount,
          }
        : null,
      retryCount: this.state.retryCount,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Boundary Report');
      console.log('Error Details:', errorReport);
      console.groupEnd();
    }

    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorToMonitoring(errorReport);
    }

    // Store error in localStorage for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push(errorReport);
      localStorage.setItem('app_errors', JSON.stringify(errors.slice(-10))); // Keep last 10 errors
    }
  }

  // Send error to monitoring service
  async sendErrorToMonitoring(errorReport) {
    try {
      // In production, send to your error monitoring service
      // Example: Sentry, LogRocket, etc.
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: errorReport.message,
          fatal: true,
          custom_parameters: {
            error_id: errorReport.errorId,
            component_stack: errorReport.componentStack,
            retry_count: errorReport.retryCount,
          },
        });
      }
    } catch (error) {
      console.warn('Failed to send error to monitoring service:', error);
    }
  }

  // Reset error state and retry
  handleRetry() {
    const { retryCount } = this.state;

    if (retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: retryCount + 1,
      });
    } else {
      // After max retries, reload the page
      window.location.reload();
    }
  }

  handleReload() {
    window.location.reload();
  }

  handleGoHome() {
    window.location.href = '/';
  }

  handleReportError() {
    const { error, errorInfo, errorId } = this.state;

    // Create error report
    const errorReport = {
      errorId,
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      componentStack: errorInfo?.componentStack || '',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In production, you would send this to your error reporting service
    if (process.env.NODE_ENV === 'development') {
      console.log('Error Report:', errorReport);
    }

    // For now, just show an alert
    alert(
      `Error reported with ID: ${errorId}. Please contact support with this ID.`
    );
  }

  // Cleanup on unmount
  componentWillUnmount() {
    // Clear any stored errors to prevent memory leaks
    if (process.env.NODE_ENV === 'development') {
      localStorage.removeItem('app_errors');
    }
  }

  render() {
    if (this.state.hasError) {
      const { errorId, retryCount } = this.state;

      return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
          <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center'>
            <div className='mb-6'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4'>
                <svg
                  className='h-6 w-6 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                Something went wrong
              </h2>
              <p className='text-gray-600 mb-4'>
                We're sorry, but something unexpected happened. Our team has
                been notified.
              </p>
              {errorId && (
                <p className='text-sm text-gray-500 mb-2'>
                  Error ID:{' '}
                  <code className='bg-gray-100 px-2 py-1 rounded'>
                    {errorId}
                  </code>
                </p>
              )}
              {retryCount > 0 && (
                <p className='text-sm text-gray-500 mb-4'>
                  Retry attempt: {retryCount} of {this.maxRetries}
                </p>
              )}
            </div>

            <div className='space-y-3'>
              {retryCount < this.maxRetries ? (
                <button
                  onClick={this.handleRetry}
                  className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                >
                  Try Again
                </button>
              ) : (
                <button
                  onClick={this.handleReload}
                  className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                >
                  Reload Page
                </button>
              )}

              <button
                onClick={this.handleGoHome}
                className='w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
              >
                Go to Homepage
              </button>

              <button
                onClick={this.handleReportError}
                className='w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors'
              >
                Report This Error
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-6 text-left'>
                <summary className='cursor-pointer text-sm text-gray-600 hover:text-gray-800'>
                  Show Error Details (Development)
                </summary>
                <div className='mt-2 p-4 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40'>
                  <div className='mb-2'>
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className='whitespace-pre-wrap mt-1'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
