// Generates the site's static pages: the homepage, the five case studies, 404.html and
// the /work/ redirect. Run from the repository root:   node tools/build.js
// No dependencies. GitHub Pages serves the generated HTML as-is; nothing runs there.
//
// Project facts (titles, summaries, status, contribution) live in P below. Walkthrough
// titles, durations and steps come from assets/walkthroughs/demos.js — the same file
// the player reads — so the pages and the walkthroughs can't disagree.
const fs = require('fs');
const path = require('path');
const { sculpture } = require('./sculpture.js');
const XP = require('./explain.js');

const REPO = path.resolve(__dirname, '..');
const SITE = 'https://gaurangg123.github.io/portfoliowebiste/';
const V = '17';                                   // cache-busting for css/js
const EMAIL = 'gaurangashava@gmail.com';
const GITHUB = 'https://github.com/gaurangg123';
const LINKEDIN = 'https://www.linkedin.com/in/gaurang-ashava/';
const RESUME = 'https://drive.google.com/file/d/1LbktI3_wzj6RZ04ig9SzPOV6p41pssqJ/view?usp=sharing';   // exactly as supplied

// walkthrough steps come from the same data the player uses
global.window = {};
require(path.join(REPO, 'assets/walkthroughs/demos.js'));
const DEMOS = global.window.PortfolioDemos;
for (const [slug, d] of Object.entries(DEMOS)) {
  if (d.duration % 1000) throw new Error(`${slug}: walkthrough duration must be whole seconds, so every place shows the same length`);
}

/* ---------- icons ---------- */
const I = {
  moon: '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"/></svg>',
  sun: '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
  play: '<svg class="i-play" viewBox="0 0 12 12" aria-hidden="true"><path d="M3.4 1.7v8.6L10.4 6z"/></svg>',
  pause: '<svg class="i-pause" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 1.6h2.4v8.8H2.6zM7 1.6h2.4v8.8H7z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  db: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13"/><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/></svg>',
  badge: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9.5" r="5.5"/><path d="M8.6 13.9 7.5 21l4.5-2.4 4.5 2.4-1.1-7.1"/><path d="m9.8 9.6 1.5 1.5 3-3.1"/></svg>',
  flake: '<svg viewBox="0 0 24 24"><path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5"/><path d="M9.6 4.1 12 6.5l2.4-2.4M9.6 19.9 12 17.5l2.4 2.4M4.6 10.4l3.3-.9-.9-3.3M19.4 13.6l-3.3.9.9 3.3M4.6 13.6l3.3.9-.9 3.3M19.4 10.4l-3.3-.9.9-3.3"/></svg>',
};
// the small red signature: a record with a data arc
const MARK = `<svg class="brand__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12.5" cy="12.8" r="10.6" fill="#6E1020"/><circle cx="12" cy="12" r="10.6" fill="#BB2436"/><path d="M12 4.2a7.8 7.8 0 0 1 7.6 6" fill="none" stroke="#F5B3AB" stroke-width="2"/><circle cx="12" cy="12" r="3.8" fill="#FFFEFA"/></svg>`;
// record thumbnail for the Papercut card
const THUMB = `<svg viewBox="0 0 56 56" focusable="false"><circle cx="28" cy="28" r="27" fill="#BB2436"/><g fill="none" stroke="#6E1020" stroke-opacity=".45" stroke-width=".8"><circle cx="28" cy="28" r="23"/><circle cx="28" cy="28" r="20.5"/><circle cx="28" cy="28" r="18"/><circle cx="28" cy="28" r="15.5"/></g><path d="M28 6.5a21.5 21.5 0 0 1 19.6 12.6" fill="none" stroke="#F5B3AB" stroke-width="2.4"/><circle cx="28" cy="28" r="9.5" fill="#FFFEFA"/><circle cx="28" cy="28" r="1.8" fill="#20201F"/></svg>`;
const ext = () => `<span class="visually-hidden"> (opens in a new tab)</span> <span class="arrow" aria-hidden="true">↗</span>`;

