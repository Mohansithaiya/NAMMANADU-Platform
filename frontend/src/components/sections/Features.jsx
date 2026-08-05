/**
 * Features.jsx
 * ============================================================
 * 6 glassmorphism feature cards highlighting the platform's
 * AI-powered capabilities. Cards reveal with staggered scroll
 * animation using IntersectionObserver.
 * Grid: 1-col mobile → 2-col tablet → 3-col desktop
 * ============================================================
 */
import GoldBadge from '../ui/GoldBadge';
import { useStaggeredScrollAnimation } from '../../hooks/useScrollAnimation';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './Features.css';

/* ── Feature data ─────────────────────────────────────────── */
const FEATURES = [
  {
    id:          'ai-filing',
    icon:        AiIcon,
    title:       'AI Complaint Filing',
    description: 'Describe any civic issue in Tamil or English. Our AI auto-formats, categorises the department, and assigns urgency — instantly.',
    tag:         'Core Feature',
  },
  {
    id:          'realtime-tracking',
    icon:        TrackingIcon,
    title:       'Real-Time Tracking',
    description: 'Every complaint moves through Filed → Assigned → In Progress → Resolved. Citizens see each stage as it happens, with live updates.',
    tag:         'Transparency',
  },
  {
    id:          'scheme-engine',
    icon:        SchemeIcon,
    title:       'Scheme Eligibility Engine',
    description: 'AI evaluates your profile against hundreds of government welfare programmes and surfaces the schemes you qualify for — no searching needed.',
    tag:         'AI-Powered',
  },
  {
    id:          'role-dashboards',
    icon:        DashboardIcon,
    title:       'Role-Based Dashboards',
    description: 'Purpose-built interfaces for Citizens, Department Workers, Ward Admins, and Super Admins — each designed for their specific workflows.',
    tag:         'Multi-Role',
  },
  {
    id:          'fraud-detection',
    icon:        ShieldIcon,
    title:       'Fraud Detection',
    description: 'AI flags duplicate and suspicious complaints before they reach department workers, reducing noise and protecting system integrity.',
    tag:         'Security',
  },
  {
    id:          'multilingual',
    icon:        LanguageIcon,
    title:       'Multilingual Support',
    description: 'Tamil and English interfaces built for every citizen, regardless of language preference or literacy level — maximising reach across Tamil Nadu.',
    tag:         'Accessibility',
  },
];

/* ── SVG Icons (inline, Feather-style thin lines) ─────────── */
function AiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function TrackingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}
function SchemeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────── */
function Features() {
  const headerRef = useScrollAnimation(0.2);
  const gridRef   = useStaggeredScrollAnimation(0.08, 100);

  return (
    <section className="features section" id="services" aria-labelledby="features-title">
      <div className="container">

        {/* Section Header */}
        <div ref={headerRef} className="section-header reveal">
          <GoldBadge>Platform Capabilities</GoldBadge>
          <h2 id="features-title">
            Everything Civic Governance Needs
          </h2>
          <p>
            Six AI-powered features that turn the gap between citizens and government
            into a seamless, transparent, real-time connection.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <ul
          ref={gridRef}
          className="features__grid"
          role="list"
          aria-label="Platform features"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.id} className="features__card reveal">
                <div className="features__card-inner" role="article" aria-label={feature.title}>
                  {/* Icon */}
                  <div className="features__icon" aria-hidden="true">
                    <Icon />
                  </div>

                  {/* Tag */}
                  <span className="features__tag">{feature.tag}</span>

                  {/* Content */}
                  <h3 className="features__card-title">{feature.title}</h3>
                  <p className="features__card-desc">{feature.description}</p>

                  {/* Hover accent line */}
                  <div className="features__accent-line" aria-hidden="true" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Features;
