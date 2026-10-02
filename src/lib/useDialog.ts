import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/** a stack so Escape only closes the top-most overlay */
const stack: symbol[] = [];

/**
 * Dialog behaviour: move focus in, trap Tab, close on Escape (top-most only),
 * lock page scroll, make the page behind inert and return focus on close.
 */
export function useDialog(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const id = Symbol('dialog');
    stack.push(id);
    const previous = document.activeElement as HTMLElement | null;
    const app = document.getElementById('app-root');
    app?.setAttribute('inert', '');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const items = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
    (items()[0] ?? node).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key === 'Tab') {
        const list = items();
        if (!list.length) return e.preventDefault();
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement;
        if (!node.contains(active)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      document.removeEventListener('keydown', onKey, true);
      stack.splice(stack.indexOf(id), 1);
      if (!stack.length) {
        app?.removeAttribute('inert');
        document.body.style.overflow = prevOverflow;
      }
      previous?.focus({ preventScroll: true });
    };
  }, []);

  return ref;
}
