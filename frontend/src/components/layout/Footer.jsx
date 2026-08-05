/**
 * Footer.jsx
 * ============================================================
 * Full footer with:
 * - Brand column (logo, tagline, Tamil subtitle)
 * - 3 link columns (Platform, Services, Legal)
 * - Bottom bar (copyright + attribution)
 * ============================================================
 */
import './Footer.css';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Home',       href: '#home' },
    { label: 'Services',   href: '#services' },
    { label: 'Complaints', href: '#complaints' },
    { label: 'Track',      href: '#track' },
    { label: 'Schemes',    href: '#schemes' },
    { label: 'About',      href: '#about' },
  ],
  Services: [
    { label: 'Citizen Portal',   href: '#citizen-portal' },
    { label: 'Dept Dashboard',   href: '#dept-dashboard' },
    { label: 'Ward Admin Panel', href: '#ward-admin' },
    { label: 'Super Admin',      href: '#super-admin' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use',   href: '#' },
    { label: 'Accessibility',  href: '#' },
    { label: 'Contact Us',     href: '#' },
  ],
};

/* 8-spoke emblem (same as navbar) */
function FooterEmblem() {
  return (
    <svg
      className="footer__emblem-svg"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
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
            strokeWidth="1"
            opacity="0.6"
          />
        );
      })}
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
    </svg>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="NAMMANADU Platform Footer">

      {/* ── Top divider ── */}
      <div className="footer__divider" aria-hidden="true" />

      {/* ── Main footer content ── */}
      <div className="footer__main container">

        {/* Brand Column */}
        <div className="footer__brand">
          <a href="#home" className="footer__logo" aria-label="NAMMANADU Home">
            <div className="footer__emblem" aria-hidden="true">
              <FooterEmblem />
            </div>
            <div>
              <span className="footer__brand-name">NAMMANADU</span>
              <span className="footer__brand-tamil" lang="ta">நம்ம நாடு</span>
            </div>
          </a>

          <p className="footer__tagline">
            AI-Powered Digital Governance Platform for Tamil Nadu.
            Bridging citizens and government through transparency and technology.
          </p>

          {/* Status badge */}
          <div className="footer__status" aria-label="Platform status: In development">
            <span className="footer__status-dot" aria-hidden="true" />
            <span>Platform in active development</span>
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className="footer__col">
            <h3 className="footer__col-heading">{heading}</h3>
            <ul className="footer__col-list" role="list">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="footer__col-link"
                    id={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner container">
          <p className="footer__copyright">
            &copy; {currentYear} NAMMANADU Platform. Built for Tamil Nadu citizens.
          </p>
          <p className="footer__attribution">
            <span className="footer__attribution-dot" aria-hidden="true">✦</span>
            &nbsp; Powered by AI &nbsp;·&nbsp; Tamil Nadu, India
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
