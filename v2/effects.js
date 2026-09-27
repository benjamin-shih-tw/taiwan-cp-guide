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
    if (!target || target.closest(".welcome-zipper")) return;
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

  const welcome = {
    stage: null,
    left: null,
    right: null,
    pull: null,
    teeth: null,
    hint: null,
    progress: 0,
    dragging: false,
    dragStartY: 0,
    dragStartProgress: 0,
    raf: 0
  };

  function updateZipper(progress) {
    if (!welcome.stage) return;
    welcome.progress = Math.max(0, Math.min(1, progress));
    const rect = welcome.stage.getBoundingClientRect();
    const y = Math.max(28, welcome.progress * (rect.height - 56) + 28);
    const gap = Math.min(rect.width * 0.36, 360) * welcome.progress;

    welcome.left.style.clipPath =
      "polygon(0 0, calc(50% - " + gap.toFixed(1) + "px) 0, 50% " + y.toFixed(1) + "px, 50% 100%, 0 100%)";
    welcome.right.style.clipPath =
      "polygon(calc(50% + " + gap.toFixed(1) + "px) 0, 100% 0, 100% 100%, 50% 100%, 50% " + y.toFixed(1) + "px)";
    welcome.pull.style.transform = "translate(-50%, " + (y - 26).toFixed(1) + "px)";
    welcome.teeth.style.top = y.toFixed(1) + "px";
    welcome.hint.style.opacity = String(Math.max(0, 1 - welcome.progress * 2.2));
    welcome.stage.style.setProperty("--zip-progress", welcome.progress.toFixed(3));
  }

  function animateZipper(to) {
    cancelAnimationFrame(welcome.raf);
    if (reduceMotion) {
      updateZipper(to);
      if (to >= 1) finishZipper();
      return;
    }
    const from = welcome.progress;
    const started = performance.now();
    const duration = 720 * Math.max(0.35, Math.abs(to - from));
    const tick = now => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      updateZipper(from + (to - from) * eased);
      if (t < 1) welcome.raf = requestAnimationFrame(tick);
      else if (to >= 1) finishZipper();
    };
    welcome.raf = requestAnimationFrame(tick);
  }

  function finishZipper() {
    welcome.stage.classList.add("is-revealed");
    welcome.pull.setAttribute("aria-expanded", "true");
  }

  function openWelcome() {
    if (!welcome.stage) return;
    cancelAnimationFrame(welcome.raf);
    welcome.stage.hidden = false;
    welcome.stage.setAttribute("aria-hidden", "false");
    welcome.stage.classList.remove("is-leaving", "is-revealed");
    document.body.classList.add("welcome-open");
    updateZipper(0);
    if (reduceMotion) {
      updateZipper(1);
      finishZipper();
    }
  }

  function closeWelcome() {
    if (!welcome.stage || welcome.stage.hidden) return;
    welcome.stage.classList.add("is-leaving");
    document.body.classList.remove("welcome-open");
    setTimeout(() => {
      welcome.stage.hidden = true;
      welcome.stage.setAttribute("aria-hidden", "true");
      welcome.stage.classList.remove("is-leaving");
    }, reduceMotion ? 0 : 420);
  }

  function setupWelcome() {
    welcome.stage = document.getElementById("welcome-stage");
    if (!welcome.stage) return;
    welcome.left = welcome.stage.querySelector(".zipper-panel-left");
    welcome.right = welcome.stage.querySelector(".zipper-panel-right");
    welcome.pull = document.getElementById("zipper-pull");
    welcome.teeth = welcome.stage.querySelector(".zipper-teeth");
    welcome.hint = welcome.stage.querySelector(".zipper-hint");
    const enter = document.getElementById("welcome-enter");

    welcome.pull.addEventListener("pointerdown", event => {
      welcome.dragging = true;
      welcome.dragStartY = event.clientY;
      welcome.dragStartProgress = welcome.progress;
      welcome.pull.setPointerCapture(event.pointerId);
      welcome.stage.classList.add("is-dragging");
    });

    welcome.pull.addEventListener("pointermove", event => {
      if (!welcome.dragging) return;
      const h = Math.max(1, welcome.stage.clientHeight - 56);
      const delta = (event.clientY - welcome.dragStartY) / h;
      updateZipper(welcome.dragStartProgress + delta);
    });

    const finishDrag = event => {
      if (!welcome.dragging) return;
      welcome.dragging = false;
      welcome.stage.classList.remove("is-dragging");
      try { welcome.pull.releasePointerCapture(event.pointerId); } catch (_) {}
      animateZipper(welcome.progress > 0.42 ? 1 : 0);
    };
    welcome.pull.addEventListener("pointerup", finishDrag);
    welcome.pull.addEventListener("pointercancel", finishDrag);

    welcome.pull.addEventListener("click", event => {
      if (welcome.progress < 0.08) animateZipper(1);
      burst(welcome.pull, event);
    });

    enter.addEventListener("click", () => {
      closeWelcome();
      if (location.hash !== "#/home") location.hash = "#/home";
    });

    window.addEventListener("resize", () => {
      if (!welcome.stage.hidden && !welcome.stage.classList.contains("is-revealed")) updateZipper(welcome.progress);
    });
  }

  document.addEventListener("DOMContentLoaded", setupWelcome);

  window.CourseFX = {
    burst,
    themeReveal,
    openWelcome,
    closeWelcome
  };
})();
