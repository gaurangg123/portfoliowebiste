// Query the Engineer: its own page at /query-engineer/, and the homepage invitation to it.
// The assistant is local and transparent: it answers from the portfolio's structured data
// (src/data/query.js) with src/scripts/query-engine.js. Without JavaScript the page shows
// the same engine's answers to the suggested questions, rendered at build time.
const { answer } = require('../scripts/query-engine.js');
const { icon, esc, ext } = require('./ui.js');

/** a link from an answer: data-only hrefs, resolved against the page's base */
const link = (href, inner, base, cls = '') => {
  if (/^https?:/.test(href)) return ext(href, inner, cls);
  const h = /^mailto:/.test(href) ? href : base + href;
  return `<a${cls ? ` class="${cls}"` : ''} href="${esc(h)}">${inner}</a>`;
};

/** the visible words of an answer's link, by where it goes */
const goText = (href) => (/^work\//.test(href) ? 'Case study' : /^#/.test(href) ? 'On the homepage' : /^mailto:/.test(href) ? 'Write' : 'Open');

/** an answer as HTML (the browser builds the same structure with DOM calls) */
const renderAnswer = (a, base, { follow = true } = {}) => {
  const blocks = a.blocks.map((b) => {
    if (b.type === 'p') return `<p>${esc(b.text)}</p>`;
    if (b.type === 'tags') return `<ul class="tags">${b.items.map((t) => `<li class="tag">${esc(t)}</li>`).join('')}</ul>`;
    return `<ul class="qe-ans__list">${b.items.map((i) => `<li>${i.label ? `<b>${esc(i.label)}</b> ` : ''}${esc(i.text)}${i.href ? ` ${link(i.href, `${goText(i.href)}${i.label ? `<span class="visually-hidden">: ${esc(i.label)}</span>` : ''}${icon('arrowRight', 'i-go')}`, base, 'qe-ans__go')}` : ''}</li>`).join('')}</ul>`;
  }).join('');
  const links = a.links.length ? `<ul class="qe-ans__links">${a.links.map((l) => `<li>${link(l.href, `${esc(l.text)}${icon('arrowUpRight', 'i-go')}`, base)}</li>`).join('')}</ul>` : '';
  const next = follow && a.follow.length ? `<div class="qe-ans__next js-only"><span class="label">Ask next</span>${a.follow.map((q) => `<button class="qe-chip" type="button" data-qe-ask="${esc(q)}">${esc(q)}</button>`).join('')}</div>` : '';
  return `<h3 class="qe-ans__title">${esc(a.title)}</h3>${blocks}${links}${next}`;
};

const queryPage = ({ kb, base }) => {
  const welcome = answer('', kb);
  return `<main id="main" class="qe" data-qe data-base="${base}">
  <canvas class="qe__net js-only" data-net aria-hidden="true"></canvas>
  <template id="qe-arrow">${icon('arrowRight', 'i-go')}</template>
  <div class="container qe__grid">
    <aside class="qe__brief" aria-labelledby="qe-title">
      <a class="qe__back" href="${base}">${icon('arrowLeft')}Return to portfolio</a>
      <p class="qe__kicker"><span>DF</span> // Portfolio assistant</p>
      <h1 class="qe__title" id="qe-title"><span>Query</span> <span class="qe__the">the</span> <span>Engineer.</span></h1>
      <p class="qe__lead">Curious about what I build, how I think, or the technologies I work with?</p>
      <p class="qe__desc">Explore my engineering profile through an interactive workspace. Discover my projects, technical skills, experience and approach to building intelligent systems.</p>
      <div class="qe__how" role="note">
        <p class="qe__how-h">${icon('lock')}How this works</p>
        <p>This is a portfolio assistant, not an AI chatbot. It matches your question against this portfolio’s own content, in your browser, and answers from it. Nothing you type is sent anywhere, and when the portfolio doesn’t cover something, it says so rather than guessing.</p>
      </div>
      <div class="qe__topics js-only">
        <h2 class="label qe__topics-h">Try asking</h2>
        <ul>
${kb.suggestions.map((q, i) => `          <li><button class="qe-topic" type="button" data-qe-ask="${esc(q)}"><span class="qe-topic__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(q)}</button></li>`).join('\n')}
        </ul>
      </div>
    </aside>

    <section class="qe__chat js-only" aria-labelledby="qe-chat-title">
      <header class="qe__chat-head">
        <span class="qe__status" aria-hidden="true"></span>
        <h2 class="qe__chat-title" id="qe-chat-title">Portfolio assistant</h2>
        <span class="qe__mode">Local · answers from portfolio data</span>
        <button class="qe__clear" type="button" data-qe-clear>Clear</button>
      </header>
      <div class="qe__log" data-qe-log role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">
        <div class="qe-msg qe-msg--a" data-qe-welcome><span class="qe-msg__who" aria-hidden="true">DF</span><article class="qe-ans">${renderAnswer(welcome, base)}</article></div>
      </div>
      <form class="qe__form" data-qe-form autocomplete="off">
        <label class="visually-hidden" for="qe-input">Your question</label>
        <input class="qe__input" id="qe-input" name="q" type="text" maxlength="200" placeholder="Ask about projects, experience, Snowflake, AI…" data-qe-input enterkeyhint="send" />
        <button class="qe__send" type="submit" aria-label="Ask">${icon('send')}<span aria-hidden="true">Ask</span></button>
      </form>
      <p class="qe__hint">Enter asks · ↑ recalls your last question</p>
    </section>

    <section class="qe__faq nojs-only" aria-labelledby="qe-faq-title">
      <h2 class="label" id="qe-faq-title">Answers to common questions</h2>
${kb.suggestions.map((q) => `      <details class="disclosure qe__faq-item"><summary>${esc(q)}</summary><article class="qe-ans">${renderAnswer(answer(q, kb), base, { follow: false })}</article></details>`).join('\n')}
    </section>
  </div>
</main>`;
};

// the homepage's invitation: a short sample exchange, then the way in
const queryPromo = ({ kb }) => {
  const sample = answer(kb.suggestions[2], kb);
  const firstItems = sample.blocks.find((b) => b.type === 'list').items.slice(0, 3);
  return `<section class="section qpromo" id="query" aria-labelledby="query-title">
  <div class="container qpromo__grid">
    <div class="qpromo__copy" data-reveal>
      <p class="sec-head__label"><b>08</b><span aria-hidden="true">//</span><span>Query the engineer</span></p>
      <h2 class="qpromo__title" id="query-title">Want to explore my <em>engineering mindset?</em></h2>
      <p class="qpromo__lede">Ask questions about my experience, projects and technical interests.</p>
      <a class="btn btn--primary qpromo__cta" href="query-engineer/">Explore Query the Engineer ${icon('arrowRight', 'i-move')}</a>
      <p class="qpromo__note">A local portfolio assistant: it answers from this portfolio’s content, not from an AI model.</p>
    </div>
    <div class="qpromo__demo" aria-hidden="true" data-reveal style="--i:1">
      <div class="qpromo__bubble qpromo__bubble--q">${esc(kb.suggestions[2])}</div>
      <div class="qpromo__bubble qpromo__bubble--a">
        <p class="qpromo__a-title">${esc(sample.title)}</p>
        <ul>${firstItems.map((i) => `<li><b>${esc(i.label)}</b> ${esc(i.text.length > 96 ? i.text.slice(0, 94).replace(/\s+\S*$/, '') + '…' : i.text)}</li>`).join('')}</ul>
      </div>
      <ul class="qpromo__chips">${[0, 3, 4].map((n) => `<li>${esc(kb.suggestions[n])}</li>`).join('')}</ul>
    </div>
  </div>
</section>`;
};

module.exports = { queryPage, queryPromo, renderAnswer, goText };
