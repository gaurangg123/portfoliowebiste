// 04 · Engineering missions: a project explorer.
//   desktop (≥1024px, with JavaScript): an index of every project beside a large showcase
//   of the selected one (hover previews, click or arrow keys select)
//   smaller screens and without JavaScript: every project as a full card
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

// the four panels each project answers; experiments describe what the agent does instead
const facts = (p) => {
  const isCase = p.type === 'Company project';
  const rows = isCase
    ? [['problem', 'Problem', p.problem], ['built', 'What I built', p.contribution], ['how', 'How it works', p.approach], ['results', 'Results', `${p.status ? `<span class="status">${p.status[1]}</span> ` : ''}${p.outcome}`]]
    : [['built', 'What I built', 'Built it myself, with AI as my co-developer at every step.'], ['how', 'How it works', p.sample === 'bug' ? 'In: a screenshot and a short description of an issue. Out: a structured bug report with title, steps, expected and actual result.' : 'In: existing code and the logic it should follow. Out: proposed changes, for a developer to review and apply.'], ['results', 'Status', 'An experiment, shown with a sample input and output. Not a live tool.']];
  return `<dl class="px__facts">${rows.map(([k, t, v]) => `<div class="px__fact px__fact--${k}"><dt>${t}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
};

const card = (p, i) => {
  const isCase = p.type === 'Company project';
  return `        <article class="px__card${i === 0 ? ' is-active' : ''}" id="px-${p.slug}" data-mission data-cats="${p.categories.join(' ')}" data-tone="${IDENTITY[p.slug]}" aria-labelledby="m-${p.slug}">
          <div class="px__media">
            <img src="assets/projects/${p.slug}-800.webp" srcset="assets/projects/${p.slug}-800.webp 800w, assets/projects/${p.slug}-1600.webp 1600w" sizes="(min-width: 1024px) 860px, (min-width: 640px) 46vw, calc(100vw - 32px)" width="1600" height="1000" alt="" loading="lazy" decoding="async" />
            <span class="px__tag">Illustration</span>
          </div>
          <div class="px__body">
            <p class="px__meta"><span class="px__code">${p.code}</span><span>${p.type}</span><span aria-hidden="true">·</span><span>${p.kicker}</span></p>
            <h3 class="px__title" id="m-${p.slug}"${isCase ? ` data-vt="${p.slug}"` : ''}>${isCase ? `<a href="work/${p.slug}/">${p.title}</a>` : p.title}</h3>
            <p class="px__summary">${p.summary}</p>
            ${facts(p)}
            <div class="px__tech">${isCase ? (p.tech ? tags(p.tech) : '<span class="placeholder">Stack details not yet published</span>') : ''}<ul class="px__cats" aria-label="Categories">${p.categories.map((c) => `<li data-tone="${TONE[c]}">${CAT[c]}</li>`).join('')}</ul></div>
            ${isCase ? `<div class="px__actions">
              <a class="btn btn--primary px__go" href="work/${p.slug}/">Read the case study<span class="visually-hidden">: ${p.title}</span> ${icon('arrowRight', 'i-move')}</a>
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
      <div class="px__layout">
        <ol class="px__index js-only" aria-label="Projects">
${list.map((p, i) => `          <li data-cats="${p.categories.join(' ')}" data-tone="${IDENTITY[p.slug]}"><button class="px__item" type="button" data-show="${p.slug}" aria-controls="px-${p.slug}" aria-pressed="${i === 0}"><span class="px__item-code">${p.code}</span><span class="px__item-name">${p.title}</span><span class="px__item-kicker">${p.kicker}${p.status ? ` · <span class="px__item-status">${p.status[1]}</span>` : ''}</span></button></li>`).join('\n')}
        </ol>
        <div class="px__stage" data-missions>
${list.map(card).join('\n')}
        </div>
        <div class="px__nav js-only" data-px-nav>
          <button class="px__step" type="button" data-px-prev>${icon('arrowLeft')}<span class="visually-hidden">Previous project</span></button>
          <p class="px__pos" aria-hidden="true"><b data-px-pos>01</b><span>/</span><span data-px-total>${String(list.length).padStart(2, '0')}</span></p>
          <span class="px__rail" aria-hidden="true"><i data-px-rail></i></span>
          <button class="px__step" type="button" data-px-next>${icon('arrowRight')}<span class="visually-hidden">Next project</span></button>
        </div>
      </div>
    </div>
  </div>
</section>`;
};

module.exports = { projects, SAMPLES, TONE, CAT };
