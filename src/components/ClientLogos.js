import { motion } from 'framer-motion';
import React from 'react';

const ClientLogos = () => {
  const clients = [
    {
      id: 1,
      name: 'TechCorp',
      logo: 'https://via.placeholder.com/150x80/374151/FFFFFF?text=TechCorp',
    },
    {
      id: 2,
      name: 'FashionBrand',
      logo: 'https://via.placeholder.com/150x80/374151/FFFFFF?text=FashionBrand',
    },
    {
      id: 3,
      name: 'FoodCo',
      logo: 'https://via.placeholder.com/150x80/374151/FFFFFF?text=FoodCo',
    },
    {
      id: 4,
      name: 'AutoGroup',
      logo: 'https://via.placeholder.com/150x80/374151/FFFFFF?text=AutoGroup',
    },
    {
      id: 5,
      name: 'HealthPlus',
      logo: 'https://via.placeholder.com/150x80/374151/FFFFFF?text=HealthPlus',
    },
    {
      id: 6,
      name: 'EduTech',
      logo: 'https://via.placeholder.com/150x80/374151/FFFFFF?text=EduTech',
    },
  ];

  return (
    <section className='py-12 sm:py-16 bg-dark-800'>
      <div className='container-custom'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-8 sm:mb-12'
        >
          <h3 className='text-xl sm:text-2xl font-semibold text-gray-300 mb-2'>
            Trusted by Leading Brands
          </h3>
          <p className='text-base sm:text-lg text-gray-400 px-4'>
            We've helped these companies create unforgettable experiences
          </p>
        </motion.div>

        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 items-center'>
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className='flex justify-center items-center p-3 sm:p-4 bg-dark-700/30 rounded-xl border border-dark-600/20 hover:border-primary-500/30 transition-all duration-300'
            >
              <img
                src={client.logo}
                alt={client.name}
                className='max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity duration-300'
                style={{ maxHeight: '60px' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
