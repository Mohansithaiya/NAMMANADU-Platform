/**
 * GoldBadge.jsx
 * Small pill-shaped label with gold accent styling.
 * Used to tag sections (e.g., "AI-Powered", "Phase 1", "Live").
 */
import './GoldBadge.css';

function GoldBadge({ children, icon, size = 'default' }) {
  return (
    <div className={`gold-badge gold-badge--${size}`} role="note" aria-label={`Badge: ${children}`}>
      {icon && (
        <span className="gold-badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="gold-badge__text">{children}</span>
    </div>
  );
}

export default GoldBadge;
