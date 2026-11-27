// 09 · Establish connection. There is no form: no working submission back end
// exists, so the channels are direct (email, LinkedIn, GitHub) plus the résumé.
const site = require('../data/site.js');
const { icon, ext } = require('./ui.js');

const contact = () => `<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="container contact__grid">
    <div class="contact__main" data-reveal>
      <p class="sec-head__label"><b>09</b><span aria-hidden="true">//</span><span>Establish connection</span></p>
      <h2 class="contact__title" id="contact-title">Have a system <em>to build?</em></h2>
      <p class="contact__lede">Let’s transform ideas into intelligent solutions.</p>
      <div class="contact__email">
        <a class="contact__address" href="mailto:${site.email}">${site.email}</a>
        <button class="contact__copy js-only" type="button" data-copy="${site.email}">${icon('copy', 'i-copy')}${icon('check', 'i-done')}<span>Copy email</span></button>
        <span class="contact__copied" role="status" data-copy-status></span>
      </div>
      <ul class="contact__actions">
        <li><a class="btn btn--primary" href="mailto:${site.email}">${icon('mail')}Send an email</a></li>
        <li>${ext(site.linkedin, `${icon('linkedin')}LinkedIn`, 'btn')}</li>
        <li>${ext(site.github, `${icon('github')}GitHub`, 'btn')}</li>
        <li>${ext(site.resume, `${icon('download')}Download Resume`, 'btn')}</li>
      </ul>
    </div>
    <div class="contact__panel" aria-hidden="true">
      <div class="contact__rings"><i></i><i></i><i></i><span class="contact__core">${icon('mail')}</span></div>
      <div class="contact__log">
        <p><span class="t-k">$</span> connect --to gaurang</p>
        <p><span class="t-dim">› resolving channels</span> <span class="t-ok">ok</span></p>
        <p><span class="t-k">email   </span> ${site.email}</p>
        <p><span class="t-k">linkedin</span> /in/gaurang-ashava</p>
        <p><span class="t-k">github  </span> /gaurangg123</p>
        <p><span class="t-k">status  </span> <span class="t-ok">● listening</span></p>
      </div>
    </div>
  </div>
</section>`;

module.exports = { contact };
