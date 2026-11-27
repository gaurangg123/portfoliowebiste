// 08 · Interactive engineering terminal. The opening output is pre-rendered from
// the same command logic the browser uses, so it reads correctly without JavaScript.
const core = require('../scripts/terminal-core.js');
const { secHead, esc } = require('./ui.js');

const line = (segs) => `<p class="t-line">${segs.map((s) => {
  const cls = s.c ? ` class="t-${s.c}"` : '';
  if (s.href) return `<a${cls} href="${esc(s.href)}"${s.ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(s.t)}</a>`;
  return s.t ? `<span${cls}>${esc(s.t)}</span>` : '';
}).join('')}</p>`;
const echo = (prompt, cmd) => `<p class="t-line t-echo"><span class="t-prompt">${prompt}</span> <span>${esc(cmd)}</span></p>`;

const terminal = (data) => {
  const boot = ['whoami', 'help'].map((c) => echo(data.prompt, c) + core.run(c, data).lines.map(line).join('')).join('');
  return `<section class="section term-sec" id="terminal" aria-labelledby="terminal-title">
  <div class="container">
    ${secHead({ num: '08', label: 'Interactive terminal', id: 'terminal-title', title: 'Query the <em>engineer.</em>', lede: 'A working, simulated shell. It answers from this portfolio’s own data: nothing is executed and nothing leaves your browser.' })}
    <div class="term" data-term data-reveal>
      <div class="term__bar">
        <span class="term__dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="term__title">gaurang@dataforge: ~</span>
        <span class="term__badge">simulated · read-only</span>
      </div>
      <div class="term__body" data-term-body>
        <div class="term__out" role="log" aria-label="Terminal output" data-term-out>
          <p class="t-line t-dim">DataForge shell 2.0 · type a command, or pick one below.</p>
          ${boot}
          <p class="t-line t-dim nojs-only">Typing commands needs JavaScript; everything here is also on the page.</p>
        </div>
        <form class="term__line js-only" data-term-form autocomplete="off">
          <span class="term__prompt" aria-hidden="true">${data.prompt}</span>
          <input class="term__input" id="term-input" type="text" name="command" aria-label="Terminal command" aria-describedby="term-help" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" maxlength="80" />
          <button class="visually-hidden" type="submit" tabindex="-1">Run command</button>
        </form>
      </div>
    </div>
    <div class="term__under js-only">
      <p class="term__help" id="term-help">Enter a command. ↑ and ↓ recall earlier commands, Tab completes one, Ctrl+L clears.</p>
      <div class="term__chips" role="group" aria-label="Run a command">
${core.NAMES.filter((n) => n !== 'history').map((n) => `        <button type="button" class="term__chip" data-cmd="${n}">${n}</button>`).join('\n')}
      </div>
    </div>
    <script type="application/json" id="term-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
  </div>
</section>`;
};

module.exports = { terminal };
