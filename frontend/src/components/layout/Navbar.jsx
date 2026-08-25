import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services / Features', href: '#services' },
];

function TnEmblem() {
  return (
    <svg
      className="navbar__emblem-svg"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index * 45 * Math.PI) / 180;
        const x1 = 18 + 6 * Math.cos(angle);
        const y1 = 18 + 6 * Math.sin(angle);
        const x2 = 18 + 14 * Math.cos(angle);
        const y2 = 18 + 14 * Math.sin(angle);

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.7"
          />
        );
      })}
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
    </svg>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((previous) => !previous),
    [],
  );

  return (
    <header className={`navbar${isScrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" aria-label="NAMMANADU — go to homepage">
          <span className="navbar__emblem">
            <TnEmblem />
          </span>
          <span className="navbar__brand">
            <span className="navbar__brand-name">NAMMANADU</span>
            <span className="navbar__brand-tamil" lang="ta">நம்ம நாடு</span>
          </span>
        </Link>

        <nav className="navbar__nav" aria-label="Primary navigation">
          <ul className="navbar__nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="navbar__nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <Link to="/login" className="navbar__login-link">
            Login
          </Link>
          <Link to="/register" className="navbar__cta">
            Create Account
          </Link>
        </div>

        <button
          className={`navbar__hamburger${isMobileMenuOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          type="button"
        >
          <span className="navbar__bar" />
          <span className="navbar__bar" />
          <span className="navbar__bar" />
        </button>
      </div>

      <div
        id="mobile-nav-menu"
        className={`navbar__mobile${isMobileMenuOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul className="navbar__mobile-list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="navbar__mobile-link"
                  onClick={closeMobileMenu}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar__mobile-footer">
            <Link to="/login" className="navbar__mobile-login" onClick={closeMobileMenu} tabIndex={isMobileMenuOpen ? 0 : -1}>
              Login
            </Link>
            <Link to="/register" className="navbar__mobile-cta" onClick={closeMobileMenu} tabIndex={isMobileMenuOpen ? 0 : -1}>
              Create Account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
