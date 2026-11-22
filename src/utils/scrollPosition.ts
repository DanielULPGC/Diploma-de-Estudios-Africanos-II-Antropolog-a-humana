let pendingRaf1: number | null = null;
let pendingRaf2: number | null = null;

export function cancelPendingScroll(): void {
  if (typeof window === 'undefined') return;
  if (pendingRaf1 !== null) {
    window.cancelAnimationFrame(pendingRaf1);
    pendingRaf1 = null;
  }
  if (pendingRaf2 !== null) {
    window.cancelAnimationFrame(pendingRaf2);
    pendingRaf2 = null;
  }
}

/**
 * Measures the currently visible sticky top bar (main navbar or Reading Mode toolbar)
 * and adds editorial breathing room so jumped headers are never clipped underneath.
 */
export function getStickyHeaderOffset(extraGap = 16): number {
  if (typeof document === 'undefined') return 72;
  const stickyBar =
    document.querySelector<HTMLElement>('[data-sticky-topbar="true"]') ??
    document.querySelector<HTMLElement>('header');
  if (!stickyBar) return 72;
  const { height } = stickyBar.getBoundingClientRect();
  return Math.max(48, Math.ceil(height)) + extraGap;
}

export interface InstantScrollOptions {
  /** Extra space below the sticky bar in px (default: 16). */
  extraGap?: number;
  /**
   * When true, only scrolls if the target header is currently above the sticky offset
   * or below the upper viewport band. Useful for top tab strips already in view.
   */
  onlyIfAbove?: boolean;
  /** Moves programmatic focus to the target element without triggering native scroll. */
  focusTarget?: boolean;
  /** Callback invoked right after React commits and before measuring/scrolling. */
  onBeforeScroll?: () => void;
}

export function scrollToElementInstant(
  el: HTMLElement | null,
  options: InstantScrollOptions = {}
): void {
  if (!el || typeof window === 'undefined') return;

  const { extraGap = 16, onlyIfAbove = false, focusTarget = false } = options;
  const offset = getStickyHeaderOffset(extraGap);
  const rect = el.getBoundingClientRect();

  if (onlyIfAbove) {
    const isAlreadyComfortablyVisible =
      rect.top >= offset - 8 && rect.top <= Math.min(window.innerHeight * 0.45, 360);
    if (isAlreadyComfortablyVisible) {
      return;
    }
  }

  const targetTop = Math.max(0, Math.round(rect.top + window.scrollY - offset));
  window.scrollTo({ top: targetTop, left: 0, behavior: 'instant' });

  if (focusTarget) {
    if (!el.hasAttribute('tabindex') && el.tabIndex < 0) {
      el.setAttribute('tabindex', '-1');
    }
    el.focus({ preventScroll: true });
  }
}

/**
 * Schedules an instant, deterministic scroll after React commits state changes
 * and the browser completes layout recalculation (double requestAnimationFrame).
 * Any previous queued jump is cancelled so rapid clicks never race each other.
 */
export function scheduleInstantScrollToElement(
  getTarget: () => HTMLElement | null,
  options: InstantScrollOptions = {}
): void {
  if (typeof window === 'undefined') return;
  cancelPendingScroll();

  pendingRaf1 = window.requestAnimationFrame(() => {
    pendingRaf1 = null;
    pendingRaf2 = window.requestAnimationFrame(() => {
      pendingRaf2 = null;
      options.onBeforeScroll?.();
      const target = getTarget();
      scrollToElementInstant(target, options);
    });
  });
}
