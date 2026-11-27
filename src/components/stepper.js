// A stepper: connected stages, one open at a time. Used by the engineering workflow,
// the data architecture and the engineering disciplines.
//   desktop (≥1024px, with JavaScript): nodes on a track, one shared detail area
//   small screens and no JavaScript: a vertical timeline; each stage expands in place
// Accessible as an accordion: each stage is a heading with a button (aria-expanded)
// that controls its panel. The panels are plain containers, not landmark regions:
// three steppers with 17 stages would otherwise flood the landmark list.
// src/scripts/stepper.js adds the behaviour.
const { icon } = require('./ui.js');

// names may arrive escaped or not: encode only a bare "&"
const amp = (t) => String(t).replace(/&(?![a-z]+;|#\d+;)/gi, '&amp;');

/**
 * @param {{ id: string, variant: 'journey'|'side', label: string, steps: Array<{ key: string, tone?: string, num: string, icon?: string, name: string, short?: string, body: string }> }} o
 */
const stepper = ({ id, variant, label, steps }) => `<div class="stepper stepper--${variant}" data-stepper data-label="${label}" style="--n:${steps.length}">
      <div class="stepper__track" aria-hidden="true"><span class="stepper__fill"></span><span class="stepper__pulse"></span></div>
${steps.map((s, i) => `      <div class="stepper__step" style="--c:${i + 1}"${s.tone ? ` data-tone="${s.tone}"` : ''}>
        <h3 class="stepper__h">
          <button class="stepper__node" type="button" id="${id}-tab-${s.key}" aria-controls="${id}-panel-${s.key}" aria-expanded="${i === 0}">
            <span class="stepper__dot" aria-hidden="true">${s.icon ? icon(s.icon) : ''}</span>
            <span class="stepper__num">${s.num}</span>
            <span class="stepper__name">${amp(s.name)}</span>${s.short ? `
            <span class="stepper__short">${amp(s.short)}</span>` : ''}
          </button>
        </h3>
        <div class="stepper__panel" id="${id}-panel-${s.key}">
          ${s.body}
        </div>
      </div>`).join('\n')}
    </div>`;

module.exports = { stepper };
