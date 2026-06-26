// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SnapSlider({ project, nextProject }) {
  const snapRef = useRef(null);
  const deviceInnerRef = useRef(null);
  const deviceWrapRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentRef = useRef(0);

  const TOTAL = 4;
  const darkSlides = [2, 3];

  // Device 3D mouse follow
  useEffect(() => {
    const wrap = deviceWrapRef.current;
    const inner = deviceInnerRef.current;
    if (!wrap || !inner) return;

    let mx = 0, my = 0, smx = 0, smy = 0;
    let tx = 0, ty = 0;
    let isHover = false;
    let pullForce = 0;
    let rafId;
    let lastTime = 0;

    function onMouseMove(e) {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const heroSlide = document.getElementById('slide-hero');
    if (heroSlide) {
      heroSlide.addEventListener('mouseenter', () => { isHover = true; });
      heroSlide.addEventListener('mouseleave', () => { isHover = false; });
    }

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate(ts) {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min((ts - lastTime) / 16.67, 3);
      lastTime = ts;

      const sp = 0.07 * dt;
      smx = lerp(smx, mx, sp);
      smy = lerp(smy, my, sp);
      pullForce = lerp(pullForce, isHover ? 1 : 0, 0.05 * dt);

      const t = ts * 0.001;
      const idleX = Math.sin(t * 0.48) * 1.5;
      const idleY = Math.sin(t * 0.65) * 2.2;

      const targetTX = idleX + smx * 18 * pullForce;
      const targetTY = idleY - smy * 12 * pullForce;
      tx = lerp(tx, targetTX, 0.055 * dt);
      ty = lerp(ty, targetTY, 0.055 * dt);

      const idleRY = Math.sin(t * 0.32) * 2 - 6;
      const idleRX = Math.sin(t * 0.41) * 1.5 + 2;
      const rotY = idleRY + smx * 22 * pullForce;
      const rotX = idleRX - smy * 15 * pullForce;
      const rotZ = -smx * 1.5 * pullForce;
      const scale = 1 + pullForce * 0.03;

      inner.style.transform =
        `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) ` +
        `rotateX(${rotX.toFixed(2)}deg) ` +
        `rotateY(${rotY.toFixed(2)}deg) ` +
        `rotateZ(${rotZ.toFixed(2)}deg) ` +
        `scale(${scale.toFixed(4)})`;
    }

    const snapRoot = snapRef.current;
    if (heroSlide) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!rafId) { lastTime = performance.now(); animate(lastTime); }
          } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          }
        });
      }, { root: snapRoot, threshold: 0.1 });
      io.observe(heroSlide);
    } else {
      lastTime = performance.now();
      animate(lastTime);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Snap slide navigation
  useEffect(() => {
    const wrap = snapRef.current;
    if (!wrap) return;

    const slides = Array.from(wrap.querySelectorAll('.pd-slide'));
    if (!slides.length) return;

    function revealSlide(idx) {
      slides[idx].querySelectorAll('.anim-words, [data-reveal]').forEach(el => {
        el.classList.add('in-view');
      });
    }

    function goTo(idx) {
      idx = Math.max(0, Math.min(TOTAL - 1, idx));
      if (idx === currentRef.current) return;
      currentRef.current = idx;
      setCurrentSlide(idx);
      slides[idx].scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => revealSlide(idx), 400);
    }

    revealSlide(0);

    let wheelAcc = 0;
    let wheelTimer;
    function onWheel(e) {
      e.preventDefault();
      clearTimeout(wheelTimer);
      wheelAcc += e.deltaY;
      wheelTimer = setTimeout(() => {
        if (Math.abs(wheelAcc) > 30) goTo(currentRef.current + (wheelAcc > 0 ? 1 : -1));
        wheelAcc = 0;
      }, 60);
    }
    wrap.addEventListener('wheel', onWheel, { passive: false });

    let touchY0 = 0;
    function onTouchStart(e) { touchY0 = e.touches[0].clientY; }
    function onTouchEnd(e) {
      const dy = touchY0 - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 40) goTo(currentRef.current + (dy > 0 ? 1 : -1));
    }
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchend', onTouchEnd, { passive: true });

    function onKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(currentRef.current + 1); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(currentRef.current - 1); }
    }
    document.addEventListener('keydown', onKey);

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const idx = slides.indexOf(entry.target);
          if (idx !== -1 && idx !== currentRef.current) {
            currentRef.current = idx;
            setCurrentSlide(idx);
            revealSlide(idx);
          }
        }
      });
    }, { root: wrap, threshold: 0.6 });
    slides.forEach(s => io.observe(s));

    const hint = document.getElementById('scrollHint');
    if (hint) hint.onclick = () => goTo(1);

    // Gallery auto-slide
    const grid = document.getElementById('galleryGrid');
    const galleryNumEl = document.getElementById('galleryNum');
    const galleryTotalEl = document.getElementById('galleryTotal');
    if (grid) {
      const items = grid.querySelectorAll('.pd-gallery__img-wrap');
      const total = items.length;
      if (galleryTotalEl) galleryTotalEl.textContent = total;
      let gIdx = 0;
      let gTimer;

      function isMobile() { return window.innerWidth <= 768; }
      function goGallery(n) {
        gIdx = (n + total) % total;
        grid.scrollTo({ left: grid.clientWidth * gIdx, behavior: 'smooth' });
        if (galleryNumEl) galleryNumEl.textContent = gIdx + 1;
      }
      function startAuto() {
        clearInterval(gTimer);
        if (!isMobile()) return;
        gTimer = setInterval(() => goGallery(gIdx + 1), 3000);
      }
      grid.addEventListener('scroll', () => {
        const newIdx = Math.round(grid.scrollLeft / grid.clientWidth);
        if (newIdx !== gIdx) { gIdx = newIdx; if (galleryNumEl) galleryNumEl.textContent = gIdx + 1; startAuto(); }
      }, { passive: true });

      const gallerySlide = document.getElementById('slide-gallery');
      if (gallerySlide) {
        new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) startAuto(); else clearInterval(gTimer); });
        }, { root: wrap, threshold: 0.5 }).observe(gallerySlide);
      }
      window.addEventListener('resize', startAuto);
    }

    return () => {
      wrap.removeEventListener('wheel', onWheel);
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('keydown', onKey);
      io.disconnect();
    };
  }, []);

  function goToDot(idx) {
    const wrap = snapRef.current;
    if (!wrap) return;
    const slides = Array.from(wrap.querySelectorAll('.pd-slide'));
    if (idx === currentRef.current) return;
    currentRef.current = idx;
    setCurrentSlide(idx);
    slides[idx]?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      slides[idx]?.querySelectorAll('.anim-words, [data-reveal]').forEach(el => el.classList.add('in-view'));
    }, 400);
  }

  const isDark = darkSlides.includes(currentSlide);

  return (
    <>
      <div className="pd-snap" ref={snapRef}>
        {/* SLIDE 1: HERO */}
        <section className="pd-slide pd-slide--hero" id="slide-hero">
          <div className="pd-hero__left">
            <Link to="/projects" className="pd-back" data-hover>← Projects</Link>
            <h1 className="pd-hero__title anim-words">{project.title}</h1>
            <p className="pd-hero__sub">{project.sub}</p>
            {project.link && (
              <a href={project.link} className="pd-hero__link" target="_blank" rel="noopener noreferrer" data-hover>
                {project.link}
              </a>
            )}
            <button className="pd-scroll-hint" id="scrollHint" aria-label="다음 슬라이드">
              <span>Scroll</span>
              <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
                <rect x="1" y="1" width="16" height="22" rx="8" stroke="currentColor" strokeWidth="1.5" />
                <circle className="scroll-dot" cx="9" cy="8" r="2.5" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="pd-hero__right">
            <div className="device-wrap" ref={deviceWrapRef}>
              <div className="device-inner" ref={deviceInnerRef}>
                <img className="device-frame" src="/img/ipad.jpg" alt="" />
                <div className="device-screen">
                  <img src={project.screenImg} alt="프로젝트 스크린샷" onError={e => { e.target.style.display = 'none'; }} />
                </div>
              </div>
            </div>
          </div>
          <div className="pd-slide-counter">
            <span>{String(currentSlide + 1).padStart(2, '0')}</span> / <span>{String(TOTAL).padStart(2, '0')}</span>
          </div>
        </section>

        {/* SLIDE 2: META */}
        <section className="pd-slide pd-slide--meta" id="slide-meta">
          <div className="pd-slide__inner">
            <div className="pd-meta__specs">
              {project.specs.map((spec, i) => (
                <div key={i} className="pd-spec">
                  <span className="pd-spec__label">{spec.label}</span>
                  <span className="pd-spec__value" dangerouslySetInnerHTML={{ __html: spec.value }} />
                </div>
              ))}
            </div>
            <div className="pd-meta__desc">
              <h2 className="pd-meta__heading anim-words">프로젝트<br />개요</h2>
              {project.desc.map((p, i) => (
                <p key={i} className="pd-desc">{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 3: GALLERY */}
        <section className="pd-slide pd-slide--gallery" id="slide-gallery">
          <div className="gallery-indicator" id="galleryIndicator">
            <span id="galleryNum">1</span>
            <span className="gallery-sep"> / </span>
            <span id="galleryTotal">3</span>
          </div>
          <div className="pd-gallery__grid" id="galleryGrid">
            <div className="pd-gallery__main">
              <div className="pd-gallery__img-wrap">
                <img className="pd-gallery__bg" src={project.gallery[0]} alt="" aria-hidden="true" />
                <img className="pd-gallery__fg" src={project.gallery[0]} alt="메인 화면" />
              </div>
            </div>
            <div className="pd-gallery__side">
              <div className="pd-gallery__img-wrap">
                <img className="pd-gallery__bg" src={project.gallery[1]} alt="" aria-hidden="true" />
                <img className="pd-gallery__fg" src={project.gallery[1]} alt="상세 화면 1" />
              </div>
              <div className="pd-gallery__img-wrap">
                <img className="pd-gallery__bg" src={project.gallery[2]} alt="" aria-hidden="true" />
                <img className="pd-gallery__fg" src={project.gallery[2]} alt="상세 화면 2" />
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 4: NEXT */}
        <section className="pd-slide pd-slide--next" id="slide-next">
          <Link to={nextProject ? `/projects/${nextProject.id}` : '/projects'} className="pd-next__link" data-hover>
            <span className="pd-next__label">Next Project</span>
            <span className="pd-next__title">{nextProject?.title || 'Projects'}</span>
            <span className="pd-next__arrow">→</span>
          </Link>
          <footer className="pd-footer">
            <div className="pd-footer__inner">
              <span>Web &amp; App Portfolio</span>
              <a href="mailto:hello@portfolio.kr" data-hover>hello@portfolio.kr</a>
              <span>© 2025</span>
            </div>
          </footer>
        </section>
      </div>

      {/* Nav dots */}
      <nav className="pd-nav-dots" aria-label="슬라이드 네비게이션">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            className={`pd-dot${i === currentSlide ? ' pd-dot--active' : ''}`}
            aria-label={`슬라이드 ${i + 1}`}
            onClick={() => goToDot(i)}
            style={{
              background: isDark
                ? (i === currentSlide ? '#fff' : 'rgba(255,255,255,.3)')
                : (i === currentSlide ? 'var(--black)' : 'rgba(0,0,0,.15)'),
            }}
          />
        ))}
      </nav>
    </>
  );
}