/* ---------- illustrations: noninteractive figures with sample content ---------- */
const ILL = {};
ILL.kp = `<div class="ill ill--kp" aria-hidden="true">
            <div class="ill__canvas">
              <div class="ui">
                <div class="ui__bar"><span class="ui__dots"><i></i><i></i><i></i></span><span class="ui__name">Knowledge portal</span><span class="ui__meta">Sample data</span></div>
                <div class="kp__body">
                  <ul class="kp__nav"><li class="is-on">Discover</li><li>Requests</li><li>Approvals</li><li>Assistant</li><li>Leaderboard</li></ul>
                  <div class="kp__main">
                    <p class="kp__query">3 results for <b>“onboarding”</b></p>
                    <ul class="kp__results">
                      <li><span class="file file--pdf">PDF</span><span><b>New joiner onboarding guide</b><small>HR · Onboarding</small></span></li>
                      <li><span class="file file--doc">DOC</span><span><b>Laptop and access setup</b><small>IT · Onboarding</small></span></li>
                      <li><span class="file file--xls">XLS</span><span><b>First-week checklist</b><small>HR · Templates</small></span></li>
                    </ul>
                  </div>
                  <div class="kp__chat">
                    <p class="kp__chat-h"><i></i>Assistant</p>
                    <p class="msg msg--me">Where's the onboarding guide for new joiners?</p>
                    <p class="msg msg--bot">It's in HR › Onboarding, titled “New joiner onboarding guide”.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

ILL.contract = `<div class="ill ill--contract" aria-hidden="true">
            <div class="ill__canvas">
              <div class="ui">
                <div class="ui__bar"><span class="ui__dots"><i></i><i></i><i></i></span><span class="ui__name">Contract review</span><span class="ui__meta">sample-services-agreement.pdf</span></div>
              <div class="ct">
                <div class="ct__doc">
                  <p class="ct__title">Master services agreement</p>
                  <p class="ct__p">Between <mark class="hl hl--key">Sample Client Pvt. Ltd.</mark> and <mark class="hl hl--key">Sample Supplier Ltd.</mark>, effective <mark class="hl hl--key">1 April 2025</mark>.</p>
                  <p class="ct__p"><b>7. Term.</b> This agreement runs for <mark class="hl hl--key">24 months</mark>.</p>
                  <p class="ct__p"><b>9. Reporting.</b> <mark class="hl hl--oblig">The Supplier shall deliver a monthly service report.</mark></p>
                  <p class="ct__p ct__extra"><b>12. Termination.</b> <span class="hl hl--clause">Either party may terminate with 60 days' written notice.</span></p>
                </div>
                <div class="ct__panel">
                  <p class="ct__h">Key information</p>
                  <dl class="ct__fields">
                    <div><dt>Parties</dt><dd>2</dd></div>
                    <div><dt>Effective</dt><dd>1 Apr 2025</dd></div>
                    <div><dt>Term</dt><dd>24 months</dd></div>
                  </dl>
                  <p class="ct__h">Clauses</p>
                  <p class="ct__list">Term · Reporting · Termination</p>
                  <p class="ct__h">Obligations</p>
                  <p class="ct__ob">Monthly service report · Supplier</p>
                  <p class="ct__track ct__extra">Tracked · term ends 31 Mar 2027</p>
                </div>
              </div>
              </div>
            </div>
          </div>`;

ILL.pipe = `<div class="ill ill--pipe" aria-hidden="true">
            <div class="ill__canvas">
              <ol class="pipe">
                <li class="pipe__node">${I.db}<span><b>Microsoft SQL Server</b><small>Traditional sources</small></span></li>
                <li class="pipe__step"><b>Extract</b></li>
                <li class="pipe__step"><b>Transform</b></li>
                <li class="pipe__step"><b>Validate</b></li>
                <li class="pipe__step"><b>Load</b></li>
                <li class="pipe__node pipe__node--dst">${I.flake}<span><b>Snowflake</b><small>Cloud data warehouse</small></span></li>
              </ol>
              <p class="pipe__infra">Azure Data Factory · supporting infrastructure</p>
              <div class="pipe__scope">
                <p class="pipe__scope-h">Also migrated</p>
                <ul>
                  <li><span class="pipe__ico pipe__ico--dash"></span>Dashboards</li>
                  <li><span class="pipe__ico pipe__ico--src"></span>Their underlying data sources</li>
                </ul>
              </div>
            </div>
          </div>`;

ILL.match = `<div class="ill ill--match" aria-hidden="true">
            <div class="ill__canvas">
              <div class="ui">
                <div class="ui__bar"><span class="ui__dots"><i></i><i></i><i></i></span><span class="ui__name">Resume matching</span><span class="ui__meta">Sample role</span></div>
              <div class="rm">
                <div class="rm__col">
                  <p class="rm__h">Role requirements</p>
                  <div class="rm__card"><b>Data Analyst</b><small>Sample role</small></div>
                  <ul class="rm__list">
                    <li><span>SQL</span><em>Required</em></li>
                    <li><span>Python</span><em>Required</em></li>
                    <li><span>Dashboards</span><em>Preferred</em></li>
                    <li><span>2+ years in analytics</span><em>Required</em></li>
                  </ul>
                </div>
                <div class="rm__col">
                  <p class="rm__h">Candidate profile</p>
                  <div class="rm__card"><b>Candidate A</b><small>Resume · 2 pages</small></div>
                  <ul class="rm__list">
                    <li class="is-yes"><span>Skills</span><em>Aligned</em></li>
                    <li class="is-yes"><span>Experience</span><em>Aligned</em></li>
                    <li><span>Dashboards</span><em>Partly aligned</em></li>
                  </ul>
                  <p class="rm__note">AI-assisted summary for the recruiter</p>
                </div>
              </div>
              </div>
            </div>
          </div>`;

// Business Sheet: the same sample series as its walkthrough (revenue, Org A · LOB 2, FY2014 → current FY)
const REV = [64, 70, 68, 76, 81, 79, 88, 96, 92, 108, 120, 132];
ILL.sheet = `<div class="ill ill--sheet" aria-hidden="true">
            <div class="ill__canvas">
              <div class="ui">
                <div class="ui__bar"><span class="ui__dots"><i></i><i></i><i></i></span><span class="ui__name">Business Sheet</span><span class="ui__meta">Sample data</span></div>
                <div class="bs__tools">
                  <span class="bs__pick"><small>Organization</small><b>Org A</b></span>
                  <span class="bs__pick"><small>Line of business</small><b>LOB 2</b></span>
                  <span class="bs__pick"><small>Financial years</small><b>FY2014 → Current FY</b></span>
                  <span class="bs__go">Generate charts</span>
                </div>
                <div class="bs">
                  <div class="bs__sheet">
                    <p class="bs__file">sample-data.xlsx</p>
                    <table>
                      <thead><tr><th scope="col">FY</th><th scope="col">Revenue</th></tr></thead>
                      <tbody>
                        <tr><td>FY2014</td><td>64</td></tr>
                        <tr><td>FY2015</td><td>70</td></tr>
                        <tr class="is-gap"><td>⋮</td><td>⋮</td></tr>
                        <tr><td>Current FY</td><td>132</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="bs__chart">
                    <div class="bs__head"><b>Revenue · Org A · LOB 2</b></div>
                    <div class="bs__plot">${REV.map((v, i) => `<i style="--h:${Math.round(v / 132 * 86)}%"${i === 0 || i === REV.length - 1 ? ` data-v="${v}"` : ''}></i>`).join('')}</div>
                    <div class="bs__axis"><span>FY2014</span><span>Current FY</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

/* ---------- small previews for the homepage cards ----------
   Schematic and decorative: shapes only, drawn in the site's colours. The detailed
   illustrations stay on the case studies and in the walkthroughs. */
const miniWin = (body) => `<svg viewBox="0 0 320 90" focusable="false">
            <rect class="m-win" x="14" y="12" width="292" height="100" rx="8"/>
            <circle class="m-dot" cx="26" cy="22" r="2.5"/><circle class="m-dot" cx="34" cy="22" r="2.5"/><circle class="m-dot" cx="42" cy="22" r="2.5"/>
            <path class="m-line" d="M14 32.5h292"/>
            ${body}
            </svg>`;
