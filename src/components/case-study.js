// A mission's case study: overview, problem, approach, a functional diagram,
// my contribution, technologies, results and status, the walkthrough, and links.
// Missing facts are shown as clearly marked placeholders, never filled in.
const site = require('../data/site.js');
const { NOT_PUBLIC } = require('../data/projects.js');
const XP = require('./explain.js');
const { ILL } = require('./illustrations.js');
const { icon, tags } = require('./ui.js');
const { CAT, TONE } = require('./projects.js');

const ILLUSTRATION = { 'knowledge-portal': ILL.kp, 'business-sheet': ILL.sheet, 'contract-intelligence': ILL.contract, 'resume-matching': ILL.match, 'data-migration': ILL.pipe };
const DEMO_NOTE = 'Illustrative walkthrough · sample data';

const steps = (items) => `<ol class="steps">
${items.map(([b, t]) => `                <li><b>${b}</b><span>${t}</span></li>`).join('\n')}
              </ol>`;

const caseStudy = ({ p, demo, prev, next, all }) => {
  const secs = Math.round(demo.duration / 1000);
  const ss = String(secs).padStart(2, '0');
  const sid = (h) => `${p.slug}-${h}`;
  const toc = [];
  const sec = (key, label, body, mod = '') => {
    toc.push([sid(key), label]);
    return `      <section class="cs-sec${mod}" aria-labelledby="${sid(key)}" data-reveal>
        <h2 class="cs-sec__h" id="${sid(key)}"><span class="cs-sec__n" aria-hidden="true">${String(toc.length).padStart(2, '0')}</span>${label}</h2>
        <div class="cs-sec__body">
          ${body}
        </div>
      </section>`;
  };

  const facts = [['My contribution', p.role]]
    .concat(p.status ? [['Status', `<span class="status">${p.status[1]}</span>`]] : [['Status', '<span class="placeholder">No public status</span>']])
    .concat(p.facts)
    .concat([['Categories', p.categories.map((c) => CAT[c]).join(' · ')]]);

  const walk = `<div class="walk">
            <figure class="walk__figure demo-preview">
              <div class="demo-preview__frame">
              ${ILLUSTRATION[p.slug]}
                <button class="demo-preview__btn js-only" type="button" data-demo="${p.slug}" aria-haspopup="dialog"><span class="demo-preview__bar"><span class="demo-preview__cta">${icon('play')}<span>Watch walkthrough</span></span><span class="visually-hidden">: ${p.title} (${secs} seconds)</span><span class="demo-preview__len" aria-hidden="true">0:${ss}</span></span></button>
              </div>
              <figcaption class="figure-note"><span class="js-only">${DEMO_NOTE}</span><span class="nojs-only">${p.slug === 'data-migration' ? 'Illustrative diagram · documented stages' : 'Illustrative interface · sample content'}</span><span class="demo-status" data-demo-status role="status"></span></figcaption>
            </figure>
            <div class="walk__text">
              <p class="walk__lede">${p.walk}</p>
              <ul class="walk__meta"><li>${secs} seconds</li><li>Silent</li><li>Pause, replay or choose a step</li></ul>
              <details class="walk__alt">
                <summary>Read the walkthrough as text</summary>
              ${steps(demo.scenes.map((x) => [x.title, x.text]))}
              </details>
            </div>
          </div>`;

  const body = [
    sec('problem', 'The problem', `<p>${p.problem}</p>`),
    sec('approach', 'Technical approach', `<p>${p.approach}</p>`),
    sec('diagram', p.explainTitle, `<p class="cs-note">${icon('ai')}Functional view drawn from the documented capabilities, with sample content. It is not a system architecture diagram.</p>
          ${XP[p.explain]()}${p.explainNote ? `
          <p class="xp__foot">${p.explainNote}</p>` : ''}`, ' cs-sec--wide'),
    sec('contribution', 'My contribution', `<p>${p.contribution}</p>${p.timeline ? `
          ${XP.kpTimeline()}` : ''}`),
    sec('tech', 'Technologies', p.tech ? tags(p.tech) : '<p><span class="placeholder">Stack details not yet published</span></p><p class="cs-muted">Technologies are listed only once confirmed.</p>'),
    sec('results', 'Results and status', `<p>${p.outcome}</p>
          <dl class="cs-results">
            <div><dt>Status</dt><dd>${p.status ? `<span class="status">${p.status[1]}</span>` : '<span class="placeholder">No public status</span>'}</dd></div>
            <div><dt>Metrics</dt><dd><span class="placeholder">No published metrics</span></dd></div>
          </dl>`),
    sec('walkthrough', 'Walkthrough', walk, ' cs-sec--wide'),
    sec('links', 'Repository and demo', `<ul class="cs-links">
            <li>${icon('lock')}<span><b>Repository</b>${NOT_PUBLIC}</span></li>
            <li>${icon('lock')}<span><b>Live demo</b>${NOT_PUBLIC}</span></li>
            <li>${icon('play')}<span><b>Illustrative walkthrough</b><button class="link-btn js-only" type="button" data-demo="${p.slug}" aria-haspopup="dialog">Watch the ${secs}-second walkthrough</button><span class="nojs-only">Described above, as text</span></span></li>
          </ul>`),
  ].join('\n');

  const navCard = (q, dir, rel) => q
    ? `<a class="cs-next__card" href="../${q.slug}/" rel="${rel}"><span class="label">${dir}</span><span class="cs-next__title" data-vt="${q.slug}">${q.title}</span><span class="cs-next__desc">${q.summary}</span><img src="../../assets/projects/${q.slug}-800.webp" width="1600" height="1000" alt="" loading="lazy" decoding="async" /></a>`
    : `<a class="cs-next__card" href="../../#projects"><span class="label">${dir}</span><span class="cs-next__title">All missions</span><span class="cs-next__desc">Every project on one page, with filters.</span><span class="cs-next__all" aria-hidden="true">${all.length}</span></a>`;

  return `<main id="main">
  <article class="cs" aria-labelledby="cs-title">
    <header class="cs-head" id="top">
      <div class="container cs-head__grid">
        <div class="cs-head__text">
          <p class="cs-head__back"><a href="../../#projects">${icon('arrowLeft')}All missions</a></p>
          <p class="mission__meta"><span class="mission__code">${p.code}</span><span>${p.type}</span><span aria-hidden="true">·</span><span>${p.kicker}</span></p>
          <h1 class="cs-head__title" id="cs-title" data-vt="${p.slug}">${p.title}</h1>
          <p class="cs-head__lede">${p.lede}</p>
          <ul class="mission__cats" aria-label="Categories">${p.categories.map((c) => `<li data-tone="${TONE[c]}">${CAT[c]}</li>`).join('')}</ul>
        </div>
        <figure class="cs-head__cover">
          <img src="../../assets/projects/${p.slug}-1600.webp" srcset="../../assets/projects/${p.slug}-800.webp 800w, ../../assets/projects/${p.slug}-1600.webp 1600w" sizes="(min-width: 1100px) 560px, calc(100vw - 32px)" width="1600" height="1000" alt="" fetchpriority="high" decoding="async" />
          <figcaption class="figure-note">Original illustration · not a screenshot</figcaption>
        </figure>
      </div>
      <div class="container">
        <dl class="cs-facts">
${facts.map(([k, v]) => `          <div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n')}
        </dl>
      </div>
    </header>

    <div class="container cs-layout">
      <nav class="cs-toc" aria-label="On this page">
        <p class="label">Mission log</p>
        <ol>
${toc.map(([id, label]) => `          <li><a href="#${id}" data-spy="${id}">${label}</a></li>`).join('\n')}
        </ol>
      </nav>
      <div class="cs-main">
${body}
      </div>
    </div>

    <nav class="container cs-next" aria-label="More missions">
      ${navCard(prev, 'Previous mission', 'prev')}
      ${navCard(next, 'Next mission', 'next')}
    </nav>
  </article>
</main>`;
};

const notFound = () => `<main id="main">
  <section class="nf container" id="top" aria-labelledby="nf-title">
    <p class="label"><span class="t-warn">Error 404</span> // route not found</p>
    <h1 class="nf__title" id="nf-title">This path leads <em>nowhere.</em></h1>
    <p class="nf__lede">The link may be old or mistyped. Everything lives on the homepage.</p>
    <pre class="nf__log" aria-hidden="true"><span class="t-k">$</span> resolve <span data-path>this page</span>
<span class="t-warn">✕ 404</span> no route matches
<span class="t-k">$</span> cd ~ <span class="t-dim"># back to the homepage</span></pre>
    <p><a class="btn btn--primary" href="${site.basePath}">${icon('arrowLeft')}Go to the homepage</a></p>
  </section>
</main>`;

module.exports = { caseStudy, notFound };
