// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjectsFromCache, fetchProjects } from '../../services/projectService';

function toList(raw) {
  return raw.map(p => ({ id: p.id, img: p.thumb, title: p.title, sub: p.sub, link: p.link || '' }));
}

export default function ProjectsGrid() {
  const [projects, setProjects] = useState(() => toList(getProjectsFromCache()));
  const gridRef = useRef(null);

  useEffect(() => {
    fetchProjects().then(list => setProjects(toList(list)));
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll('.block-projects__item'));
    if (!items.length) return;

    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(48px)';
    });

    function getCols() {
      const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      return cols || 3;
    }

    const revealed = new Set();

    function checkItems() {
      const threshold = window.innerHeight * 0.93;
      const cols = getCols();
      items.forEach((item, i) => {
        if (revealed.has(i)) return;
        if (item.getBoundingClientRect().top < threshold) {
          revealed.add(i);
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
          setTimeout(() => { item.style.transitionDelay = '0s'; }, 800 + (i % cols) * 130);
        }
      });
    }

    const timer = setTimeout(() => {
      const cols = getCols();
      items.forEach((item, i) => {
        item.classList.add('will-animate');
        item.style.transitionDelay = (i % cols * 0.13) + 's';
      });
      checkItems();
    }, 50);

    window.addEventListener('scroll', checkItems, { passive: true });
    window.addEventListener('resize', () => {
      const cols = getCols();
      items.forEach((item, i) => {
        if (!revealed.has(i)) item.style.transitionDelay = (i % cols * 0.13) + 's';
      });
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkItems);
    };
  }, []);

  return (
    <div className="block-projects-wrap">
      <div className="block-group__inner-container">
        <div className="block-projects__grid" ref={gridRef}>
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="block-projects__item" data-hover>
              <div className="block-projects__media">
                <img
                  className="block-projects__image"
                  src={p.img}
                  alt={p.title}
                  onError={e => { e.target.parentElement.innerHTML = `<div class="proj-ph">?룫</div>`; }}
                />
              </div>
              <h4 className="block-projects__title">{p.title}</h4>
              <p className="block-projects__subtitle">{p.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