const MINI = {
  // a sidebar, search results and a chat beside them
  'knowledge-portal': miniWin(`<path class="m-pane" d="M14.5 33h55v57h-55z"/>
            <rect class="m-on" x="20" y="38" width="44" height="9" rx="4.5"/>
            ${[52, 61, 70, 79].map((y, i) => `<rect class="m-soft" x="25" y="${y}" width="${[30, 34, 28, 36][i]}" height="4" rx="2"/>`).join('')}
            <path class="m-line" d="M69.5 33v57"/>
            <rect class="m-field" x="80" y="39" width="124" height="10" rx="5"/>
            ${[55, 67, 79].map((y, i) => `<rect class="m-file m-file--${i + 1}" x="80" y="${y}" width="9" height="10" rx="1.5"/><rect class="m-ink" x="95" y="${y + 0.5}" width="${[74, 62, 68][i]}" height="4" rx="2"/><rect class="m-soft" x="95" y="${y + 6.5}" width="${[42, 50, 36][i]}" height="3" rx="1.5"/>`).join('')}
            <path class="m-pane" d="M214.5 33h91v57h-91z"/>
            <path class="m-line" d="M214.5 33v57"/>
            <rect class="m-me" x="246" y="40" width="52" height="11" rx="5.5"/>
            <rect class="m-bot" x="222" y="57" width="68" height="18" rx="6"/>
            <rect class="m-soft" x="228" y="64.5" width="44" height="3" rx="1.5"/>`),
  // selections, a Generate button, the sheet and the chart it produces
  'business-sheet': miniWin(`<rect class="m-field" x="24" y="38" width="46" height="11" rx="5.5"/>
            <rect class="m-field" x="76" y="38" width="46" height="11" rx="5.5"/>
            <rect class="m-field" x="128" y="38" width="62" height="11" rx="5.5"/>
            <rect class="m-btn" x="244" y="38" width="54" height="11" rx="5.5"/>
            <path class="m-line" d="M14 55.5h292"/>
            <path class="m-pane" d="M14.5 56h82v34h-82z"/>
            ${[62, 69, 76, 83].map((y, i) => `<rect class="${i ? 'm-soft' : 'm-ink'}" x="22" y="${y}" width="28" height="3" rx="1.5"/><rect class="${i ? 'm-soft' : 'm-ink'}" x="62" y="${y}" width="22" height="3" rx="1.5"/>`).join('')}
            <path class="m-line" d="M96.5 56v34"/>
            ${REV.map((v, i) => `<rect class="${i === REV.length - 1 || i === 0 ? 'm-bar m-bar--key' : 'm-bar'}" x="${110 + i * 15.6}" y="${(88 - v / 132 * 26).toFixed(1)}" width="10" height="${(v / 132 * 26).toFixed(1)}" rx="1.5"/>`).join('')}`),
  // a contract with highlights, and the key information drawn from it
  'contract-intelligence': miniWin(`<rect class="m-ink" x="26" y="39" width="92" height="5" rx="2.5"/>
            <rect class="m-key" x="64" y="47.5" width="54" height="9" rx="2"/>
            <rect class="m-oblig" x="24" y="65.5" width="122" height="9" rx="2"/>
            ${[[50, 150], [59, 162], [68, 140], [77, 156], [86, 118]].map(([y, w]) => `<rect class="m-soft" x="26" y="${y}" width="${w}" height="4" rx="2"/>`).join('')}
            <path class="m-clause" d="M26 83h110"/>
            <path class="m-pane" d="M206.5 33h99v57h-99z"/>
            <path class="m-line" d="M206.5 33v57"/>
            <rect class="m-ink" x="216" y="39" width="48" height="5" rx="2.5"/>
            ${[50, 60, 70].map((y, i) => `<rect class="m-soft" x="216" y="${y}" width="${[26, 30, 22][i]}" height="4" rx="2"/><rect class="m-ink" x="${[262, 258, 266][i]}" y="${y}" width="${[32, 36, 28][i]}" height="4" rx="2"/>`).join('')}
            <rect class="m-oblig" x="214" y="79" width="78" height="9" rx="3"/>`),
  // role requirements beside a candidate profile, row by row
  'resume-matching': miniWin(`<rect class="m-ink" x="26" y="39" width="58" height="5" rx="2.5"/>
            ${[50, 60, 70, 80].map((y, i) => `<rect class="m-soft" x="26" y="${y}" width="${[64, 56, 72, 60][i]}" height="4" rx="2"/><rect class="${i === 3 ? 'm-field' : 'm-key'}" x="112" y="${y - 1.5}" width="30" height="7" rx="3.5"/>`).join('')}
            ${[50, 60, 70, 80].map((y) => `<path class="m-dash" d="M146 ${y + 2}h26"/>`).join('')}
            <path class="m-pane" d="M176.5 33h129v57h-129z"/>
            <path class="m-line" d="M176.5 33v57"/>
            <rect class="m-ink" x="186" y="39" width="52" height="5" rx="2.5"/>
            ${[50, 60, 70, 80].map((y, i) => `<circle class="${i === 3 ? 'm-part' : 'm-ok'}" cx="191" cy="${y + 2}" r="3.2"/><rect class="m-soft" x="199" y="${y}" width="${[78, 70, 62, 84][i]}" height="4" rx="2"/>`).join('')}`),
  // source to warehouse through four stages, with dashboards and data sources alongside
  'data-migration': `<svg viewBox="0 0 320 90" focusable="false">
            <path class="m-track" d="M58 30H262"/>
            <rect class="m-win" x="22" y="14" width="36" height="32" rx="8"/>
            <path class="m-ico" d="M32 23.5c0-1.6 3.6-2.6 8-2.6s8 1 8 2.6-3.6 2.6-8 2.6-8-1-8-2.6zM32 23.5v12c0 1.6 3.6 2.6 8 2.6s8-1 8-2.6v-12M32 29.5c0 1.6 3.6 2.6 8 2.6s8-1 8-2.6"/>
            ${[100, 140, 180, 220].map((x) => `<circle class="m-stage" cx="${x}" cy="30" r="6.5"/>`).join('')}
            <rect class="m-win" x="262" y="14" width="36" height="32" rx="8"/>
            <path class="m-flake" d="M280 19v22M270.5 24.5l19 11M270.5 35.5l19-11"/>
            <rect class="m-scope" x="96" y="58" width="128" height="22" rx="6"/>
            <rect class="m-field" x="106" y="64" width="12" height="10" rx="2"/><rect class="m-soft" x="122" y="67" width="30" height="4" rx="2"/>
            <rect class="m-field" x="162" y="64" width="12" height="10" rx="2"/><rect class="m-soft" x="178" y="67" width="34" height="4" rx="2"/>
          </svg>`,
  // the overview: three cards and two more entries
  all: `<svg viewBox="0 0 320 90" focusable="false">
            ${[22, 120, 218].map((x) => `<rect class="m-win" x="${x}" y="14" width="80" height="42" rx="6"/><rect class="m-pane" x="${x + 5}" y="19" width="70" height="14" rx="3"/><rect class="m-ink" x="${x + 6}" y="39" width="44" height="4" rx="2"/><rect class="m-soft" x="${x + 6}" y="47" width="58" height="3" rx="1.5"/>`).join('')}
            ${[66, 78].map((y) => `<rect class="m-soft" x="22" y="${y}" width="128" height="4" rx="2"/><rect class="m-soft" x="170" y="${y}" width="128" height="4" rx="2"/>`).join('')}
          </svg>`,
};

