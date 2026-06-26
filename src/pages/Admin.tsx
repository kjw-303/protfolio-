import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjectsFromCache, fetchProjects, saveProjects } from '../services/projectService';
import { DEFAULT_PROJECTS } from '../data/defaultProjects';
import type { Project } from '../types/project';

function useAdminCursor() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'admin-cursor';
    style.textContent = '* { cursor: auto !important; } a, button { cursor: pointer !important; } input, textarea { cursor: text !important; }';
    document.head.appendChild(style);
    return () => { document.getElementById('admin-cursor')?.remove(); };
  }, []);
}

const c = {
  accent: '#00e5ff',
  black: '#111',
  border: '#e8e8e8',
  bg: '#f7f7f7',
  cardBg: '#fff',
  muted: '#999',
  danger: '#e53935',
};

type CSSObj = Record<string, string | number>;

const s = {
  page: { minHeight: '100vh', background: c.bg, fontFamily: "'Pretendard Variable', sans-serif", color: c.black } as CSSObj,
  header: { background: c.black, color: '#fff', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 } as CSSObj,
  headerLeft: { display: 'flex', alignItems: 'center', gap: 24 } as CSSObj,
  headerTitle: { fontSize: 15, fontWeight: 700, margin: 0 } as CSSObj,
  headerBreadcrumb: { fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 8 } as CSSObj,
  headerLinks: { display: 'flex', gap: 12 } as CSSObj,
  btn: (bg: string, color: string, border?: string): CSSObj => ({
    padding: '8px 18px', background: bg, color, border: border ?? 'none',
    borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    letterSpacing: '.05em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
  }),
  btnSave: { padding: '8px 22px', background: c.accent, color: '#000', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' } as CSSObj,
  listWrap: { padding: '36px 40px' } as CSSObj,
  listTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 } as CSSObj,
  listTitle: { fontSize: 22, fontWeight: 700, margin: 0 } as CSSObj,
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 } as CSSObj,
  card: (hover: boolean): CSSObj => ({
    background: c.cardBg, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
    border: `1.5px solid ${hover ? c.accent : c.border}`,
    transition: 'border-color .15s, box-shadow .15s',
    boxShadow: hover ? '0 4px 16px rgba(0,229,255,.12)' : '0 1px 3px rgba(0,0,0,.06)',
  }),
  cardThumb: { width: '100%', height: 130, objectFit: 'cover', display: 'block', background: '#eee' } as CSSObj,
  cardThumbPh: { width: '100%', height: 130, background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 } as CSSObj,
  cardBody: { padding: '12px 14px 14px' } as CSSObj,
  cardNum: { fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: c.muted, marginBottom: 4 } as CSSObj,
  cardTitle: { fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 4 } as CSSObj,
  cardSub: { fontSize: 11, color: '#888', lineHeight: 1.4 } as CSSObj,
  editWrap: { padding: '32px 40px', maxWidth: 900, margin: '0 auto' } as CSSObj,
  editTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 } as CSSObj,
  editTitle: { fontSize: 20, fontWeight: 700, margin: 0 } as CSSObj,
  editBtns: { display: 'flex', alignItems: 'center', gap: 10 } as CSSObj,
  saved: { fontSize: 12, color: '#00c853', fontWeight: 700 } as CSSObj,
  section: { background: c.cardBg, borderRadius: 10, padding: '24px 28px', marginBottom: 16, border: `1px solid ${c.border}` } as CSSObj,
  sectionTitle: { fontSize: 10, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: c.muted, marginBottom: 18 } as CSSObj,
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' } as CSSObj,
  grid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px 16px' } as CSSObj,
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 } as CSSObj,
  field: { display: 'flex', flexDirection: 'column', gap: 6 } as CSSObj,
  label: { fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#888' } as CSSObj,
  input: { padding: '8px 11px', border: `1.5px solid ${c.border}`, borderRadius: 6, fontSize: 13, outline: 'none', fontFamily: 'inherit', cursor: 'text' } as CSSObj,
  textarea: { padding: '8px 11px', border: `1.5px solid ${c.border}`, borderRadius: 6, fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, cursor: 'text' } as CSSObj,
  preview: (h?: number): CSSObj => ({ width: '100%', height: h ?? 120, objectFit: 'cover', borderRadius: 6, background: '#f0f0f0', marginTop: 8, display: 'block' }),
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onDelete: () => void;
}

