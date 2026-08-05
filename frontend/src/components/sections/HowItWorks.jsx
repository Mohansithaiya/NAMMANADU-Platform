/**
 * HowItWorks.jsx
 * ============================================================
 * 4-step animated process section showing the citizen journey:
 * Report → AI Processes → Track → Resolved
 *
 * Desktop: horizontal timeline with connecting line
 * Mobile: vertical stacked steps
 * ============================================================
 */
import GoldBadge from '../ui/GoldBadge';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../../hooks/useScrollAnimation';
import './HowItWorks.css';

const STEPS = [
  {
    id:          'step-report',
    step:        '01',
    icon:        ReportIcon,
    title:       'Report',
    description: 'Describe your civic issue in Tamil or English — broken roads, water supply, streetlights. Any topic, any location.',
    color:       'step-color-1',
  },
  {
    id:          'step-ai',
    step:        '02',
    icon:        AiProcessIcon,
    title:       'AI Processes',
    description: 'Our AI auto-categorises the complaint, determines urgency, and routes it directly to the responsible department — in seconds.',
    color:       'step-color-2',
  },
  {
    id:          'step-track',
    step:        '03',
    icon:        TrackIcon,
    title:       'Track',
    description: 'Follow your complaint in real time. Every status change — Filed, Assigned, In Progress — is visible to you instantly.',
    color:       'step-color-3',
  },
  {
    id:          'step-resolved',
    step:        '04',
    icon:        ResolvedIcon,
    title:       'Resolved',
    description: 'You receive a notification once the issue is resolved. Rate the department response, creating accountability at every level.',
    color:       'step-color-4',
  },
];

/* ── SVG Icons ─────────────────────────────────────────────── */
function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function AiProcessIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 12l10 5 10-5M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function TrackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ResolvedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────── */
function HowItWorks() {
  const headerRef = useScrollAnimation(0.2);
  const stepsRef  = useStaggeredScrollAnimation(0.08, 130);

  return (
    <section
      className="how-it-works section"
      id="complaints"
      aria-labelledby="how-it-works-title"
    >
      <div className="container">

        {/* Header */}
        <div ref={headerRef} className="section-header reveal">
          <GoldBadge>Citizen Journey</GoldBadge>
          <h2 id="how-it-works-title">How It Works</h2>
          <p>
            From complaint to resolution — four simple steps powered by
            AI and built for transparency.
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="how-it-works__steps"
          role="list"
          aria-label="Process steps"
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`how-it-works__step reveal ${step.color}`}
                role="listitem"
              >
                {/* Connector line (hidden on last step) */}
                {index < STEPS.length - 1 && (
                  <div className="how-it-works__connector" aria-hidden="true" />
                )}

                {/* Step number */}
                <div className="how-it-works__step-number" aria-hidden="true">
                  {step.step}
                </div>

                {/* Icon circle */}
                <div className="how-it-works__icon-wrap" aria-hidden="true">
                  <div className="how-it-works__icon">
                    <Icon />
                  </div>
                </div>

                {/* Text */}
                <div className="how-it-works__text">
                  <h3 className="how-it-works__step-title">{step.title}</h3>
                  <p className="how-it-works__step-desc">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="how-it-works__note reveal" aria-live="polite">
          ✦ &nbsp;The entire journey — from filing to resolution — is tracked in real time, visible to citizens at every stage.
        </p>
      </div>
    </section>
  );
}

export default HowItWorks;
