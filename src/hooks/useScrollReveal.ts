import { useEffect } from 'react';

export default function useScrollReveal(): void {
  useEffect(() => {
    function splitWords(el: Element) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) nodes.push(n as Text);

      nodes.forEach(tn => {
        const parts = (tn.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(part => {
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else if (part) {
            const outer = document.createElement('span');
            outer.className = 'word';
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          }
        });
        tn.parentNode?.replaceChild(frag, tn);
      });

      (el as HTMLElement).querySelectorAll('.word-inner').forEach((wi, i) => {
        (wi as HTMLElement).style.transitionDelay = `${i * 0.055}s`;
      });
    }

    document.querySelectorAll('.anim-words').forEach(el => splitWords(el));

    function checkReveal() {
      const wh = window.innerHeight;
      document.querySelectorAll('.anim-words:not(.in-view), [data-reveal]:not(.in-view)').forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < wh * 0.92) el.classList.add('in-view');
      });
    }

    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('resize', checkReveal, { passive: true });
    checkReveal();
    const t = setTimeout(checkReveal, 100);

    return () => {
      window.removeEventListener('scroll', checkReveal);
      window.removeEventListener('resize', checkReveal);
      clearTimeout(t);
    };
  }, []);
}
