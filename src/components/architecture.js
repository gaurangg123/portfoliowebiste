// 07 · Interactive data architecture: seven connected stages from raw data to decisions.
// Desktop: a horizontal flow with animated data along the track; small screens: a
// vertical timeline. Each stage: an illustration, what it does, technologies, where it
// shows up in documented work, and what it connects to.
const A = require('../data/architecture.js');
const { secHead, tags, icon, esc } = require('./ui.js');
const { stepper } = require('./stepper.js');
const { SCENES } = require('./scenes.js');

const n = (i) => String(i + 1).padStart(2, '0');

const architecture = () => {
  const S = A.stages;
  const body = (s, i) => `<div class="arch-panel">
            <div class="arch-panel__art">${SCENES[s.scene]}</div>
            <div class="arch-panel__main">
              <p class="label arch-panel__step">Stage ${n(i)} of ${n(S.length - 1)}</p>
              <p class="arch-panel__does">${s.does}</p>
              <div class="arch-panel__cols">
                <div><p class="label">Technologies</p>${tags(s.tech, 'tag tag--tone')}</div>
                <div><p class="label">Where it shows up</p><ul class="arch-uses">${s.uses.map(([t, href]) => `<li><a href="${href}">${t}</a></li>`).join('')}</ul></div>
                <div><p class="label">Connects</p><p class="arch-links">${i ? `<span>${icon('arrowLeft')}<span>Receives from <b>${esc(S[i - 1].name)}</b></span></span>` : '<span>The starting point: where data comes from</span>'}${i < S.length - 1 ? `<span>${icon('arrowRight')}<span>Feeds <b>${esc(S[i + 1].name)}</b></span></span>` : '<span>The end of the flow: decisions and action</span>'}</p></div>
              </div>
            </div>
          </div>`;
  return `<section class="section section--band arch" id="architecture" aria-labelledby="architecture-title">
  <div class="container">
    ${secHead({ num: '07', label: 'Interactive data architecture', id: 'architecture-title', title: 'From raw data to <em>decisions.</em>', lede: `${A.note} ${A.disclaimer}`, split: true })}
    <div class="arch__frame" data-reveal>
      ${stepper({ id: 'arch', variant: 'journey', label: 'Architecture stages', steps: S.map((s, i) => ({ key: s.id, tone: s.tone, num: n(i), icon: s.icon, name: esc(s.name), short: s.short, body: body(s, i) })) })}
    </div>
  </div>
</section>`;
};

module.exports = { architecture };
