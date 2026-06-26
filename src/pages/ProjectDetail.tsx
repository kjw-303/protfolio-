// @ts-nocheck
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cursor from '../components/common/Cursor';
import Header from '../components/common/Header';
import SnapSlider from '../components/project-detail/SnapSlider';
import useScrollReveal from '../hooks/useScrollReveal';
import { getProjectsFromCache, fetchProjects } from '../services/projectService';
import '../styles/project-detail.css';

function toSnapSliderProps(p) {
  return {
    title: p.title,
    sub: p.sub,
    link: p.link || '',
    screenImg: p.screenImg || p.thumb,
    specs: [
      { label: 'CATEGORY', value: (p.category || '').replace(/\n/g, '<br>') },
      { label: 'STACK', value: (p.stack || '').replace(/\n/g, '<br>') },
      { label: 'FOCUS', value: (p.focus || '').replace(/\n/g, '<br>') },
      { label: 'YEAR', value: (p.year || '').replace(/\n/g, '<br>') },
    ],
    desc: [p.desc1, p.desc2].filter(Boolean),
    gallery: p.gallery || [],
  };
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [allProjects, setAllProjects] = useState(() => getProjectsFromCache());

  useEffect(() => {
    fetchProjects().then(setAllProjects);
  }, []);

  const raw = allProjects.find(p => p.id === Number(id)) || allProjects[0];
  if (!raw) return null;
  const project = toSnapSliderProps(raw);
  const currentIdx = allProjects.findIndex(p => p.id === raw.id);
  const nextRaw = allProjects[(currentIdx + 1) % allProjects.length];
  const nextProject = nextRaw ? { id: nextRaw.id, title: nextRaw.title } : null;

  useScrollReveal();

  return (
    <>
      <Cursor />
      <Header />
      <SnapSlider key={id} project={project} nextProject={nextProject} />
    </>
  );
}
