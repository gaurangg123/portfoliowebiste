/* ---------- hero: the 3D data lattice ----------
   A Fibonacci-sphere shell of nodes around a three-layer neural core, joined by
   edges that data pulses travel along, with drifting particles and a perspective
   floor grid. Drawn on a 2D canvas with a small projection: no 3D library.

   It behaves like a small nervous system: now and then a node fires and the signal
   cascades through its neighbours, and nodes near the pointer brighten and reach
   towards it. Colours come from the theme tokens (--lattice-*), so it redraws when
   the theme changes.

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

  /** @typedef {{x:number,y:number,z:number,core:boolean,px:number,py:number,pz:number,ps:number,h?:number}} Node */
  /** @type {Node[]} */ var nodes = [];
  /** @type {Array<[number, number, boolean]>} */ var edges = [];
  /** @type {number[][]} */ var adj = [];
  /** @type {Array<{a:number,b:number,t:number,v:number,c:number}>} */ var pulses = [];
  /** @type {Array<{x:number,y:number,z:number,vx:number,vy:number,vz:number}>} */ var dust = [];
  /** @type {Array<[number, number, number, number]>} */ var grid = [];

  var W = 0, H = 0, DPR = 1, small = false, built = '';
  var CX = 0, CY = 0, S = 1, CAM = 4.4;
  var yaw = 0.6, pitch = 0.34, tYaw = 0, tPitch = 0, oYaw = 0, oPitch = 0;
  /** @type {HTMLCanvasElement[]} */ var sprites = [];
  var T = { a: [56, 189, 248], b: [139, 92, 246], c: [52, 211, 153], edge: '148,184,230', dust: '203,213,225', light: false };
  /** @param {string} v @param {number[]} fallback */
  var rgb = function (v, fallback) {
    var m = String(v || '').split(',').map(function (x) { return parseInt(x, 10); });
    return m.length === 3 && m.every(function (n) { return n >= 0 && n <= 255; }) ? m : fallback;
  };
  // the theme's colours, and one soft glow dot per colour, drawn once per theme
  var readTheme = function () {
    var cs = getComputedStyle(document.documentElement);
    T.a = rgb(cs.getPropertyValue('--lattice-a'), [56, 189, 248]);
    T.b = rgb(cs.getPropertyValue('--lattice-b'), [139, 92, 246]);
    T.c = rgb(cs.getPropertyValue('--lattice-c'), [52, 211, 153]);
    T.edge = rgb(cs.getPropertyValue('--lattice-edge'), [148, 184, 230]).join(',');
    T.dust = rgb(cs.getPropertyValue('--lattice-dust'), [203, 213, 225]).join(',');
    T.light = cs.getPropertyValue('--lattice-blend').trim() === 'source-over';
    sprites = [T.a, T.b, T.c].map(function (c) {
      var sp = document.createElement('canvas'); sp.width = sp.height = 64;
      var g = /** @type {CanvasRenderingContext2D} */ (sp.getContext('2d'));
      var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(' + c + ',1)'); grad.addColorStop(0.25, 'rgba(' + c + ',0.55)'); grad.addColorStop(1, 'rgba(' + c + ',0)');
      g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
      return sp;
    });
  };
  readTheme();

  // the pointer, in canvas pixels; nodes near it brighten and reach towards it
  var px = -1e4, py = -1e4, pOn = false, hover = -1, hoverD = 1e9;
  // firing cascades: a node fires, its neighbours follow a moment later, fading with depth
  /** @type {Array<{n:number,at:number,d:number,w:number}>} */ var queue = [];
  /** @type {number[]} */ var fireAt = [];
  /** @type {number[]} */ var fired = [];
  var clock = 0, wave = 0, nextWave = 1.1, lastPoke = -9;
  /** @param {number} n */
  var ignite = function (n) { wave++; queue.push({ n: n, at: clock, d: 0, w: wave }); };

  /* ---------- geometry ---------- */
  var build = function () {
    var key = small || low ? 'lite' : 'full';
    if (built === key) return;
    built = key;
    var R = seeded(20251027);
    var N = key === 'lite' ? 70 : 128, ring = key === 'lite' ? 6 : 9;
    nodes = []; edges = []; adj = []; pulses = []; dust = []; grid = []; queue = []; fireAt = []; fired = [];
    /** @param {number} x @param {number} y @param {number} z @param {boolean} core */
    var add = function (x, y, z, core) { nodes.push({ x: x, y: y, z: z, core: core, px: 0, py: 0, pz: 0, ps: 0 }); adj.push([]); fireAt.push(0); fired.push(0); };
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
    if (small) { var top = Math.max(120, Math.min(300, w * 0.34)); CX = w * 0.64; CY = 64 + top * 0.55; S = Math.min(w * 0.34, top * 0.62); }
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
      g.strokeStyle = 'rgba(' + T.a + ',' + (a * (T.light ? 0.8 : 1)).toFixed(3) + ')';
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(tmp[0], tmp[1]); g.stroke();
    }

    // nodes: project once per frame, and find the ones near the pointer
    var PR = small ? 110 : 160, near = [];
    hover = -1; hoverD = 1e9;
    for (var n = 0; n < nodes.length; n++) {
      var nd = nodes[n];
      project(nd.x, nd.y, nd.z, tmp);
      nd.px = tmp[0]; nd.py = tmp[1]; nd.pz = tmp[2]; nd.ps = tmp[3];
      nd.h = 0;
      if (pOn) {
        var dx = nd.px - px, dy = nd.py - py, dd = Math.sqrt(dx * dx + dy * dy);
        if (dd < PR && nd.pz < 0.4) { nd.h = 1 - dd / PR; near.push(n); }
        if (dd < hoverD) { hoverD = dd; hover = n; }
      }
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
    var alphas = T.light ? [0.34, 0.22, 0.13, 0.07] : [0.5, 0.32, 0.18, 0.09];
    for (var b = 3; b >= 0; b--) {
      g.strokeStyle = 'rgba(' + T.edge + ',' + alphas[b] + ')';
      g.lineWidth = b < 2 ? 1.1 : 0.8;
      g.beginPath();
      bands[b].forEach(function (ed2) { var p = nodes[ed2[0]], q = nodes[ed2[1]]; g.moveTo(p.px, p.py); g.lineTo(q.px, q.py); });
      g.stroke();
    }
    g.strokeStyle = 'rgba(' + T.b + ',' + (T.light ? 0.26 : 0.34) + ')'; g.lineWidth = 0.9;
    g.beginPath();
    coreBand.forEach(function (ed3) { var p = nodes[ed3[0]], q = nodes[ed3[1]]; g.moveTo(p.px, p.py); g.lineTo(q.px, q.py); });
    g.stroke();

    // edges carrying a cascade light up between the two firing nodes
    g.lineWidth = 1.4;
    for (var f = 0; f < edges.length; f++) {
      var ef = edges[f], wf = Math.min(fired[ef[0]], fired[ef[1]]);
      if (wf < 0.05) continue;
      g.strokeStyle = 'rgba(' + (ef[2] ? T.b : T.a) + ',' + Math.min(0.9, wf * 0.95).toFixed(3) + ')';
      g.beginPath(); g.moveTo(nodes[ef[0]].px, nodes[ef[0]].py); g.lineTo(nodes[ef[1]].px, nodes[ef[1]].py); g.stroke();
    }
    // the pointer: faint threads to the nearest nodes
    if (near.length) {
      near.sort(function (p, q) { return (nodes[q].h || 0) - (nodes[p].h || 0); });
      g.lineWidth = 1;
      for (var r = 0; r < Math.min(4, near.length); r++) {
        var nn = nodes[near[r]];
        g.strokeStyle = 'rgba(' + T.a + ',' + ((nn.h || 0) * (T.light ? 0.35 : 0.45)).toFixed(3) + ')';
        g.beginPath(); g.moveTo(px, py); g.lineTo(nn.px, nn.py); g.stroke();
      }
    }

    // particles
    for (var d = 0; d < dust.length; d++) {
      var pt = dust[d];
      project(pt.x, pt.y, pt.z, tmp);
      var da = 0.12 + (1 - (tmp[2] + 2) / 4) * 0.35;
      g.fillStyle = 'rgba(' + T.dust + ',' + Math.max(0.05, da * (T.light ? 0.7 : 1)).toFixed(3) + ')';
      var ds = tmp[3] * 1.6;
      g.fillRect(tmp[0], tmp[1], ds, ds);
    }

    // nodes, far to near
    var order = nodes.map(function (_, ix) { return ix; }).sort(function (p, q) { return nodes[q].pz - nodes[p].pz; });
    g.globalCompositeOperation = T.light ? 'source-over' : 'lighter';
    var A0 = T.a, B0 = T.b;
    for (var o = 0; o < order.length; o++) {
      var mi = order[o], m = nodes[mi], front = 1 - (m.pz + 1) / 2, lit = Math.min(1, fired[mi] + (m.h || 0) * 0.8);
      var c = m.core ? B0 : [Math.round(A0[0] + (B0[0] - A0[0]) * (1 - front)), Math.round(A0[1] + (B0[1] - A0[1]) * (1 - front)), Math.round(A0[2] + (B0[2] - A0[2]) * (1 - front))];
      var rad = (m.core ? 2.1 : 1.3 + front * 1.9) * m.ps * (1 + lit * 0.9);
      if (front > 0.55 || m.core || lit > 0.05) {
        var gs = rad * (7 + lit * 3);
        g.globalAlpha = Math.min(1, (m.core ? 0.32 : Math.max(0, (front - 0.5) * 0.7)) + lit * 0.7) * (T.light ? 0.55 : 1);
        g.drawImage(sprites[lit > 0.3 ? 2 : m.core ? 1 : 0], m.px - gs / 2, m.py - gs / 2, gs, gs);
      }
      g.globalAlpha = Math.min(1, 0.35 + front * 0.65 + lit * 0.4);
      g.fillStyle = 'rgb(' + (lit > 0.3 ? T.c : c) + ')';
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
        g.globalAlpha = (tr ? 0.5 - tr * 0.11 : 0.95) * (0.45 + fz * 0.55) * (T.light ? 0.75 : 1);
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
    cascade(dt);
    draw(now / 1000);
    // the pointer resting on a node sets off a cascade from it
    if (pOn && hover >= 0 && hoverD < 34 && clock - lastPoke > 0.9) { lastPoke = clock; ignite(hover); }
  };
  /** @param {number} dt */
  var cascade = function (dt) {
    clock += dt;
    if (clock >= nextWave) { ignite(Math.floor(Math.random() * nodes.length)); nextWave = clock + 1.4 + Math.random() * 2.2; }
    for (var q = queue.length - 1; q >= 0; q--) {
      var it = queue[q];
      if (it.at > clock) continue;
      queue.splice(q, 1);
      if (fireAt[it.n] === it.w) continue;
      fireAt[it.n] = it.w;
      fired[it.n] = Math.max(fired[it.n], 1 - it.d * 0.19);
      if (it.d >= 4) continue;
      var nb = adj[it.n];
      for (var j = 0; j < nb.length; j++) {
        if (fireAt[nb[j]] !== it.w && Math.random() < 0.62) queue.push({ n: nb[j], at: clock + 0.08 + Math.random() * 0.09, d: it.d + 1, w: it.w });
      }
    }
    var fade = Math.exp(-dt * 2.3);
    for (var f = 0; f < fired.length; f++) fired[f] = fired[f] > 0.01 ? fired[f] * fade : 0;
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
      var r = cv.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      pOn = py >= 0 && py <= r.height;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { pOn = false; });
  }
  // a new theme: new colours, and a fresh still frame when nothing is animating
  document.addEventListener('df:theme', function () { readTheme(); if (!running && layout()) draw(0); });
  sync();
})();
