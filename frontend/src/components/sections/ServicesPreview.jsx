import GoldBadge from '../ui/GoldBadge';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../../hooks/useScrollAnimation';
import './ServicesPreview.css';

const SERVICES = [
  {
    id: 'citizen-account',
    icon: CitizenIcon,
    eyebrow: 'Available in Phase 1',
    title: 'A secure citizen account',
    description: 'Create a personal account that gives you a clear, trusted starting point for your future civic interactions.',
    points: ['Simple signup', 'Secure login', 'Personal profile'],
    accent: 'accent-gold',
  },
  {
    id: 'civic-reporting',
    icon: ReportIcon,
    eyebrow: 'Coming next',
    title: 'A simpler way to raise concerns',
    description: 'The next stage will help you share a local civic issue with words and, later, supporting photos from your phone.',
    points: ['Short description', 'Photo support planned', 'Clear review step'],
    accent: 'accent-blue',
  },
  {
    id: 'transparent-follow-up',
    icon: TrackIcon,
    eyebrow: 'Long-term vision',
    title: 'Visibility after you speak up',
    description: 'NAMMANADU is designed to make the journey easier to understand, from a citizen’s report to the authority’s response.',
    points: ['Understand next steps', 'Follow status updates', 'Build public trust'],
    accent: 'accent-green',
  },
];

function CitizenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c.7-3.35 3.05-5.25 7-5.25s6.3 1.9 7 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServicesPreview() {
  const headerRef = useScrollAnimation(0.2);
  const cardsRef = useStaggeredScrollAnimation(0.08, 110);

  return (
    <section className="services section" id="what-next" aria-labelledby="services-title">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <GoldBadge>What comes next</GoldBadge>
          <h2 id="services-title">Built in stages, for real needs</h2>
          <p>
            NAMMANADU will grow carefully from a secure citizen foundation into a more transparent
            way to communicate with public services.
          </p>
        </div>

        <div ref={cardsRef} className="services__grid" role="list" aria-label="NAMMANADU service vision">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.id} className={`services__card reveal ${service.accent}`} role="listitem">
                <div className="services__card-header">
                  <div className="services__icon-wrap" aria-hidden="true"><Icon /></div>
                  <span className="services__badge">{service.eyebrow}</span>
                </div>

                <div className="services__card-body">
                  <h3 className="services__card-title">{service.title}</h3>
                  <p className="services__card-desc">{service.description}</p>
                </div>

                <ul className="services__features" aria-label={`${service.title} details`}>
                  {service.points.map((point) => (
                    <li key={point} className="services__feature-item">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M4 6l1.5 1.5L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesPreview;