/* ---------- shared chrome ---------- */
const themeScript = (legacy) => `<script>
(function (d, r) {
${legacy ? `  /* old shareable track links (#/trk-01 … #/trk-05) now have real pages */
  var m = location.hash.match(/^#\\/trk-0([1-5])$/);
  if (m) { location.replace('work/' + ['knowledge-portal', 'business-sheet', 'contract-intelligence', 'resume-matching', 'data-migration'][m[1] - 1] + '/'); return; }
` : ''}  r.className += ' js';
  var t = null;
  try { t = localStorage.getItem('theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', t);
  d.getElementById('themeColor').setAttribute('content', t === 'dark' ? '#1A1918' : '#F6F4EE');
})(document, document.documentElement);
</script>`;

const head = ({ base, title, description, url, ogType = 'website', ogTitle, ogDescription, legacy = false, extra = '', robots = '' }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="author" content="Gaurang Ashava" />
${robots}<meta name="color-scheme" content="light dark" />
<meta name="theme-color" id="themeColor" content="#F6F4EE" />
${url ? `<link rel="canonical" href="${url}" />

<meta property="og:type" content="${ogType}" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${ogTitle || title}" />
<meta property="og:description" content="${ogDescription || description}" />
<meta property="og:image" content="${SITE}assets/og.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Gaurang Ashava — Data systems. AI applications. Built to be used." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${ogTitle || title}" />
<meta name="twitter:description" content="${ogDescription || description}" />
<meta name="twitter:image" content="${SITE}assets/og.jpg" />
` : ''}
<link rel="icon" href="${base}assets/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png" />

${themeScript(legacy)}
<link rel="stylesheet" href="${base}portfolio.css?v=${V}" />
<script src="${base}portfolio.js?v=${V}" defer></script>
${extra}</head>`;

// sections in page order; menuOnly links appear in the small-screen menu but not the desktop bar
const NAV = [['work', 'Work'], ['about', 'About'], ['experience', 'Experience'], ['education', 'Education', true], ['certifications', 'Certifications', true], ['experiments', 'Experiments', true], ['contact', 'Contact']];
const navBar = ({ home, base, music = false }) => {
  const h = home ? '' : base;
  return `<a class="skip" href="#main">Skip to content</a>

<header class="site-nav" data-nav>
  <div class="container nav">
    <a class="brand" href="${home ? '#top' : base}">${MARK}<span class="brand__name">Gaurang Ashava</span></a>
${music ? `    <button class="music-mini js-only" type="button" data-music-mini aria-label="Pause Papercut (instrumental)" hidden>${I.play}${I.pause}<span class="music-mini__txt">Papercut</span></button>
` : ''}    <button class="icon-btn nav__menu-btn js-only" type="button" data-menu-btn aria-expanded="false" aria-controls="nav-panel">Menu</button>
    <div class="nav__panel" id="nav-panel">
      <nav aria-label="Main">
        <ul class="nav__links">
${NAV.map(([id, label, menuOnly]) => `          <li${menuOnly ? ' class="nav__extra"' : ''}><a href="${h}#${id}">${label}</a></li>`).join('\n')}
          <li><a href="${RESUME}" target="_blank" rel="noopener noreferrer">Resume<span class="visually-hidden"> (opens in a new tab)</span> <span class="nav__ext" aria-hidden="true">↗</span></a></li>
        </ul>
      </nav>
      <button class="icon-btn theme-btn js-only" type="button" data-theme-toggle>${I.moon}${I.sun}<span class="theme-btn__txt">Switch to dark theme</span></button>
    </div>
  </div>
</header>`;
};

const footer = ({ links = true } = {}) => `<footer class="site-footer${links ? '' : ' site-footer--joined'}">
  <div class="container">
    <div class="footer">
      <p>© <span data-year>2026</span> Gaurang Ashava · Pune, India</p>
      <ul class="footer__links">
${links ? `        <li><a href="mailto:${EMAIL}">Email</a></li>
        <li><a href="${GITHUB}" target="_blank" rel="noopener noreferrer">GitHub<span class="visually-hidden"> (opens in a new tab)</span></a></li>
        <li><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn<span class="visually-hidden"> (opens in a new tab)</span></a></li>
` : ''}        <li><a href="#top">Back to top</a></li>
      </ul>
    </div>
  </div>
</footer>`;

/* ---------- projects (documented facts only) ---------- */
const steps = (items) => `<ol class="steps">
${items.map(([b, t]) => `              <li><span><b>${b}</b><span>${t}</span></span></li>`).join('\n')}
            </ol>`;
// Titles come from demos.js (one source for the pages and the walkthroughs).
// Contribution and status are stated only where they are confirmed.
const P = {
  'knowledge-portal': {
    kicker: 'Knowledge platform',
    role: 'Owned the build, spec to UAT',
    status: ['scheduled', 'Production deployment scheduled'],
    summary: 'One platform for knowledge discovery, requests, an AI chatbot, approvals and leaderboards.',
    lede: 'An enterprise knowledge platform combining discovery, knowledge requests, an AI chatbot, approval workflows, and leaderboards. I owned its build, from the functional specification through UAT.',
    description: 'Enterprise Knowledge Portal, developed end to end by Gaurang Ashava: knowledge discovery, knowledge requests, an AI chatbot, an approval queue and leaderboards, with sharing and role-based access. Production deployment is scheduled.',
    facts: [['My contribution', 'Owned the full build, from functional spec to UAT'], ['Status', '<span class="status-dot status-dot--scheduled">Production deployment scheduled</span>']],
    visual: ILL.kp,
    problem: `<p>Make organizational knowledge easier to discover and use through a shared platform with role-based access. It serves four roles: Viewer, User, Admin and Champion.</p>`,
    contribution: `<p>I developed the Enterprise Knowledge Portal end to end, starting from the supplied functional specification document. I implemented the application and incorporated business feedback during UAT. Production deployment is scheduled.</p>
            ${XP.kpTimeline()}`,
    explain: ['How it works', `${XP.kpMap()}
        <p class="xp__foot">The chatbot is one capability of the platform, not the whole product.</p>`],
    outcome: ['Outcome and current status', `<p>The application brings these knowledge workflows into one place and has been refined through business feedback during UAT. Production deployment is scheduled.</p>`],
    walk: 'It follows a sample user through discovery, a knowledge request, the approval queue, the chatbot and a leaderboard.',
    tech: null,
  },
  'business-sheet': {
    kicker: 'Enterprise analytics',
    role: 'Owned the full build',
    status: ['uat', 'In UAT'],
    summary: 'Turns manual Excel reporting into customisable charts and comparisons, with a metrics chatbot.',
    lede: 'Automates the manual Excel work behind organization and line-of-business reporting: meaningful charts and financial-year comparisons, from FY2014 to the current financial year, with a chatbot that explains the metrics. I built it end to end, from chart generation to the metrics chatbot.',
    description: 'Business Sheet, built end to end by Gaurang Ashava: turns manual Excel reporting into customisable charts and financial-year comparisons, from FY2014 to the current financial year, with a chatbot that helps users understand the tracked metrics. Currently undergoing user acceptance testing (UAT).',
    facts: [['My contribution', 'Owned the full build'], ['Status', '<span class="status-dot status-dot--scheduled">In UAT</span>'], ['Compares', 'FY2014 to the current FY']],
    visual: ILL.sheet,
    problem: `<p>Preparing and comparing information from Excel required manual work, making it cumbersome to turn the data into useful views.</p>`,
    contribution: `<p>I built Business Sheet end to end: the selections, chart generation and customisation, and the chatbot that explains the metrics. It is currently undergoing user acceptance testing (UAT).</p>`,
    explain: ['How it works', XP.bsSheet()],
    outcome: ['Outcome and current status', `<p>Users can generate and customise useful views through button-driven actions instead of repeatedly assembling them manually in Excel.</p>
        <p>Built end to end and currently undergoing user acceptance testing (UAT).</p>`],
    walk: 'It shows sample Excel data becoming a chart, a changed selection and a chatbot explanation of a metric.',
    tech: null,
  },
  'contract-intelligence': {
    kicker: 'Document intelligence',
    summary: 'Helps legal teams analyze and track uploaded contracts, extracting clauses, obligations and key information.',
    lede: 'An AI-powered application for legal teams to analyze and track uploaded contracts and extract important contractual information.',
    description: 'AI Legal Contract Intelligence: an application that helps legal teams analyze and track uploaded contracts, identify clauses and extract obligations and key information.',
    facts: [['For', 'Legal teams'], ['Type', 'Generative AI application']],
    visual: ILL.contract,
    problem: `<p>Legal teams need to identify and review the clauses, obligations and important information in each contract, and keep track of their contracts.</p>`,
    contribution: `<p>I developed an AI-powered application that helps legal teams analyze and track uploaded contracts. It extracts clauses, obligations and other key information to support their review.</p>`,
    explain: ['How it works', XP.ciDoc()],
    outcome: ['Outcome', `<p>Legal teams get each contract’s clauses, obligations and key information as a structured summary to review, and their contracts are tracked in the application.</p>`],
    walk: 'It shows a fictional contract being analyzed, with its clauses, obligations and key details highlighted and summarized for review.',
    tech: null,
  },
  'resume-matching': {
    kicker: 'Recruitment AI',
    role: 'Original proof of concept',
    status: ['live', 'Live in production'],
    summary: 'Evaluates candidate profiles against role requirements.',
    lede: 'An AI-powered solution that evaluates candidate profiles against role requirements. It’s live in production.',
    description: 'AI Resume Matching: an AI-powered solution, live in production, that evaluates candidate profiles against role requirements. Gaurang Ashava developed its original proof of concept.',
    facts: [['My contribution', 'Original proof of concept'], ['Status', '<span class="status-dot">Live in production</span>']],
    visual: ILL.match,
    problem: `<p>Recruiters need to compare each candidate’s profile with what a role requires.</p>`,
    contribution: `<p>I developed the original proof of concept for this solution. The solution has since gone live in production.</p>`,
    explain: ['How it works', XP.rmMatrix()],
    outcome: ['Outcome and current status', `<p>Candidate profiles are compared with role requirements on skills and experience, supporting the people who make the decision. The solution is live in production.</p>`],
    walk: 'It shows a fictional role and profile compared, requirement by requirement, for a recruiter to review.',
    tech: null,
  },
  'data-migration': {
    kicker: 'Data engineering',
    role: 'Contributor to a team initiative',
    status: ['done', 'Completed'],
    summary: 'Migrated data, dashboards and their underlying data sources from SQL Server to Snowflake.',
    lede: 'A major enterprise initiative to move different types of data from traditional Microsoft SQL Server environments into a Snowflake data warehouse. The initiative also involved migrating dashboards and their underlying data sources. The migration is complete.',
    description: 'Enterprise Data Migration: moving different types of data from Microsoft SQL Server into Snowflake through extract, transform, validate and load stages, and migrating dashboards and their underlying data sources. A completed team initiative Gaurang Ashava contributed to.',
    facts: [['My contribution', 'Contributor to a team initiative'], ['Status', '<span class="status-dot">Completed</span>'], ['From → to', 'SQL Server → Snowflake']],
    visual: ILL.pipe,
    problem: `<p>Different types of enterprise data held in traditional Microsoft SQL Server environments needed to move into a cloud data warehouse, Snowflake.</p>`,
    contribution: `<p>This was a team initiative, and I was one of its contributors.</p>`,
    explain: ['How the migration works', `${XP.dmFlow()}
        <p class="xp__foot">Validation is its own stage, between transformation and loading, so problems surface before data reaches the warehouse.</p>`],
    outcome: ['Outcome and current status', `<p>The migration is complete. Data moved from traditional Microsoft SQL Server environments into Snowflake, and the initiative also covered dashboards and their underlying data sources.</p>`],
    walk: 'It follows sample data from SQL Server through extraction, transformation, validation and loading into Snowflake, alongside dashboards and their data sources.',
    tech: ['Microsoft SQL Server', 'Snowflake', 'Azure Data Factory', 'ETL', 'Data integration', 'Data transformation', 'Data quality'],
  },
};
for (const slug of Object.keys(P)) P[slug].title = DEMOS[slug].title;
// homepage order: featured first, then More work; case-study previous/next follow it too
const FEATURED = ['knowledge-portal', 'business-sheet', 'contract-intelligence'];
const MORE = ['resume-matching', 'data-migration'];
const ORDER = FEATURED.concat(MORE);

const DEMO_NOTE = 'Illustrative walkthrough · sample data';
const secs = (slug) => String(Math.round(DEMOS[slug].duration / 1000)).padStart(2, '0');
// a case study's walkthrough preview: the illustration with a real button over it that opens the walkthrough
const preview = (slug) => `<figure class="walk__figure demo-preview">
          <div class="demo-preview__frame">
          ${P[slug].visual}
            <button class="demo-preview__btn js-only" type="button" data-demo="${slug}" aria-haspopup="dialog"><span class="demo-preview__bar"><span class="demo-preview__cta">${I.play}<span>Watch walkthrough</span></span><span class="visually-hidden">: ${P[slug].title} (${secs(slug)} seconds)</span><span class="demo-preview__len" aria-hidden="true">0:${secs(slug)}</span></span></button>
          </div>
          <figcaption class="figure-note"><span class="js-only">${DEMO_NOTE}</span><span class="nojs-only">${slug === 'data-migration' ? 'Illustrative diagram · documented stages' : 'Illustrative interface · sample content'}</span><span class="demo-status" data-demo-status role="status"></span></figcaption>
        </figure>`;
const demoButton = (slug) => `<button class="demo-btn js-only" type="button" data-demo="${slug}" aria-haspopup="dialog">${I.play}<span>Watch walkthrough</span><span class="visually-hidden">: ${P[slug].title}</span></button>`;

// a section's heading: a small index number (decorative), the title and an optional lede
const panelHead = (num, id, title, lede = '') => `<header class="panel__head">
      <p class="panel__num" aria-hidden="true">${num}</p>
      <h2 class="section__title" id="${id}">${title}</h2>${lede ? `
      <p class="section__lede">${lede}</p>` : ''}
    </header>`;
// confirmed contribution and status, labelled; nothing for projects without them
const facts = (slug) => {
  const p = P[slug], rows = [];
  if (p.role) rows.push(['My contribution', p.role]);
  if (p.status) rows.push(['Status', `<span class="status-dot${p.status[0] === 'scheduled' || p.status[0] === 'uat' ? ' status-dot--scheduled' : ''}">${p.status[1]}</span>`]);   // scheduled or in UAT: a ring; live or completed: filled
  return rows.length ? `<dl class="project__facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : '';
};
// the same two actions everywhere: the case study first, then the walkthrough
const actions = (slug, cls) => `<div class="${cls}"><a class="act-case" href="work/${slug}/">View case study<span class="visually-hidden">: ${P[slug].title}</span> <span class="arrow" aria-hidden="true">→</span></a>${demoButton(slug)}<span class="demo-status" data-demo-status role="status"></span></div>`;
const moreItem = (slug) => `        <li class="more__item">
          <p class="project__cat">${P[slug].kicker}</p>
          <h4 class="more__name">${P[slug].title}</h4>
          <p class="more__desc">${P[slug].summary}</p>
          ${facts(slug)}
          ${actions(slug, 'more__actions')}
        </li>`;
const tile = (slug) => `      <article class="project">
        <div class="project__mini mini" aria-hidden="true">
          ${MINI[slug]}
          <span class="project__tag">Illustration</span>
        </div>
        <div class="project__body">
          <p class="project__cat">${P[slug].kicker}</p>
          <h3 class="project__title">${P[slug].title}</h3>
          <p class="project__summary">${P[slug].summary}</p>
          ${facts(slug)}
          ${actions(slug, 'project__actions')}
        </div>
      </article>`;

/* ---------- homepage ---------- */
const home = `${head({
  base: '',
  title: 'Gaurang Ashava | Data &amp; AI Engineer',
  description: 'Gaurang Ashava is a Data &amp; AI Engineer in Pune who builds data pipelines and AI applications at Tata Technologies.',
  url: SITE,
  ogTitle: 'Gaurang Ashava — Data &amp; AI Engineer',
  ogDescription: 'Data systems. AI applications. Built to be used. I build data pipelines and AI applications at Tata Technologies.',
  legacy: true,
  extra: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Person","name":"Gaurang Ashava","jobTitle":"GET – Data and AI Engineer","url":"${SITE}","email":"mailto:${EMAIL}","image":"${SITE}assets/gaurang.jpg","address":{"@type":"PostalAddress","addressLocality":"Pune","addressCountry":"IN"},"worksFor":{"@type":"Organization","name":"Tata Technologies"},"alumniOf":{"@type":"CollegeOrUniversity","name":"SRM Institute of Science and Technology"},"sameAs":["${LINKEDIN}","${GITHUB}"]}
</script>
`,
})}
<body>
${navBar({ home: true, music: true })}

