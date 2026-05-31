/* ============================================================
   Gaurang Ashava — Portfolio · interactions
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  /* ---------- Reveal on scroll (manual, robust) ---------- */
  const revealEls = [...document.querySelectorAll('[data-reveal]')];
  const meters = [...document.querySelectorAll('.meter__fill')];

  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('in'));
    meters.forEach(m => m.style.width = (m.getAttribute('data-val') || 0) + '%');
  } else {
    const inView = (el, pad) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh - (pad || 0) && r.bottom > 0;
    };
    let revealQueue = revealEls.slice();
    let meterQueue = meters.slice();

    const fillMeter = (m) => { const v = m.getAttribute('data-val') || '0'; requestAnimationFrame(() => { m.style.width = v + '%'; }); };

    const kick = () => {
      revealQueue = revealQueue.filter(el => {
        if (inView(el, el.closest('.hero') ? 0 : 40)) { el.classList.add('in'); return false; }
        return true;
      });
      meterQueue = meterQueue.filter(m => {
        if (inView(m, 60)) { fillMeter(m); return false; }
        return true;
      });
    };

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick, { passive: true });
    window.addEventListener('load', kick);
    kick();
    // safety: if anything is still hidden shortly after load, reveal it
    setTimeout(kick, 200);
    setTimeout(() => { revealQueue.forEach(el => el.classList.add('in')); meterQueue.forEach(fillMeter); }, 2500);
  }

  /* ---------- Hero text reveal ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('.hero h1 .line > span').forEach((s, i) => {
      s.style.transform = 'translateY(105%)';
      s.style.transition = 'transform 1s cubic-bezier(0.22,1,0.36,1)';
      s.style.transitionDelay = (0.15 + i * 0.12) + 's';
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelectorAll('.hero h1 .line > span').forEach(s => s.style.transform = 'none');
    }));
  }

  /* ---------- Active nav link ---------- */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav__links a')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach(a => a.style.color = a.getAttribute('href') === '#' + id ? 'var(--ink)' : '');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => so.observe(s));
  }

  /* ---------- Current year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ============================================================
     ANIMATED NETWORK BACKGROUND  (hero canvas)
     ============================================================ */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes = [], raf;
    const mouse = { x: -9999, y: -9999 };
    let bgOn = true, heroVisible = true;

    let SKY = '56,189,248';
    let VIO = '167,139,250';
    function readAccents() {
      const cs = getComputedStyle(document.documentElement);
      const s = cs.getPropertyValue('--sky-rgb').trim();
      const v = cs.getPropertyValue('--violet-rgb').trim();
      if (s) SKY = s;
      if (v) VIO = v;
    }

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      const count = Math.min(86, Math.max(34, Math.floor((w * h) / 19000)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() * 1.6 + 0.6,
          skyish: Math.random() > 0.5,
          get hue() { return this.skyish ? SKY : VIO; }
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const linkDist = 132;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;

        // gentle mouse repulsion
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 140) {
          const f = (140 - md) / 140 * 0.6;
          n.x += (mdx / (md || 1)) * f;
          n.y += (mdy / (md || 1)) * f;
        }

        if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const o = (1 - d / linkDist) * 0.5;
            ctx.strokeStyle = `rgba(${a.hue},${o})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.hue},0.85)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }

    window.addEventListener('resize', size);
    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });

    function maybeRun() { if (bgOn && heroVisible && !raf) step(); }
    function stopBg() { cancelAnimationFrame(raf); raf = null; ctx.clearRect(0, 0, w, h); }

    size();
    step();

    // pause when hero off-screen
    const hero = document.querySelector('.hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach(e => {
          heroVisible = e.isIntersecting;
          if (heroVisible) maybeRun();
          else stopBg();
        });
      }, { threshold: 0 }).observe(hero);
    }

    // public API for the Tweaks panel
    window.PORTFOLIO = window.PORTFOLIO || {};
    window.PORTFOLIO.refreshAccents = readAccents;
    window.PORTFOLIO.setBg = (on) => { bgOn = !!on; if (bgOn) maybeRun(); else stopBg(); };
  } else {
    window.PORTFOLIO = window.PORTFOLIO || {};
    window.PORTFOLIO.refreshAccents = function () {};
    window.PORTFOLIO.setBg = function () {};
  }
})();
