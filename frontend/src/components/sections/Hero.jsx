import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import GoldBadge from '../ui/GoldBadge';
import './Hero.css';

function createParticles(count, width, height) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.6 + 0.4,
    alpha: Math.random() * 0.28 + 0.06,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
  }));
}

function Hero() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      particlesRef.current = createParticles(24, width, height);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(245, 166, 35, ${particle.alpha})`;
        context.fill();
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__black-fade" aria-hidden="true" />
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__grid-overlay" aria-hidden="true" />
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />

      <div className="hero__content-wrapper container">
        <div className="hero__content">
          <div className="hero__badge-wrapper" style={{ '--delay': '0.35s' }}>
            <GoldBadge icon="✦">AI-powered civic governance for Tamil Nadu</GoldBadge>
          </div>

          <h1 id="hero-title" className="hero__title" style={{ '--delay': '0.5s' }}>
            NAMMANADU
          </h1>

          <p className="hero__subtitle" style={{ '--delay': '0.65s' }}>
            A clearer connection between Tamil Nadu citizens and the public services they rely on.
          </p>

          <p className="hero__tamil" lang="ta" style={{ '--delay': '0.8s' }}>
            உங்கள் குரல் • உங்கள் நகரம் • உங்கள் நாடு
          </p>

          <p className="hero__description" style={{ '--delay': '0.95s' }}>
            NAMMANADU is being built to help citizens raise civic concerns, understand the next step,
            and follow the journey from a reported issue to a response — with AI-assisted support and
            transparency at the centre.
          </p>

          <div className="hero__ctas" style={{ '--delay': '1.1s' }}>
            <Link to="/register" className="hero__btn-primary" id="hero-create-account-btn">
              Create Account
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link to="/login" className="hero__btn-secondary" id="hero-login-btn">
              Login
            </Link>
          </div>

          <div className="hero__trust" style={{ '--delay': '1.25s' }}>
            <span className="hero__trust-dot" aria-hidden="true" />
            <span className="hero__trust-text">Citizen-first · Tamil Nadu focused · Built for clarity</span>
          </div>
        </div>

        <div className="hero__visual" aria-label="Tamil Nadu context">
          <div className="hero__map-container">
            <div className="hero__map-glow" aria-hidden="true" />
            <img
              src="/images/tamilnadu-glow.png"
              alt="Illustrated outline of Tamil Nadu"
              className="hero__map-img"
              loading="eager"
            />
          </div>
          <div className="hero__visual-note">
            <span className="hero__visual-line" aria-hidden="true" />
            <span>Designed for the people of Tamil Nadu</span>
          </div>
        </div>
      </div>

      <a href="#how-it-works" className="hero__scroll-indicator" aria-label="Scroll to How It Works">
        <span className="hero__scroll-label">Explore</span>
        <span className="hero__scroll-line" aria-hidden="true">
          <span className="hero__scroll-dot" />
        </span>
      </a>
    </section>
  );
}

export default Hero;