<main id="main">

<!-- 1 · Introduction -->
<section class="panel panel--intro hero" id="top" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__text">
      <h1 class="hero__title" id="hero-title">
        <span class="hero__id"><i aria-hidden="true"></i>Gaurang Ashava <span class="hero__role">· Data &amp; AI Engineer</span><span class="visually-hidden">.</span></span>
        <span class="hero__headline"><span>Data systems.</span> <span>AI applications.</span> <span>Built to be used.</span></span>
      </h1>
      <p class="hero__intro">I’m Gaurang. I build data pipelines and AI applications at Tata Technologies.</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#work">Explore selected work <span class="arrow" aria-hidden="true">↓</span></a>
        <p class="hero__place">${I.pin}Pune, India</p>
      </div>
    </div>
    <div class="hero__art">
      ${sculpture({ id: 'hero' })}
    </div>
  </div>
</section>

<!-- 2 · Selected work -->
<section class="panel panel--work work" id="work" aria-labelledby="work-title">
  <div class="container">
    ${panelHead('01', 'work-title', 'Selected work')}

    <div class="work__grid">
${FEATURED.map((slug) => tile(slug)).join('\n\n')}
    </div>

    <div class="more">
      <h3 class="more__title">More work</h3>
      <ul class="more__list">
${MORE.map(moreItem).join('\n')}
      </ul>
    </div>
  </div>
