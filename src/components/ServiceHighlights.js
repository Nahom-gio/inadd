import { motion } from 'framer-motion';
import React from 'react';
import {
  FaLightbulb,
  FaPalette,
  FaCalendarCheck,
  FaRocket,
} from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const ServiceHighlights = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: <FaLightbulb className='text-3xl sm:text-4xl' />,
      title: 'Creative Strategy',
      description:
        'Innovative concepts that break through the noise and capture attention',
    },
    {
      icon: <FaPalette className='text-3xl sm:text-4xl' />,
      title: 'Visual Design',
      description: 'Stunning aesthetics that bring your brand story to life',
    },
    {
      icon: <FaCalendarCheck className='text-3xl sm:text-4xl' />,
      title: 'Event Execution',
      description: 'Flawless delivery that exceeds expectations every time',
    },
    {
      icon: <FaRocket className='text-3xl sm:text-4xl' />,
      title: 'Growth Impact',
      description: 'Measurable results that drive your business forward',
    },
  ];

  return (
    <section className='section-padding bg-dark-800'>
      <div className='container-custom'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-12 sm:mb-16'
        >
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'>
            Why Choose <span className='gradient-text'>INAD PROMOTION</span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4'>
            We combine creativity, strategy, and flawless execution to deliver
            experiences that not only look amazing but drive real business
            results.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className='bg-dark-700/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center border border-dark-600/30 hover:border-primary-500/50 transition-all duration-300 group'
            >
              <div className='text-primary-400 mb-4 sm:mb-6 group-hover:text-primary-300 transition-colors duration-300'>
                {service.icon}
              </div>
              <h3 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white'>
                {service.title}
              </h3>
              <p className='text-sm sm:text-base text-gray-300 leading-relaxed'>
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
