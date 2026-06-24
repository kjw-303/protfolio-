import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, fetchProjects, saveProjects, DEFAULT_PROJECTS } from '../data/projects.js';

/* ── 기본 커서 복원 ── */
function useAdminCursor() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'admin-cursor';
    style.textContent = '* { cursor: auto !important; } a, button { cursor: pointer !important; } input, textarea { cursor: text !important; }';
    document.head.appendChild(style);
    return () => { document.getElementById('admin-cursor')?.remove(); };
  }, []);
}

/* ── 공통 스타일 ── */
const c = {
  accent: '#00e5ff',
  black: '#111',
  border: '#e8e8e8',
  bg: '#f7f7f7',
  cardBg: '#fff',
  muted: '#999',
  danger: '#e53935',
};

const s = {
  page: { minHeight: '100vh', background: c.bg, fontFamily: "'Pretendard Variable', sans-serif", color: c.black },

  /* 헤더 */
  header: { background: c.black, color: '#fff', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 24 },
  headerTitle: { fontSize: 15, fontWeight: 700, margin: 0 },
  headerBreadcrumb: { fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 8 },
  headerLinks: { display: 'flex', gap: 12 },

  /* 버튼 */
  btn: (bg, color, border) => ({
    padding: '8px 18px', background: bg, color, border: border || 'none',
    borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    letterSpacing: '.05em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
  }),
  btnSave: { padding: '8px 22px', background: c.accent, color: '#000', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' },

  /* 리스트 뷰 */
  listWrap: { padding: '36px 40px' },
  listTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  listTitle: { fontSize: 22, fontWeight: 700, margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  card: (hover) => ({
    background: c.cardBg, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
    border: `1.5px solid ${hover ? c.accent : c.border}`,
    transition: 'border-color .15s, box-shadow .15s',
    boxShadow: hover ? '0 4px 16px rgba(0,229,255,.12)' : '0 1px 3px rgba(0,0,0,.06)',
  }),
  cardThumb: { width: '100%', height: 130, objectFit: 'cover', display: 'block', background: '#eee' },
  cardThumbPh: { width: '100%', height: 130, background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 },
  cardBody: { padding: '12px 14px 14px' },
  cardNum: { fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: c.muted, marginBottom: 4 },
  cardTitle: { fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 4 },
  cardSub: { fontSize: 11, color: '#888', lineHeight: 1.4 },

  /* 편집 뷰 */
  editWrap: { padding: '32px 40px', maxWidth: 900, margin: '0 auto' },
  editTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  editTitle: { fontSize: 20, fontWeight: 700, margin: 0 },
  editBtns: { display: 'flex', alignItems: 'center', gap: 10 },
  saved: { fontSize: 12, color: '#00c853', fontWeight: 700 },

  section: { background: c.cardBg, borderRadius: 10, padding: '24px 28px', marginBottom: 16, border: `1px solid ${c.border}` },
  sectionTitle: { fontSize: 10, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: c.muted, marginBottom: 18 },

  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' },
  grid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px 16px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 },

  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#888' },
  input: { padding: '8px 11px', border: `1.5px solid ${c.border}`, borderRadius: 6, fontSize: 13, outline: 'none', fontFamily: 'inherit', cursor: 'text' },
  textarea: { padding: '8px 11px', border: `1.5px solid ${c.border}`, borderRadius: 6, fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, cursor: 'text' },
  preview: (h) => ({ width: '100%', height: h || 120, objectFit: 'cover', borderRadius: 6, background: '#f0f0f0', marginTop: 8, display: 'block' }),
};

/* ════════════════════════════
   LIST VIEW
════════════════════════════ */
function ProjectCard({ project, onClick, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={s.card(hover)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onClick}>
        {project.thumb
          ? <img src={project.thumb} alt="" style={s.cardThumb} onError={e => { e.target.style.display='none'; }} />
          : <div style={s.cardThumbPh}>🏢</div>
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

function ListView({ projects, onSelect, onReset, onAdd, onDelete }) {
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

/* ════════════════════════════
   EDIT VIEW
════════════════════════════ */
function EditView({ project, onChange, onSave, savedMsg }) {
  const gallery = project.gallery || ['', '', ''];

  function f(field) {
    return <input style={s.input} value={project[field] || ''} onChange={e => onChange(field, e.target.value)} />;
  }
  function ta(field, rows) {
    return <textarea style={{ ...s.textarea, minHeight: rows * 28 }} value={project[field] || ''} onChange={e => onChange(field, e.target.value)} rows={rows} />;
  }

  return (
    <div style={s.editWrap}>
      <div style={s.editTop}>
        <h2 style={s.editTitle}>#{String(project.id).padStart(2,'0')} {project.title}</h2>
        <div style={s.editBtns}>
          {savedMsg && <span style={s.saved}>{savedMsg}</span>}
          <button style={s.btnSave} onClick={onSave}>저장하기</button>
        </div>
      </div>

      {/* 카드 공통 */}
      <div style={s.section}>
        <p style={s.sectionTitle}>카드 — 슬라이더 &amp; 목록 공통</p>
        <div style={s.grid2}>
          <div style={s.field}>
            <label style={s.label}>썸네일 이미지 URL</label>
            {f('thumb')}
            {project.thumb && <img src={project.thumb} alt="" style={s.preview(140)} onError={e => { e.target.style.display='none'; }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={s.field}><label style={s.label}>카드 타이틀</label>{f('title')}</div>
            <div style={s.field}><label style={s.label}>카드 서브텍스트</label>{f('sub')}</div>
            <div style={s.field}>
              <label style={s.label}>링크 URL <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, color:'#bbb', fontSize:10 }}>(비워두면 상세 페이지로 이동)</span></label>
              {f('link')}
            </div>
          </div>
        </div>
      </div>

      {/* 스펙 */}
      <div style={s.section}>
        <p style={s.sectionTitle}>스펙</p>
        <div style={s.grid4}>
          {['category', 'stack', 'focus', 'year'].map(k => (
            <div key={k} style={s.field}>
              <label style={s.label}>{k.toUpperCase()}</label>
              {ta(k, k === 'year' ? 1 : 2)}
            </div>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <div style={s.section}>
        <p style={s.sectionTitle}>프로젝트 설명</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={s.field}><label style={s.label}>설명 1</label>{ta('desc1', 3)}</div>
          <div style={s.field}><label style={s.label}>설명 2</label>{ta('desc2', 3)}</div>
        </div>
      </div>

      {/* 갤러리 */}
      <div style={s.section}>
        <p style={s.sectionTitle}>갤러리 (3장)</p>
        <div style={s.grid3}>
          {[0,1,2].map(i => (
            <div key={i} style={s.field}>
              <label style={s.label}>이미지 {i+1}</label>
              <input style={s.input} value={gallery[i] || ''} onChange={e => {
                const g = [...gallery]; g[i] = e.target.value; onChange('gallery', g);
              }} />
              {gallery[i] && <img src={gallery[i]} alt="" style={s.preview(100)} onError={e => { e.target.style.display='none'; }} />}
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

/* ════════════════════════════
   MAIN
════════════════════════════ */
export default function Admin() {
  useAdminCursor();
  const [projects, setProjects] = useState(() => getProjects());
  const [selectedId, setSelectedId] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const selected = projects.find(p => p.id === selectedId);

  function updateField(field, value) {
    setProjects(prev => prev.map(p => p.id === selectedId ? { ...p, [field]: value } : p));
  }

  async function handleSave() {
    setSavedMsg('저장 중...');
    await saveProjects(projects);
    setSavedMsg('저장 완료!');
    setTimeout(() => { setSavedMsg(''); setSelectedId(null); }, 1000);
  }

  async function handleReset() {
    if (!confirm('전체 데이터를 초기값으로 되돌릴까요?')) return;
    setProjects(DEFAULT_PROJECTS);
    await saveProjects(DEFAULT_PROJECTS);
    setSelectedId(null);
  }

  async function handleDelete(id) {
    if (!confirm('이 프로젝트를 삭제할까요?')) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await saveProjects(updated);
  }

  async function handleAdd() {
    const newId = Math.max(...projects.map(p => p.id)) + 1;
    const newProject = {
      id: newId,
      thumb: '',
      title: '새 프로젝트',
      sub: '서브텍스트',
      titleLine1: '새',
      titleLine2: '프로젝트',
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
      {/* 헤더 */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.headerTitle}>Admin</span>
          {selected && (
            <div style={s.headerBreadcrumb}>
              <span style={{ color: '#444' }}>›</span>
              <button
                style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, padding: 0, cursor: 'pointer' }}
                onClick={() => setSelectedId(null)}
              >
                Projects
              </button>
              <span style={{ color: '#444' }}>›</span>
              <span style={{ color: '#fff' }}>{selected.title}</span>
            </div>
          )}
        </div>
        <div style={s.headerLinks}>
          <button onClick={() => setSelectedId(null)} style={s.btn('transparent', '#888', '1px solid #333')}>← 홈</button>
          <Link to="/projects" style={s.btn('transparent', '#888', '1px solid #333')}>Projects</Link>
        </div>
      </header>

      {/* 뷰 전환 */}
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
