// 09 · Establish connection: the conclusion. There is no form (no working submission
// back end exists), so the channels are direct: email, LinkedIn, GitHub, and the résumé.
const site = require('../data/site.js');
const { icon, ext } = require('./ui.js');

const channel = (ico, name, value, href, external) => {
  const inner = `<span class="ch__ico">${icon(ico)}</span><span class="ch__txt"><b>${name}</b><span>${value}</span></span>${icon(external ? 'arrowUpRight' : 'arrowRight', 'ch__go')}`;
  return `<li>${external ? ext(href, inner, 'ch') : `<a class="ch" href="${href}">${inner}</a>`}</li>`;
};

const contact = () => `<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="contact__signal" aria-hidden="true"><i></i><i></i><i></i></div>
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
      <div class="contact__actions">
        <a class="btn btn--primary" href="mailto:${site.email}">${icon('mail')}Send an email</a>
        ${ext(site.resume, `${icon('download')}Download Resume`, 'btn')}
      </div>
    </div>
    <div class="contact__panel" data-reveal style="--i:1">
      <p class="label contact__panel-h">Channels</p>
      <ul class="channels">
        ${channel('mail', 'Email', site.email, `mailto:${site.email}`, false)}
        ${channel('linkedin', 'LinkedIn', 'in/gaurang-ashava', site.linkedin, true)}
        ${channel('github', 'GitHub', 'gaurangg123', site.github, true)}
        ${channel('file', 'Résumé', 'View or download (Google Drive)', site.resume, true)}
      </ul>
      <p class="contact__where">${icon('pin')}${site.location} · IST (UTC+5:30)</p>
    </div>
  </div>
</section>`;

module.exports = { contact };
