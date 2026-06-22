export default function Services() {
  return (
    <section className="services" id="services">
      <a href="#contact" className="service-tile is-cyan" data-hover data-cursor="Web">
        <span className="has-cursor-label">
          <strong className="tile-title">Web Publishing</strong>
          <span className="tile-desc">명확한 기술 구조로 제작된 개별 웹사이트. 확장 가능하고 유지보수하기 쉬운 코드.</span>
        </span>
      </a>
      <a href="#contact" className="service-tile is-black" data-hover data-cursor="App">
        <span className="has-cursor-label">
          <strong className="tile-title">App &amp; UX Planning</strong>
          <span className="tile-desc">앱 화면설계부터 와이어프레임까지. 개발팀과 원활하게 협업할 수 있는 산출물.</span>
        </span>
      </a>
      <a href="#contact" className="service-tile is-grey" data-hover data-cursor="RWD">
        <span className="has-cursor-label">
          <strong className="tile-title">반응형 &amp; 접근성</strong>
          <span className="tile-desc">모바일 반응형 및 접근성 기준에 맞춰 구현. 장기적으로 유지보수하기 쉬운 구조.</span>
        </span>
      </a>
    </section>
  );
}
