import { motion } from 'framer-motion';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const Clients = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials = [
    {
      id: 1,
      quote:
        'INAD PROMOTION transformed our product launch into an unforgettable experience. Their creativity and attention to detail exceeded all expectations.',
      author: 'Sarah Johnson',
      position: 'Marketing Director',
      company: 'TechCorp',
    },
    {
      id: 2,
      quote:
        'Working with INAD was a game-changer for our brand. They understood our vision perfectly and delivered results that drove real business impact.',
      author: 'Michael Chen',
      position: 'Brand Manager',
      company: 'FashionBrand',
    },
    {
      id: 3,
      quote:
        'The team at INAD PROMOTION is incredibly professional and creative. They made our roadshow a huge success across all markets.',
      author: 'Emily Rodriguez',
      position: 'Events Coordinator',
      company: 'FoodCo',
    },
    {
      id: 4,
      quote:
        'INAD delivered an experience that perfectly captured our brand essence. The engagement and feedback we received were outstanding.',
      author: 'David Thompson',
      position: 'CEO',
      company: 'AutoGroup',
    },
  ];

  return (
    <section id='clients' className='section-padding bg-dark-800'>
      <div className='container-custom'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-12 sm:mb-16'
        >
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'>
            What Our <span className='gradient-text'>Clients Say</span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4'>
            Don't just take our word for it. Here's what our clients have to say
            about working with INAD PROMOTION.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className='bg-dark-700/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-dark-600/30 hover:border-primary-500/50 transition-all duration-300'
            >
              <div className='mb-4 sm:mb-6'>
                <svg
                  className='w-8 h-8 sm:w-12 sm:h-12 text-primary-400 mb-3 sm:mb-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='text-gray-300 text-base sm:text-lg leading-relaxed italic'>
                  "{testimonial.quote}"
                </p>
              </div>
              <div className='flex items-center'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg mr-3 sm:mr-4 flex-shrink-0'>
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className='font-semibold text-white text-sm sm:text-base'>
                    {testimonial.author}
                  </div>
                  <div className='text-gray-400 text-xs sm:text-sm'>
                    {testimonial.position} at {testimonial.company}
                  </div>
                </div>
              </div>
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
            className='btn-secondary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4'
          >
            Become Our Next Success Story
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
