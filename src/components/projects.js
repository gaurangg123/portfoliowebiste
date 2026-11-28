// 04 · Engineering missions, in three labelled groups: the featured project (illustration
// beside its headline, every fact in a row beneath), the other four company projects as
// an even grid of equal cards, and the two experiments in "the lab". Filters narrow the
// gallery; a group with nothing left to show hides.
// Company projects link to their case studies and open the illustrative walkthrough;
// the experiments show a sample input and output. Unconfirmed facts stay marked as such.
const { CATEGORIES, PROJECTS } = require('../data/projects.js');
const { secHead, icon, tags } = require('./ui.js');

const CAT = Object.fromEntries(CATEGORIES);
const TONE = { data: 'cyan', ai: 'violet', automation: 'green', analytics: 'amber', software: 'blue' };
const IDENTITY = { 'knowledge-portal': 'cyan', 'business-sheet': 'amber', 'contract-intelligence': 'violet', 'resume-matching': 'green', 'data-migration': 'blue', 'bug-detailer': 'green', 'web-app-builder': 'violet' };

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

// the facts a project answers; the featured project shows all four, the others the essentials
const facts = (p, full) => {
  const isCase = p.type === 'Company project';
  const rows = isCase
    ? (full
      ? [['problem', 'Problem', p.problem], ['built', 'What I built', p.contribution], ['how', 'How it works', p.approach], ['results', 'Results', `${p.status ? `<span class="status">${p.status[1]}</span> ` : ''}${p.outcome}`]]
      : [['built', 'My part', p.role + '.'], ['results', 'Result', `${p.status ? `<span class="status">${p.status[1]}</span> ` : ''}${p.outcome}`]])
    : [['built', 'What I built', 'Built it myself, with AI as my co-developer at every step.'], ['how', 'How it works', p.sample === 'bug' ? 'In: a screenshot and a short description of an issue. Out: a structured bug report with title, steps, expected and actual result.' : 'In: existing code and the logic it should follow. Out: proposed changes, for a developer to review and apply.']];
  return `<dl class="px__facts">${rows.map(([k, t, v]) => `<div class="px__fact px__fact--${k}"><dt>${t}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
};

// the featured project is laid out on its own; every other card shares one layout
const SIZE = { 'knowledge-portal': 'feature', 'bug-detailer': 'lab', 'web-app-builder': 'lab' };

const card = (p, i) => {
  const isCase = p.type === 'Company project';
  const size = SIZE[p.slug] || 'card';
  const feature = size === 'feature';
  const href = isCase ? `work/${p.slug}/` : null;
  const img = `<img src="assets/projects/${p.slug}-800.webp" srcset="assets/projects/${p.slug}-800.webp 800w, assets/projects/${p.slug}-1600.webp 1600w" sizes="${feature ? '(min-width: 1024px) 760px' : '(min-width: 1024px) 640px'}, (min-width: 640px) 90vw, calc(100vw - 32px)" width="1600" height="1000" alt="" loading="lazy" decoding="async" />`;
  const media = `<span class="px__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${img}<span class="px__tag">Illustration</span>`;
  return `        <article class="px__card px--${size}" id="px-${p.slug}" data-mission data-cats="${p.categories.join(' ')}" data-tone="${IDENTITY[p.slug]}" aria-labelledby="m-${p.slug}">
          ${href ? `<a class="px__media" href="${href}" tabindex="-1" aria-hidden="true">${media}</a>` : `<div class="px__media">${media}</div>`}
          <div class="px__body">
            <div class="px__head">
            <p class="px__meta"><span class="px__code">${p.code}</span><span>${p.type}</span><span aria-hidden="true">·</span><span>${p.kicker}</span>${p.status ? `<span class="px__live"><span class="dot"></span>${p.status[1]}</span>` : ''}</p>
            <h3 class="px__title" id="m-${p.slug}"${isCase ? ` data-vt="${p.slug}"` : ''}>${isCase ? `<a href="${href}">${p.title}</a>` : p.title}</h3>
            <p class="px__summary">${p.summary}</p>
            </div>
            ${facts(p, feature)}
            <div class="px__tech">${isCase && feature ? (p.tech ? tags(p.tech) : '<span class="placeholder">Stack details not yet published</span>') : ''}${isCase && !feature && p.tech ? tags(p.tech.slice(0, 4)) : ''}<ul class="px__cats" aria-label="Categories">${p.categories.map((c) => `<li data-tone="${TONE[c]}">${CAT[c]}</li>`).join('')}</ul></div>
            ${isCase ? `<div class="px__actions">
              <a class="btn btn--primary px__go" href="${href}">Read the case study<span class="visually-hidden">: ${p.title}</span> ${icon('arrowRight', 'i-move')}</a>
              <button class="demo-btn js-only" type="button" data-demo="${p.slug}" aria-haspopup="dialog">${icon('play')}<span>Watch walkthrough</span><span class="visually-hidden">: ${p.title}</span></button>
              <span class="demo-status" data-demo-status role="status"></span>
            </div>` : `<details class="disclosure px__sample">
              <summary>See a sample input and output<span class="visually-hidden">: ${p.title}</span></summary>
              <figure class="exp__sample">
              ${SAMPLES[p.sample]}
                <figcaption class="exp__note">A sample input and output, for illustration. Not a live tool.</figcaption>
              </figure>
            </details>`}
          </div>
        </article>`;
};

