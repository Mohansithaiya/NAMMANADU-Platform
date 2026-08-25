/*
 * NAMMANADU — citizen-first landing page composition.
 *
 * The landing page explains the platform vision without implying that
 * complaint submission or AI processing is already available in Phase 1.
 */
import './styles/animations.css';

import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import HowItWorks from './components/sections/HowItWorks';
import ServicesPreview from './components/sections/ServicesPreview';
import CallToAction from './components/sections/CallToAction';
import Footer from './components/layout/Footer';

function App() {
  return (
    <>
      <a href="#home" className="visually-hidden" id="skip-to-main">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <HowItWorks />
        <Features />
        <ServicesPreview />
        <CallToAction />
      </main>

      <Footer />
    </>
  );
}

export default App;