</section>

<!-- 3 · About -->
<section class="panel panel--about about" id="about" aria-labelledby="about-title">
  <div class="container">
    <div class="about__grid">
      <figure class="about__photo">
        <picture>
          <source type="image/webp" srcset="assets/gaurang-480.webp 480w, assets/gaurang-800.webp 800w, assets/gaurang-1200.webp 1200w" sizes="(min-width: 1296px) 470px, (min-width: 900px) 38vw, calc(100vw - 40px)" />
          <img src="assets/gaurang.jpg" width="900" height="1200" alt="Gaurang Ashava sitting on a grassy hillside with wind turbines behind him" loading="lazy" decoding="async" />
        </picture>
      </figure>

      <div class="about__body">
        ${panelHead('02', 'about-title', 'About')}
        <div class="about__intro">
          <p>I’m Gaurang, GET – Data and AI Engineer at Tata Technologies in Pune. I joined in October 2025 after a B.Tech in computer science with a specialization in big data analytics.</p>
          <p>I work across data engineering and applied AI, and I like taking an idea from data, to AI, to an application people use. Next, I want to go deeper into agentic coding, managing AI agents and tailoring LLMs to business use cases.</p>
          <p class="about__links"><a class="link-more" href="${RESUME}" target="_blank" rel="noopener noreferrer">View resume<span class="visually-hidden"> (opens in a new tab)</span> <span class="arrow" aria-hidden="true">↗</span></a></p>
        </div>

        <div class="music" data-music-card>
          <div class="music__thumb" aria-hidden="true">${THUMB}</div>
          <div class="music__meta">
            <p class="music__title">Papercut</p>
            <p class="music__artist">Linkin Park · instrumental</p>
          </div>
          <button class="music__btn js-only" type="button" data-music>${I.play}${I.pause}<span class="music__label">Play</span><span class="visually-hidden"> Papercut by Linkin Park (instrumental)</span></button>
          <p class="music__status" id="music-status" role="status"></p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 4 · Experience -->
