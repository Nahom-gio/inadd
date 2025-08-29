import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { FaCookieBite, FaTimes, FaCheck, FaCog } from 'react-icons/fa';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    setCookiePreferences(preferences);
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);

    // Enable all tracking (in production, this would call your analytics services)
    if (typeof window !== 'undefined') {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        functionality_storage: 'granted',
      });
    }
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);

    // Update consent based on preferences
    if (typeof window !== 'undefined') {
      window.gtag?.('consent', 'update', {
        analytics_storage: cookiePreferences.analytics ? 'granted' : 'denied',
        ad_storage: cookiePreferences.marketing ? 'granted' : 'denied',
        functionality_storage: cookiePreferences.preferences
          ? 'granted'
          : 'denied',
      });
    }
  };

  const handleRejectAll = () => {
    const preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    setCookiePreferences(preferences);
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);

    // Disable all tracking
    if (typeof window !== 'undefined') {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied',
      });
    }
  };

  const handlePreferenceChange = (type, value) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleManageSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='fixed bottom-0 left-0 right-0 z-50 bg-dark-800 border-t border-dark-600/30 backdrop-blur-md'
          role='banner'
          aria-label='Cookie consent banner'
        >
          <div className='container-custom py-4 sm:py-6'>
            <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
              {/* Cookie Icon and Text */}
              <div className='flex items-start gap-3 flex-1'>
                <div className='text-primary-400 text-xl sm:text-2xl mt-1'>
                  <FaCookieBite aria-hidden='true' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-white font-semibold text-sm sm:text-base mb-1'>
                    We use cookies to enhance your experience
                  </h3>
                  <p className='text-gray-300 text-xs sm:text-sm'>
                    We use cookies and similar technologies to help personalize
                    content, provide social media features, and analyze our
                    traffic.
                    <a
                      href='#'
                      className='text-primary-400 hover:text-primary-300 underline ml-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded'
                      aria-label='Learn more about our cookie policy - opens in new tab'
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto'>
                <button
                  onClick={handleManageSettings}
                  className='flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded'
                  aria-label='Manage cookie preferences'
                >
                  <FaCog className='w-3 h-3' aria-hidden='true' />
                  Settings
                </button>

                <button
                  onClick={handleRejectAll}
                  className='px-4 py-2 text-xs sm:text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800'
                  aria-label='Reject all non-essential cookies'
                >
                  Reject All
                </button>

                <button
                  onClick={handleAcceptAll}
                  className='btn-primary px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800'
                  aria-label='Accept all cookies'
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>

          {/* Cookie Settings Modal */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
                role='dialog'
                aria-modal='true'
                aria-labelledby='cookie-settings-title'
                aria-describedby='cookie-settings-description'
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className='bg-dark-800 rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto'
                >
                  <div className='flex items-center justify-between mb-6'>
                    <h2
                      id='cookie-settings-title'
                      className='text-xl font-bold text-white'
                    >
                      Cookie Preferences
                    </h2>
                    <button
                      onClick={handleCloseSettings}
                      className='text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded-full p-1'
                      aria-label='Close cookie settings'
                    >
                      <FaTimes className='w-5 h-5' aria-hidden='true' />
                    </button>
                  </div>

                  <p
                    id='cookie-settings-description'
                    className='text-gray-300 text-sm mb-6'
                  >
                    Manage your cookie preferences below. You can change these
                    settings at any time.
                  </p>

                  <div className='space-y-4'>
                    {/* Necessary Cookies */}
                    <div className='flex items-center justify-between p-3 bg-dark-700/30 rounded-lg'>
                      <div>
                        <h3 className='text-white font-medium text-sm'>
                          Necessary Cookies
                        </h3>
                        <p className='text-gray-400 text-xs'>
                          Required for the website to function properly
                        </p>
                      </div>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={cookiePreferences.necessary}
                          disabled
                          className='w-4 h-4 text-primary-500 bg-dark-600 border-gray-500 rounded focus:ring-primary-500 focus:ring-2'
                          aria-label='Necessary cookies (always enabled)'
                        />
                        <span className='ml-2 text-xs text-gray-400'>
                          Always
                        </span>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className='flex items-center justify-between p-3 bg-dark-700/30 rounded-lg'>
                      <div>
                        <h3 className='text-white font-medium text-sm'>
                          Analytics Cookies
                        </h3>
                        <p className='text-gray-400 text-xs'>
                          Help us understand how visitors interact with our
                          website
                        </p>
                      </div>
                      <input
                        type='checkbox'
                        checked={cookiePreferences.analytics}
                        onChange={e =>
                          handlePreferenceChange('analytics', e.target.checked)
                        }
                        className='w-4 h-4 text-primary-500 bg-dark-600 border-gray-500 rounded focus:ring-primary-500 focus:ring-2'
                        aria-label='Enable analytics cookies'
                      />
                    </div>

                    {/* Marketing Cookies */}
                    <div className='flex items-center justify-between p-3 bg-dark-700/30 rounded-lg'>
                      <div>
                        <h3 className='text-white font-medium text-sm'>
                          Marketing Cookies
                        </h3>
                        <p className='text-gray-400 text-xs'>
                          Used to deliver personalized advertisements
                        </p>
                      </div>
                      <input
                        type='checkbox'
                        checked={cookiePreferences.marketing}
                        onChange={e =>
                          handlePreferenceChange('marketing', e.target.checked)
                        }
                        className='w-4 h-4 text-primary-500 bg-dark-600 border-gray-500 rounded focus:ring-primary-500 focus:ring-2'
                        aria-label='Enable marketing cookies'
                      />
                    </div>

                    {/* Preferences Cookies */}
                    <div className='flex items-center justify-between p-3 bg-dark-700/30 rounded-lg'>
                      <div>
                        <h3 className='text-white font-medium text-sm'>
                          Preference Cookies
                        </h3>
                        <p className='text-gray-400 text-xs'>
                          Remember your settings and preferences
                        </p>
                      </div>
                      <input
                        type='checkbox'
                        checked={cookiePreferences.preferences}
                        onChange={e =>
                          handlePreferenceChange(
                            'preferences',
                            e.target.checked
                          )
                        }
                        className='w-4 h-4 text-primary-500 bg-dark-600 border-gray-500 rounded focus:ring-primary-500 focus:ring-2'
                        aria-label='Enable preference cookies'
                      />
                    </div>
                  </div>

                  <div className='flex gap-3 mt-6'>
                    <button
                      onClick={handleCloseSettings}
                      className='flex-1 px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAcceptSelected}
                      className='flex-1 btn-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800'
                    >
                      Save Preferences
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
