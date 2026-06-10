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

  /* ---------- Dot-rail active sync ---------- */
  const dots = [...document.querySelectorAll('.dotnav a')];
  if (dots.length) {
    const targets = dots.map(d => document.querySelector(d.getAttribute('href')));
    const dotSync = () => {
      const pos = window.scrollY + window.innerHeight * 0.4;
      let active = 0;
      targets.forEach((sec, i) => { if (sec && sec.offsetTop <= pos) active = i; });
      dots.forEach((d, i) => d.classList.toggle('active', i === active));
    };
    window.addEventListener('scroll', dotSync, { passive: true });
    window.addEventListener('resize', dotSync, { passive: true });
    dotSync();
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
    // target mouse + smoothed (trailing) mouse
    const mouse = { x: -9999, y: -9999, has: false };
    const eye = { x: 0, y: 0 };      // smoothed cursor
    const par = { x: 0, y: 0 };      // parallax offset
    let bgOn = true, heroVisible = true;
    let t = 0;

    let SKY = '56,189,248';
    let VIO = '167,139,250';
    let TEAL = '45,212,191';
    function readAccents() {
      const cs = getComputedStyle(document.documentElement);
      const s = cs.getPropertyValue('--sky-rgb').trim();
      const v = cs.getPropertyValue('--violet-rgb').trim();
      if (s) SKY = s;
      if (v) VIO = v;
    }

    let blobs = [], comets = [];

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      const count = Math.min(96, Math.max(40, Math.floor((w * h) / 17000)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.34,
          r: Math.random() * 1.7 + 0.6,
          depth: Math.random() * 0.8 + 0.4,
          ph: Math.random() * Math.PI * 2,
          skyish: Math.random() > 0.5,
          get hue() { return this.skyish ? SKY : VIO; }
        });
      }
      // drifting aurora clouds — the living color in the background
      const cols = [SKY, VIO, TEAL, VIO, SKY];
      blobs = cols.map((c, i) => ({
        cx: Math.random() * w, cy: Math.random() * h,
        // lissajous drift
        ax: (0.18 + Math.random() * 0.22) * w,
        ay: (0.18 + Math.random() * 0.22) * h,
        sx: 0.06 + Math.random() * 0.08,
        sy: 0.05 + Math.random() * 0.08,
        phx: Math.random() * 6.28, phy: Math.random() * 6.28,
        rad: Math.min(w, h) * (0.34 + Math.random() * 0.22),
        getCol: () => (i % 3 === 0 ? SKY : i % 3 === 1 ? VIO : TEAL)
      }));
      comets = [];
    }

    function spawnComet() {
      const edge = Math.floor(Math.random() * 4);
      let x, y, ang;
      if (edge === 0) { x = -30; y = Math.random() * h; ang = (Math.random() - 0.5) * 0.7; }
      else if (edge === 1) { x = w + 30; y = Math.random() * h; ang = Math.PI + (Math.random() - 0.5) * 0.7; }
      else if (edge === 2) { x = Math.random() * w; y = -30; ang = Math.PI / 2 + (Math.random() - 0.5) * 0.7; }
      else { x = Math.random() * w; y = h + 30; ang = -Math.PI / 2 + (Math.random() - 0.5) * 0.7; }
      const sp = 4.5 + Math.random() * 4;
      comets.push({
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        hue: Math.random() > 0.5 ? SKY : VIO, life: 0,
        max: 120 + Math.random() * 120, len: 80 + Math.random() * 80
      });
    }

    function step() {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const linkDist = 146;

      // ease the smoothed cursor toward the real mouse
      const tx = mouse.has ? mouse.x : w / 2;
      const ty = mouse.has ? mouse.y : h / 2;
      eye.x += (tx - eye.x) * 0.08;
      eye.y += (ty - eye.y) * 0.08;
      const pgx = mouse.has ? (mouse.x / w - 0.5) : 0;
      const pgy = mouse.has ? (mouse.y / h - 0.5) : 0;
      par.x += (pgx * -40 - par.x) * 0.06;
      par.y += (pgy * -40 - par.y) * 0.06;

      // ---- drifting aurora clouds (additive) ----
      ctx.globalCompositeOperation = 'lighter';
      for (const b of blobs) {
        const cx = b.cx + Math.sin(t * b.sx + b.phx) * b.ax + par.x * 1.4;
        const cy = b.cy + Math.cos(t * b.sy + b.phy) * b.ay + par.y * 1.4;
        const col = b.getCol();
        const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.rad);
        gr.addColorStop(0, `rgba(${col},0.16)`);
        gr.addColorStop(0.5, `rgba(${col},0.05)`);
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = 'source-over';

      // ---- aurora glow that trails the cursor ----
      if (mouse.has || eye.x) {
        const gr = ctx.createRadialGradient(eye.x, eye.y, 0, eye.x, eye.y, 380);
        gr.addColorStop(0, `rgba(${SKY},0.20)`);
        gr.addColorStop(0.45, `rgba(${VIO},0.09)`);
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, w, h);
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        const mdx = n.x - eye.x, mdy = n.y - eye.y;
        const md = Math.hypot(mdx, mdy);
        if (mouse.has && md < 230) {
          if (md < 95) {
            const f = (95 - md) / 95 * 1.0;
            n.x += (mdx / (md || 1)) * f;
            n.y += (mdy / (md || 1)) * f;
          } else {
            n.x += (-mdy / (md || 1)) * 0.3;
            n.y += (mdx / (md || 1)) * 0.3;
          }
        }
        if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
      }

      const px = (n) => n.x + par.x * n.depth;
      const py = (n) => n.y + par.y * n.depth;

      // glowing links (additive)
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const ax = px(a), ay = py(a), bx = px(b), by = py(b);
          const dx = ax - bx, dy = ay - by;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const o = (1 - d / linkDist) * 0.55;
            ctx.strokeStyle = `rgba(${a.hue},${o})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
          }
        }
      }

      // beams from cursor to nearby nodes
      if (mouse.has) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const ax = px(n), ay = py(n);
          const dx = ax - eye.x, dy = ay - eye.y;
          const d = Math.hypot(dx, dy);
          if (d < 210) {
            const o = (1 - d / 210) * 0.9;
            ctx.strokeStyle = `rgba(${n.hue},${o})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(eye.x, eye.y); ctx.lineTo(ax, ay); ctx.stroke();
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      // nodes (twinkle)
      for (const n of nodes) {
        const ax = px(n), ay = py(n);
        const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + n.ph);
        ctx.fillStyle = `rgba(${n.hue},${0.85 * tw})`;
        ctx.beginPath();
        ctx.arc(ax, ay, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- streaking data comets ----
      if (comets.length < 5 && Math.random() < 0.025) spawnComet();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx; c.y += c.vy; c.life++;
        const fade = c.life < 18 ? c.life / 18 : c.life > c.max - 24 ? Math.max(0, (c.max - c.life) / 24) : 1;
        const tlx = c.x - c.vx / Math.hypot(c.vx, c.vy) * c.len;
        const tly = c.y - c.vy / Math.hypot(c.vx, c.vy) * c.len;
        const g2 = ctx.createLinearGradient(tlx, tly, c.x, c.y);
        g2.addColorStop(0, `rgba(${c.hue},0)`);
        g2.addColorStop(1, `rgba(${c.hue},${0.85 * fade})`);
        ctx.strokeStyle = g2; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(tlx, tly); ctx.lineTo(c.x, c.y); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.9 * fade})`;
        ctx.beginPath(); ctx.arc(c.x, c.y, 1.8, 0, Math.PI * 2); ctx.fill();
        if (c.life > c.max || c.x < -120 || c.x > w + 120 || c.y < -120 || c.y > h + 120) comets.splice(i, 1);
      }
      ctx.globalCompositeOperation = 'source-over';

      // cursor core + ring
      if (mouse.has) {
        ctx.fillStyle = `rgba(${SKY},0.95)`;
        ctx.beginPath(); ctx.arc(eye.x, eye.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(${SKY},${0.35 + 0.25 * Math.sin(t * 3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(eye.x, eye.y, 12 + 3 * Math.sin(t * 3), 0, Math.PI * 2); ctx.stroke();
      }

      raf = requestAnimationFrame(step);
    }

    window.addEventListener('resize', size);
    const moveHandler = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      mouse.has = true;
    };
    // listen on the hero (covers the text/content sitting above the canvas)
    const heroEl = document.querySelector('.hero') || window;
    heroEl.addEventListener('pointermove', moveHandler);
    heroEl.addEventListener('pointerleave', () => { mouse.has = false; });

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


/* ============================================================
   LIVE UX layer — clock · typewriter · cursor · magnetic · tilt · decode
   ============================================================ */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;

  /* ---- live IST clock ---- */
  const clock = document.getElementById('ist-clock');
  if (clock) {
    const tick = () => {
      clock.textContent = 'IST ' + new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- typewriter role cycler ---- */
  const typer = document.getElementById('typer');
  if (typer && !reduce) {
    const words = ['Data Scientist', 'Data Engineer', 'AI / ML Specialist', 'Data Storyteller'];
    let wi = 0, txt = words[0], deleting = false;
    function type() {
      const full = words[wi];
      txt = deleting ? full.slice(0, txt.length - 1) : full.slice(0, txt.length + 1);
      typer.textContent = txt;
      let delay = deleting ? 42 : 88;
      if (!deleting && txt === full) { delay = 2400; deleting = true; }
      else if (deleting && txt === '') { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
      setTimeout(type, delay);
    }
    setTimeout(type, 2600);
  }

  /* ---- glowing cursor ring ---- */
  if (fine && !reduce) {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);
    let x = -100, y = -100, rx = -100, ry = -100, s = 1, ts = 1;
    window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      ts = e.target.closest('a, button, .chip, .dotnav a, image-slot') ? 1.9 : 1;
    });
    document.addEventListener('pointerdown', () => { ts = 0.7; });
    document.addEventListener('pointerup', () => { ts = 1; });
    (function loop() {
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2; s += (ts - s) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%) scale(' + s + ')';
      requestAnimationFrame(loop);
    })();
  }

  /* ---- magnetic buttons ---- */
  if (fine && !reduce) {
    document.querySelectorAll('.btn, .social, .nav__cta').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (dx * 0.16) + 'px,' + (dy * 0.22) + 'px)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---- 3D tilt + cursor spotlight on cards ---- */
  if (fine && !reduce) {
    document.querySelectorAll('.skillcard, .cert, .about__photo').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 6).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 8).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  /* ---- matrix decode on section kickers ---- */
  if (!reduce) {
    const chars = '!<>-_\\/[]{}=+*^?#01';
    const done = new Set();
    const decode = (el) => {
      const orig = el.textContent;
      let frame = 0;
      (function tick() {
        frame++;
        const reveal = Math.floor(frame / 2);
        el.textContent = orig.split('').map((c, i) =>
          i < reveal ? c : (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])
        ).join('');
        if (reveal < orig.length) requestAnimationFrame(tick);
        else el.textContent = orig;
      })();
    };
    const scan = () => {
      document.querySelectorAll('.kicker').forEach((k) => {
        if (done.has(k)) return;
        const r = k.getBoundingClientRect();
        if (r.top < window.innerHeight - 40 && r.bottom > 0) { done.add(k); decode(k); }
      });
    };
    window.addEventListener('scroll', scan, { passive: true });
    scan();
  }
})();


/* ---- hero background video ---- */
(function () {
  'use strict';
  const v = document.querySelector('.bg-video');
  if (!v) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.remove(); return; }
  v.addEventListener('canplay', () => v.classList.add('ready'));
  v.addEventListener('error', () => v.remove(), true);
  const src = v.querySelector('source');
  if (src) src.addEventListener('error', () => v.remove());
  // pause when its section is out of view
  const host = v.closest('section');
  if (host && 'IntersectionObserver' in window) {
    new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); } });
    }, { threshold: 0 }).observe(host);
  }
})();
