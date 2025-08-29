import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

import { submitContactForm } from '../utils/api';
import {
  checkRateLimit,
  validateHoneypot,
  detectSuspiciousPatterns,
  validateSubmissionFrequency,
  getClientFingerprint,
} from '../utils/security';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
    website: '', // Honeypot field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const formRef = useRef(null);
  const firstErrorRef = useRef(null);

  // Announce errors and messages to screen readers
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  // Focus first error when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus();
    }
  }, [errors]);

  // Input sanitization function
  const sanitizeInput = input => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data protocol
      .replace(/vbscript:/gi, '') // Remove vbscript protocol
      .replace(/file:/gi, ''); // Remove file protocol
  };

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value))
          return 'Name contains invalid characters';
        return '';

      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Please enter a valid email address';
        if (value.length > 100) return 'Email must be less than 100 characters';
        return '';

      case 'company':
        if (value && value.length > 100)
          return 'Company name must be less than 100 characters';
        if (value && !/^[a-zA-Z0-9\s&.,'-]+$/.test(value))
          return 'Company name contains invalid characters';
        return '';

      case 'service':
        if (!value) return 'Please select a service';
        return '';

      case 'message':
        if (!value) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        if (value.length > 1000)
          return 'Message must be less than 1000 characters';
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    // Don't sanitize honeypot field to detect bots
    if (name === 'website') {
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }

    const sanitizedValue = sanitizeInput(value);

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(fieldName => {
      // Skip honeypot field validation
      if (fieldName === 'website') return;

      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    // Announce validation errors to screen readers
    if (!isValid) {
      const errorCount = Object.keys(newErrors).length;
      setAnnouncement(
        `Form validation failed. ${errorCount} field${
          errorCount > 1 ? 's have' : ' has'
        } errors.`
      );
    }

    return isValid;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError('');

    // Security checks
    if (!checkRateLimit()) {
      setSubmitError(
        'Please wait 30 seconds before submitting another message.'
      );
      setAnnouncement(
        'Rate limit exceeded. Please wait before submitting again.'
      );
      return;
    }

    if (!validateSubmissionFrequency()) {
      setSubmitError('Too many submissions. Please try again later.');
      setAnnouncement('Too many submissions. Please try again later.');
      return;
    }

    if (!validateHoneypot(formData.website)) {
      setSubmitError('Invalid submission detected.');
      setAnnouncement('Invalid submission detected.');
      return;
    }

    if (detectSuspiciousPatterns(formData)) {
      setSubmitError(
        'Suspicious content detected. Please review your message.'
      );
      setAnnouncement(
        'Suspicious content detected. Please review your message.'
      );
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setAnnouncement('Submitting your message...');

    try {
      // Use mock API for development
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        service: formData.service,
        message: formData.message,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        clientFingerprint: getClientFingerprint(),
        referrer: document.referrer,
      });

      if (result.success) {
        setIsSubmitted(true);
        setAnnouncement(
          'Message sent successfully! We will get back to you within 24 hours.'
        );
        // Reset form after successful submission
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            service: '',
            message: '',
            website: '',
          });
          setErrors({});
        }, 5000);
      } else {
        // Handle validation errors from API
        if (result.errors) {
          setErrors(result.errors);
          setAnnouncement(
            'Form submission failed. Please correct the errors and try again.'
          );
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Form submission error:', error);
      }
      const errorMessage =
        error.message === 'Failed to fetch'
          ? 'Network error. Please check your connection and try again.'
          : error.message || 'Something went wrong. Please try again later.';
      setSubmitError(errorMessage);
      setAnnouncement(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <FaEnvelope className='text-xl sm:text-2xl' />,
      title: 'Email',
      value: 'hello@inadpromotion.com',
      link: 'mailto:hello@inadpromotion.com',
    },
    {
      icon: <FaPhone className='text-xl sm:text-2xl' />,
      title: 'WhatsApp',
      value: '+1 (555) 123-4567',
      link: 'https://wa.me/15551234567',
    },
    {
      icon: <FaPhone className='text-xl sm:text-2xl' />,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: <FaLinkedin className='text-xl sm:text-2xl' />,
      title: 'LinkedIn',
      value: 'inadpromotion',
      link: 'https://linkedin.com/company/inadpromotion',
    },
  ];

  return (
    <section
      id='contact'
      className='section-padding bg-dark-800'
      aria-label='Contact us'
    >
      {/* Screen reader announcements */}
      <div
        aria-live='polite'
        aria-atomic='true'
        className='sr-only'
        aria-label='Form status announcements'
      >
        {announcement}
      </div>

      <div className='container-custom'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-12 sm:mb-16'
        >
          <h2
            className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'
            aria-level='2'
          >
            Let's <span className='gradient-text'>Connect</span>
          </h2>
          <p
            className='text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4'
            aria-label='Contact form description'
          >
            Ready to create something amazing together? Get in touch and let's
            discuss how we can bring your vision to life.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16'>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3
              className='text-xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6'
              aria-level='3'
            >
              Send us a Message
            </h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-green-500/20 border border-green-500/30 rounded-2xl p-6 sm:p-8 text-center'
                role='alert'
                aria-live='polite'
                aria-label='Success message'
              >
                <div className='text-green-400 text-4xl sm:text-6xl mb-4'>
                  <FaCheckCircle className='mx-auto' aria-hidden='true' />
                </div>
                <h4 className='text-lg sm:text-xl font-semibold text-white mb-2'>
                  Message Sent Successfully!
                </h4>
                <p className='text-green-300 text-sm sm:text-base'>
                  We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className='space-y-4 sm:space-y-6'
                noValidate
                aria-label='Contact form'
                aria-describedby='form-instructions'
              >
                <div id='form-instructions' className='sr-only'>
                  Contact form with required fields marked with asterisks.
                  Please fill in all required fields and submit your message.
                </div>

                {/* Honeypot field for spam protection */}
                <input
                  type='text'
                  name='website'
                  value={formData.website}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                  tabIndex='-1'
                  autoComplete='off'
                  aria-hidden='true'
                  aria-label='Hidden field - do not fill'
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-white font-medium mb-2 text-sm sm:text-base'
                    >
                      Name{' '}
                      <span className='text-red-400' aria-label='required'>
                        *
                      </span>
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={e => {
                        const error = validateField('name', e.target.value);
                        setErrors(prev => ({ ...prev, name: error }));
                      }}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-colors duration-300 text-sm sm:text-base ${
                        errors.name ? 'border-red-500' : 'border-dark-600/30'
                      }`}
                      placeholder='Your full name'
                      autoComplete='name'
                      maxLength={50}
                      required
                      aria-required='true'
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      ref={errors.name ? firstErrorRef : null}
                    />
                    {errors.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center mt-2 text-red-400 text-xs sm:text-sm'
                        id='name-error'
                        role='alert'
                        aria-live='polite'
                      >
                        <FaExclamationTriangle
                          className='mr-2 flex-shrink-0'
                          aria-hidden='true'
                        />
                        {errors.name}
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-white font-medium mb-2 text-sm sm:text-base'
                    >
                      Email{' '}
                      <span className='text-red-400' aria-label='required'>
                        *
                      </span>
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={e => {
                        const error = validateField('email', e.target.value);
                        setErrors(prev => ({ ...prev, email: error }));
                      }}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-colors duration-300 text-sm sm:text-base ${
                        errors.email ? 'border-red-500' : 'border-dark-600/30'
                      }`}
                      placeholder='your@email.com'
                      autoComplete='email'
                      maxLength={100}
                      required
                      aria-required='true'
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                      ref={errors.email ? firstErrorRef : null}
                    />
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center mt-2 text-red-400 text-xs sm:text-sm'
                        id='email-error'
                        role='alert'
                        aria-live='polite'
                      >
                        <FaExclamationTriangle
                          className='mr-2 flex-shrink-0'
                          aria-hidden='true'
                        />
                        {errors.email}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                  <div>
                    <label
                      htmlFor='company'
                      className='block text-white font-medium mb-2 text-sm sm:text-base'
                    >
                      Company
                    </label>
                    <input
                      type='text'
                      id='company'
                      name='company'
                      value={formData.company}
                      onChange={handleInputChange}
                      onBlur={e => {
                        const error = validateField('company', e.target.value);
                        setErrors(prev => ({ ...prev, company: error }));
                      }}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-colors duration-300 text-sm sm:text-base ${
                        errors.company ? 'border-red-500' : 'border-dark-600/30'
                      }`}
                      placeholder='Your company name'
                      autoComplete='organization'
                      maxLength={100}
                      aria-invalid={!!errors.company}
                      aria-describedby={
                        errors.company ? 'company-error' : undefined
                      }
                      ref={errors.company ? firstErrorRef : null}
                    />
                    {errors.company && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center mt-2 text-red-400 text-xs sm:text-sm'
                        id='company-error'
                        role='alert'
                        aria-live='polite'
                      >
                        <FaExclamationTriangle
                          className='mr-2 flex-shrink-0'
                          aria-hidden='true'
                        />
                        {errors.company}
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor='service'
                      className='block text-white font-medium mb-2 text-sm sm:text-base'
                    >
                      Service Interest{' '}
                      <span className='text-red-400' aria-label='required'>
                        *
                      </span>
                    </label>
                    <select
                      id='service'
                      name='service'
                      value={formData.service}
                      onChange={handleInputChange}
                      onBlur={e => {
                        const error = validateField('service', e.target.value);
                        setErrors(prev => ({ ...prev, service: error }));
                      }}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-700/50 border rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-colors duration-300 text-sm sm:text-base ${
                        errors.service ? 'border-red-500' : 'border-dark-600/30'
                      }`}
                      required
                      aria-required='true'
                      aria-invalid={!!errors.service}
                      aria-describedby={
                        errors.service ? 'service-error' : undefined
                      }
                      ref={errors.service ? firstErrorRef : null}
                    >
                      <option value=''>Select a service</option>
                      <option value='event-planning'>Event Planning</option>
                      <option value='roadshow'>Roadshow & Tours</option>
                      <option value='brand-activation'>Brand Activation</option>
                      <option value='promotional'>Promotional Campaigns</option>
                      <option value='other'>Other</option>
                    </select>
                    {errors.service && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center mt-2 text-red-400 text-xs sm:text-sm'
                        id='service-error'
                        role='alert'
                        aria-live='polite'
                      >
                        <FaExclamationTriangle
                          className='mr-2 flex-shrink-0'
                          aria-hidden='true'
                        />
                        {errors.service}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='block text-white font-medium mb-2 text-sm sm:text-base'
                  >
                    Message{' '}
                    <span className='text-red-400' aria-label='required'>
                      *
                    </span>
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={e => {
                      const error = validateField('message', e.target.value);
                      setErrors(prev => ({ ...prev, message: error }));
                    }}
                    rows={4}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-colors duration-300 resize-none text-sm sm:text-base ${
                      errors.message ? 'border-red-500' : 'border-dark-600/30'
                    }`}
                    placeholder='Tell us about your project...'
                    maxLength={1000}
                    required
                    aria-required='true'
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? 'message-error' : 'message-counter'
                    }
                    ref={errors.message ? firstErrorRef : null}
                  />
                  <div className='flex justify-between items-center mt-2'>
                    {errors.message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center text-red-400 text-xs sm:text-sm'
                        id='message-error'
                        role='alert'
                        aria-live='polite'
                      >
                        <FaExclamationTriangle
                          className='mr-2 flex-shrink-0'
                          aria-hidden='true'
                        />
                        {errors.message}
                      </motion.div>
                    )}
                    <span
                      className='text-gray-400 text-xs ml-auto'
                      id='message-counter'
                      aria-label={`${formData.message.length} characters used out of 1000 maximum`}
                    >
                      {formData.message.length}/1000
                    </span>
                  </div>
                </div>

                {/* Submit Error Display */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center'
                    role='alert'
                    aria-live='polite'
                    aria-label='Submission error'
                  >
                    <div className='flex items-center justify-center text-red-400 mb-2'>
                      <FaExclamationTriangle
                        className='mr-2'
                        aria-hidden='true'
                      />
                      <span className='font-medium'>Submission Error</span>
                    </div>
                    <p className='text-red-300 text-sm'>{submitError}</p>
                  </motion.div>
                )}

                <motion.button
                  type='submit'
                  disabled={
                    isSubmitting || Object.keys(errors).some(key => errors[key])
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='btn-primary w-full py-3 sm:py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800'
                  aria-describedby={
                    isSubmitting ? 'submitting-status' : undefined
                  }
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {isSubmitting && (
                    <span id='submitting-status' className='sr-only'>
                      Form is being submitted, please wait
                    </span>
                  )}
                </motion.button>

                {/* Privacy Notice */}
                <p className='text-xs text-gray-400 text-center'>
                  By submitting this form, you agree to our{' '}
                  <a
                    href='#'
                    className='text-primary-400 hover:text-primary-300 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded'
                    aria-label='Privacy Policy - opens in new tab'
                  >
                    Privacy Policy
                  </a>{' '}
                  and consent to being contacted regarding your inquiry.
                </p>
              </form>
            )}
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3
              className='text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8'
              aria-level='3'
            >
              Get in Touch
            </h3>

            <div
              className='space-y-4 sm:space-y-6'
              role='list'
              aria-label='Contact methods'
            >
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : '_self'}
                  rel={
                    method.link.startsWith('http') ? 'noopener noreferrer' : ''
                  }
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className='flex items-center p-3 sm:p-4 bg-dark-700/30 rounded-xl border border-dark-600/20 hover:border-primary-500/30 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800'
                  role='listitem'
                  aria-label={`${method.title}: ${method.value}`}
                >
                  <div
                    className='text-primary-400 mr-3 sm:mr-4 group-hover:text-primary-300 transition-colors duration-300'
                    aria-hidden='true'
                  >
                    {method.icon}
                  </div>
                  <div>
                    <div className='text-white font-medium text-sm sm:text-base'>
                      {method.title}
                    </div>
                    <div className='text-gray-300 text-xs sm:text-sm'>
                      {method.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className='mt-8 sm:mt-12 p-4 sm:p-6 bg-dark-700/30 rounded-2xl border border-dark-600/20'>
              <h4
                className='text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3'
                aria-level='4'
              >
                Office Hours
              </h4>
              <div
                className='text-gray-300 space-y-1 text-sm sm:text-base'
                role='list'
                aria-label='Office hours'
              >
                <div role='listitem'>Monday - Friday: 9:00 AM - 6:00 PM</div>
                <div role='listitem'>Saturday: 10:00 AM - 4:00 PM</div>
                <div role='listitem'>Sunday: Closed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
