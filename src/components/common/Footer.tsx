import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

interface FooterProps {
  tagline?: string;
}

export default function Footer({ tagline = 'Web & App Designer' }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
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
          <p className={styles.address}>{tagline}<br />Korea</p>
        </div>
        <div className={styles.col}>
          <h4>Menu</h4>
          <ul>
            <li><Link to="/projects" data-hover>Projects</Link></li>
            <li><Link to="/#contact" data-hover>Contact</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Skills</h4>
          <ul>
            <li><a href="#" data-hover>HTML/CSS/JavaScript</a></li>
            <li><a href="#" data-hover>React</a></li>
            <li><a href="#" data-hover>Figma</a></li>
          </ul>
        </div>
        <div className={styles.col}>
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