<section class="panel panel--experience" id="experience" aria-labelledby="experience-title">
  <div class="container panel__split">
    ${panelHead('03', 'experience-title', 'Experience')}
    <ol class="rows">
      <li class="row row--now">
        <p class="row__when">Oct 2025 – now</p>
        <div class="row__body">
          <h3 class="row__title">GET – Data and AI Engineer</h3>
          <p class="row__org">Tata Technologies · Pune</p>
          <p class="row__lede">Working across data engineering, Generative AI, enterprise applications and cloud data platforms to build practical data and AI solutions.</p>
          <ul class="row__list">
            <li>Owned the Knowledge Portal build, from the supplied FSD through UAT.</li>
            <li>Built Business Sheet end to end; contributed to a Snowflake migration.</li>
            <li>Developed the original Resume Matching POC; the solution is now live.</li>
          </ul>
          <details class="row__more">
            <summary>More responsibilities<span class="visually-hidden"> at Tata Technologies</span></summary>
            <ul class="row__list">
              <li>Enterprise Knowledge Portal: production deployment is scheduled.</li>
              <li>Business Sheet: built end to end and currently undergoing user acceptance testing (UAT).</li>
              <li>The completed migration, a team initiative, moved data from Microsoft SQL Server to Snowflake, along with dashboards and their underlying data sources.</li>
              <li>Building AI-powered applications, including enterprise chatbots, knowledge platforms and intelligent document solutions, and full-stack applications that connect data, AI, backend logic and user-facing experiences.</li>
              <li>Exploring and applying AI agents and automation to improve engineering workflows and productivity.</li>
            </ul>
          </details>
        </div>
      </li>
      <li class="row">
        <p class="row__when">Dec 2023 – Jan 2024</p>
        <div class="row__body">
          <h3 class="row__title">Training Internship – Data Analytics</h3>
          <p class="row__org">Vertisystem · Indore</p>
          <p class="row__lede">Data analytics training: SQL analysis, data collection and reporting.</p>
          <ul class="row__list">
            <li>Developed and executed SQL queries across databases.</li>
            <li>Created analytical reports and documentation.</li>
          </ul>
          <details class="row__more">
            <summary>More responsibilities<span class="visually-hidden"> at Vertisystem</span></summary>
            <ul class="row__list">
              <li>Worked on data analytics use cases and SQL-based analysis.</li>
              <li>Worked on web scraping and data collection.</li>
            </ul>
          </details>
        </div>
      </li>
      <li class="row">
        <p class="row__when">Jun – Jul 2023</p>
        <div class="row__body">
          <h3 class="row__title">Software Developer Intern / L1</h3>
          <p class="row__org">Swap Infotech · Indore</p>
          <p class="row__lede">Front-end development on live web projects, in an Agile team.</p>
          <ul class="row__list">
            <li>Contributed to live web projects using AngularJS, HTML, CSS and JavaScript.</li>
            <li>Debugged and tested web applications.</li>
          </ul>
          <details class="row__more">
            <summary>More responsibilities<span class="visually-hidden"> at Swap Infotech</span></summary>
            <ul class="row__list">
              <li>Worked in an Agile environment using Jira.</li>
              <li>Created client-facing documentation.</li>
            </ul>
          </details>
        </div>
      </li>
    </ol>
  </div>
</section>

<!-- 5 · Education -->
<section class="panel panel--education" id="education" aria-labelledby="education-title">
  <div class="container panel__split">
    ${panelHead('04', 'education-title', 'Education')}
    <div class="edu">
      <p class="edu__when">2021 – 2025</p>
      <h3 class="edu__title">B.Tech, Computer Science Engineering</h3>
      <p class="edu__org">SRM Institute of Science &amp; Technology</p>
      <dl class="facts edu__facts">
        <div><dt>Specialization</dt><dd>Big Data Analytics</dd></div>
        <div><dt>CGPA</dt><dd>8.68 / 10</dd></div>
      </dl>
    </div>
  </div>
</section>

<!-- 6 · Certifications -->
<section class="panel panel--certs" id="certifications" aria-labelledby="certifications-title">
  <div class="container panel__split">
    ${panelHead('05', 'certifications-title', 'Certifications')}
    <ul class="certs">
      <li class="cert">
        <span class="cert__icon">${I.badge}</span>
        <div>
          <h3 class="cert__title">Snowflake foundational badges</h3>
          <p class="cert__note">Core data warehousing and platform concepts.</p>
        </div>
      </li>
      <li class="cert">
        <span class="cert__icon">${I.badge}</span>
        <div>
          <h3 class="cert__title">Snowflake Ascent</h3>
          <p class="cert__note">Hands-on training in the AI Data Cloud.</p>
        </div>
      </li>
    </ul>
  </div>
</section>

<!-- 7 · Experiments -->
<section class="panel panel--lab lab" id="experiments" aria-labelledby="lab-title">
  <div class="container">
    ${panelHead('06', 'lab-title', 'Experiments', 'Two AI agents I built to make engineering work faster.')}
    <div class="lab__grid">
      <article class="exp">
        <h3 class="exp__title">Bug Detailer</h3>
        <p class="exp__what">An AI agent reads a screenshot and a short description of an issue together, and writes a structured, detailed bug report.</p>
        <figure class="exp__sample">
          <div class="exp__io">
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
          </div>
          <figcaption class="exp__note">A sample input and output, for illustration. Not a live tool.</figcaption>
        </figure>
      </article>
      <article class="exp">
        <h3 class="exp__title">Web App Builder</h3>
        <p class="exp__what">An AI agent works out how existing code is built, then adapts it to the logic it should follow. It assists development rather than building software on its own.</p>
        <figure class="exp__sample">
          <div class="exp__io">
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
          </div>
          <figcaption class="exp__note">A sample input and output, for illustration. Not a live tool.</figcaption>
        </figure>
      </article>
    </div>
    <p class="lab__note"><b>Built by me, with AI.</b> I built both tools myself, with AI as my co-developer at every step.</p>
  </div>
</section>

