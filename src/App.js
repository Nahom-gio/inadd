import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import About from './components/About';
import Blog from './components/Blog';
import ClientLogos from './components/ClientLogos';
import Clients from './components/Clients';
import Contact from './components/Contact';
import CookieConsent from './components/CookieConsent';
import ErrorBoundary from './components/ErrorBoundary';
import FeaturedProjects from './components/FeaturedProjects';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Newsletter from './components/Newsletter';
import Portfolio from './components/Portfolio';
import ServiceHighlights from './components/ServiceHighlights';
import Services from './components/Services';

import { initPerformanceMonitoring } from './utils/performance';
import { registerServiceWorker } from './utils/serviceWorker';

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Register service worker for PWA capabilities
    registerServiceWorker();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className='App bg-dark-900 text-white min-h-screen w-full overflow-x-hidden layout-stable stable-container'>
          <Navbar />
          <Hero />
          <ServiceHighlights />
          <FeaturedProjects />
          <ClientLogos />
          <About />
          <Services />
          <Portfolio />
          <Clients />
          <Blog />
          <Contact />
          <Newsletter />
          <Footer />
        </div>
        <CookieConsent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
