import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let lastY = 0;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const delta = y - lastY;
          setScrolled(y > 60);
          if (delta > 0 && y > 120) setHidden(true);
          else if (delta < 0) setHidden(false);
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function openNav() {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('nav-is-open');
  }

  function closeNav() {
    setIsOpen(false);
    document.body.style.overflow = '';
    document.documentElement.classList.remove('nav-is-open');
  }

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') closeNav(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close nav on route change
  useEffect(() => { closeNav(); }, [location]);

  const isProjects = location.pathname.startsWith('/projects');

  return (
    <>
      {/* Cyan shutter */}
      <div
        className="nav-shutter"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: isOpen
            ? 'transform .35s cubic-bezier(.76,0,.24,1)'
            : 'transform .4s cubic-bezier(.76,0,.24,1) .15s',
        }}
      />

      {/* Full-screen drawer */}
      <nav
        className="nav-drawer"
        aria-hidden={!isOpen}
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: isOpen ? 'all' : 'none',
          transition: isOpen
            ? 'transform .55s cubic-bezier(.76,0,.24,1)'
            : 'transform .5s cubic-bezier(.76,0,.24,1)',
        }}
      >
        <div className="nav-drawer-inner">
          <ul className="nav-drawer-list">
            <li className="nav-drawer-item">
              <Link to="/projects" onClick={closeNav}>Projects</Link>
            </li>
            <li className="nav-drawer-item">
              <Link to="/#contact" onClick={closeNav}>Contact</Link>
            </li>
          </ul>
        </div>
        <div className="nav-drawer-footer">Web &amp; App Portfolio</div>
      </nav>

      <header
        className={`header${scrolled ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`}
        ref={headerRef}
      >
        <Link to="/" className="logo" data-hover>
          <div className="logo-mark">
            <span className="a"></span>
            <span className="b"></span>
            <span className="c"></span>
            <span className="d"></span>
          </div>
          <span className="logo-name">Portfolio</span>
        </Link>
        <nav className="desktop-nav">
          <Link to="/projects" className={`nav-link${isProjects ? ' is-active' : ''}`} data-hover>
            Projects
          </Link>
          <Link to="/#contact" className="nav-link" data-hover>Contact</Link>
        </nav>
        <button
          className="nav-toggle"
          aria-label="메뉴 열기"
          aria-expanded={isOpen}
          onClick={() => isOpen ? closeNav() : openNav()}
        >
          <em></em>
        </button>
      </header>
    </>
  );
}
