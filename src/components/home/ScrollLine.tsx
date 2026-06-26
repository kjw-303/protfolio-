// @ts-nocheck
import { useEffect, useRef } from 'react';

export default function ScrollLine() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let W, VH, S, segs;
    let scrollProg = 0, targetProg = 0;
    let pathYStart = 0, pathYEnd = 1;
    let rafId;

    const ORIG_W = 1440;
    function sx(v) { return v * S; }

    function setup() {
      W  = window.innerWidth;
      VH = window.innerHeight;
      S  = W / ORIG_W;
      canvas.width  = W;
      canvas.height = VH;

      const heroEl = document.querySelector('section.hero');
      const indEl  = document.querySelector('section.industries');
      if (!heroEl || !indEl) return;

      const heroBottom  = heroEl.offsetTop + heroEl.offsetHeight;
      const indTop      = indEl.offsetTop;
      const indBottom   = indTop + indEl.offsetHeight;
      const cx          = W / 2;
      const R           = sx(70);

      pathYStart = heroBottom - VH * 0.15;
      pathYEnd   = indBottom;

      const Re = sx(22);  // 진입 arc 작은 반경
      const Rx = sx(65);  // 하단 exit arc 반경

      // c1 (green): 오른쪽 엣지에서 아주 짧게 진입 → 타이트 arc↓ → 우측 극단 빈공간 → arc← → 왼쪽으로
      const c1EntryY = heroEl.offsetTop + heroEl.offsetHeight * 0.35;
      const c1TurnX  = W - sx(18);
      const c1DownX  = c1TurnX - Re;

      // c2 (blue): 약간 더 왼쪽, 더 아래 진입
      const c2EntryY = heroBottom - sx(20);
      const c2TurnX  = W - sx(32);
      const c2DownX  = c2TurnX - Re;

      segs = {
        c1: [
          { type:'L', x1:W,          y1:c1EntryY,       x2:c1TurnX,       y2:c1EntryY       },
          { type:'A', cx:c1TurnX,    cy:c1EntryY+Re,    r:Re, a1:-Math.PI/2, a2:Math.PI,   ccw:true  },
          { type:'L', x1:c1DownX,    y1:c1EntryY+Re,    x2:c1DownX,       y2:indTop-Rx     },
          { type:'A', cx:c1DownX-Rx, cy:indTop-Rx,      r:Rx, a1:0,          a2:Math.PI/2, ccw:false },
          { type:'L', x1:c1DownX-Rx, y1:indTop,         x2:0,             y2:indTop         },
        ],
        c2: [
          { type:'L', x1:W,          y1:c2EntryY,       x2:c2TurnX,       y2:c2EntryY       },
          { type:'A', cx:c2TurnX,    cy:c2EntryY+Re,    r:Re, a1:-Math.PI/2, a2:Math.PI,   ccw:true  },
          { type:'L', x1:c2DownX,    y1:c2EntryY+Re,    x2:c2DownX,       y2:indBottom-Rx  },
          { type:'A', cx:c2DownX-Rx, cy:indBottom-Rx,   r:Rx, a1:0,          a2:Math.PI/2, ccw:false },
          { type:'L', x1:c2DownX-Rx, y1:indBottom,      x2:0,             y2:indBottom      },
        ],
      };
    }

    function segLen(seg) {
      if (seg.type === 'L') {
        const dx = seg.x2 - seg.x1, dy = seg.y2 - seg.y1;
        return Math.sqrt(dx * dx + dy * dy);
      }
      let da = seg.ccw ? seg.a1 - seg.a2 : seg.a2 - seg.a1;
      if (da < 0) da += 2 * Math.PI;
      return Math.abs(da) * seg.r;
    }

    function drawPath(segments, progress, color) {
      const totalLen = segments.reduce((s, g) => s + segLen(g), 0);
      let remaining  = totalLen * progress;
      if (remaining <= 0) return;

      ctx.strokeStyle = color;
      ctx.lineWidth   = sx(5);
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      let started = false;

      for (const seg of segments) {
        if (remaining <= 0) break;
        const len  = segLen(seg);
        const frac = Math.min(1, remaining / len);

        if (seg.type === 'L') {
          if (!started) { ctx.moveTo(seg.x1, seg.y1); started = true; }
          else ctx.lineTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x1 + (seg.x2 - seg.x1) * frac, seg.y1 + (seg.y2 - seg.y1) * frac);
        } else {
          const asx = seg.cx + seg.r * Math.cos(seg.a1);
          const asy = seg.cy + seg.r * Math.sin(seg.a1);
          if (!started) { ctx.moveTo(asx, asy); started = true; }
          else ctx.lineTo(asx, asy);
          let da = seg.ccw ? seg.a1 - seg.a2 : seg.a2 - seg.a1;
          if (da < 0) da += 2 * Math.PI;
          const endA = seg.ccw ? seg.a1 - da * frac : seg.a1 + da * frac;
          ctx.arc(seg.cx, seg.cy, seg.r, seg.a1, endA, seg.ccw);
        }
        remaining -= len;
      }
      ctx.stroke();
    }

    function calcProgress() {
      const tipY = window.scrollY + VH * 0.85;
      const t    = (tipY - pathYStart) / (pathYEnd - pathYStart) * 1.8;
      return Math.max(0, Math.min(1, t));
    }

    function render() {
      scrollProg += (targetProg - scrollProg) * 0.12;
      ctx.clearRect(0, 0, W, VH);
      if (segs) {
        ctx.save();
        ctx.translate(0, -window.scrollY);
        drawPath(segs.c1, scrollProg, '#82dca8');
        drawPath(segs.c2, Math.max(0, Math.min(1, (scrollProg - 0.12) / 0.88)), '#5ecff9');
        ctx.restore();
      }
      rafId = requestAnimationFrame(render);
    }

    function onScroll() { targetProg = calcProgress(); }

    setup();
    targetProg = calcProgress();
    render();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { setup(); targetProg = calcProgress(); });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}
