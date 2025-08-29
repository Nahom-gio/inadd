import { motion } from 'framer-motion';
import React from 'react';

const Portfolio = () => {
  const portfolioItems = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      category: 'Technology',
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    },
    {
      id: 2,
      title: 'Fashion Week Activation',
      category: 'Fashion',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    },
    {
      id: 3,
      title: 'Product Launch Event',
      category: 'Product Launch',
      image:
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
    },
    {
      id: 4,
      title: 'Brand Roadshow',
      category: 'Roadshow',
      image:
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    },
    {
      id: 5,
      title: 'Interactive Installation',
      category: 'Installation',
      image:
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop',
    },
    {
      id: 6,
      title: 'Corporate Event',
      category: 'Corporate',
      image:
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
    },
  ];

  return (
    <section id='portfolio' className='section-padding bg-dark-900'>
      <div className='container-custom'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-12 sm:mb-16'
        >
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'>
            Our <span className='gradient-text'>Portfolio</span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4'>
            Explore our diverse portfolio of successful campaigns and events
            that have transformed brands and captivated audiences.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className='group cursor-pointer'
            >
              <div className='relative overflow-hidden rounded-2xl bg-dark-700/50 border border-dark-600/30 hover:border-primary-500/50 transition-all duration-300'>
                <div className='aspect-[4/3] overflow-hidden'>
                  <img
                    src={item.image}
                    alt={item.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                </div>

                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                  <div className='p-4 sm:p-6 w-full transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300'>
                    <span className='inline-block px-2 sm:px-3 py-1 bg-primary-500/20 text-primary-300 text-xs sm:text-sm font-medium rounded-full mb-2 sm:mb-3 border border-primary-500/30'>
                      {item.category}
                    </span>
                    <h3 className='text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4'>
                      {item.title}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='btn-primary w-full text-sm sm:text-base py-2 sm:py-3'
                    >
                      View Project
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className='text-center mt-12 sm:mt-16'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='btn-secondary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4'
          >
            Load More Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
