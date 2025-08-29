// Security utility functions for the contact form

// Generate CSRF token (in production, this should come from your backend)
export const generateCsrfToken = () => {
  // Use crypto.randomUUID() for cryptographically secure tokens
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers - still more secure than Math.random()
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Last resort fallback - not recommended for production
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Get stored CSRF token - only from sessionStorage
export const getCsrfToken = () => {
  return sessionStorage.getItem('csrf_token');
};

// Store CSRF token - use only sessionStorage for security
export const storeCsrfToken = token => {
  sessionStorage.setItem('csrf_token', token);
};

// Rate limiting check (client-side only - should be supplemented with server-side validation)
export const checkRateLimit = () => {
  const now = Date.now();
  const lastSubmission = localStorage.getItem('last_form_submission');
  const minInterval = 30000; // 30 seconds between submissions

  // Check if user has submitted recently
  if (lastSubmission && now - parseInt(lastSubmission) < minInterval) {
    return false;
  }

  // Store submission time
  localStorage.setItem('last_form_submission', now.toString());

  // Additional client-side checks
  const submissions = JSON.parse(
    localStorage.getItem('form_submissions') || '[]'
  );
  const oneHour = 60 * 60 * 1000;

  // Remove submissions older than 1 hour
  const recentSubmissions = submissions.filter(time => now - time < oneHour);

  // Allow max 5 submissions per hour
  if (recentSubmissions.length >= 5) {
    return false;
  }

  // Add current submission
  recentSubmissions.push(now);
  localStorage.setItem('form_submissions', JSON.stringify(recentSubmissions));

  return true;
};

// Validate honeypot field
export const validateHoneypot = honeypotValue => {
  // Honeypot should be empty (hidden field that bots might fill)
  return !honeypotValue || honeypotValue.trim() === '';
};

// Sanitize and validate input
export const sanitizeAndValidate = (input, type = 'text') => {
  if (!input) return { isValid: false, value: '', error: 'Field is required' };

  let sanitized = input.trim();

  // Remove potentially dangerous content with more comprehensive patterns
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/vbscript:/gi, '') // Remove vbscript protocol
    .replace(/data:/gi, '') // Remove data protocol
    .replace(/file:/gi, '') // Remove file protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/expression\s*\(/gi, '') // Remove CSS expressions
    .replace(/url\s*\(/gi, '') // Remove CSS url functions
    .replace(/import\s+/gi, '') // Remove CSS imports
    .replace(/@import/gi, '') // Remove CSS @import
    .replace(/eval\s*\(/gi, '') // Remove eval function calls
    .replace(/setTimeout\s*\(/gi, '') // Remove setTimeout calls
    .replace(/setInterval\s*\(/gi, '') // Remove setInterval calls
    .replace(/Function\s*\(/gi, '') // Remove Function constructor
    .replace(/new\s+Function/gi, '') // Remove new Function
    .replace(/document\./gi, '') // Remove document object access
    .replace(/window\./gi, '') // Remove window object access
    .replace(/localStorage\./gi, '') // Remove localStorage access
    .replace(/sessionStorage\./gi, '') // Remove sessionStorage access
    .replace(/cookie/gi, '') // Remove cookie access
    .replace(/alert\s*\(/gi, '') // Remove alert calls
    .replace(/confirm\s*\(/gi, '') // Remove confirm calls
    .replace(/prompt\s*\(/gi, ''); // Remove prompt calls

  // Type-specific validation
  switch (type) {
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitized)) {
        return { isValid: false, value: '', error: 'Invalid email format' };
      }
      break;
    }

    case 'name': {
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (!nameRegex.test(sanitized)) {
        return {
          isValid: false,
          value: '',
          error: 'Name contains invalid characters',
        };
      }
      if (sanitized.length < 2) {
        return {
          isValid: false,
          value: '',
          error: 'Name must be at least 2 characters',
        };
      }
      if (sanitized.length > 50) {
        return {
          isValid: false,
          value: '',
          error: 'Name must be less than 50 characters',
        };
      }
      break;
    }

    case 'company': {
      if (sanitized.length > 100) {
        return {
          isValid: false,
          value: '',
          error: 'Company name must be less than 50 characters',
        };
      }
      const companyRegex = /^[a-zA-Z0-9\s&.,'-]+$/;
      if (!companyRegex.test(sanitized)) {
        return {
          isValid: false,
          value: '',
          error: 'Company name contains invalid characters',
        };
      }
      break;
    }

    case 'message': {
      if (sanitized.length < 10) {
        return {
          isValid: false,
          value: '',
          error: 'Message must be at least 10 characters',
        };
      }
      if (sanitized.length > 1000) {
        return {
          isValid: false,
          value: '',
          error: 'Message must be less than 1000 characters',
        };
      }
      break;
    }
  }

  return { isValid: true, value: sanitized, error: '' };
};

// Check for suspicious patterns
export const detectSuspiciousPatterns = data => {
  const suspiciousPatterns = [
    /spam/i,
    /viagra/i,
    /casino/i,
    /loan/i,
    /free.*money/i,
    /click.*here/i,
    /buy.*now/i,
    /urgent/i,
    /limited.*time/i,
    /act.*now/i,
  ];

  const textToCheck = Object.values(data).join(' ').toLowerCase();

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(textToCheck)) {
      return true;
    }
  }

  return false;
};

// Validate submission frequency
export const validateSubmissionFrequency = () => {
  const submissions = JSON.parse(
    localStorage.getItem('form_submissions') || '[]'
  );
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // Remove submissions older than 1 hour
  const recentSubmissions = submissions.filter(time => now - time < oneHour);

  // Allow max 5 submissions per hour
  if (recentSubmissions.length >= 5) {
    return false;
  }

  // Add current submission
  recentSubmissions.push(now);
  localStorage.setItem('form_submissions', JSON.stringify(recentSubmissions));

  return true;
};

// Get client fingerprint for additional security
export const getClientFingerprint = () => {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
  };

  return btoa(JSON.stringify(fingerprint));
};
