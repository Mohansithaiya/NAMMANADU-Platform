/**
 * Hero.jsx — Updated Hero section with static PNG Tamil Nadu map
 * Uses /images/tamilnadu-glow.png directly with custom smooth CSS animations.
 */
import { useEffect, useRef } from 'react';
import GoldBadge from '../ui/GoldBadge';
import './Hero.css';

/* ── Floating Background Particles ─────────────────────────── */
function createParticles(count, w, h) {
  return Array.from({ length: count }, () => ({
    x:      Math.random() * w,
    y:      Math.random() * h,
    r:      Math.random() * 1.6 + 0.4,
    alpha:  Math.random() * 0.28 + 0.06,
    vx:     (Math.random() - 0.5) * 0.20,
    vy:     (Math.random() - 0.5) * 0.20,
  }));
}

function Hero() {
  const canvasRef    = useRef(null);
  const frameRef     = useRef(null);
  const particlesRef = useRef([]);

  /* Canvas background floating particles */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      particlesRef.current = createParticles(24, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particlesRef.current.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0)  p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0)  p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 166, 35, ${p.alpha})`;
        ctx.fill();
      });
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(frameRef.current); ro.disconnect(); };
  }, []);

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">

      {/* ── Fade-from-black overlay ── */}
      <div className="hero__black-fade" aria-hidden="true" />

      {/* ── Radial gradient background ── */}
      <div className="hero__bg" aria-hidden="true" />

      {/* ── Grid overlay ── */}
      <div className="hero__grid-overlay" aria-hidden="true" />

      {/* ── Floating background particles ── */}
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />

      {/* ── Hero Content & Map Layout ── */}
      <div className="hero__content-wrapper container">
        {/* Left / Top: Hero Text Content */}
        <div className="hero__content">

          {/* Badge */}
          <div className="hero__badge-wrapper" style={{ '--delay': '0.65s' }}>
            <GoldBadge icon="✦">Powered by AI · Built for Tamil Nadu</GoldBadge>
          </div>

          {/* Title */}
          <h1
            id="hero-title"
            className="hero__title"
            style={{ '--delay': '0.80s' }}
          >
            NAMMANADU
          </h1>

          {/* Subtitle */}
          <p className="hero__subtitle" style={{ '--delay': '0.95s' }}>
            AI-Powered Digital Governance Platform for Tamil Nadu
          </p>

          {/* Tamil line */}
          <p
            className="hero__tamil"
            lang="ta"
            aria-label="Your voice, your government, your future"
            style={{ '--delay': '1.10s' }}
          >
            உங்கள் குரல் &bull; உங்கள் அரசு &bull; உங்கள் எதிர்காலம்
          </p>

          {/* CTAs */}
          <div className="hero__ctas" style={{ '--delay': '1.25s' }}>
            <a href="#" className="hero__btn-primary" id="hero-get-started-btn">
              Get Started
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#services" className="hero__btn-secondary" id="hero-explore-btn">
              Explore Services
            </a>
          </div>

          {/* Trust row */}
          <div className="hero__trust" style={{ '--delay': '1.40s' }}>
            <span className="hero__trust-dot" aria-hidden="true" />
            <span className="hero__trust-text">Secure · Transparent · Real-Time</span>
          </div>
        </div>

        {/* Right / Below: Tamil Nadu Map PNG Image */}
        <div className="hero__map-container">
          <img
            src="/images/tamilnadu-glow.png"
            alt="Tamil Nadu Map Outline"
            className="hero__map-img"
            loading="eager"
          />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="hero__scroll-indicator" aria-hidden="true" style={{ '--delay': '1.60s' }}>
        <span className="hero__scroll-label">Scroll</span>
        <div className="hero__scroll-line">
          <div className="hero__scroll-dot" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
