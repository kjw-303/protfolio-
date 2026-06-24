import { supabase } from '../lib/supabase.js';

const STORAGE_KEY = 'portfolio_projects';
const DB_ROW_ID   = 1;

export const DEFAULT_PROJECTS = [
  {
    id: 1,
    thumb: '/img/koelnturm-teaser.jpg',
    title: '게임입시 랜딩페이지',
    sub: 'SBS Game Academy — 입시 전략 랜딩페이지',
    link: '',
    screenImg: '/img/koelnturm-teaser.jpg',
    category: 'Landing Page',
    stack: 'HTML / CSS\nJavaScript',
    focus: 'UI 애니메이션\n반응형 퍼블리싱',
    year: '2025',
    desc1: 'SBS Game Academy의 게임 관련 학과 입시 전략 랜딩페이지입니다. 수험생과 학부모가 필요한 정보를 직관적으로 파악할 수 있도록 설계된 단일 페이지 구조로 제작했습니다.',
    desc2: 'Hero 영역의 캐러셀 슬라이더, 무한 롤링 슬라이더, 자동 스크롤 스트립, 커리큘럼 카드 등 다양한 인터랙션 요소를 포함하며, PC 우선 설계 후 모바일 반응형을 적용했습니다.',
    gallery: ['/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg', '/img/speakbar.jpg'],
  },
  {
    id: 2,
    thumb: '/img/proxity-teaser.jpg',
    title: '스마트러닝앱 화면설계',
    sub: '앱 전체 화면설계서 및 와이어프레임',
    link: '',
    screenImg: '/img/proxity-teaser.jpg',
    category: 'App Planning',
    stack: 'Figma\nNotion',
    focus: '화면설계서\n와이어프레임',
    year: '2025',
    desc1: '스마트러닝 앱의 전체 화면설계서 및 와이어프레임 작업입니다.',
    desc2: '사용자 흐름 분석을 바탕으로 직관적인 UX를 설계하고 개발팀과의 원활한 협업을 위한 산출물을 제공했습니다.',
    gallery: ['/img/proxity-teaser.jpg', '/img/koelnturm-teaser.jpg', '/img/speakbar.jpg'],
  },
  {
    id: 3,
    thumb: '/img/cp-teaser.png',
    title: 'KEG 그룹 홈페이지 리뉴얼',
    sub: '그룹사 홈페이지 반응형 리뉴얼',
    link: '',
    screenImg: '/img/cp-teaser.png',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: '반응형\n그룹사 사이트',
    year: '2024',
    desc1: '그룹사 홈페이지 반응형 리뉴얼 프로젝트입니다.',
    desc2: '다양한 계열사 정보를 일관된 디자인 시스템으로 통합하여 구현했습니다.',
    gallery: ['/img/cp-teaser.png', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 4,
    thumb: '/img/haeger-teaser2.jpg',
    title: '켈리스펫 리뉴얼',
    sub: '펫 아카데미 웹사이트 전면 리뉴얼',
    link: '',
    screenImg: '/img/haeger-teaser2.jpg',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: '전면 리뉴얼\n모바일 반응형',
    year: '2024',
    desc1: '펫 아카데미 웹사이트 전면 리뉴얼 프로젝트입니다.',
    desc2: '브랜드 아이덴티티를 유지하면서 사용자 경험을 개선하는 방향으로 설계했습니다.',
    gallery: ['/img/haeger-teaser2.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 5,
    thumb: '/img/speakbar.jpg',
    title: '항공운항과 리뉴얼',
    sub: '모바일 반응형 React 전환 작업',
    link: '',
    screenImg: '/img/speakbar.jpg',
    category: 'React',
    stack: 'React\nCSS Modules',
    focus: '모바일 반응형\nReact 전환',
    year: '2025',
    desc1: '항공운항과 홈페이지 모바일 반응형 React 전환 작업입니다.',
    desc2: '기존 HTML/CSS 구조를 React 컴포넌트 기반으로 재구성했습니다.',
    gallery: ['/img/speakbar.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 6,
    thumb: '/img/gras-teaser-1.jpg',
    title: '코리아 AI 아카데미',
    sub: 'AI 교육기관 홈페이지 구축 퍼블리싱',
    link: '',
    screenImg: '/img/gras-teaser-1.jpg',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: 'AI 교육기관\n홈페이지 구축',
    year: '2025',
    desc1: 'AI 교육기관 홈페이지 구축 퍼블리싱 프로젝트입니다.',
    desc2: '최신 트렌드를 반영한 UI/UX 설계와 퍼블리싱을 담당했습니다.',
    gallery: ['/img/gras-teaser-1.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 7,
    thumb: '/img/hohenlind-teaser-1.jpg',
    title: '입시 포털 통합 리뉴얼',
    sub: '멀티사이트 기반 입시 정보 플랫폼',
    link: '',
    screenImg: '/img/hohenlind-teaser-1.jpg',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: '멀티사이트\n입시 플랫폼',
    year: '2024',
    desc1: '멀티사이트 기반 입시 정보 플랫폼 통합 리뉴얼 프로젝트입니다.',
    desc2: '다수의 학과 사이트를 일관된 구조로 통합하여 운영 효율을 높였습니다.',
    gallery: ['/img/hohenlind-teaser-1.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 8,
    thumb: '/img/of-teaser.jpg',
    title: '학원 그룹 통합 CMS',
    sub: '다중 캠퍼스 관리 시스템 퍼블리싱',
    link: '',
    screenImg: '/img/of-teaser.jpg',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: '다중 캠퍼스\nCMS 퍼블리싱',
    year: '2024',
    desc1: '다중 캠퍼스 관리 시스템 퍼블리싱 프로젝트입니다.',
    desc2: '복잡한 관리 기능을 사용하기 쉬운 인터페이스로 구현했습니다.',
    gallery: ['/img/of-teaser.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 9,
    thumb: '/img/lux-teaser2.jpg',
    title: '의료기관 홈페이지',
    sub: 'Healthcare 기관 접근성 기준 구축',
    link: '',
    screenImg: '/img/lux-teaser2.jpg',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: '접근성\nHealthcare',
    year: '2024',
    desc1: 'Healthcare 기관 접근성 기준에 맞는 홈페이지 구축 프로젝트입니다.',
    desc2: 'WCAG 기준을 준수하며 모든 사용자가 편리하게 이용할 수 있도록 설계했습니다.',
    gallery: ['/img/lux-teaser2.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 10,
    thumb: '/img/horticert-teaser.jpg',
    title: '이러닝 플랫폼 구축',
    sub: 'LMS 연동 온라인 강의 서비스 개발',
    link: '',
    screenImg: '/img/horticert-teaser.jpg',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: 'LMS 연동\n이러닝 플랫폼',
    year: '2024',
    desc1: 'LMS 연동 온라인 강의 서비스 개발 프로젝트입니다.',
    desc2: '학습자 중심의 UX 설계와 LMS 시스템 연동을 담당했습니다.',
    gallery: ['/img/horticert-teaser.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 11,
    thumb: '/img/meo-teaser-light.jpg',
    title: '기업 브랜드 사이트',
    sub: 'B2B 기업 홈페이지 다국어 지원 구축',
    link: '',
    screenImg: '/img/meo-teaser-light.jpg',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: 'B2B\n다국어 지원',
    year: '2024',
    desc1: 'B2B 기업 홈페이지 다국어 지원 구축 프로젝트입니다.',
    desc2: '한국어/영어 다국어 지원과 글로벌 스탠다드에 맞는 디자인을 구현했습니다.',
    gallery: ['/img/meo-teaser-light.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
  {
    id: 12,
    thumb: '/img/patentkreis-teaser.jpg',
    title: '회원 전용 포털',
    sub: '로그인 기반 멤버십 플랫폼 퍼블리싱',
    link: '',
    screenImg: '/img/patentkreis-teaser.jpg',
    category: 'Web Publishing',
    stack: 'HTML / CSS\nJavaScript',
    focus: '멤버십\n로그인 플랫폼',
    year: '2024',
    desc1: '로그인 기반 멤버십 플랫폼 퍼블리싱 프로젝트입니다.',
    desc2: '회원 전용 콘텐츠 관리와 접근 제어를 위한 UI를 구현했습니다.',
    gallery: ['/img/patentkreis-teaser.jpg', '/img/koelnturm-teaser.jpg', '/img/proxity-teaser.jpg'],
  },
];

// 동기 (초기 렌더용 — localStorage 캐시 또는 DEFAULT)
export function getProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_PROJECTS;
}

// 비동기 — Supabase에서 최신 데이터 로드
export async function fetchProjects() {
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('projects')
      .eq('id', DB_ROW_ID)
      .single();
    if (error || !data) throw error;
    const list = data.projects;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    return getProjects(); // fallback
  }
}

// 비동기 — Supabase에 저장
export async function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  const { error } = await supabase
    .from('portfolio_projects')
    .upsert({ id: DB_ROW_ID, projects });
  if (error) console.error('Supabase save error:', error);
}

export async function getProjectById(id) {
  const list = await fetchProjects();
  return list.find(p => p.id === Number(id)) || DEFAULT_PROJECTS[0];
}
