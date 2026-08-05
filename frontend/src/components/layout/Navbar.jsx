/**
 * Navbar.jsx
 * ============================================================
 * Sticky top navigation with:
 * - Glass morphism appearance on scroll
 * - Desktop: logo + nav links + Citizen Login CTA
 * - Mobile: hamburger → full-screen slide-down menu
 * - Smooth scroll to sections via href anchors
 * - Proper ARIA attributes for accessibility
 * ============================================================
 */
import { useState, useEffect, useCallback } from 'react';
import './Navbar.css';

/* Navigation link definitions */
const NAV_LINKS = [
  { label: 'Home',       href: '#home' },
  { label: 'Services',   href: '#services' },
  { label: 'Complaints', href: '#complaints' },
  { label: 'Track',      href: '#track' },
  { label: 'Schemes',    href: '#schemes' },
  { label: 'About',      href: '#about' },
];

/* Tamil Nadu emblem — simplified star/dharma-wheel symbol */
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
      {/* 8-spoke wheel */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 18 + 6 * Math.cos(angle);
        const y1 = 18 + 6 * Math.sin(angle);
        const x2 = 18 + 14 * Math.cos(angle);
        const y2 = 18 + 14 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1} y1={y1}
            x2={x2} y2={y2}
            stroke="currentColor"
            strokeWidth="1.0"
            opacity="0.7"
          />
        );
      })}
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
    </svg>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  /* ── Close mobile menu on ESC ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    []
  );

  return (
    <header
      className={`navbar${isScrolled ? ' navbar--scrolled' : ''}`}
      role="banner"
    >
      <div className="navbar__inner container">

        {/* ── Logo ── */}
        <a href="#home" className="navbar__logo" aria-label="NAMMANADU — go to homepage">
          <div className="navbar__emblem">
            <TnEmblem />
          </div>
          <div className="navbar__brand">
            <span className="navbar__brand-name">NAMMANADU</span>
            <span className="navbar__brand-tamil" lang="ta">நம்ம நாடு</span>
          </div>
        </a>

        {/* ── Desktop Navigation ── */}
        <nav className="navbar__nav" aria-label="Primary navigation">
          <ul className="navbar__nav-list" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="navbar__nav-link"
                  id={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="navbar__actions">
          <a
            href="#"
            className="navbar__cta"
            id="navbar-citizen-login-btn"
            aria-label="Citizen Login"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 7a3 3 0 100-6 3 3 0 000 6zM1.5 13a5.5 5.5 0 0111 0"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Citizen Login
          </a>
        </div>

        {/* ── Hamburger (mobile only) ── */}
        <button
          className={`navbar__hamburger${isMobileMenuOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          id="hamburger-btn"
        >
          <span className="navbar__bar" />
          <span className="navbar__bar" />
          <span className="navbar__bar" />
        </button>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      <div
        id="mobile-nav-menu"
        className={`navbar__mobile${isMobileMenuOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <nav aria-label="Mobile navigation">
          <ul className="navbar__mobile-list" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="navbar__mobile-link"
                  onClick={closeMobileMenu}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                  id={`mobile-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  <svg
                    className="navbar__mobile-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8h8M9 5l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar__mobile-footer">
            <a
              href="#"
              className="navbar__mobile-cta"
              onClick={closeMobileMenu}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              id="mobile-citizen-login-btn"
            >
              Citizen Login
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
