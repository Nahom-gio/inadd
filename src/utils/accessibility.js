// Accessibility utility functions for the INAD PROMOTION website

// Focus management utilities
export const focusManager = {
  // Trap focus within a container
  trapFocus: (container, firstFocusable, lastFocusable) => {
    if (!container || !firstFocusable || !lastFocusable) return;

    const handleTabKey = e => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  },

  // Focus first focusable element in a container
  focusFirst: container => {
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  },

  // Focus last focusable element in a container
  focusLast: container => {
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  },

  // Store and restore focus
  storeFocus: () => {
    return document.activeElement;
  },

  restoreFocus: element => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  },
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle arrow key navigation in lists
  handleArrowKeys: (currentIndex, itemCount, onIndexChange) => {
    return e => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          onIndexChange(Math.min(currentIndex + 1, itemCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          onIndexChange(Math.max(currentIndex - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          onIndexChange(0);
          break;
        case 'End':
          e.preventDefault();
          onIndexChange(itemCount - 1);
          break;
      }
    };
  },

  // Handle enter and space key activation
  handleActivation: onActivate => {
    return e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    };
  },

  // Handle escape key
  handleEscape: onEscape => {
    return e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
      }
    };
  },
};

// Screen reader utilities
export const screenReader = {
  // Announce text to screen readers
  announce: (message, priority = 'polite') => {
    // Create a live region for announcements
    let liveRegion = document.getElementById('sr-announcements');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'sr-announcements';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Clear previous announcements
    liveRegion.textContent = '';

    // Set new announcement
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  },

  // Announce form errors
  announceErrors: errors => {
    const errorCount = Object.keys(errors).length;
    const message = `Form validation failed. ${errorCount} field${
      errorCount > 1 ? 's have' : ' has'
    } errors.`;
    screenReader.announce(message, 'assertive');
  },

  // Announce form submission status
  announceStatus: (status, message) => {
    const statusMessage = `${status}: ${message}`;
    screenReader.announce(statusMessage, 'polite');
  },
};

// ARIA utilities
export const ariaUtils = {
  // Set ARIA expanded state
  setExpanded: (element, expanded) => {
    if (element) {
      element.setAttribute('aria-expanded', expanded.toString());
    }
  },

  // Set ARIA pressed state
  setPressed: (element, pressed) => {
    if (element) {
      element.setAttribute('aria-pressed', pressed.toString());
    }
  },

  // Set ARIA selected state
  setSelected: (element, selected) => {
    if (element) {
      element.setAttribute('aria-selected', selected.toString());
    }
  },

  // Set ARIA invalid state
  setInvalid: (element, invalid) => {
    if (element) {
      element.setAttribute('aria-invalid', invalid.toString());
    }
  },

  // Set ARIA required state
  setRequired: (element, required) => {
    if (element) {
      element.setAttribute('aria-required', required.toString());
    }
  },

  // Set ARIA describedby
  setDescribedBy: (element, describedBy) => {
    if (element) {
      element.setAttribute('aria-describedby', describedBy);
    }
  },

  // Set ARIA controls
  setControls: (element, controls) => {
    if (element) {
      element.setAttribute('aria-controls', controls);
    }
  },

  // Set ARIA label
  setLabel: (element, label) => {
    if (element) {
      element.setAttribute('aria-label', label);
    }
  },
};

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getLuminance: (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio
  getContrastRatio: (l1, l2) => {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  // Check if contrast meets WCAG AA standards
  meetsWCAGAA: (contrastRatio, isLargeText = false) => {
    const threshold = isLargeText ? 3 : 4.5;
    return contrastRatio >= threshold;
  },

  // Check if contrast meets WCAG AAA standards
  meetsWCAGAAA: (contrastRatio, isLargeText = false) => {
    const threshold = isLargeText ? 4.5 : 7;
    return contrastRatio >= threshold;
  },
};

// Touch target utilities
export const touchTargets = {
  // Minimum touch target size (44px for mobile)
  MIN_SIZE: 44,

  // Check if element meets minimum touch target size
  meetsMinimumSize: element => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const minSize = touchTargets.MIN_SIZE;

    return rect.width >= minSize && rect.height >= minSize;
  },

  // Add padding to ensure minimum touch target size
  ensureMinimumSize: element => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const minSize = touchTargets.MIN_SIZE;

    if (rect.width < minSize || rect.height < minSize) {
      const currentPadding =
        parseInt(window.getComputedStyle(element).padding) || 0;
      const neededPadding = Math.max(
        0,
        (minSize - Math.min(rect.width, rect.height)) / 2
      );

      element.style.padding = `${currentPadding + neededPadding}px`;
    }
  },
};

// Animation accessibility utilities
export const animationAccessibility = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Disable animations if user prefers reduced motion
  disableAnimations: element => {
    if (animationAccessibility.prefersReducedMotion()) {
      element.style.animation = 'none';
      element.style.transition = 'none';
    }
  },

  // Apply reduced motion styles
  applyReducedMotion: () => {
    if (animationAccessibility.prefersReducedMotion()) {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  },
};

// Form accessibility utilities
export const formAccessibility = {
  // Validate form field accessibility
  validateField: field => {
    const issues = [];

    if (!field.id) {
      issues.push('Field missing ID attribute');
    }

    if (
      !field.getAttribute('aria-label') &&
      !field.getAttribute('aria-labelledby')
    ) {
      const label = document.querySelector(`label[for="${field.id}"]`);
      if (!label) {
        issues.push('Field missing label or aria-label');
      }
    }

    if (field.required && !field.getAttribute('aria-required')) {
      issues.push('Required field missing aria-required attribute');
    }

    return issues;
  },

  // Add error announcements to form fields
  addErrorAnnouncement: (field, errorMessage) => {
    const errorId = `${field.id}-error`;
    const errorElement = document.getElementById(errorId);

    if (!errorElement) {
      const error = document.createElement('div');
      error.id = errorId;
      error.className = 'sr-only';
      error.setAttribute('role', 'alert');
      error.setAttribute('aria-live', 'polite');
      error.textContent = errorMessage;

      field.parentNode.appendChild(error);
    } else {
      errorElement.textContent = errorMessage;
    }

    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
  },

  // Remove error announcement from form field
  removeErrorAnnouncement: field => {
    const errorId = `${field.id}-error`;
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.remove();
    }

    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  },
};

// Export all utilities
export default {
  focusManager,
  keyboardNavigation,
  screenReader,
  ariaUtils,
  colorContrast,
  touchTargets,
  animationAccessibility,
  formAccessibility,
};
