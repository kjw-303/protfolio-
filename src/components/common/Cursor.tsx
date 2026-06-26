// @ts-nocheck
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let rx = 0, ry = 0, tx = 0, ty = 0;
    let rafId;

    function onMouseMove(e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.left = tx + 'px';
      dot.style.top = ty + 'px';
      label.style.left = e.clientX + 'px';
      label.style.top = e.clientY + 'px';
    }

    function loop() {
      rx += (tx - rx) * 0.14;
      ry += (ty - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      rafId = requestAnimationFrame(loop);
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    function attachHover(el) {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hover');
        ring.classList.add('hover');
        const lbl = el.dataset.cursor;
        if (lbl) {
          label.textContent = lbl;
          label.style.opacity = '1';
        }
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
        label.style.opacity = '0';
      });
    }

    // Attach to existing [data-hover] elements and observe new ones
    document.querySelectorAll('[data-hover]').forEach(attachHover);

    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-hover]:not([data-hover-bound])').forEach(el => {
        el.setAttribute('data-hover-bound', '');
        attachHover(el);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
      <span
        ref={labelRef}
        id="cursorLabel"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 10000,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: '#fff',
          background: 'var(--accent)',
          padding: '4px 8px',
          borderRadius: '2px',
          transform: 'translate(14px,-50%)',
          opacity: 0,
          transition: 'opacity .2s',
          whiteSpace: 'nowrap',
          fontFamily: "'Inter',sans-serif",
        }}
      />
    </>
  );
}
