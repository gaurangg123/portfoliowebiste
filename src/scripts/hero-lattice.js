/* ---------- hero: the 3D data lattice ----------
   A Fibonacci-sphere shell of nodes around a three-layer neural core, joined by
   edges that data pulses travel along, with drifting particles and a perspective
   floor grid. Drawn on a 2D canvas with a small projection: no 3D library.

   Budget: it animates only while the hero is on screen and the tab is visible;
   low-power devices and small screens get fewer nodes and 30 fps; reduced motion
   or "Pause motion" leaves one still frame. Seeded, so every load looks the same. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var canvas = /** @type {HTMLCanvasElement|null} */ (document.querySelector('[data-lattice]'));
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  var c2 = /** @type {CanvasRenderingContext2D} */ (ctx);
  var cv = /** @type {HTMLCanvasElement} */ (canvas);
  var host = /** @type {HTMLElement} */ (cv.parentElement);

  var nav = /** @type {any} */ (navigator);
  var low = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4 || !!(nav.connection && nav.connection.saveData);

  /** @param {number} s */
  var seeded = function (s) {
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /** @typedef {{x:number,y:number,z:number,core:boolean,px:number,py:number,pz:number,ps:number}} Node */
  /** @type {Node[]} */ var nodes = [];
  /** @type {Array<[number, number, boolean]>} */ var edges = [];
  /** @type {number[][]} */ var adj = [];
  /** @type {Array<{a:number,b:number,t:number,v:number,c:number}>} */ var pulses = [];
  /** @type {Array<{x:number,y:number,z:number,vx:number,vy:number,vz:number}>} */ var dust = [];
  /** @type {Array<[number, number, number, number]>} */ var grid = [];

  var W = 0, H = 0, DPR = 1, small = false, built = '';
  var CX = 0, CY = 0, S = 1, CAM = 4.4;
  var yaw = 0.6, pitch = 0.34, tYaw = 0, tPitch = 0, oYaw = 0, oPitch = 0;
  var COLORS = [[56, 189, 248], [139, 92, 246], [52, 211, 153]];
  /** @type {HTMLCanvasElement[]} */ var sprites = [];

  // soft glow dots, one per accent colour, drawn once
  COLORS.forEach(function (c) {
    var s = document.createElement('canvas'); s.width = s.height = 64;
    var g = /** @type {CanvasRenderingContext2D} */ (s.getContext('2d'));
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(' + c + ',1)'); grad.addColorStop(0.25, 'rgba(' + c + ',0.55)'); grad.addColorStop(1, 'rgba(' + c + ',0)');
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    sprites.push(s);
  });

  /* ---------- geometry ---------- */
  var build = function () {
    var key = small || low ? 'lite' : 'full';
    if (built === key) return;
    built = key;
    var R = seeded(20251027);
    var N = key === 'lite' ? 70 : 128, ring = key === 'lite' ? 6 : 9;
    nodes = []; edges = []; adj = []; pulses = []; dust = []; grid = [];
    /** @param {number} x @param {number} y @param {number} z @param {boolean} core */
    var add = function (x, y, z, core) { nodes.push({ x: x, y: y, z: z, core: core, px: 0, py: 0, pz: 0, ps: 0 }); adj.push([]); };
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i, j = 1 + (R() - 0.5) * 0.09;
      add(Math.cos(th) * r * j, y * j, Math.sin(th) * r * j, false);
    }
    [-0.42, 0, 0.42].forEach(function (yy, k) {
      for (var n = 0; n < ring; n++) {
        var a = (n / ring) * Math.PI * 2 + k * 0.4, rr = 0.5 - Math.abs(yy) * 0.3;
        add(Math.cos(a) * rr, yy, Math.sin(a) * rr, true);
      }
    });
    /** @type {Record<string, boolean>} */ var seen = {};
    /** @param {number} a @param {number} b @param {boolean} core */
    var link = function (a, b, core) {
      var k = a < b ? a + '-' + b : b + '-' + a;
      if (a === b || seen[k]) return;
      seen[k] = true; edges.push([a, b, core]); adj[a].push(b); adj[b].push(a);
    };
    /** @param {number} a @param {number} b */
    var d2 = function (a, b) { var p = nodes[a], q = nodes[b]; return (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y) + (p.z - q.z) * (p.z - q.z); };
    /** @param {number} a @param {number[]} pool @param {number} k */
    var nearest = function (a, pool, k) { return pool.filter(function (b) { return b !== a; }).sort(function (p, q) { return d2(a, p) - d2(a, q); }).slice(0, k); };
    var shell = [], core = [];
    for (var s = 0; s < nodes.length; s++) (nodes[s].core ? core : shell).push(s);
    shell.forEach(function (a) { nearest(a, shell, 3).forEach(function (b) { link(a, b, false); }); });
    core.forEach(function (a) {
      nearest(a, core, 3).forEach(function (b) { link(a, b, true); });
      nearest(a, shell, 1).forEach(function (b) { link(a, b, true); });
    });
    var P = key === 'lite' ? 10 : 22;
    for (var p = 0; p < P; p++) {
      var e = edges[Math.floor(R() * edges.length)];
      pulses.push({ a: e[0], b: e[1], t: R(), v: 0.35 + R() * 0.45, c: p % 5 === 0 ? 2 : p % 2 });
    }
    var D = key === 'lite' ? 36 : 84;
    for (var q = 0; q < D; q++) {
      var u = R() * 2 - 1, ph = R() * Math.PI * 2, rad = 1.3 + R() * 1.1, rs = Math.sqrt(1 - u * u);
      dust.push({ x: Math.cos(ph) * rs * rad, y: u * rad, z: Math.sin(ph) * rs * rad, vx: (R() - 0.5) * 0.02, vy: (R() - 0.5) * 0.02, vz: (R() - 0.5) * 0.02 });
    }
    for (var g = -2.4; g <= 2.401; g += 0.4) { grid.push([g, -2.4, g, 2.4]); grid.push([-2.4, g, 2.4, g]); }
  };

  /* ---------- projection ---------- */
  var cy = 0, sy = 0, cp = 0, sp = 0;
  /** @param {number} x @param {number} y @param {number} z @param {number[]} out */
  var project = function (x, y, z, out) {
    var x1 = x * cy - z * sy, z1 = x * sy + z * cy;
    var y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    var d = CAM / (CAM + z2);
    out[0] = CX + x1 * d * S; out[1] = CY + y2 * d * S; out[2] = z2; out[3] = d;
  };

  var layout = function () {
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return false;
    DPR = Math.min(window.devicePixelRatio || 1, low ? 1.25 : 2);
    W = w; H = h; small = w < 900;
    cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
    if (small) { CX = w * 0.7; CY = Math.min(h * 0.27, 260); S = Math.min(w * 0.4, h * 0.21); }
    else if (w < 1200) { CX = w * 0.78; CY = h * 0.52; S = Math.min(w * 0.215, h * 0.31); }
    else { CX = w * 0.71; CY = h * 0.5; S = Math.min(w * 0.25, h * 0.34); }
    build();
    return true;
  };

  /* ---------- drawing ---------- */
  var tmp = [0, 0, 0, 0];
  /** @param {number} time seconds */
  var draw = function (time) {
    var g = c2;
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.clearRect(0, 0, W, H);
    var cyy = Math.cos(yaw + oYaw), syy = Math.sin(yaw + oYaw), pp = pitch + oPitch;
    cy = cyy; sy = syy; cp = Math.cos(pp); sp = Math.sin(pp);
    var scrollLift = Math.min(window.pageYOffset, H) * 0.18;
    var baseCY = CY; CY = baseCY - scrollLift;

    // floor grid
    g.lineWidth = 1;
    for (var i = 0; i < grid.length; i++) {
      var l = grid[i];
      project(l[0], 1.18, l[1], tmp); var ax = tmp[0], ay = tmp[1], az = tmp[2];
      project(l[2], 1.18, l[3], tmp);
      var depth = (az + tmp[2]) / 2;
      var a = Math.max(0, 0.13 - Math.abs(depth) * 0.03) * (1 - Math.abs(l[0] === l[2] ? l[0] : l[1]) / 2.6);
      if (a <= 0.004) continue;
      g.strokeStyle = 'rgba(56,189,248,' + a.toFixed(3) + ')';
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(tmp[0], tmp[1]); g.stroke();
    }

    // nodes: project once per frame
    for (var n = 0; n < nodes.length; n++) {
      var nd = nodes[n];
      project(nd.x, nd.y, nd.z, tmp);
      nd.px = tmp[0]; nd.py = tmp[1]; nd.pz = tmp[2]; nd.ps = tmp[3];
    }

    // edges in four depth bands, one stroke each
    /** @type {Array<Array<[number, number, boolean]>>} */ var bands = [[], [], [], []];
    /** @type {Array<[number, number, boolean]>} */ var coreBand = [];
    for (var e = 0; e < edges.length; e++) {
      var ed = edges[e];
      if (ed[2]) { coreBand.push(ed); continue; }
      var z = (nodes[ed[0]].pz + nodes[ed[1]].pz) / 2;
      bands[Math.max(0, Math.min(3, Math.floor((z + 1) * 2)))].push(ed);
    }
    var alphas = [0.5, 0.32, 0.18, 0.09];
    for (var b = 3; b >= 0; b--) {
      g.strokeStyle = 'rgba(148,184,230,' + alphas[b] + ')';
      g.lineWidth = b < 2 ? 1.1 : 0.8;
      g.beginPath();
      bands[b].forEach(function (ed2) { var p = nodes[ed2[0]], q = nodes[ed2[1]]; g.moveTo(p.px, p.py); g.lineTo(q.px, q.py); });
      g.stroke();
    }
    g.strokeStyle = 'rgba(167,139,250,0.34)'; g.lineWidth = 0.9;
    g.beginPath();
    coreBand.forEach(function (ed3) { var p = nodes[ed3[0]], q = nodes[ed3[1]]; g.moveTo(p.px, p.py); g.lineTo(q.px, q.py); });
    g.stroke();

    // particles
    for (var d = 0; d < dust.length; d++) {
      var pt = dust[d];
      project(pt.x, pt.y, pt.z, tmp);
      var da = 0.12 + (1 - (tmp[2] + 2) / 4) * 0.35;
      g.fillStyle = 'rgba(203,213,225,' + Math.max(0.05, da).toFixed(3) + ')';
      var ds = tmp[3] * 1.6;
      g.fillRect(tmp[0], tmp[1], ds, ds);
    }

    // nodes, far to near
    var order = nodes.slice().sort(function (p, q) { return q.pz - p.pz; });
    g.globalCompositeOperation = 'lighter';
    for (var o = 0; o < order.length; o++) {
      var m = order[o], front = 1 - (m.pz + 1) / 2;
      var c = m.core ? COLORS[1] : [Math.round(56 + (139 - 56) * (1 - front)), Math.round(189 + (92 - 189) * (1 - front)), Math.round(248 + (246 - 248) * (1 - front))];
      var rad = (m.core ? 2.1 : 1.3 + front * 1.9) * m.ps;
      if (front > 0.55 || m.core) { var gs = rad * 7; g.globalAlpha = m.core ? 0.32 : (front - 0.5) * 0.7; g.drawImage(sprites[m.core ? 1 : 0], m.px - gs / 2, m.py - gs / 2, gs, gs); }
      g.globalAlpha = 0.35 + front * 0.65;
      g.fillStyle = 'rgb(' + c + ')';
      g.beginPath(); g.arc(m.px, m.py, rad, 0, Math.PI * 2); g.fill();
    }

    // data pulses with short trails
    for (var k = 0; k < pulses.length; k++) {
      var pu = pulses[k], A = nodes[pu.a], B = nodes[pu.b];
      for (var tr = 0; tr < 4; tr++) {
        var tt = Math.max(0, pu.t - tr * 0.06);
        var x = A.px + (B.px - A.px) * tt, y = A.py + (B.py - A.py) * tt;
        var fz = 1 - ((A.pz + (B.pz - A.pz) * tt) + 1) / 2;
        var sz = (tr ? 9 - tr * 1.8 : 16) * (0.6 + fz * 0.7);
        g.globalAlpha = (tr ? 0.5 - tr * 0.11 : 0.95) * (0.45 + fz * 0.55);
        g.drawImage(sprites[pu.c], x - sz / 2, y - sz / 2, sz, sz);
      }
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
    CY = baseCY;
    void time;
  };

  /* ---------- the loop ---------- */
  var running = false, raf = 0, last = 0, visible = true, ready = false;
  /** @param {number} now */
  var step = function (now) {
    raf = requestAnimationFrame(step);
    var dt = Math.min(0.05, (now - last) / 1000 || 0);
    if (low && now - last < 32) return;
    last = now;
    yaw += dt * 0.085;
    oYaw += (tYaw - oYaw) * 0.04; oPitch += (tPitch - oPitch) * 0.04;
    for (var k = 0; k < pulses.length; k++) {
      var pu = pulses[k];
      pu.t += dt * pu.v;
      if (pu.t >= 1) {
        var nx = adj[pu.b].filter(function (n) { return n !== pu.a; });
        var to = nx.length ? nx[Math.floor(Math.random() * nx.length)] : pu.a;
        pu.a = pu.b; pu.b = to; pu.t = 0;
      }
    }
    for (var d = 0; d < dust.length; d++) {
      var p = dust[d];
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      var r2 = p.x * p.x + p.y * p.y + p.z * p.z;
      if (r2 > 6 || r2 < 1.4) { p.vx = -p.vx; p.vy = -p.vy; p.vz = -p.vz; }
    }
    draw(now / 1000);
  };
  var start = function () {
    if (running || !DF.motionOn() || !visible || document.hidden) return;
    running = true; last = performance.now(); raf = requestAnimationFrame(step);
  };
  var stop = function () { running = false; cancelAnimationFrame(raf); };
  var still = function () { if (layout()) { draw(0); markReady(); } };
  var markReady = function () { if (!ready) { ready = true; cv.classList.add('is-ready'); } };
  var sync = function () { if (DF.motionOn()) start(); else { stop(); still(); } };

  if (!layout()) return;
  draw(0); markReady();
  DF.watch(host, function (on) { visible = on; if (on) sync(); else stop(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else sync(); });
  DF.onMotion(sync);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(function () { if (layout()) draw(0); }).observe(host);
  else window.addEventListener('resize', function () { if (layout()) draw(0); });
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      if (!running) return;
      tYaw = (e.clientX / window.innerWidth - 0.5) * 0.5;
      tPitch = (e.clientY / window.innerHeight - 0.5) * 0.24;
    }, { passive: true });
  }
  sync();
})();
