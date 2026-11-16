// 스크롤 등장 모션과 숫자 올라가기. 움직임 줄이기 설정이면 아무것도 하지 않는다.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  const targets = document.querySelectorAll(
    "section > h2, section > p, .layer, .auditor, .flow li, .stat, .stack > div, .card, .group");
  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });
  const countUp = (el) => {
    const m = el.textContent.match(/^([\d,]+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1].replace(/,/g, ""), 10);
    const rest = m[2];
    const start = performance.now();
    const dur = 1100;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const v = Math.round(target * (1 - Math.pow(1 - t, 3)));
      el.textContent = v.toLocaleString("en-US") + rest;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const b = e.target.matches(".stat") && e.target.querySelector("b");
      if (b) countUp(b);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  targets.forEach((el) => io.observe(el));
})();
