import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const mobileMenuRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus management for mobile menu
  useEffect(() => {
    if (isOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [isOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      // Return focus to the trigger element
      document.activeElement?.blur();
    }
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(Math.min(index + 1, navItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(Math.max(index - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(navItems.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        scrollToSection(navItems[index].id);
        break;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', description: 'Go to homepage' },
    { id: 'about', label: 'About', description: 'Learn about INAD PROMOTION' },
    { id: 'services', label: 'Services', description: 'View our services' },
    { id: 'portfolio', label: 'Portfolio', description: 'See our work' },
    { id: 'clients', label: 'Clients', description: 'Client testimonials' },
    { id: 'contact', label: 'Contact', description: 'Get in touch with us' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full layout-stable ${
        scrolled
          ? 'bg-dark-800/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='container-custom w-full mobile-stable-layout'>
        <div className='flex items-center h-16 sm:h-20 w-full mobile-fixed-dimensions'>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='text-lg sm:text-xl md:text-2xl font-bold gradient-text cursor-pointer mobile-fixed-dimensions'
            onClick={() => scrollToSection('home')}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToSection('home');
              }
            }}
            role='button'
            tabIndex={0}
            aria-label='INAD PROMOTION - Go to homepage'
          >
            INAD PROMOTION
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-6 lg:space-x-8 mobile-fixed-dimensions ml-auto'>
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='text-white hover:text-primary-400 transition-colors duration-300 font-medium text-sm lg:text-base mobile-fixed-dimensions focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 rounded-md px-2 py-1'
                onClick={() => scrollToSection(item.id)}
                onKeyDown={e => handleKeyDown(e, index)}
                aria-label={item.description}
                aria-describedby={`nav-${item.id}-desc`}
              >
                {item.label}
                <span id={`nav-${item.id}-desc`} className='sr-only'>
                  {item.description}
                </span>
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='btn-primary text-sm lg:text-base mobile-fixed-dimensions focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900'
              onClick={() => scrollToSection('contact')}
              aria-label='Get started - Contact us to begin your project'
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className='md:hidden text-white text-xl sm:text-2xl p-2 mobile-fixed-dimensions ml-auto focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 rounded-md'
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isOpen}
            aria-controls='mobile-menu'
            aria-haspopup='true'
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={mobileMenuRef}
              id='mobile-menu'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden bg-dark-800/95 backdrop-blur-md rounded-b-2xl overflow-hidden border-t border-dark-600/30 w-full mobile-stable-layout'
              role='menu'
              aria-label='Mobile navigation menu'
            >
              <div className='py-4 sm:py-6 space-y-2 sm:space-y-4 w-full mobile-fixed-dimensions'>
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    ref={index === 0 ? firstMenuItemRef : null}
                    whileHover={{ x: 10 }}
                    className='block w-full text-left text-white hover:text-primary-400 transition-colors duration-300 font-medium px-6 py-3 sm:py-4 text-base sm:text-lg mobile-fixed-dimensions focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded-md'
                    onClick={() => scrollToSection(item.id)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    role='menuitem'
                    tabIndex={focusedIndex === index ? 0 : -1}
                    aria-label={item.description}
                    aria-describedby={`mobile-nav-${item.id}-desc`}
                  >
                    {item.label}
                    <span id={`mobile-nav-${item.id}-desc`} className='sr-only'>
                      {item.description}
                    </span>
                  </motion.button>
                ))}
                <div className='px-6 pt-2 sm:pt-4 w-full mobile-fixed-dimensions'>
                  <button
                    className='btn-primary w-full text-base sm:text-lg py-3 sm:py-4 mobile-fixed-dimensions focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800'
                    onClick={() => scrollToSection('contact')}
                    role='menuitem'
                    aria-label='Get started - Contact us to begin your project'
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
