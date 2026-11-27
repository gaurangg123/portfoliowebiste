// 07 · Interactive data architecture.
// Without JavaScript this is a plain ordered list of stages, each with its details.
// src/scripts/architecture.js turns it into tabs: select a stage (pointer or arrow
// keys) to show its details; the connections on either side of it light up.
const A = require('../data/architecture.js');
const { secHead, tags, icon, esc } = require('./ui.js');

const n = (i) => String(i + 1).padStart(2, '0');

const architecture = () => {
  const S = A.stages;
  return `<section class="section section--alt arch" id="architecture" aria-labelledby="architecture-title">
  <div class="container">
    ${secHead({ num: '07', label: 'Interactive data architecture', id: 'architecture-title', title: 'From raw data to <em>decisions.</em>', lede: `${A.note} Select a stage to see what it does, the tools it uses and where it shows up in my work.` })}
    <div class="arch__wrap" data-arch data-reveal>
      <ol class="arch__flow" data-arch-flow>
${S.map((s, i) => `        <li class="arch__step"><button class="arch__stage" type="button" id="arch-tab-${s.id}" aria-controls="arch-panel-${s.id}" data-i="${i}"><span class="arch__num">${n(i)}</span><span class="arch__ico">${icon(s.icon)}</span><span class="arch__name">${esc(s.name)}</span></button></li>`).join('\n')}
      </ol>
      <div class="arch__panels">
${S.map((s, i) => `        <section class="arch__panel" id="arch-panel-${s.id}" aria-labelledby="arch-h-${s.id}" data-arch-panel>
          <header class="arch__phead">
            <span class="arch__pico">${icon(s.icon)}</span>
            <div><p class="label">Stage ${n(i)} of ${n(S.length - 1)}</p><h3 class="arch__ptitle" id="arch-h-${s.id}">${esc(s.name)}</h3></div>
          </header>
          <div class="arch__cols">
            <div class="arch__col arch__col--does"><p class="label">What it does</p><p>${s.does}</p></div>
            <div class="arch__col"><p class="label">Technologies</p>${tags(s.tech)}</div>
            <div class="arch__col"><p class="label">Example use cases</p><ul class="arch__uses">${s.uses.map(([t, href]) => `<li><a href="${href}">${t}</a></li>`).join('')}</ul></div>
            <div class="arch__col"><p class="label">Connects</p><p class="arch__links">${i ? `<span>${icon('arrowLeft')}<span>Receives from <b>${esc(S[i - 1].name)}</b></span></span>` : '<span>The starting point: where data comes from</span>'}${i < S.length - 1 ? `<span>${icon('arrowRight')}<span>Feeds <b>${esc(S[i + 1].name)}</b></span></span>` : '<span>The end of the flow: decisions and action</span>'}</p></div>
          </div>
        </section>`).join('\n')}
      </div>
    </div>
  </div>
</section>`;
};

module.exports = { architecture };
