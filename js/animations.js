/* ============================================================
   Scroll & entrance animations powered by Motion
   (Framer Motion's vanilla-JS engine, loaded from CDN —
   no build step, works on GitHub Pages).
   If the CDN is unreachable, the site still works untouched.
   ============================================================ */
import {
  animate,
  inView,
  stagger,
} from "https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced) {
  // --- Hero entrance ---
  const heroBits = document.querySelectorAll(
    ".hero .badge, .hero h1, .hero p.lead, .hero .btn, .cert-hero .level-tag, .cert-hero h1, .cert-hero > .container > p"
  );
  if (heroBits.length) {
    heroBits.forEach((el) => (el.style.opacity = "0"));
    animate(
      heroBits,
      { opacity: [0, 1], y: [24, 0] },
      { duration: 0.7, delay: stagger(0.12), easing: [0.22, 1, 0.36, 1] }
    );
  }

  // --- Stat cards pop in ---
  const stats = document.querySelectorAll(".stat-card");
  if (stats.length) {
    stats.forEach((el) => (el.style.opacity = "0"));
    inView(".stats-grid", () => {
      animate(
        stats,
        { opacity: [0, 1], scale: [0.92, 1] },
        { duration: 0.5, delay: stagger(0.07), easing: [0.22, 1, 0.36, 1] }
      );
    }, { amount: 0.3 });
  }

  // --- Generic scroll reveals for cards & sections ---
  const revealSelectors = [
    ".roadmap-card",
    ".lab-card",
    ".tool-card",
    ".sell-card",
    ".domain",
    ".callout",
    "table.info",
    ".pager a",
  ];
  document.querySelectorAll(revealSelectors.join(",")).forEach((el) => {
    el.style.opacity = "0";
    inView(
      el,
      () => {
        animate(
          el,
          { opacity: [0, 1], y: [28, 0] },
          { duration: 0.55, easing: [0.22, 1, 0.36, 1] }
        );
      },
      { amount: 0.15 }
    );
  });

  // --- Section headings slide in ---
  document.querySelectorAll("section.block h2").forEach((el) => {
    el.style.opacity = "0";
    inView(
      el,
      () => {
        animate(
          el,
          { opacity: [0, 1], x: [-24, 0] },
          { duration: 0.5, easing: [0.22, 1, 0.36, 1] }
        );
      },
      { amount: 0.5 }
    );
  });

  // --- Number count-up on stat cards ---
  document.querySelectorAll(".stat-card .num").forEach((el) => {
    const match = el.textContent.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (isNaN(target)) return;
    const hasComma = numStr.includes(",");
    inView(el.closest(".stat-card") || el, () => {
      animate(0, target, {
        duration: 1.1,
        easing: "ease-out",
        onUpdate(v) {
          let shown = Math.round(v).toString();
          if (hasComma) shown = Number(shown).toLocaleString("en-US");
          el.textContent = prefix + shown + suffix;
        },
      });
    }, { amount: 0.6 });
  });
}
