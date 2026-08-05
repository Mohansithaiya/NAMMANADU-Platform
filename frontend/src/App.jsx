/**
 * App.jsx
 * ============================================================
 * NAMMANADU Platform — Root Application Component
 *
 * Composes the landing page from reusable section components.
 * Import order reflects visual top-to-bottom page order.
 *
 * Sections:
 *   Navbar → Hero → Features → HowItWorks →
 *   ServicesPreview → Statistics → CallToAction → Footer
 * ============================================================
 */
import './styles/animations.css';

import Navbar          from './components/layout/Navbar';
import Hero            from './components/sections/Hero';
import Features        from './components/sections/Features';
import HowItWorks      from './components/sections/HowItWorks';
import ServicesPreview from './components/sections/ServicesPreview';
import Statistics      from './components/sections/Statistics';
import CallToAction    from './components/sections/CallToAction';
import Footer          from './components/layout/Footer';

function App() {
  return (
    <>
      {/* Skip to main content — accessibility */}
      <a href="#home" className="visually-hidden" id="skip-to-main">
        Skip to main content
      </a>

      {/* ── Sticky Navigation ── */}
      <Navbar />

      {/* ── Main Page Content ── */}
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <ServicesPreview />
        <Statistics />
        <CallToAction />
      </main>

      {/* ── Site Footer ── */}
      <Footer />
    </>
  );
}

export default App;