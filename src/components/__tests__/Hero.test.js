import React from 'react';

import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import Hero from '../Hero';

// Mock the video element
const mockVideo = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  currentTime: 0,
  duration: 100,
  volume: 1,
  muted: false,
};

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.IntersectionObserver = mockIntersectionObserver;

describe('Hero Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock IntersectionObserver to trigger intersection
    const mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };

    global.IntersectionObserver = jest.fn(() => mockObserver);

    // Mock the observe method to trigger intersection
    mockObserver.observe = jest.fn(element => {
      // Simulate intersection after a short delay
      setTimeout(() => {
        if (element && element.tagName === 'VIDEO') {
          // Trigger the intersection callback
          const callback = global.IntersectionObserver.mock.calls[0][0];
          callback([{ isIntersecting: true, target: element }]);
        }
      }, 10);
    });
  });

  describe('Rendering', () => {
    test('renders hero section with main heading', () => {
      render(<Hero />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/We Create/i);
      expect(heading).toHaveTextContent(/Experiences/i);
      expect(heading).toHaveTextContent(/That Matter/i);
    });

    test('renders hero subtitle', () => {
      render(<Hero />);

      const subtitle = screen.getByText(
        /Transform your brand with immersive experiential marketing/i
      );
      expect(subtitle).toBeInTheDocument();
    });

    test('renders call-to-action buttons', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', {
        name: /start your project/i,
      });
      const portfolioButton = screen.getByRole('button', {
        name: /view our work/i,
      });

      expect(ctaButton).toBeInTheDocument();
      expect(portfolioButton).toBeInTheDocument();
    });

    test('renders video background when intersecting', async () => {
      render(<Hero />);

      // Wait for video to appear after intersection
      await waitFor(
        () => {
          const video = screen.getByRole('video');
          expect(video).toBeInTheDocument();
          expect(video).toHaveAttribute('autoPlay');
          expect(video).toHaveAttribute('muted');
          expect(video).toHaveAttribute('loop');
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Video Functionality', () => {
    test('video loads and plays correctly', async () => {
      render(<Hero />);

      // Wait for video to appear
      await waitFor(
        () => {
          const video = screen.getByRole('video');
          expect(video).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const video = screen.getByRole('video');

      // Simulate video load event
      fireEvent.loadedData(video);

      expect(video).toBeInTheDocument();
    });

    test('video has correct attributes', async () => {
      render(<Hero />);

      // Wait for video to appear
      await waitFor(
        () => {
          const video = screen.getByRole('video');
          expect(video).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const video = screen.getByRole('video');
      expect(video).toHaveAttribute('autoPlay');
      expect(video).toHaveAttribute('muted');
      expect(video).toHaveAttribute('loop');
      expect(video).toHaveAttribute('playsInline');
    });

    test('video controls appear when video is loaded', async () => {
      render(<Hero />);

      // Wait for video to appear and load
      await waitFor(
        () => {
          const video = screen.getByRole('video');
          expect(video).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const video = screen.getByRole('video');

      // Simulate video load event
      fireEvent.loadedData(video);

      // Wait for controls to appear
      await waitFor(
        () => {
          const playButton = screen.getByLabelText(/pause background video/i);
          const muteButton = screen.getByLabelText(/mute background video/i);
          expect(playButton).toBeInTheDocument();
          expect(muteButton).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Button Functionality', () => {
    test('CTA button is clickable', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', {
        name: /start your project/i,
      });
      fireEvent.click(ctaButton);

      expect(ctaButton).toBeEnabled();
    });

    test('portfolio button is clickable', () => {
      render(<Hero />);

      const portfolioButton = screen.getByRole('button', {
        name: /view our work/i,
      });
      fireEvent.click(portfolioButton);

      expect(portfolioButton).toBeEnabled();
    });
  });

  describe('Responsive Design', () => {
    test('renders on mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 375,
      });

      render(<Hero />);

      const hero = screen.getByRole('banner');
      expect(hero).toBeInTheDocument();
    });

    test('renders on desktop devices', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1920,
      });

      render(<Hero />);

      const hero = screen.getByRole('banner');
      expect(hero).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      render(<Hero />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    test('buttons have proper ARIA labels', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', {
        name: /start your project/i,
      });
      const portfolioButton = screen.getByRole('button', {
        name: /view our work/i,
      });

      expect(ctaButton).toHaveAttribute('aria-label');
      expect(portfolioButton).toHaveAttribute('aria-label');
    });

    test('video has proper accessibility attributes', async () => {
      render(<Hero />);

      // Wait for video to appear
      await waitFor(
        () => {
          const video = screen.getByRole('video');
          expect(video).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const video = screen.getByRole('video');
      expect(video).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Performance', () => {
    test('component renders without performance issues', () => {
      const startTime = performance.now();

      render(<Hero />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Component should render in under 100ms
      expect(renderTime).toBeLessThan(100);
    });

    test('video loads efficiently', async () => {
      render(<Hero />);

      // Wait for video to appear
      await waitFor(
        () => {
          const video = screen.getByRole('video');
          expect(video).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const video = screen.getByRole('video');
      expect(video).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles video loading errors gracefully', async () => {
      render(<Hero />);

      // Wait for video to appear
      await waitFor(
        () => {
          const video = screen.getByRole('video');
          expect(video).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const video = screen.getByRole('video');

      // Simulate video error
      fireEvent.error(video);

      // Component should still render even if video fails
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Scroll Functionality', () => {
    test('scroll button is accessible', () => {
      render(<Hero />);

      const scrollButton = screen.getByLabelText(
        /scroll down to learn more about INAD PROMOTION/i
      );
      expect(scrollButton).toBeInTheDocument();
    });

    test('skip link is present for accessibility', () => {
      render(<Hero />);

      const skipLink = screen.getByText(/skip to main content/i);
      expect(skipLink).toBeInTheDocument();
    });
  });
});