function ProjectCard({ project, onClick, onDelete }: ProjectCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={s.card(hover)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onClick}>
        {project.thumb
          ? <img src={project.thumb} alt="" style={s.cardThumb} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          : <div style={s.cardThumbPh}>🖼</div>
        }
        <button
          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.65)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer', zIndex: 10 }}
          onClick={e => { e.stopPropagation(); onDelete(); }}
        >
          삭제
        </button>
      </div>
      <div style={{ ...s.cardBody, cursor: 'pointer' }} onClick={onClick}>
        <p style={s.cardNum}>#{String(project.id).padStart(2, '0')}</p>
        <p style={s.cardTitle}>{project.title}</p>
        <p style={s.cardSub}>{project.sub}</p>
      </div>
    </div>
  );
}

interface ListViewProps {
  projects: Project[];
  onSelect: (id: number) => void;
  onReset: () => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

function ListView({ projects, onSelect, onAdd, onDelete }: ListViewProps) {
  return (
    <div style={s.listWrap}>
      <div style={s.listTop}>
        <h1 style={s.listTitle}>Projects <span style={{ color: c.muted, fontSize: 16, fontWeight: 400 }}>{projects.length}개</span></h1>
        <button style={s.btnSave} onClick={onAdd}>+ 새 프로젝트</button>
      </div>
      <div style={s.grid}>
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} onClick={() => onSelect(p.id)} onDelete={() => onDelete(p.id)} />
        ))}
      </div>
    </div>
  );
}

interface EditViewProps {
  project: Project;
  onChange: (field: keyof Project, value: string | string[]) => void;
  onSave: () => void;
  savedMsg: string;
}

