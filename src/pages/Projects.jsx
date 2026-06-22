import { Link } from 'react-router-dom';
import Cursor from '../components/common/Cursor.jsx';
import Header from '../components/common/Header.jsx';
import ProjectsGrid from '../components/projects/ProjectsGrid.jsx';
import CTA from '../components/home/CTA.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import '../styles/projects.css';

function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="logo" style={{ color: '#fff' }}>
            <div className="logo-mark">
              <span className="a"></span>
              <span className="b" style={{ background: '#333' }}></span>
              <span className="c" style={{ background: '#333' }}></span>
              <span className="d" style={{ background: '#555' }}></span>
            </div>
            <span className="logo-name">Portfolio</span>
          </div>
          <p className="footer-address">Web &amp; App Designer<br />Korea</p>
        </div>
        <div className="footer-col">
          <h4>Menu</h4>
          <ul>
            <li><Link to="/projects" data-hover>Projects</Link></li>
            <li><Link to="/#services" data-hover>Services</Link></li>
            <li><Link to="/#contact" data-hover>Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Skills</h4>
          <ul>
            <li><a href="#" data-hover>Web Publishing</a></li>
            <li><a href="#" data-hover>UX Design</a></li>
            <li><a href="#" data-hover>App Spec</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Info</h4>
          <ul>
            <li><a href="#" data-hover>About</a></li>
            <li><a href="#" data-hover>Resume</a></li>
            <li><a href="#" data-hover>GitHub</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default function Projects() {
  useScrollReveal();

  return (
    <>
      <Cursor />
      <Header />

      <div className="page-intro">
        <div className="page-intro__inner">
          <h1 className="page-intro__title anim-words">
            Selected<br />
            <span className="cyan">Works.</span>
          </h1>
        </div>
      </div>

      <ProjectsGrid />
      <CTA />
      <Footer />
    </>
  );
}
