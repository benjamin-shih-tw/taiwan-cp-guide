(() => {
  "use strict";

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function targetPoint(target, event) {
    const rect = target.getBoundingClientRect();
    const x = event && Number.isFinite(event.clientX) ? event.clientX : rect.left + rect.width / 2;
    const y = event && Number.isFinite(event.clientY) ? event.clientY : rect.top + rect.height / 2;
    return { x, y };
  }

  function burst(target, event) {
    if (reduceMotion || !target) return;
    const { x, y } = targetPoint(target, event);
    const color = getComputedStyle(target).color || getComputedStyle(document.documentElement).color;
    const host = document.createElement("span");
    host.className = "fx-particle-host";
    host.style.left = x + "px";
    host.style.top = y + "px";
    host.style.color = color;

    const count = 22;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("i");
      particle.className = "fx-particle fx-particle-" + (i % 3);
      const angle = (Math.PI * 2 * i / count) + Math.sin(i * 4.91) * 0.16;
      const distance = 38 + ((i * 37) % 58);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 8;
      const rotate = ((i * 47) % 180) - 90;
      const delay = (i % 5) * 8;
      particle.style.setProperty("--fx-x", dx.toFixed(1) + "px");
      particle.style.setProperty("--fx-y", dy.toFixed(1) + "px");
      particle.style.setProperty("--fx-r", rotate + "deg");
      particle.style.setProperty("--fx-delay", delay + "ms");
      host.appendChild(particle);
    }
    document.body.appendChild(host);
    setTimeout(() => host.remove(), 1250);
  }

  const burstSelector = [
    "button",
    ".btn",
    ".chip",
    ".domain-card",
    ".course-card",
    ".problem-domain-card",
    ".problem-course-row",
    ".resource-card"
  ].join(",");

  document.addEventListener("pointerdown", event => {
    const target = event.target.closest && event.target.closest(burstSelector);
    if (!target) return;
    burst(target, event);
  }, { passive: true });

  function noisyPolygon(cx, cy, radius, noise, phase) {
    const points = [];
    const count = 64;
    for (let i = 0; i < count; i++) {
      const a = Math.PI * 2 * i / count;
      const wave =
        Math.sin(i * 2.17 + phase) * 0.55 +
        Math.sin(i * 5.31 + phase * 1.7) * 0.28 +
        Math.sin(i * 9.73 - phase * 0.6) * 0.17;
      const rr = Math.max(0, radius * (1 + wave * noise));
      points.push((cx + Math.cos(a) * rr).toFixed(1) + "px " + (cy + Math.sin(a) * rr).toFixed(1) + "px");
    }
    return "polygon(" + points.join(",") + ")";
  }

  async function themeReveal(target, applyTheme, event) {
    if (typeof applyTheme !== "function") return;
    if (reduceMotion || !document.startViewTransition) {
      applyTheme();
      return;
    }

    const { x, y } = targetPoint(target, event);
    const radius = Math.max(
      Math.hypot(x, y),
      Math.hypot(innerWidth - x, y),
      Math.hypot(x, innerHeight - y),
      Math.hypot(innerWidth - x, innerHeight - y)
    ) * 1.12;

    const transition = document.startViewTransition(() => applyTheme());
    try {
      await transition.ready;
      document.documentElement.animate(
        {
          clipPath: [
            noisyPolygon(x, y, 2, 0.18, 0),
            noisyPolygon(x, y, radius * 0.32, 0.15, 1.2),
            noisyPolygon(x, y, radius * 0.68, 0.09, 2.6),
            noisyPolygon(x, y, radius, 0, 4.1)
          ]
        },
        {
          duration: 1050,
          easing: "cubic-bezier(.2,.72,.18,1)",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    } catch (_) {}
  }

  window.CourseFX = {
    burst,
    themeReveal
  };
})();
