// @ts-nocheck
import { useEffect, useRef } from 'react';

export default function CTA() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const hitRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const pathEl = pathRef.current;
    const hitEl = hitRef.current;
    const cta = ctaRef.current;
    if (!svg || !pathEl || !cta) return;

    const STIFFNESS = 0.032;
    const DAMPING = 0.90;

    let H = cta.offsetHeight;
    let W = cta.offsetWidth;
    let targetCY = H * 0.5;
    let currentCY = H * 0.5;
    let velocity = 0;
    let rafId;

    function calcTarget() {
      const rect = cta.getBoundingClientRect();
      H = cta.offsetHeight;
      W = cta.offsetWidth;
      targetCY = H * 0.5 + rect.top * 0.3;
    }

    function loop() {
      rafId = requestAnimationFrame(loop);
      const force = (targetCY - currentCY) * STIFFNESS;
      velocity = (velocity + force) * DAMPING;
      currentCY += velocity;
      const d = `M 0,${H} Q ${(W / 2).toFixed(1)},${currentCY.toFixed(2)} ${W},0`;
      pathEl.setAttribute('d', d);
      if (hitEl) hitEl.setAttribute('d', d);
    }

    calcTarget();
    currentCY = targetCY;
    loop();

    window.addEventListener('scroll', calcTarget, { passive: true });
    window.addEventListener('resize', calcTarget, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', calcTarget);
      window.removeEventListener('resize', calcTarget);
    };
  }, []);

  return (
    <section className="cta" id="contact" ref={ctaRef}>
      <svg aria-hidden="true" className="line line--cyan" ref={svgRef}>
        <path className="line__path" ref={pathRef} d="" />
        <path className="line__hit" ref={hitRef} d="" />
      </svg>
      <div className="cta-inner">
        <h2 className="cta-heading anim-words">
          프로젝트<br />
          구상 중이신가요?
        </h2>
        <p className="cta-sub" data-reveal data-delay="1">
          새로운 프로젝트에 대해 이야기해보세요.<br />
          직접, 빠르게, 군더더기 없이.
        </p>
        <a href="mailto:hello@portfolio.kr" className="cta-btn" data-hover data-reveal data-delay="2">
          문의하기
        </a>
      </div>
    </section>
  );
}
