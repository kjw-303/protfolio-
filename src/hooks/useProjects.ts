import { useState, useEffect } from 'react';
import { getProjectsFromCache, fetchProjects } from '../services/projectService';
import type { Project } from '../types/project';

export default function useProjects(): { projects: Project[]; loading: boolean } {
  const [projects, setProjects] = useState<Project[]>(getProjectsFromCache);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return { projects, loading };
}
