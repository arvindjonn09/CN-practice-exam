/**
 * app.js — Core app utilities: nav rendering, page init, shared helpers
 * Every page includes this first.
 */

/* ── Navigation ── */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard.html' },
  {
    id: 'path', label: 'My Path', href: '#',
    dropdown: [
      { icon: '🌐', label: 'CCST Networking',     href: '/paths/ccst-networking.html' },
      { icon: '🛡️', label: 'CCST Cybersecurity',  href: '/paths/ccst-cybersecurity.html' },
      { icon: '🔀', label: 'CCNA',                href: '/paths/ccna.html' },
      { icon: '⚡', label: 'CCNP',                href: '/paths/ccnp.html' },
      { icon: '🏆', label: 'CCIE',                href: '/paths/ccie.html' },
      { icon: '🏛️', label: 'Network Architect',   href: '/paths/architecture.html' },
    ]
  },
  { id: 'labs',   label: 'Labs',   href: '/labs/index.html' },
  { id: 'review', label: 'Review', href: '/review/index.html' },
];

function renderNav(activePage = '') {
  const el = document.getElementById('site-nav');
  if (!el) return;

  const links = NAV_ITEMS.map(item => {
    const isActive = item.id === activePage;
    if (item.dropdown) {
      const items = item.dropdown.map(d =>
        `<a class="nav-dropdown-item" href="${d.href}">
          <span class="di-icon">${d.icon}</span>${d.label}
        </a>`
      ).join('');
      return `<div class="nav-dropdown">
        <button class="nav-link${isActive ? ' active' : ''}">${item.label} ▾</button>
        <div class="nav-dropdown-menu">${items}</div>
      </div>`;
    }
    return `<a class="nav-link${isActive ? ' active' : ''}" href="${item.href}">${item.label}</a>`;
  }).join('');

  el.innerHTML = `
    <nav class="site-header">
      <div class="nav-inner">
        <a class="nav-brand" href="/dashboard.html">CN<span>JOURNEY</span></a>
        ${links}
        <div class="nav-sep"></div>
        <div class="nav-avatar" title="Profile">AJ</div>
      </div>
    </nav>`;
}

/* ── Breadcrumb ── */
function renderBreadcrumb(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const parts = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast) return `<span class="breadcrumb-current">${item.label}</span>`;
    return `<a href="${item.href}">${item.label}</a><span class="breadcrumb-sep">›</span>`;
  }).join('');
  el.innerHTML = parts;
}

/* ── Copy to clipboard ── */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const el = target ? document.getElementById(target) : btn.closest('.commands-block')?.querySelector('.commands-body');
      if (!el) return;
      const text = el.innerText || el.textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
      });
    });
  });
}

/* ── Module accordion ── */
function initModuleAccordion() {
  document.querySelectorAll('.module-head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.closest('.module-item');
      if (item.classList.contains('locked')) return;
      item.classList.toggle('open');
    });
  });
  // Auto-open the first active module
  const active = document.querySelector('.module-item.active');
  if (active) active.classList.add('open');
}

/* ── Table of contents scroll spy ── */
function initTocSpy() {
  const tocItems = document.querySelectorAll('.toc-item');
  if (!tocItems.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocItems.forEach(item => item.classList.remove('active'));
        const active = document.querySelector(`.toc-item a[href="#${id}"]`)?.parentElement;
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0% -60% 0%' });
  document.querySelectorAll('.topic-section[id]').forEach(s => observer.observe(s));
}

/* ── Animate numbers on scroll ── */
function animateNumbers() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 800;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (Number.isInteger(target) ? Math.round(target * ease) : (target * ease).toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  });
  nums.forEach(n => observer.observe(n));
}

/* ── Entrance animations ── */
function initEntranceAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const style = document.createElement('style');
  style.textContent = `
    .anim-ready { opacity: 0; transform: translateY(16px); transition: opacity 0.4s ease, transform 0.4s ease; }
    .anim-ready.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);
  const els = document.querySelectorAll('.card, .stat-card, .subject-card, .module-item, .focus-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 40);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => { el.classList.add('anim-ready'); observer.observe(el); });
}

/* ── Init all on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initModuleAccordion();
  initTocSpy();
  animateNumbers();
  initEntranceAnimations();
});
