import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

let bodyScrollLockCount = 0;
let savedBodyOverflow = '';

function acquireBodyScrollLock(): void {
  if (typeof document === 'undefined') return;
  if (bodyScrollLockCount === 0) {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  bodyScrollLockCount += 1;
}

function releaseBodyScrollLock(): void {
  if (typeof document === 'undefined') return;
  bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
  if (bodyScrollLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow;
  }
}

export interface UseModalFocusTrapOptions {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  lockScroll?: boolean;
}

/**
 * Accessible modal dialog lifecycle manager:
 * - Reference-counted body scroll lock (safe for nested modals)
 * - Circular Tab / Shift+Tab focus trap inside the dialog container
 * - Capture-phase Escape handling (prevents cascading close of outer views)
 * - Automatic initial focus placement and restoration to the triggering element on close
 */
export function useModalFocusTrap({
  isOpen,
  containerRef,
  onClose,
  initialFocusRef,
  lockScroll = true,
}: UseModalFocusTrapOptions): void {
  useEffect(() => {
    if (!isOpen) return;

    const prevFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (lockScroll) {
      acquireBodyScrollLock();
    }

    const focusTimer = window.setTimeout(() => {
      const target = initialFocusRef?.current ?? containerRef.current;
      target?.focus();
    }, 10);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;
      const container = containerRef.current;
      if (!container) return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => {
        if (el.tabIndex < 0) return false;
        return el.offsetParent !== null || el === document.activeElement;
      });

      if (focusables.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!active || active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (!active || active === last || !container.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown, true);
      if (lockScroll) {
        releaseBodyScrollLock();
      }
      if (prevFocus && document.contains(prevFocus)) {
        requestAnimationFrame(() => prevFocus.focus());
      }
    };
  }, [isOpen, containerRef, initialFocusRef, onClose, lockScroll]);
}