<!-- 8 · Contact -->
<section class="panel panel--contact contact" id="contact" aria-labelledby="contact-title">
  <div class="container">
    ${panelHead('07', 'contact-title', 'Get in touch', 'Have an interesting problem, idea, or opportunity? I’d love to hear about it.')}
    <p class="contact__email">
      <a href="mailto:${EMAIL}">${EMAIL}</a>
      <button class="copy-btn js-only" type="button" data-copy="${EMAIL}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg><span>Copy email</span></button>
      <span class="copy-status" role="status" data-copy-status></span>
    </p>
    <ul class="contact__links">
      <li><a href="${GITHUB}" target="_blank" rel="noopener noreferrer">GitHub${ext()}</a></li>
      <li><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn${ext()}</a></li>
    </ul>
  </div>
</section>

</main>

${footer({ links: false })}

<!-- Papercut (instrumental). Silent until someone presses Play; the file isn't requested before that. -->
<audio id="papercut" data-src="assets/papercut-instrumental.mp3?v=2" preload="none"></audio>
</body>
</html>
`;

/* ---------- case studies ----------
   Overview (the header), problem, my contribution where confirmed, a visual
   explanation, outcome and status, a short invitation to the walkthrough, then
   two cards to another project. */
// previous / next: whole cards are single links; at either end, "All projects" keeps two cards
const navCard = ({ href, rel, dir, back, title, desc, mini }) => `        <a class="nav-card${back ? ' nav-card--back' : ''}" href="${href}"${rel ? ` rel="${rel}"` : ''}>
          <span class="nav-card__mini mini" aria-hidden="true">${mini}</span>
          <span class="nav-card__body">
            <span class="nav-card__dir">${back ? '<span class="arrow" aria-hidden="true">←</span> ' : ''}${dir}${back ? '' : ' <span class="arrow" aria-hidden="true">→</span>'}</span>
            <span class="nav-card__title">${title}</span>
            <span class="nav-card__desc">${desc}</span>
          </span>
        </a>`;
const ALL = { href: '../../#work', title: 'All projects', desc: 'Every project on one page, with its walkthrough.', mini: MINI.all };
const caseNav = (prev, next) => `      <nav class="case-next" aria-labelledby="next-label">
        <p class="case-next__label" id="next-label">Explore another project</p>
        <div class="case-next__grid">
${prev ? navCard({ href: `../${prev}/`, rel: 'prev', dir: 'Previous project', back: true, title: P[prev].title, desc: P[prev].summary, mini: MINI[prev] })
       : navCard({ ...ALL, dir: 'Overview', back: true })}
${next ? navCard({ href: `../${next}/`, rel: 'next', dir: 'Next project', title: P[next].title, desc: P[next].summary, mini: MINI[next] })
       : navCard({ ...ALL, dir: 'Overview' })}
        </div>
      </nav>`;
const casePage = (slug) => {
  const p = P[slug], d = DEMOS[slug];
  const i = ORDER.indexOf(slug);
  const prev = ORDER[i - 1], next = ORDER[i + 1];
  const base = '../../';
  const sid = (h) => `${slug}-${h.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, '')}`;
  const sec = (h, body, mod = '') => `      <section class="case-sec${mod}" aria-labelledby="${sid(h)}">
        <h2 class="case-sec__h" id="${sid(h)}">${h}</h2>
        <div class="case-sec__body">
            ${body}
        </div>
      </section>`;
  const walk = `<div class="walk">
          ${preview(slug)}
          <div class="walk__text">
            <p class="walk__lede">${p.walk}</p>
            <p class="walk__meta"><span>${Math.round(d.duration / 1000)} seconds</span><span>Silent</span><span>Pause, replay or choose a step</span></p>
            <details class="walk__alt">
              <summary>Read the walkthrough as text</summary>
              ${steps(d.scenes.map((x) => [x.title, x.text]))}
            </details>
          </div>
        </div>`;
  const sections = [
    sec('The problem', p.problem),
    p.contribution ? sec('My contribution', p.contribution) : '',
    sec(p.explain[0], p.explain[1], ' case-sec--wide'),
    p.outcome ? sec(p.outcome[0], p.outcome[1]) : '',
    p.tech ? sec('Technologies', `<ul class="tags">${p.tech.map((t) => `<li>${t}</li>`).join('')}</ul>`) : '',
    sec('Walkthrough', walk, ' case-sec--wide case-sec--walk'),
  ].filter(Boolean).join('\n');
  return `${head({
    base,
    title: `${p.title} — Gaurang Ashava`,
    description: p.description,
    url: `${SITE}work/${slug}/`,
    ogType: 'article',
    ogTitle: `${p.title} — Gaurang Ashava`,
    ogDescription: p.lede,
    extra: `<script src="${base}assets/explain.js?v=${V}" defer></script>\n`,
  })}
<body>
${navBar({ home: false, base })}

<main id="main">
  <article class="case" aria-labelledby="case-title">
    <header class="case-head container" id="top">
      <p class="case-head__back"><a href="${base}#work"><span class="arrow" aria-hidden="true">←</span> All projects</a></p>
      <p class="kicker">${p.kicker}</p>
      <h1 class="case-head__title" id="case-title">${p.title}</h1>
      <p class="case-head__lede">${p.lede}</p>
      <dl class="facts">
${p.facts.map(([k, v]) => `        <div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n')}
      </dl>
    </header>

    <div class="container">
${sections}

${caseNav(prev, next)}
    </div>
  </article>
</main>

${footer()}
</body>
</html>
`;
};

/* ---------- 404 (served at any missing path, so absolute URLs) ---------- */
const notFound = `${head({
  base: '/portfoliowebiste/',
  title: 'Page not found — Gaurang Ashava',
  description: 'This page doesn’t exist.',
  url: '',
  robots: '<meta name="robots" content="noindex" />\n',
})}
<body>
${navBar({ home: false, base: '/portfoliowebiste/' })}

<main id="main">
  <section class="container notfound" id="top" aria-labelledby="nf-title">
    <p class="kicker">404</p>
    <h1 class="case-head__title" id="nf-title">This page doesn’t exist.</h1>
    <p class="case-head__lede">The link may be old or mistyped. Everything lives on the homepage.</p>
    <a class="btn btn--primary" href="/portfoliowebiste/">Go to the homepage</a>
  </section>
</main>

${footer()}
</body>
</html>
`;

const workIndex = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Work — Gaurang Ashava</title>
<meta name="robots" content="noindex" />
<meta http-equiv="refresh" content="0; url=../#work" />
<link rel="canonical" href="${SITE}#work" />
</head>
<body>
<p><a href="../#work">See all work on the homepage</a></p>
</body>
</html>
`;

const write = (rel, html) => {
  const f = path.join(REPO, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  console.log('wrote', rel, html.length, 'bytes');
};
write('index.html', home);
for (const slug of ORDER) write(`work/${slug}/index.html`, casePage(slug));
write('work/index.html', workIndex);
write('404.html', notFound);
module.exports = { MARK, THUMB };
