import { useParams } from 'react-router-dom';
import Cursor from '../components/common/Cursor.jsx';
import Header from '../components/common/Header.jsx';
import SnapSlider from '../components/project-detail/SnapSlider.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import { getProjectById, getProjects } from '../data/projects.js';
import '../styles/project-detail.css';

function toSnapSliderProps(p) {
  return {
    title: p.title,
    sub: p.sub,
    link: p.link || '',
    screenImg: p.screenImg || p.thumb,
    specs: [
      { label: 'CATEGORY', value: p.category || '' },
      { label: 'STACK', value: (p.stack || '').replace(/\n/g, '<br>') },
      { label: 'FOCUS', value: (p.focus || '').replace(/\n/g, '<br>') },
      { label: 'YEAR', value: p.year || '' },
    ],
    desc: [p.desc1, p.desc2].filter(Boolean),
    gallery: p.gallery || [],
  };
}

export default function ProjectDetail() {
  const { id } = useParams();
  const raw = getProjectById(Number(id));
  const project = toSnapSliderProps(raw);

  const allProjects = getProjects();
  const currentIdx = allProjects.findIndex(p => p.id === raw.id);
  const nextRaw = allProjects[(currentIdx + 1) % allProjects.length];
  const nextProject = { id: nextRaw.id, title: nextRaw.title };

  useScrollReveal();

  return (
    <>
      <Cursor />
      <Header />
      <SnapSlider key={id} project={project} nextProject={nextProject} />
    </>
  );
}
