/**
 * CallToAction.jsx
 * ============================================================
 * Final CTA section before the footer.
 * Premium gradient card with strong CTAs and social proof.
 * ============================================================
 */
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './CallToAction.css';

function CallToAction() {
  const contentRef = useScrollAnimation(0.15);

  return (
    <section
      className="cta-section section"
      id="about"
      aria-labelledby="cta-title"
    >
      <div className="container">
        <div ref={contentRef} className="cta-card reveal">

          {/* Background decorative map */}
          <div className="cta-card__bg-map" aria-hidden="true">
            <svg
              viewBox="0 0 200 280"
              xmlns="http://www.w3.org/2000/svg"
              className="cta-card__map-svg"
              aria-hidden="true"
            >
              <path
                d="M 184,19 Q 192,30 190,52 Q 188,68 184,85 Q 178,106 172,122 Q 167,140 166,152 Q 163,168 158,182 Q 152,196 148,210 Q 140,226 132,240 Q 120,256 108,266 Q 98,274 88,278 Q 76,275 66,264 Q 54,250 44,232 Q 35,214 28,194 Q 22,172 20,150 Q 18,130 20,110 Q 22,97 28,86 Q 38,70 58,58 Q 78,45 100,37 Q 124,29 150,22 Q 166,16 178,13 Z"
                fill="none"
                stroke="rgba(245, 158, 11, 0.12)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="cta-card__content">
            {/* Eyebrow */}
            <div className="cta-card__eyebrow" aria-hidden="true">
              <span className="cta-card__dot" />
              <span>Ready to make a difference?</span>
            </div>

            {/* Title */}
            <h2 id="cta-title" className="cta-card__title">
              Your Voice Shapes Tamil Nadu.
              <br />
              <span className="cta-card__title-gold">Let Technology Deliver It.</span>
            </h2>

            {/* Tamil subtitle */}
            <p className="cta-card__tamil" lang="ta" aria-label="Join thousands of Tamil Nadu citizens">
              தமிழக மக்களுடன் இணைந்து, உங்கள் குரலை எங்கள் தொழில்நுட்பம் வழி அரசிடம் கொண்டு செல்லுங்கள்.
            </p>

            {/* Subtitle */}
            <p className="cta-card__desc">
              Join citizens across Tamil Nadu who are using NAMMANADU to report issues,
              track resolutions, and discover the welfare schemes they deserve.
            </p>

            {/* Buttons */}
            <div className="cta-card__buttons">
              <a
                href="#"
                className="cta-card__btn-primary"
                id="cta-get-started-btn"
                aria-label="Get started with NAMMANADU"
              >
                Get Started — It's Free
              </a>
              <a
                href="#services"
                className="cta-card__btn-secondary"
                id="cta-explore-btn"
                aria-label="Explore platform services"
              >
                Explore Platform
              </a>
            </div>

            {/* Trust note */}
            <p className="cta-card__trust-note" aria-label="Platform commitment">
              🔒 &nbsp;Secure authentication · No spam · Built for Tamil Nadu citizens
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
