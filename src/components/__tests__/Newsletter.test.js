import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import Newsletter from '../Newsletter';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  useInView: () => [jest.fn(), true],
}));

// Mock react-intersection-observer
jest.mock('react-intersection-observer', () => ({
  useInView: () => [jest.fn(), true],
}));

describe('Newsletter Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders newsletter section with correct heading', () => {
    render(<Newsletter />);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/Stay Connected/i)).toBeInTheDocument();
  });

  test('renders newsletter description', () => {
    render(<Newsletter />);

    expect(screen.getByText(/Get the latest insights/i)).toBeInTheDocument();
    expect(screen.getByText(/Join our community/i)).toBeInTheDocument();
  });

  test('renders email input field', () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  test('renders subscribe button', () => {
    render(<Newsletter />);

    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
    expect(subscribeButton).toBeInTheDocument();
    expect(subscribeButton).toHaveAttribute('type', 'submit');
  });

  test('renders privacy notice', () => {
    render(<Newsletter />);

    expect(
      screen.getByText(/We'll never share your email/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/By subscribing, you agree/i)).toBeInTheDocument();
  });

  test('shows error for empty email submission', async () => {
    render(<Newsletter />);

    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    await act(async () => {
      fireEvent.click(subscribeButton);
    });

    expect(
      screen.getByText(/Please enter your email address/i)
    ).toBeInTheDocument();
  });

  test('shows error for invalid email format', async () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(subscribeButton);
    });

    expect(
      screen.getByText(/Please enter a valid email address/i)
    ).toBeInTheDocument();
  });

  test('accepts valid email format', async () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  test('clears error when user starts typing', async () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Submit with empty email to show error
    await act(async () => {
      fireEvent.click(subscribeButton);
    });

    expect(
      screen.getByText(/Please enter your email address/i)
    ).toBeInTheDocument();

    // Start typing to clear error
    fireEvent.change(emailInput, { target: { value: 't' } });

    expect(
      screen.queryByText(/Please enter your email address/i)
    ).not.toBeInTheDocument();
  });

  test('handles successful subscription', async () => {
    // Mock setTimeout
    jest.useFakeTimers();

    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Fill and submit form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.click(subscribeButton);
    });

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText(/Welcome to the Family!/i)).toBeInTheDocument();
    });

    // Fast-forward timers to test auto-reset
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Form should reset
    await waitFor(() => {
      expect(
        screen.queryByText(/Welcome to the Family!/i)
      ).not.toBeInTheDocument();
      expect(emailInput.value).toBe('');
    });

    jest.useRealTimers();
  });

  test('shows loading state during submission', async () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.click(subscribeButton);
    });

    expect(screen.getByText(/Subscribing.../i)).toBeInTheDocument();
    expect(subscribeButton).toBeDisabled();
  });

  test('handles submission error gracefully', async () => {
    // Mock fetch to simulate error
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.click(subscribeButton);
    });

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to subscribe/i)).toBeInTheDocument();
    });

    // Clean up
    global.fetch.mockRestore();
  });

  test('supports keyboard navigation', async () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Test Enter key submission
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.keyDown(emailInput, { key: 'Enter' });
    });

    // Should trigger submission
    await waitFor(() => {
      expect(screen.getByText(/Welcome to the Family!/i)).toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Email input accessibility
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby');

    // Subscribe button accessibility
    expect(subscribeButton).toHaveAttribute('type', 'submit');
  });

  test('shows help text for email field', () => {
    render(<Newsletter />);

    expect(
      screen.getByText(/We'll never share your email with anyone else/i)
    ).toBeInTheDocument();
  });

  test('handles email length validation', async () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Test very long email
    const longEmail = `${'a'.repeat(100)}@example.com`;
    fireEvent.change(emailInput, { target: { value: longEmail } });

    await act(async () => {
      fireEvent.click(subscribeButton);
    });

    // Should still accept long emails (no length restriction in current implementation)
    expect(screen.queryByText(/email.*too long/i)).not.toBeInTheDocument();
  });

  test('maintains focus management', async () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });

    // Component should focus email input when it comes into view
    expect(emailInput).toHaveFocus();
  });

  test('renders with proper ARIA labels', () => {
    render(<Newsletter />);

    expect(
      screen.getByRole('region', { name: /newsletter subscription/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('form', { name: /newsletter subscription form/i })
    ).toBeInTheDocument();
  });

  test('handles multiple rapid submissions', async () => {
    render(<Newsletter />);

    const emailInput = screen.getByRole('textbox', {
      name: /email address for newsletter subscription/i,
    });
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Submit multiple times rapidly
    await act(async () => {
      fireEvent.click(subscribeButton);
      fireEvent.click(subscribeButton);
      fireEvent.click(subscribeButton);
    });

    // Should handle gracefully (button should be disabled during submission)
    expect(subscribeButton).toBeDisabled();
  });
});
