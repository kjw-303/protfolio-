import Cursor from '../components/common/Cursor';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import CTA from '../components/home/CTA';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/projects.css';

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
      <Footer tagline="Web &amp; App Developer" />
    </>
  );
}
