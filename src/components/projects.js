// 04 · Engineering missions — filterable project cards.
// Company projects link to their case studies and open the illustrative walkthrough;
// the two experiments show a sample input and output in place.
const { CATEGORIES, PROJECTS } = require('../data/projects.js');
const { secHead, icon } = require('./ui.js');

const CAT = Object.fromEntries(CATEGORIES);
const TONE = { data: 'cyan', ai: 'violet', automation: 'green', analytics: 'amber', software: 'cyan' };

// sample input and output for the experiments: illustrations, not live tools
const SAMPLES = {
  bug: `<div class="exp__io">
              <div class="exp__side">
                <p class="exp__k">Input · screenshot and description</p>
                <div class="exp__shot" aria-hidden="true"><span class="exp__shot-bar"></span><span class="exp__shot-field"></span><span class="exp__shot-field"></span><span class="exp__shot-btn">Save</span></div>
                <p class="exp__quote">“Save does nothing on the profile page.”</p>
              </div>
              <div class="exp__side">
                <p class="exp__k">Output · bug report</p>
                <dl class="exp__report">
                  <div><dt>Title</dt><dd>Profile changes aren’t saved</dd></div>
                  <div><dt>Steps</dt><dd>Open Profile, change the name, select Save</dd></div>
                  <div><dt>Expected</dt><dd>The change is saved</dd></div>
                  <div><dt>Actual</dt><dd>Nothing happens</dd></div>
                </dl>
              </div>
            </div>`,
  code: `<div class="exp__io">
              <div class="exp__side">
                <p class="exp__k">Input · code and the logic to follow</p>
                <pre class="exp__code"><code>function total(items) {
  return items.reduce((s, i) =&gt; s + i.price, 0);
}</code></pre>
                <p class="exp__quote">“Members get 10% off.”</p>
              </div>
              <div class="exp__side">
                <p class="exp__k">Output · proposed changes</p>
                <pre class="exp__code"><code><del>- function total(items) {</del>
<ins>+ function total(items, isMember) {</ins>
<ins>+   const s = items.reduce((t, i) =&gt; t + i.price, 0);</ins>
<ins>+   return isMember ? s * 0.9 : s;</ins></code></pre>
                <p class="exp__quote">For a developer to review and apply.</p>
              </div>
            </div>`,
};

// a project's cover: original illustration, two sizes of WebP
const cover = (p, sizes) => `<img src="assets/projects/${p.slug}-800.webp" srcset="assets/projects/${p.slug}-800.webp 800w, assets/projects/${p.slug}-1600.webp 1600w" sizes="${sizes}" width="1600" height="1000" alt="" loading="lazy" decoding="async" />`;

const facts = (p) => {
  const rows = [['My contribution', p.role]];
  if (p.status) rows.push(['Status', `<span class="status">${p.status[1]}</span>`]);
  return `<dl class="mission__facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
};

const card = (p, i) => {
  const isCase = p.type === 'Company project';
  return `      <li class="mission${i === 0 ? ' is-lead' : ''}" data-cats="${p.categories.join(' ')}" data-mission>
        <article class="mission__card" aria-labelledby="m-${p.slug}">
          <div class="mission__media">
            ${cover(p, i === 0 ? '(min-width: 1100px) 760px, (min-width: 640px) calc(100vw - 96px), calc(100vw - 32px)' : '(min-width: 1100px) 400px, (min-width: 640px) 46vw, calc(100vw - 32px)')}
            <span class="mission__tag">Illustration</span>
          </div>
          <div class="mission__body">
            <p class="mission__meta"><span class="mission__code">${p.code}</span><span>${p.type}</span><span aria-hidden="true">·</span><span>${p.kicker}</span></p>
            <h3 class="mission__title" id="m-${p.slug}"${isCase ? ` data-vt="${p.slug}"` : ''}>${isCase ? `<a href="work/${p.slug}/">${p.title}</a>` : p.title}</h3>
            <p class="mission__summary">${p.summary}</p>
            ${facts(p)}
            <ul class="mission__cats" aria-label="Categories">${p.categories.map((c) => `<li data-tone="${TONE[c]}">${CAT[c]}</li>`).join('')}</ul>
            ${isCase ? `<div class="mission__actions">
              <a class="link-arrow mission__go" href="work/${p.slug}/" tabindex="-1" aria-hidden="true">Case study ${icon('arrowRight')}</a>
              <button class="demo-btn js-only" type="button" data-demo="${p.slug}" aria-haspopup="dialog">${icon('play')}<span>Watch walkthrough</span><span class="visually-hidden">: ${p.title}</span></button>
              <span class="demo-status" data-demo-status role="status"></span>
            </div>` : `<details class="mission__sample">
              <summary>See a sample input and output<span class="visually-hidden">: ${p.title}</span></summary>
              <figure class="exp__sample">
            ${SAMPLES[p.sample]}
                <figcaption class="exp__note">A sample input and output, for illustration. Not a live tool. Built by me, with AI as my co-developer.</figcaption>
              </figure>
            </details>`}
          </div>
        </article>
      </li>`;
};

const projects = (titles) => {
  const list = PROJECTS.map((p) => ({ ...p, title: titles[p.slug] }));
  const count = (c) => list.filter((p) => p.categories.includes(c)).length;
  return `<section class="section missions" id="projects" aria-labelledby="projects-title">
  <div class="container">
    ${secHead({ num: '04', label: 'Engineering missions', id: 'projects-title', title: 'Systems built for <em>real work.</em>', lede: 'Five enterprise applications from my work at Tata Technologies, and two AI-agent experiments. Company projects are shown with original illustrations and sample data; their code and live systems aren’t public.' })}
    <div class="missions__bar js-only">
      <div class="filters" role="group" aria-label="Filter projects by category" data-filters>
        <button type="button" aria-pressed="true" data-filter="all">All<span class="filters__n">${list.length}</span></button>
${CATEGORIES.map(([id, label]) => `        <button type="button" aria-pressed="false" data-filter="${id}" data-tone="${TONE[id]}">${label}<span class="filters__n">${count(id)}</span></button>`).join('\n')}
      </div>
      <p class="missions__count" role="status" data-filter-status>Showing all ${list.length} projects</p>
    </div>
    <ul class="missions__grid" data-missions>
${list.map(card).join('\n')}
    </ul>
  </div>
</section>`;
};

module.exports = { projects, SAMPLES, TONE, CAT };
