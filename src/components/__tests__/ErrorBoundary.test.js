import React from 'react';

import { render, screen, fireEvent } from '../../utils/test-utils';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal component</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('Normal Rendering', () => {
    test('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal component')).toBeInTheDocument();
    });

    test('does not show error UI when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(
        screen.queryByText('Something went wrong')
      ).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('catches errors and shows error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(/We're sorry, but something unexpected happened/)
      ).toBeInTheDocument();
    });

    test('generates unique error ID when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorIdElement = screen.getByText(/Error ID:/);
      expect(errorIdElement).toBeInTheDocument();

      const errorId = errorIdElement.textContent.match(/Error ID: (.+)/)[1];
      expect(errorId).toMatch(/^error-\d+-\w+$/);
    });

    test('logs error to console in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error UI Elements', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    test('displays error icon', () => {
      const errorIcon = screen.getByRole('img', { hidden: true });
      expect(errorIcon).toBeInTheDocument();
    });

    test('shows error title', () => {
      const title = screen.getByText('Something went wrong');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
    });

    test('shows error description', () => {
      const description = screen.getByText(
        /We're sorry, but something unexpected happened/
      );
      expect(description).toBeInTheDocument();
    });

    test('displays error ID', () => {
      const errorIdText = screen.getByText(/Error ID:/);
      expect(errorIdText).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    test('renders Try Again button', () => {
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
      expect(tryAgainButton).toHaveClass('bg-blue-600');
    });

    test('renders Go to Homepage button', () => {
      const homeButton = screen.getByRole('button', {
        name: /go to homepage/i,
      });
      expect(homeButton).toBeInTheDocument();
      expect(homeButton).toHaveClass('bg-gray-200');
    });

    test('renders Report This Error button', () => {
      const reportButton = screen.getByRole('button', {
        name: /report this error/i,
      });
      expect(reportButton).toBeInTheDocument();
      expect(reportButton).toHaveClass('bg-red-600');
    });
  });

  describe('Button Functionality', () => {
    beforeEach(() => {
      // Mock window methods
      Object.defineProperty(window, 'location', {
        value: {
          reload: jest.fn(),
          href: 'https://example.com',
        },
        writable: true,
      });

      // Mock alert
      global.alert = jest.fn();

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    test('Try Again button reloads the page', () => {
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(tryAgainButton);

      expect(window.location.reload).toHaveBeenCalled();
    });

    test('Go to Homepage button navigates to home', () => {
      const homeButton = screen.getByRole('button', {
        name: /go to homepage/i,
      });
      fireEvent.click(homeButton);

      expect(window.location.href).toBe('/');
    });

    test('Report This Error button shows alert with error ID', () => {
      const reportButton = screen.getByRole('button', {
        name: /report this error/i,
      });
      fireEvent.click(reportButton);

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringMatching(/Error reported with ID: error-\d+-\w+/)
      );
    });
  });

  describe('Development Mode Features', () => {
    test('shows error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const detailsElement = screen.getByText(
        /Show Error Details \(Development\)/
      );
      expect(detailsElement).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    test('hides error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const detailsElement = screen.queryByText(/Show Error Details/);
      expect(detailsElement).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Reporting', () => {
    test('creates comprehensive error report', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reportButton = screen.getByRole('button', {
        name: /report this error/i,
      });
      fireEvent.click(reportButton);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error Report:',
        expect.objectContaining({
          errorId: expect.stringMatching(/^error-\d+-\w+$/),
          message: 'Test error message',
          timestamp: expect.any(String),
          userAgent: expect.any(String),
          url: expect.any(String),
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    test('has proper semantic structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('Something went wrong');
    });

    test('buttons have proper ARIA labels', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Styling and Layout', () => {
    test('applies proper CSS classes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const container = screen.getByText('Something went wrong').closest('div');
      expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
    });

    test('has responsive design classes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const mainContainer = screen
        .getByText('Something went wrong')
        .closest('div');
      expect(mainContainer).toHaveClass(
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });
});
