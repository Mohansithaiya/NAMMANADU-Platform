/**
 * GlassCard.jsx
 * Reusable glassmorphism card with optional gold accent left-border.
 * Supports hover lift + glow effect via CSS.
 */
import './GlassCard.css';

function GlassCard({
  children,
  className = '',
  accent = false,
  hover = true,
  as: Tag = 'div',
  ...props
}) {
  return (
    <Tag
      className={[
        'glass-card',
        accent  ? 'glass-card--accent' : '',
        hover   ? 'glass-card--hoverable' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default GlassCard;
