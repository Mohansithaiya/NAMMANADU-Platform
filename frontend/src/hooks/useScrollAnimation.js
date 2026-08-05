/**
 * useScrollAnimation.js
 * ============================================================
 * Lightweight scroll-reveal hooks using IntersectionObserver API.
 * Zero external dependencies. Works by toggling CSS classes.
 *
 * Usage:
 *   const ref = useScrollAnimation();
 *   <div ref={ref} className="reveal"> ... </div>
 *
 * The element must have a base class like "reveal", "reveal-scale",
 * or "reveal-left" (defined in animations.css). The hook adds
 * "is-visible" when the element enters the viewport.
 * ============================================================
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * useScrollAnimation
 * Adds "is-visible" class to an element when it scrolls into view.
 * Animates once — unobserves after first trigger.
 *
 * @param {number} threshold - 0–1, fraction of element visible to trigger (default 0.15)
 * @param {string} visibleClass - CSS class to add when visible (default "is-visible")
 * @returns {React.RefObject} - attach to the target element
 */
export function useScrollAnimation(threshold = 0.15, visibleClass = 'is-visible') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediately visible if already in viewport (no scroll needed)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(visibleClass);
          observer.unobserve(el); // play once
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, visibleClass]);

  return ref;
}

/**
 * useStaggeredScrollAnimation
 * Reveals a group of child elements with staggered delays when
 * the parent container scrolls into view.
 *
 * @param {number} threshold   - fraction of container visible to trigger
 * @param {number} staggerMs   - delay in ms between each child reveal
 * @param {string} visibleClass - CSS class added to each child
 * @returns {React.RefObject} - attach to the parent container
 */
export function useStaggeredScrollAnimation(
  threshold = 0.10,
  staggerMs = 90,
  visibleClass = 'is-visible'
) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = Array.from(container.children);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => {
              child.classList.add(visibleClass);
            }, i * staggerMs);
          });
          observer.unobserve(container);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [threshold, staggerMs, visibleClass]);

  return ref;
}

/**
 * useScrollAnimationMultiple
 * Applies useScrollAnimation to multiple elements at once.
 * Returns a callback ref factory for use in list renders.
 *
 * @param {number} threshold
 * @param {string} visibleClass
 * @returns {Function} - getRef(i) returns a ref callback for the i-th element
 */
export function useScrollAnimationMultiple(threshold = 0.12, visibleClass = 'is-visible') {
  const observers = useRef(new Map());

  const getRef = useCallback(
    (index) => (el) => {
      if (!el) return;
      if (observers.current.has(el)) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(visibleClass);
            }, index * 80);
            observer.unobserve(entry.target);
          }
        },
        { threshold, rootMargin: '0px 0px -40px 0px' }
      );

      observer.observe(el);
      observers.current.set(el, observer);
    },
    [threshold, visibleClass]
  );

  // Cleanup on unmount
  useEffect(() => {
    const obs = observers.current;
    return () => {
      obs.forEach((observer) => observer.disconnect());
      obs.clear();
    };
  }, []);

  return getRef;
}
