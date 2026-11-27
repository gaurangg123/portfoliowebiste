// 06 · Inside my engineering workflow: five connected stages. Desktop: a horizontal
// journey with a progress line; small screens: a vertical timeline.
const W = require('../data/workflow.js');
const { secHead, tags, esc, icon } = require('./ui.js');
const { stepper } = require('./stepper.js');
const { SCENES } = require('./scenes.js');

const body = (s) => `<div class="wf-panel">
            <div class="wf-panel__art">${SCENES[s.scene]}<p class="wf-panel__step">Stage ${s.num} of 05</p></div>
            <div class="wf-panel__main">
              <p class="wf-panel__what">${s.what}</p>
              <div class="wf-panel__cols">
                <div><p class="label">What I do here</p><ul class="wf-list">${s.activities.map((a) => `<li>${a}</li>`).join('')}</ul></div>
                <div><p class="label">Tools &amp; techniques</p>${tags(s.tools, 'tag tag--tone')}
                  <p class="label wf-panel__ex-h">In practice</p><p class="wf-panel__ex">${s.example[0]} <a href="${s.example[1]}">See the project${icon('arrowRight')}</a></p></div>
              </div>
            </div>
          </div>`;

const workflow = () => `<section class="section workflow" id="workflow" aria-labelledby="workflow-title">
  <div class="container">
    ${secHead({ num: '06', label: 'How I work', id: 'workflow-title', title: 'Inside my engineering <em>workflow.</em>', lede: `From a business question to a solution people use, in five stages. Select a stage to see what happens there. ${esc(W.note)}`, split: true })}
    ${stepper({ id: 'wf', variant: 'journey', label: 'Engineering workflow stages', steps: W.stages.map((s) => ({ key: s.key, tone: s.tone, num: s.num, icon: s.icon, name: s.name, short: s.short, body: body(s) })) })}
  </div>
</section>`;

module.exports = { workflow };
