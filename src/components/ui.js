// Small shared pieces used by every section.
const { icon } = require('./icons.js');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// "opens in a new tab", for screen readers
const newTab = '<span class="visually-hidden"> (opens in a new tab)</span>';
const ext = (href, inner, cls = '', extra = '') =>
  `<a${cls ? ` class="${cls}"` : ''} href="${href}" target="_blank" rel="noopener noreferrer"${extra}>${inner}${newTab}</a>`;

// a section heading: "02 // About" in mono, the title, an optional lede
const secHead = ({ num, label, id, title, lede = '', split = false }) => `<header class="sec-head${split ? ' sec-head--split' : ''}" data-reveal>
      <p class="sec-head__label"><b>${num}</b><span aria-hidden="true">//</span><span>${esc(label)}</span></p>
      <h2 class="sec-head__title" id="${id}">${title}</h2>${lede ? `
      <p class="sec-head__lede">${lede}</p>` : ''}
    </header>`;

const tags = (list, cls = 'tag') => `<ul class="tags">${list.map((t) => `<li class="${cls}">${esc(t)}</li>`).join('')}</ul>`;

module.exports = { esc, ext, newTab, secHead, tags, icon };
