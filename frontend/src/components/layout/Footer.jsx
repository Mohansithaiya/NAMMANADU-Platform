import { Link } from 'react-router-dom';
import './Footer.css';

const FOOTER_LINKS = {
  Explore: [
    { label: 'Home', href: '#home' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Services / Features', href: '#services' },
  ],
  'Get started': [
    { label: 'Login', to: '/login' },
    { label: 'Create Account', to: '/register' },
  ],
};

function FooterEmblem() {
  return (
    <svg className="footer__emblem-svg" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index * 45 * Math.PI) / 180;
        const x1 = 18 + 6 * Math.cos(angle);
        const y1 = 18 + 6 * Math.sin(angle);
        const x2 = 18 + 14 * Math.cos(angle);
        const y2 = 18 + 14 * Math.sin(angle);
        return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" opacity="0.6" />;
      })}
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
    </svg>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="NAMMANADU footer">
      <div className="footer__divider" aria-hidden="true" />

      <div className="footer__main container">
        <div className="footer__brand">
          <a href="#home" className="footer__logo" aria-label="NAMMANADU — go to homepage">
            <span className="footer__emblem" aria-hidden="true"><FooterEmblem /></span>
            <span>
              <span className="footer__brand-name">NAMMANADU</span>
              <span className="footer__brand-tamil" lang="ta">நம்ம நாடு</span>
            </span>
          </a>

          <p className="footer__tagline">
            An AI-powered citizen governance platform being built for clearer civic communication in Tamil Nadu.
          </p>

          <div className="footer__status" aria-label="Phase 1 foundation in development">
            <span className="footer__status-dot" aria-hidden="true" />
            <span>Phase 1 foundation in development</span>
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className="footer__col">
            <h3 className="footer__col-heading">{heading}</h3>
            <ul className="footer__col-list">
              {links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="footer__col-link">{link.label}</Link>
                  ) : (
                    <a href={link.href} className="footer__col-link">{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner container">
          <p className="footer__copyright">&copy; {currentYear} NAMMANADU. Built for Tamil Nadu citizens.</p>
          <p className="footer__attribution">This is an independent civic-tech project, not an official government service.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
