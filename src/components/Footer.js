import { motion } from 'framer-motion';
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    {
      icon: <FaFacebook className='text-lg sm:text-xl' />,
      href: '#',
      label: 'Facebook',
    },
    {
      icon: <FaInstagram className='text-lg sm:text-xl' />,
      href: '#',
      label: 'Instagram',
    },
    {
      icon: <FaLinkedin className='text-lg sm:text-xl' />,
      href: '#',
      label: 'LinkedIn',
    },
    {
      icon: <FaTwitter className='text-lg sm:text-xl' />,
      href: '#',
      label: 'Twitter',
    },
  ];

  const footerLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className='bg-dark-900 border-t border-dark-700/30'>
      <div className='container-custom py-12 sm:py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='sm:col-span-2'>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='text-xl sm:text-2xl font-bold gradient-text mb-3 sm:mb-4'
            >
              INAD PROMOTION
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className='text-gray-300 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base'
            >
              We create immersive experiential marketing campaigns that connect
              brands with their audiences in meaningful and memorable ways.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className='flex space-x-3 sm:space-x-4'
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className='w-8 h-8 sm:w-10 sm:h-10 bg-dark-700/50 border border-dark-600/30 hover:border-primary-500/50 rounded-full flex items-center justify-center text-gray-300 hover:text-primary-400 transition-all duration-300'
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className='text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6'
            >
              Quick Links
            </motion.h4>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className='space-y-2 sm:space-y-3'
            >
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <motion.button
                    onClick={() => scrollToSection(link.href.substring(1))}
                    whileHover={{ x: 5 }}
                    className='text-gray-300 hover:text-primary-400 transition-colors duration-300 text-sm sm:text-base'
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Services */}
          <div>
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className='text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6'
            >
              Our Services
            </motion.h4>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className='space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base'
            >
              <li>Event Planning</li>
              <li>Brand Activation</li>
              <li>Roadshow Management</li>
              <li>Promotional Campaigns</li>
            </motion.ul>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className='mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-dark-700/30 text-center'
        >
          <h4 className='text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4'>
            Ready to Create Something Amazing?
          </h4>
          <motion.button
            onClick={() => scrollToSection('contact')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4'
          >
            Work With Us
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-dark-700/30 py-4 sm:py-6'>
        <div className='container-custom'>
          <div className='flex flex-col sm:flex-row justify-between items-center text-gray-400 text-xs sm:text-sm space-y-2 sm:space-y-0'>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              © 2024 INAD PROMOTION. All rights reserved.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className='flex space-x-4 sm:space-x-6'
            >
              <a
                href='#'
                className='hover:text-primary-400 transition-colors duration-300'
              >
                Privacy Policy
              </a>
              <a
                href='#'
                className='hover:text-primary-400 transition-colors duration-300'
              >
                Terms of Service
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