function EditView({ project, onChange, onSave, savedMsg }: EditViewProps) {
  const gallery = project.gallery ?? ['', '', ''];

  function f(field: keyof Project) {
    return <input style={s.input} value={String(project[field] ?? '')} onChange={e => onChange(field, e.target.value)} />;
  }
  function ta(field: keyof Project, rows: number) {
    return <textarea style={{ ...s.textarea, minHeight: rows * 28 }} value={String(project[field] ?? '')} onChange={e => onChange(field, e.target.value)} rows={rows} />;
  }

  return (
    <div style={s.editWrap}>
      <div style={s.editTop}>
        <h2 style={s.editTitle}>#{String(project.id).padStart(2, '0')} {project.title}</h2>
        <div style={s.editBtns}>
          {savedMsg && <span style={s.saved}>{savedMsg}</span>}
          <button style={s.btnSave} onClick={onSave}>저장하기</button>
        </div>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>썸네일 이미지 & 기본 정보</p>
        <div style={s.grid2}>
          <div style={s.field}>
            <label style={s.label}>썸네일 이미지 URL</label>
            {f('thumb')}
            {project.thumb && <img src={project.thumb} alt="" style={s.preview(140)} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={s.field}><label style={s.label}>제목</label>{f('title')}</div>
            <div style={s.field}><label style={s.label}>부제목</label>{f('sub')}</div>
            <div style={s.field}>
              <label style={s.label}>링크 URL <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#bbb', fontSize: 10 }}>(있으면 외부 사이트로 이동)</span></label>
              {f('link')}
            </div>
          </div>
        </div>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>스펙</p>
        <div style={s.grid4}>
          {(['category', 'stack', 'focus', 'year'] as const).map(k => (
            <div key={k} style={s.field}>
              <label style={s.label}>{k.toUpperCase()}</label>
              {ta(k, k === 'year' ? 1 : 2)}
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>프로젝트 설명</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={s.field}><label style={s.label}>설명 1</label>{ta('desc1', 3)}</div>
          <div style={s.field}><label style={s.label}>설명 2</label>{ta('desc2', 3)}</div>
        </div>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>갤러리 (3장)</p>
        <div style={s.grid3}>
          {[0, 1, 2].map(i => (
            <div key={i} style={s.field}>
              <label style={s.label}>이미지 {i + 1}</label>
              <input style={s.input} value={gallery[i] ?? ''} onChange={e => {
                const g = [...gallery]; g[i] = e.target.value; onChange('gallery', g);
              }} />
              {gallery[i] && <img src={gallery[i]} alt="" style={s.preview(100)} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'right', paddingBottom: 40 }}>
        <button style={{ ...s.btnSave, padding: '11px 32px', fontSize: 14 }} onClick={onSave}>저장하기</button>
      </div>
    </div>
  );
}

export default function Admin() {
  useAdminCursor();
  const [projects, setProjects] = useState<Project[]>(() => getProjectsFromCache());
  const [selectedId, setSelectedId] = useState(-1);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const selected = selectedId !== -1 ? projects.find(p => p.id === selectedId) : undefined;

  function updateField(field: keyof Project, value: string | string[]) {
    setProjects(prev => prev.map(p => p.id === selectedId ? { ...p, [field]: value } : p));
  }

  function handleSave() {
    const clean = projects.filter(p => p.id !== null && p.id !== undefined && p.id > 0);
    saveProjects(clean).catch(console.error);
    setProjects(clean);
    setSavedMsg('저장됨');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  async function handleReset() {
    if (!confirm('전체 데이터를 초기화하시겠습니까?')) return;
    setProjects(DEFAULT_PROJECTS);
    await saveProjects(DEFAULT_PROJECTS);
    setSelectedId(-1);
  }

  async function handleDelete(id: number) {
    if (!confirm('이 프로젝트를 삭제하시겠습니까?')) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await saveProjects(updated);
  }

  async function handleAdd() {
    const validIds = projects.map(p => p.id).filter(id => typeof id === 'number' && id > 0);
    const newId = validIds.length > 0 ? Math.max(...validIds) + 1 : 1;
    const newProject: Project = {
      id: newId,
      thumb: '',
      title: '새 프로젝트',
      sub: '부제목',
      link: '',
      screenImg: '',
      category: '',
      stack: '',
      focus: '',
      year: new Date().getFullYear().toString(),
      desc1: '',
      desc2: '',
      gallery: ['', '', ''],
    };
    const updated = [...projects, newProject];
    setProjects(updated);
    await saveProjects(updated);
    setSelectedId(newId);
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.headerTitle}>Admin</span>
          {selected && (
            <div style={s.headerBreadcrumb}>
              <span style={{ color: '#444' }}>›</span>
              <button
                style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, padding: 0, cursor: 'pointer' }}
                onClick={() => setSelectedId(-1)}
              >
                Projects
              </button>
              <span style={{ color: '#444' }}>›</span>
              <span style={{ color: '#fff' }}>{selected.title}</span>
            </div>
          )}
        </div>
        <div style={s.headerLinks}>
          <button onClick={() => setSelectedId(-1)} style={s.btn('transparent', '#888', '1px solid #333')}>목록</button>
          <Link to="/projects" style={s.btn('transparent', '#888', '1px solid #333')}>Projects</Link>
        </div>
      </header>

      {selected
        ? <EditView
            project={selected}
            onChange={updateField}
            onSave={handleSave}
            savedMsg={savedMsg}
          />
        : <ListView
            projects={projects}
            onSelect={setSelectedId}
            onReset={handleReset}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
      }
    </div>
  );
}
