import { supabase } from '../lib/supabase';
import { DEFAULT_PROJECTS } from '../data/defaultProjects';
import type { Project } from '../types/project';

const STORAGE_KEY = 'portfolio_projects';
const DB_ROW_ID = 1;

export function getProjectsFromCache(): Project[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Project[];
  } catch (e) {
    console.warn('Failed to parse cached projects, using defaults:', e);
  }
  return DEFAULT_PROJECTS;
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('projects')
      .eq('id', DB_ROW_ID)
      .single();
    if (error || !data) throw error;
    const list = data.projects as Project[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    return getProjectsFromCache();
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  const { error } = await supabase
    .from('portfolio_projects')
    .upsert({ id: DB_ROW_ID, projects });
  if (error) console.error('Supabase save error:', error);
}

export async function getProjectById(id: number | string): Promise<Project> {
  const list = await fetchProjects();
  return list.find(p => p.id === Number(id)) ?? DEFAULT_PROJECTS[0];
}
