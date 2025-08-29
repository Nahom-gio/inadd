import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import {
  FaEnvelope,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const Newsletter = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const emailInputRef = useRef(null);

  // Announce messages to screen readers
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  // Focus email input when component comes into view
  useEffect(() => {
    if (inView && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [inView]);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = e => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      setAnnouncement('Email field is required');
      emailInputRef.current?.focus();
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setAnnouncement('Invalid email format');
      emailInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError('');
    setAnnouncement('Subscribing to newsletter...');

    try {
      // Simulate API call (replace with actual newsletter subscription API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      setIsSubmitted(true);
      setAnnouncement(
        'Successfully subscribed to newsletter! Check your email for confirmation.'
      );

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 5000);
    } catch (error) {
      setError('Failed to subscribe. Please try again.');
      setAnnouncement('Newsletter subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <section
      ref={ref}
      className='bg-gradient-to-r from-dark-800 to-dark-900 py-16 sm:py-20'
      aria-label='Newsletter subscription'
    >
      {/* Screen reader announcements */}
      <div
        aria-live='polite'
        aria-atomic='true'
        className='sr-only'
        aria-label='Newsletter status announcements'
      >
        {announcement}
      </div>

      <div className='container-custom'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center max-w-3xl mx-auto'
        >
          <h2
            className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'
            aria-level='2'
          >
            Stay <span className='gradient-text'>Connected</span>
          </h2>

          <p
            className='text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto'
            aria-label='Newsletter description'
          >
            Get the latest insights, industry trends, and exclusive offers
            delivered straight to your inbox. Join our community of marketing
            professionals.
          </p>

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
              <h3 className='text-lg sm:text-xl font-semibold text-white mb-2'>
                Welcome to the Family!
              </h3>
              <p className='text-green-300 text-sm sm:text-base'>
                You've successfully subscribed to our newsletter. Check your
                email for a welcome message.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSubmit}
              className='flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-lg mx-auto'
              aria-label='Newsletter subscription form'
              noValidate
            >
              <div className='relative flex-1'>
                <div className='relative'>
                  <FaEnvelope
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg'
                    aria-hidden='true'
                  />
                  <input
                    ref={emailInputRef}
                    type='email'
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                    placeholder='Enter your email address'
                    className={`w-full pl-10 pr-4 py-3 sm:py-4 bg-dark-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-colors duration-300 text-sm sm:text-base ${
                      error ? 'border-red-500' : 'border-dark-600/30'
                    }`}
                    aria-label='Email address for newsletter subscription'
                    aria-required='true'
                    aria-invalid={!!error}
                    aria-describedby={error ? 'email-error' : 'email-help'}
                    required
                  />
                </div>

                {error && (
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
                    {error}
                  </motion.div>
                )}

                <div
                  id='email-help'
                  className='text-xs text-gray-400 mt-2 text-left'
                  aria-label='Email help text'
                >
                  We'll never share your email with anyone else.
                </div>
              </div>

              <motion.button
                type='submit'
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800'
                aria-describedby={
                  isSubmitting ? 'submitting-status' : undefined
                }
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                {isSubmitting && (
                  <span id='submitting-status' className='sr-only'>
                    Newsletter subscription in progress, please wait
                  </span>
                )}
              </motion.button>
            </motion.form>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='mt-6 sm:mt-8 text-xs text-gray-400'
          >
            <p>
              By subscribing, you agree to our{' '}
              <a
                href='#'
                className='text-primary-400 hover:text-primary-300 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded'
                aria-label='Privacy Policy - opens in new tab'
              >
                Privacy Policy
              </a>{' '}
              and consent to receiving marketing communications.
            </p>
            <p className='mt-2'>
              You can unsubscribe at any time. We respect your privacy.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
