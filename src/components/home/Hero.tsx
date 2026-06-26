// @ts-nocheck
import { useEffect, useRef } from 'react';

export default function Hero() {
  const gridRef = useRef(null);

  useEffect(() => {
    const cubeGrid = gridRef.current;
    if (!cubeGrid) return;
    // Clear in case of hot reload
    cubeGrid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const cube = document.createElement('div');
      cube.className = 'cube';
      const face = document.createElement('div');
      face.className = 'cube-face cube-top';
      const l = 80 + Math.random() * 15;
      face.style.background = `linear-gradient(135deg,hsl(0,0%,${l}%),hsl(0,0%,${l - 10}%))`;
      face.style.animationDelay = `${(i * 0.31) % 5}s`;
      cube.appendChild(face);
      cube.style.animationDelay = `${(i * 0.4) % 5}s`;
      cubeGrid.appendChild(cube);
    }
  }, []);

  return (
    <section className="hero">
      <div className="hero-left"></div>
      <div className="hero-right">
        <div className="cube-scene">
          <div className="cube-grid" ref={gridRef}></div>
        </div>
      </div>

      <div className="hero-title-wrap">
        <h1 className="hero-title">
          <span className="hero-title-line black">
            Digital <span className="cyan">Planning.</span>
          </span>
          <span className="hero-title-line black">
            Web &amp; <span className="cyan">App Works.</span>
          </span>
        </h1>
      </div>

      <p className="hero-sub">
        웹 &amp; 앱 프로젝트를 설계하고 구현합니다.<br />
        데이터 기반, 사용자 중심 — <span className="cyan">직접 만드는 디지털 경험.</span>
      </p>

      <div className="scroll-indicator">
        <div className="scroll-bar"></div>
      </div>
    </section>
  );
}
