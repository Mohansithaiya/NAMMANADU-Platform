/**
 * ServicesPreview.jsx
 * ============================================================
 * Showcases the 4 role-based service portals available on
 * the platform. Each card represents one user role with a
 * distinct icon, description, and feature highlights.
 *
 * Layout: 1-col mobile → 2-col tablet → 2x2 desktop
 * ============================================================
 */
import GoldBadge from '../ui/GoldBadge';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../../hooks/useScrollAnimation';
import './ServicesPreview.css';

const SERVICES = [
  {
    id:       'citizen-portal',
    role:     'Citizen',
    icon:     CitizenIcon,
    title:    'Citizen Portal',
    subtitle: 'File, Track & Discover',
    description:
      'Report civic issues, track resolution in real time, and discover government welfare schemes you qualify for — all from one place.',
    features: ['Complaint submission', 'Live status tracking', 'Scheme eligibility', 'Push notifications'],
    badge:    'For Citizens',
    accent:   'accent-gold',
  },
  {
    id:       'dept-dashboard',
    role:     'Department',
    icon:     DeptIcon,
    title:    'Department Dashboard',
    subtitle: 'Manage & Resolve',
    description:
      'Department workers receive AI-routed complaints, update status, upload resolution evidence, and communicate with citizens directly.',
    features: ['Assigned complaint queue', 'Status workflow', 'Evidence upload', 'Citizen communication'],
    badge:    'For Departments',
    accent:   'accent-blue',
  },
  {
    id:       'ward-admin',
    role:     'Ward Admin',
    icon:     WardIcon,
    title:    'Ward Admin Panel',
    subtitle: 'Route & Oversee',
    description:
      'Ward-level administrators manage worker assignments, oversee complaint routing, and monitor resolution performance across their zone.',
    features: ['Worker assignment', 'Ward analytics', 'Complaint routing', 'Performance reports'],
    badge:    'For Ward Admins',
    accent:   'accent-green',
  },
  {
    id:       'super-admin',
    role:     'Super Admin',
    icon:     SuperAdminIcon,
    title:    'Super Admin Console',
    subtitle: 'Intelligence & Control',
    description:
      'System-wide visibility across all wards and departments — analytics, department performance, fraud alerts, and platform health monitoring.',
    features: ['Cross-ward analytics', 'AI fraud alerts', 'Dept performance', 'System health'],
    badge:    'For Super Admins',
    accent:   'accent-purple',
  },
];

/* ── SVG Icons ─────────────────────────────────────────────── */
function CitizenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function DeptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 8h4M6 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function WardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function SuperAdminIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────── */
function ServicesPreview() {
  const headerRef  = useScrollAnimation(0.2);
  const cardsRef   = useStaggeredScrollAnimation(0.08, 110);

  return (
    <section
      className="services section"
      id="track"
      aria-labelledby="services-title"
    >
      <div className="container">

        {/* Header */}
        <div ref={headerRef} className="section-header reveal">
          <GoldBadge>Role-Based Access</GoldBadge>
          <h2 id="services-title">Services Built for Every Role</h2>
          <p>
            Four distinct dashboards, each purpose-built for the people who use them —
            citizens, workers, admins, and system supervisors.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div
          ref={cardsRef}
          className="services__grid"
          aria-label="Service portals by user role"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`services__card reveal ${service.accent}`}
                id={service.id}
              >
                {/* Card header */}
                <div className="services__card-header">
                  <div className="services__icon-wrap" aria-hidden="true">
                    <Icon />
                  </div>
                  <span className="services__badge">{service.badge}</span>
                </div>

                {/* Card body */}
                <div className="services__card-body">
                  <p className="services__subtitle">{service.subtitle}</p>
                  <h3 className="services__card-title">{service.title}</h3>
                  <p className="services__card-desc">{service.description}</p>
                </div>

                {/* Feature list */}
                <ul
                  className="services__features"
                  aria-label={`${service.title} features`}
                >
                  {service.features.map((feat) => (
                    <li key={feat} className="services__feature-item">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M4 6l1.5 1.5L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#"
                  className="services__card-cta"
                  id={`${service.id}-cta`}
                  aria-label={`Access ${service.title}`}
                >
                  Access Portal
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesPreview;
