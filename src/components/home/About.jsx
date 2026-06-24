import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, fetchProjects } from '../../data/projects.js';

function toCards(list) {
  return list.slice(0, 6).map(p => ({ href: `/projects/${p.id}`, img: p.thumb, title: p.title, desc: p.sub }));
}

export default function About() {
  const [cards, setCards] = useState(() => toCards(getProjects()));
  const trackRef = useRef(null);
  const slideOffsetRef = useRef(0);
  const isResetRef = useRef(false);
  const autoTimerRef = useRef(null);

  useEffect(() => {
    fetchProjects().then(list => setCards(toCards(list)));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Clone cards for infinite loop
    const origCards = Array.from(track.children);
    const origCount = origCards.length;
    origCards.forEach(c => {
      const clone = c.cloneNode(true);
      clone.classList.add('in-view');
      track.appendChild(clone);
    });

    // Reveal original cards on scroll
    let cardsRevealed = false;
    function revealCards() {
      if (cardsRevealed) return;
      const vp = track.parentElement;
      if (!vp) return;
      const top = vp.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.88) {
        cardsRevealed = true;
        origCards.forEach((card, i) => {
          setTimeout(() => card.classList.add('in-view'), i * 150);
        });
      }
    }
    window.addEventListener('scroll', revealCards, { passive: true });
    setTimeout(revealCards, 120);

    function getCardW() {
      const c0 = track.children[0];
      const c1 = track.children[1];
      if (c0 && c1) {
        return c1.getBoundingClientRect().left - c0.getBoundingClientRect().left;
      }
      return c0 ? c0.getBoundingClientRect().width + 24 : 420;
    }
    function getLoopW() { return origCount * getCardW(); }

    function goNext() {
      if (isResetRef.current) return;
      slideOffsetRef.current += getCardW();
      track.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
      track.style.transform = `translateX(-${slideOffsetRef.current}px)`;
      if (slideOffsetRef.current >= getLoopW()) {
        isResetRef.current = true;
        setTimeout(() => {
          track.style.transition = 'none';
          slideOffsetRef.current -= getLoopW();
          track.style.transform = `translateX(-${slideOffsetRef.current}px)`;
          isResetRef.current = false;
        }, 570);
      }
    }

    function goPrev() {
      if (isResetRef.current) return;
      if (slideOffsetRef.current <= 0) {
        track.style.transition = 'none';
        slideOffsetRef.current = getLoopW();
        track.style.transform = `translateX(-${slideOffsetRef.current}px)`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            track.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
            slideOffsetRef.current -= getCardW();
            track.style.transform = `translateX(-${slideOffsetRef.current}px)`;
          });
        });
      } else {
        slideOffsetRef.current -= getCardW();
        track.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
        track.style.transform = `translateX(-${slideOffsetRef.current}px)`;
      }
    }

    const nextBtn = document.getElementById('projNext');
    const prevBtn = document.getElementById('projPrev');
    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (prevBtn) prevBtn.addEventListener('click', goPrev);

    autoTimerRef.current = setInterval(goNext, 3500);

    function onResize() {
      slideOffsetRef.current = Math.max(0, Math.min(slideOffsetRef.current, getLoopW()));
      track.style.transition = 'none';
      track.style.transform = `translateX(-${slideOffsetRef.current}px)`;
    }
    window.addEventListener('resize', onResize);

    function onKey(e) {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    document.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('scroll', revealCards);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
      clearInterval(autoTimerRef.current);
      if (nextBtn) nextBtn.removeEventListener('click', goNext);
      if (prevBtn) prevBtn.removeEventListener('click', goPrev);
    };
  }, []);

  return (
    <section className="about" id="about">
      <div className="about-top">
        <h2 className="about-heading anim-words">
          Quality<br />
          &amp; <span className="cyan">Craft</span>
        </h2>
        <div className="about-body">
          <p className="about-desc" data-reveal data-delay="1">
            웹과 앱 영역에서 기획부터 퍼블리싱까지 폭넓게 작업합니다. 교육·Healthcare·B2B 등 복잡한 요구사항이 있는 프로젝트에서 구조적 설계와 기술적 명확성을 바탕으로 결과물을 만듭니다.
          </p>
          <div className="about-links">
            <div className="about-link" data-reveal data-delay="2">
              <p>컴포넌트 기반 설계와 체계화된 CSS로 장기적으로 유지보수가 쉬운 결과물을 제공합니다.</p>
              <a href="#services" data-hover>Web Publishing</a>
            </div>
            <div className="about-link" data-reveal data-delay="3">
              <p>지속적인 협업을 중요하게 생각합니다. 명확한 커뮤니케이션과 일관된 프로세스를 유지합니다.</p>
              <a href="#contact" data-hover>협업 &amp; 유지보수</a>
            </div>
          </div>
        </div>
      </div>

      <div id="projects">
        <div className="projects-header">
          <h2 className="section-title anim-words">Selected Works</h2>
          <div className="proj-arrows">
            <button className="proj-arrow" id="projPrev" data-hover aria-label="이전">←</button>
            <button className="proj-arrow" id="projNext" data-hover aria-label="다음">→</button>
          </div>
        </div>
        <div className="projects-viewport">
          <div className="projects-track" ref={trackRef}>
            {cards.map((card, i) => (
              <Link key={i} to={card.href} className="proj-card" data-hover>
                <div className="proj-thumb">
                  <div className="proj-ph">
                    {card.img ? <img src={card.img} alt="" /> : card.emoji}
                  </div>
                  <div className="proj-overlay"><span className="proj-overlay-label">View Project</span></div>
                </div>
                <h3 className="proj-title">{card.title}</h3>
                <p className="proj-desc">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