const projects = (titles) => {
  const list = PROJECTS.map((p) => ({ ...p, title: titles[p.slug] }));
  const count = (c) => list.filter((p) => p.categories.includes(c)).length;
  const company = list.filter((p) => p.type === 'Company project');
  const lab = list.filter((p) => p.type !== 'Company project');
  return `<section class="section missions" id="projects" aria-labelledby="projects-title">
  <div class="container">
    ${secHead({ num: '04', label: 'Engineering missions', id: 'projects-title', title: 'Systems built for <em>real work.</em>', lede: 'Five enterprise applications from my work at Tata Technologies, and two AI-agent experiments. Company projects are shown with original illustrations and sample data; their code and live systems aren’t public.', split: true })}
    <div class="px" data-explorer>
      <div class="px__bar js-only">
        <div class="filters" role="group" aria-label="Filter projects by category" data-filters>
          <button type="button" aria-pressed="true" data-filter="all">All<span class="filters__n">${list.length}</span></button>
${CATEGORIES.map(([id, label]) => `          <button type="button" aria-pressed="false" data-filter="${id}" data-tone="${TONE[id]}">${label}<span class="filters__n">${count(id)}</span></button>`).join('\n')}
        </div>
        <p class="px__count" role="status" data-filter-status>Showing all ${list.length} projects</p>
      </div>
      <div class="px__group" data-group>
        <h3 class="px__group-h"><span class="label">Featured project</span><span>The platform I built end to end, from the specification to implementation</span></h3>
        <div class="px__grid px__grid--feature" data-missions>
${card(company[0], 0)}
        </div>
      </div>
      <div class="px__group" data-group>
        <h3 class="px__group-h"><span class="label">More from Tata Technologies</span><span>Four more enterprise applications</span><span class="px__swipe" aria-hidden="true">Swipe ${icon('arrowRight')}</span></h3>
        <div class="px__grid px__grid--more">
${company.slice(1).map((p, i) => card(p, i + 1)).join('\n')}
        </div>
      </div>
      <div class="px__group px__lab" data-group>
        <h3 class="px__group-h"><span class="label">The lab</span><span>AI-agent experiments, built with AI as co-developer</span><span class="px__swipe" aria-hidden="true">Swipe ${icon('arrowRight')}</span></h3>
        <div class="px__grid px__grid--lab">
${lab.map((p, i) => card(p, i + company.length)).join('\n')}
        </div>
      </div>
    </div>
  </div>
</section>`;
};

module.exports = { projects, SAMPLES, TONE, CAT };
