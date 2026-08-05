/**
 * AnimatedCounter.jsx
 * Counts from 0 → target when the element enters the viewport.
 * Uses IntersectionObserver + requestAnimationFrame. No libraries.
 */
import { useEffect, useRef, useState } from 'react';

/**
 * Ease-out cubic easing function.
 * @param {number} t - progress (0–1)
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1800,
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Parse numeric target (supports "38" or 38)
    const numTarget = typeof target === 'number' ? target : parseInt(String(target), 10);

    const startCounting = (startTime) => {
      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.floor(eased * numTarget);

        setDisplayValue(current);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayValue(numTarget); // ensure exact final value
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startCounting(performance.now());
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export default AnimatedCounter;
