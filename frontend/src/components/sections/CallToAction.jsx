import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './CallToAction.css';

function CallToAction() {
  const contentRef = useScrollAnimation(0.15);

  return (
    <section className="cta-section section" aria-labelledby="cta-title">
      <div className="container">
        <div ref={contentRef} className="cta-card reveal">
          <div className="cta-card__bg-map" aria-hidden="true">
            <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" className="cta-card__map-svg">
              <path
                d="M184 19Q192 30 190 52q-2 16-6 33-6 21-12 37-5 18-6 30-3 16-8 30-6 14-10 28-8 16-16 30-12 16-24 26-10 8-20 12-12-3-22-14-12-14-22-32-9-18-16-38-6-22-8-44-2-20 0-40 2-13 8-24 10-16 30-28 20-13 42-21 24-8 50-15 16-6 28-9Z"
                fill="none"
                stroke="rgba(245, 158, 11, 0.13)"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="cta-card__content">
            <div className="cta-card__eyebrow">
              <span className="cta-card__dot" aria-hidden="true" />
              <span>A citizen-first foundation</span>
            </div>

            <h2 id="cta-title" className="cta-card__title">
              Your voice belongs
              <br />
              <span className="cta-card__title-gold">in the conversation.</span>
            </h2>

            <p className="cta-card__tamil" lang="ta">
              உங்கள் குரல் • உங்கள் நகரம் • உங்கள் நாடு
            </p>

            <p className="cta-card__desc">
              Start with a NAMMANADU citizen account. The platform will grow step by step around
              clearer civic communication, transparent progress, and better access to public services.
            </p>

            <div className="cta-card__buttons">
              <Link to="/register" className="cta-card__btn-primary" id="cta-create-account-btn">
                Create Account
              </Link>
              <Link to="/login" className="cta-card__btn-secondary" id="cta-login-btn">
                Login
              </Link>
            </div>

            <p className="cta-card__trust-note">
              Built with care for Tamil Nadu citizens · Not an official government service
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
