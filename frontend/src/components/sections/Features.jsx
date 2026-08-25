import GoldBadge from '../ui/GoldBadge';
import { useStaggeredScrollAnimation, useScrollAnimation } from '../../hooks/useScrollAnimation';
import './Features.css';

const FEATURES = [
  {
    id: 'citizen-access',
    icon: CitizenIcon,
    title: 'One place for your civic voice',
    description: 'A citizen-first space for sharing local concerns and staying connected to the public services that matter to your community.',
    tag: 'Citizen focused',
  },
  {
    id: 'ai-assisted',
    icon: SparkIcon,
    title: 'AI-assisted complaint preparation',
    description: 'The future platform will help turn a short description into a clear, formal complaint that is easier to review and understand.',
    tag: 'Planned capability',
  },
  {
    id: 'transparent-process',
    icon: RouteIcon,
    title: 'A clearer path to resolution',
    description: 'Citizens should know what happens after they speak up. NAMMANADU is designed around understandable steps and visible progress.',
    tag: 'Transparency',
  },
  {
    id: 'tamil-ready',
    icon: LanguageIcon,
    title: 'Built for Tamil Nadu',
    description: 'A responsive experience with Tamil Nadu context, mobile-friendly interaction, and a foundation for Tamil and English access.',
    tag: 'Accessibility',
  },
];

function CitizenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c.65-3.35 3.02-5.25 7-5.25s6.35 1.9 7 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 12h2M18 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l1.55 6.45L20 10l-6.45 1.55L12 18l-1.55-6.45L4 10l6.45-1.55L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.25 6H14a4 4 0 014 4v5.75M15.75 18H12a4 4 0 01-4-4V8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.75 12h18.5M12 2.5a14.5 14.5 0 010 19M12 2.5a14.5 14.5 0 000 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Features() {
  const headerRef = useScrollAnimation(0.2);
  const gridRef = useStaggeredScrollAnimation(0.08, 100);

  return (
    <section className="features section" id="services" aria-labelledby="features-title">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <GoldBadge>Services / Features</GoldBadge>
          <h2 id="features-title">Designed around the citizen</h2>
          <p>
            NAMMANADU brings clarity, context, and a human-centred approach to the everyday
            connection between citizens and public services.
          </p>
        </div>

        <ul ref={gridRef} className="features__grid" role="list" aria-label="NAMMANADU services and features">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.id} className="features__card reveal">
                <article className="features__card-inner" aria-label={feature.title}>
                  <div className="features__icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <span className="features__tag">{feature.tag}</span>
                  <h3 className="features__card-title">{feature.title}</h3>
                  <p className="features__card-desc">{feature.description}</p>
                  <div className="features__accent-line" aria-hidden="true" />
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Features;
