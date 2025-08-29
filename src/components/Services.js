import { motion } from 'framer-motion';
import React from 'react';
import {
  FaLightbulb,
  FaMapMarkerAlt,
  FaRoute,
  FaGift,
  FaChartLine,
} from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: <FaLightbulb className='text-3xl sm:text-4xl' />,
      title: 'Creative Strategy & Concept Development',
      description:
        'We develop innovative concepts that align with your brand objectives and resonate with your target audience.',
      features: [
        'Brand Analysis',
        'Concept Ideation',
        'Creative Direction',
        'Strategic Planning',
      ],
    },
    {
      icon: <FaMapMarkerAlt className='text-3xl sm:text-4xl' />,
      title: 'Event Planning & Management',
      description:
        'From intimate gatherings to large-scale productions, we handle every detail with precision and creativity.',
      features: [
        'Venue Selection',
        'Logistics Management',
        'Timeline Planning',
        'Risk Management',
      ],
    },
    {
      icon: <FaRoute className='text-3xl sm:text-4xl' />,
      title: 'Roadshow & Tour Management',
      description:
        'Take your brand on the road with our comprehensive tour management and activation services.',
      features: [
        'Route Planning',
        'Local Partnerships',
        'Audience Engagement',
        'Performance Tracking',
      ],
    },
    {
      icon: <FaGift className='text-3xl sm:text-4xl' />,
      title: 'Promotional Campaigns',
      description:
        'Strategic promotional campaigns that drive awareness, engagement, and conversions.',
      features: [
        'Campaign Strategy',
        'Content Creation',
        'Distribution',
        'Performance Analysis',
      ],
    },
    {
      icon: <FaChartLine className='text-3xl sm:text-4xl' />,
      title: 'Performance Marketing',
      description:
        'Data-driven marketing strategies that deliver measurable results and ROI.',
      features: [
        'Analytics & Reporting',
        'A/B Testing',
        'Optimization',
        'ROI Tracking',
      ],
    },
  ];

  return (
    <section id='services' className='section-padding bg-dark-800'>
      <div className='container-custom'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-12 sm:mb-16'
        >
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'>
            Our <span className='gradient-text'>Services</span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4'>
            We offer comprehensive experiential marketing solutions designed to
            create meaningful connections between your brand and your audience.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className='bg-dark-700/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-dark-600/30 hover:border-primary-500/50 transition-all duration-300 group'
            >
              <div className='text-primary-400 mb-4 sm:mb-6 group-hover:text-primary-300 transition-colors duration-300'>
                {service.icon}
              </div>
              <h3 className='text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white'>
                {service.title}
              </h3>
              <p className='text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed'>
                {service.description}
              </p>
              <ul className='space-y-2'>
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className='flex items-center text-gray-300 text-sm sm:text-base'
                  >
                    <div className='w-2 h-2 bg-primary-400 rounded-full mr-3 flex-shrink-0'></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='text-center mt-12 sm:mt-16'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4'
          >
            Get a Custom Quote
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
