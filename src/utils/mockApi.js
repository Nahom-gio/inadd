// Mock API utility for development purposes
// In production, replace this with real API calls

const MOCK_DELAY = 1500; // Simulate network delay

// Simulate API response
const simulateApiCall = async (endpoint, data) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  // Simulate random failures (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Simulated server error');
  }

  // Simulate network issues (2% chance)
  if (Math.random() < 0.02) {
    throw new Error('Failed to fetch');
  }

  // Simulate validation errors
  if (!data.email || !data.name || !data.message || !data.service) {
    return {
      success: false,
      message: 'Missing required fields',
      errors: {
        email: !data.email ? 'Email is required' : null,
        name: !data.name ? 'Name is required' : null,
        message: !data.message ? 'Message is required' : null,
        service: !data.service ? 'Service is required' : null,
      },
    };
  }

  // Simulate successful submission
  return {
    success: true,
    message: 'Message sent successfully',
    data: {
      id: Math.random().toString(36).substring(2),
      ...data,
      submittedAt: new Date().toISOString(),
    },
  };
};

// Mock contact form submission
export const submitContactForm = async formData => {
  try {
    const response = await simulateApiCall('/api/contact', formData);

    // Log the submission for development (only in dev mode)
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', {
        formData,
        response,
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Mock API error:', error);
    }
    throw error;
  }
};

// Mock rate limiting check
export const checkRateLimitMock = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const lastSubmission = localStorage.getItem('last_form_submission');
  const now = Date.now();
  const minInterval = 30000; // 30 seconds

  if (lastSubmission && now - parseInt(lastSubmission) < minInterval) {
    return {
      allowed: false,
      message: 'Rate limit exceeded. Please wait before submitting again.',
      retryAfter: Math.ceil(
        (minInterval - (now - parseInt(lastSubmission))) / 1000
      ),
    };
  }

  return { allowed: true };
};

// Mock spam detection
export const detectSpamMock = async data => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const suspiciousKeywords = [
    'spam',
    'viagra',
    'casino',
    'loan',
    'free money',
    'click here',
    'buy now',
    'urgent',
    'limited time',
  ];

  const textToCheck = Object.values(data).join(' ').toLowerCase();

  for (const keyword of suspiciousKeywords) {
    if (textToCheck.includes(keyword)) {
      return {
        isSpam: true,
        reason: `Suspicious keyword detected: ${keyword}`,
        confidence: 0.9,
      };
    }
  }

  return { isSpam: false, confidence: 0.1 };
};

// Mock email validation
export const validateEmailMock = async email => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }

  // Simulate disposable email check
  const disposableDomains = [
    'tempmail.com',
    'throwaway.com',
    '10minutemail.com',
  ];
  const domain = email.split('@')[1];

  if (disposableDomains.includes(domain)) {
    return {
      valid: false,
      reason: 'Disposable email addresses are not allowed',
    };
  }

  return { valid: true };
};

// Mock honeypot validation
export const validateHoneypotMock = async honeypotValue => {
  await new Promise(resolve => setTimeout(resolve, 50));

  // Honeypot should be empty
  if (honeypotValue && honeypotValue.trim() !== '') {
    return {
      valid: false,
      reason: 'Honeypot field filled - likely a bot',
      confidence: 0.95,
    };
  }

  return { valid: true, confidence: 0.1 };
};

// Export all mock functions
export default {
  submitContactForm,
  checkRateLimitMock,
  detectSpamMock,
  validateEmailMock,
  validateHoneypotMock,
};
