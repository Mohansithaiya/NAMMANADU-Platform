import GoldBadge from '../ui/GoldBadge';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../../hooks/useScrollAnimation';
import './HowItWorks.css';

const STEPS = [
  {
    id: 'step-account',
    step: '01',
    icon: AccountIcon,
    title: 'Create your account',
    description: 'Start with a secure citizen profile so NAMMANADU can give your voice a clear place in the system.',
    status: 'Available now',
    color: 'step-color-1',
  },
  {
    id: 'step-share',
    step: '02',
    icon: ReportIcon,
    title: 'Share a concern',
    description: 'When the complaint module launches, you will be able to describe a local issue in your own words.',
    status: 'Coming next',
    color: 'step-color-2',
  },
  {
    id: 'step-review',
    step: '03',
    icon: ReviewIcon,
    title: 'Review the formal report',
    description: 'AI assistance is planned to help shape a clearer complaint that you can review and edit before sending.',
    status: 'Planned',
    color: 'step-color-3',
  },
  {
    id: 'step-follow',
    step: '04',
    icon: TrackIcon,
    title: 'Follow the progress',
    description: 'The long-term vision is transparent status updates so citizens can see what happens after they speak up.',
    status: 'Planned',
    color: 'step-color-4',
  },
];

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c.7-3.25 3-5 7-5s6.3 1.75 7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

function ReviewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 016.5 3H18a2 2 0 012 2v14a2 2 0 01-2 2H6.5A2.5 2.5 0 014 18.5v-13z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

function HowItWorks() {
  const headerRef = useScrollAnimation(0.2);
  const stepsRef = useStaggeredScrollAnimation(0.08, 130);

  return (
    <section className="how-it-works section" id="how-it-works" aria-labelledby="how-it-works-title">
      <div className="container">
        <div ref={headerRef} className="section-header reveal">
          <GoldBadge>The citizen journey</GoldBadge>
          <h2 id="how-it-works-title">A simple path from concern to action</h2>
          <p>
            NAMMANADU is being built in clear stages. The account foundation is here first;
            the complaint journey will follow with transparency at every step.
          </p>
        </div>

        <div ref={stepsRef} className="how-it-works__steps" role="list" aria-label="Planned citizen journey">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className={`how-it-works__step reveal ${step.color}`} role="listitem">
                {index < STEPS.length - 1 && <div className="how-it-works__connector" aria-hidden="true" />}
                <div className="how-it-works__step-number" aria-hidden="true">{step.step}</div>
                <div className="how-it-works__icon-wrap" aria-hidden="true">
                  <div className="how-it-works__icon"><Icon /></div>
                </div>
                <div className="how-it-works__text">
                  <span className="how-it-works__status">{step.status}</span>
                  <h3 className="how-it-works__step-title">{step.title}</h3>
                  <p className="how-it-works__step-desc">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="how-it-works__note reveal">
          <span aria-hidden="true">✦</span>
          The first step is ready: create your citizen account and be part of the foundation.
        </p>
      </div>
    </section>
  );
}

export default HowItWorks;
