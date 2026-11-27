/* ---------- a quiet data network behind the Query page ----------
   Drifting nodes that link to their near neighbours, with an occasional packet along
   a link. Colours come from the theme tokens (--lattice-*). It runs at 30 fps only
   while the page is visible, and draws one still frame under reduced motion or
   "Pause motion". Seeded, so every load starts the same. */
// @ts-check
(function () {
  'use strict';
  var found = /** @type {HTMLCanvasElement|null} */ (document.querySelector('[data-net]'));
  if (!found || !found.getContext) return;
  var cv = /** @type {HTMLCanvasElement} */ (found);
  var g = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  var DF = window.DF;
  var W = 0, H = 0, DPR = 1;
  /** @type {Array<{x:number,y:number,vx:number,vy:number}>} */ var pts = [];
  /** @type {Array<{a:number,b:number,t:number}>} */ var packets = [];
  var A = '56,189,248', B = '139,92,246', E = '148,184,230', light = false;
  var s = 7;
  var rnd = function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  var theme = function () {
    var cs = getComputedStyle(document.documentElement);
    /** @param {string} n @param {string} f */
    var v = function (n, f) { var x = cs.getPropertyValue(n).trim(); return /^\d+,\s*\d+,\s*\d+$/.test(x) ? x.replace(/\s/g, '') : f; };
    A = v('--lattice-a', A); B = v('--lattice-b', B); E = v('--lattice-edge', E);
    light = cs.getPropertyValue('--lattice-blend').trim() === 'source-over';
  };
  var size = function () {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    var n = Math.round(Math.min(70, Math.max(28, (W * H) / 26000)));
    s = 7; pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: rnd() * W, y: rnd() * H, vx: (rnd() - 0.5) * 9, vy: (rnd() - 0.5) * 9 });
    packets = [];
  };
  var LINK = 150;
  var draw = function () {
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.clearRect(0, 0, W, H);
    var k = light ? 0.55 : 1;
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d > LINK) continue;
        g.strokeStyle = 'rgba(' + E + ',' + ((1 - d / LINK) * 0.22 * k).toFixed(3) + ')';
        g.beginPath(); g.moveTo(pts[i].x, pts[i].y); g.lineTo(pts[j].x, pts[j].y); g.stroke();
      }
    }
    for (var m = 0; m < pts.length; m++) {
      g.fillStyle = 'rgba(' + (m % 5 === 0 ? B : A) + ',' + (0.55 * k) + ')';
      g.beginPath(); g.arc(pts[m].x, pts[m].y, m % 5 === 0 ? 2.2 : 1.5, 0, Math.PI * 2); g.fill();
    }
    packets.forEach(function (p) {
      var a = pts[p.a], b = pts[p.b];
      var x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
      g.fillStyle = 'rgba(' + A + ',' + (0.9 * k) + ')';
      g.beginPath(); g.arc(x, y, 2.4, 0, Math.PI * 2); g.fill();
    });
  };
  var raf = 0, last = 0, running = false;
  /** @param {number} now */
  var step = function (now) {
    raf = requestAnimationFrame(step);
    if (now - last < 33) return;
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    pts.forEach(function (p) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0 || p.x > W) p.vx = -p.vx;
      if (p.y < 0 || p.y > H) p.vy = -p.vy;
    });
    if (packets.length < 4 && rnd() < 0.04) {
      var a = Math.floor(rnd() * pts.length);
      for (var b = 0; b < pts.length; b++) {
        var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
        if (b !== a && dx * dx + dy * dy < LINK * LINK) { packets.push({ a: a, b: b, t: 0 }); break; }
      }
    }
    packets = packets.filter(function (p) { p.t += dt * 0.7; return p.t < 1; });
    draw();
  };
  var sync = function () {
    if (DF.motionOn() && !document.hidden) { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(step); } }
    else { running = false; cancelAnimationFrame(raf); draw(); }
  };
  theme(); size(); draw();
  cv.classList.add('is-ready');
  window.addEventListener('resize', function () { size(); draw(); });
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('df:theme', function () { theme(); draw(); });
  DF.onMotion(sync);
  sync();
})();
