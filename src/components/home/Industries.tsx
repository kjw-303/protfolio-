// @ts-nocheck
import { useState, useRef } from 'react';

const TABS = [
  {
    title: 'Education',
    desc: '교육 플랫폼, 학원 홈페이지, 입시 전략 랜딩페이지 등 교육 분야 디지털 커뮤니케이션을 전문적으로 설계하고 구현합니다.',
    image: '/img/img_edu.png',
  },
  {
    title: 'E-commerce',
    desc: '이커머스 앱 및 웹 서비스 운영과 최적화',
    image: '/img/img_ecom.png',
  },
  {
    title: 'Agency',
    desc: '다양한 클라이언트 및 브랜드 대상 웹 및 앱 프로젝트',
    image: '/img/img_agency.png',
  },
];

export default function Industries() {
  const [activeTab, setActiveTab] = useState(0);
  const [imgSrc, setImgSrc] = useState(TABS[0].image);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef(null);

  function handleTabClick(i) {
    if (i === activeTab) return;
    const img = imgRef.current;
    if (img) img.style.opacity = '0';
    setTimeout(() => {
      setActiveTab(i);
      setImgError(false);
      setImgSrc(TABS[i].image);
      if (img) img.style.opacity = '1';
    }, 220);
  }

  return (
    <section className="industries">
      <div className="industries-corner"></div>
      <div className="industries-body">
        <h2 className="industries-label anim-words">작업 분야</h2>
        <div className="industries-inner">
          <div className="ind-image">
            {imgSrc && !imgError ? (
              <img
                ref={imgRef}
                src={imgSrc}
                alt=""
                onError={() => setImgError(true)}
                style={{ transition: 'opacity .22s' }}
              />
            ) : (
              <div className="ind-ph" style={{ display: 'flex' }}>📚</div>
            )}
          </div>
          <div className="ind-tabs">
            {TABS.map((tab, i) => (
              <div
                key={i}
                className={`ind-tab${i === activeTab ? ' active' : ''}`}
                data-hover
                onClick={() => handleTabClick(i)}
              >
                <div className="ind-tab-title">{tab.title}</div>
                <div className="ind-tab-desc">{tab.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
