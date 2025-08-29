import { motion } from 'framer-motion';
import React from 'react';
import { FaCalendarAlt, FaUsers, FaHeart } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      icon: <FaCalendarAlt className='text-2xl sm:text-3xl' />,
      number: '500+',
      label: 'Events Delivered',
    },
    {
      icon: <FaUsers className='text-2xl sm:text-3xl' />,
      number: '200+',
      label: 'Happy Clients',
    },
    {
      icon: <FaHeart className='text-2xl sm:text-3xl' />,
      number: '98%',
      label: 'Client Satisfaction',
    },
  ];

  const behindTheScenes = [
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
  ];

  return (
    <section id='about' className='section-padding bg-dark-900'>
      <div className='container-custom'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-12 sm:mb-16'
        >
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'>
            About <span className='gradient-text'>INAD PROMOTION</span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto px-4'>
            We're a team of creative visionaries, strategic thinkers, and
            execution experts who believe that every brand deserves to create
            moments that matter.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-20'>
          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white'>
              Our Story
            </h3>
            <div className='space-y-3 sm:space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base'>
              <p>
                Founded in 2018, INAD PROMOTION emerged from a simple belief:
                that brands should create experiences, not just impressions. We
                started with a small team and big dreams, working tirelessly to
                transform how companies connect with their audiences.
              </p>
              <p>
                Today, we're proud to have delivered over 500 successful events
                and campaigns, each one crafted with the same passion and
                attention to detail that we had on day one.
              </p>
            </div>
          </motion.div>

          {/* Experiential Approach */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white'>
              Our Experiential Approach
            </h3>
            <div className='space-y-3 sm:space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base'>
              <p>
                We don't just plan events – we craft immersive journeys that
                engage all five senses. Our approach combines strategic thinking
                with creative innovation, ensuring every touchpoint tells your
                brand story in a way that resonates deeply with your audience.
              </p>
              <p>
                From concept to execution, we're with you every step of the way,
                turning your vision into reality with precision, creativity, and
                unwavering commitment to excellence.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20'
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className='text-center p-6 sm:p-8 bg-dark-800/50 rounded-2xl border border-dark-700/30 hover:border-primary-500/30 transition-all duration-300'
            >
              <div className='text-primary-400 mb-3 sm:mb-4 flex justify-center'>
                {stat.icon}
              </div>
              <div className='text-3xl sm:text-4xl font-bold text-white mb-2'>
                {stat.number}
              </div>
              <div className='text-gray-300 text-sm sm:text-base'>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Behind the Scenes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className='text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-white'>
            Behind the Scenes
          </h3>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
            {behindTheScenes.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className='aspect-square overflow-hidden rounded-xl'
              >
                <img
                  src={image}
                  alt={`Behind the scenes ${index + 1}`}
                  className='w-full h-full object-cover hover:scale-110 transition-transform duration-500'
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
