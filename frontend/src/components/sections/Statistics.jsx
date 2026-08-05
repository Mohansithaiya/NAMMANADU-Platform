/**
 * Statistics.jsx
 * ============================================================
 * Trust-building stats section with animated counters.
 * Uses feature-based statistics (no fabricated complaint counts).
 *
 * Stats: 38 Districts | 6 AI Features | 4 User Roles | Real-Time
 * ============================================================
 */
import AnimatedCounter from '../ui/AnimatedCounter';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../../hooks/useScrollAnimation';
import './Statistics.css';

const STATS = [
  {
    id:       'stat-districts',
    value:    38,
    suffix:   '',
    label:    'Districts Covered',
    sublabel: 'Across all of Tamil Nadu',
    icon:     MapIcon,
  },
  {
    id:       'stat-ai-features',
    value:    6,
    suffix:   '',
    label:    'AI-Powered Features',
    sublabel: 'Categorisation, eligibility, fraud detection & more',
    icon:     AiIcon,
  },
  {
    id:       'stat-roles',
    value:    4,
    suffix:   '',
    label:    'User Roles',
    sublabel: 'Citizens, Departments, Ward Admins, Super Admins',
    icon:     RolesIcon,
  },
  {
    id:       'stat-realtime',
    value:    null,          // no number — special "live" card
    label:    'Real-Time Tracking',
    sublabel: 'Every complaint status update, live as it happens',
    icon:     LiveIcon,
    isLive:   true,
  },
];

/* ── SVG Icons ─────────────────────────────────────────────── */
function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="2" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="16" y1="6" x2="16" y2="22" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function AiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function RolesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function LiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────── */
function Statistics() {
  const sectionRef = useScrollAnimation(0.15);
  const statsRef   = useStaggeredScrollAnimation(0.10, 120);

  return (
    <section
      className="statistics section"
      id="schemes"
      aria-labelledby="statistics-title"
    >
      {/* Background accent */}
      <div className="statistics__bg" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div ref={sectionRef} className="statistics__header reveal">
          <h2 id="statistics-title" className="statistics__title">
            Built to Scale Across Tamil Nadu
          </h2>
          <p className="statistics__subtitle">
            A platform engineered for every district, every department, and every citizen.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="statistics__grid"
          role="list"
          aria-label="Platform statistics"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`statistics__card reveal${stat.isLive ? ' statistics__card--live' : ''}`}
                id={stat.id}
                role="listitem"
              >
                {/* Icon */}
                <div className="statistics__icon" aria-hidden="true">
                  <Icon />
                </div>

                {/* Value */}
                <div className="statistics__value" aria-label={`${stat.label}: ${stat.value ?? 'Real-Time'}`}>
                  {stat.isLive ? (
                    <div className="statistics__live-display">
                      <span className="statistics__live-dot" aria-hidden="true" />
                      <span className="statistics__live-label">Live</span>
                    </div>
                  ) : (
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={1600}
                      className="statistics__number"
                    />
                  )}
                </div>

                {/* Labels */}
                <div className="statistics__text">
                  <p className="statistics__label">{stat.label}</p>
                  <p className="statistics__sublabel">{stat.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
