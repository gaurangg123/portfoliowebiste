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

const REPO = path.resolve(__dirname, '..');
const SITE = 'https://gaurangg123.github.io/portfoliowebiste/';
const V = '14';                                   // cache-busting for css/js
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
                  <p class="ct__track ct__extra">Tracked · review before Apr 2027</p>
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
const P = {
  'knowledge-portal': {
    kicker: 'Knowledge platform · Generative AI',
    status: 'Built end to end · Production deployment scheduled',
    summary: 'An enterprise knowledge platform combining discovery, knowledge requests, an AI chatbot, approval workflows, and leaderboards.',
    lede: 'An enterprise knowledge platform combining discovery, knowledge requests, an AI chatbot, approval workflows, and leaderboards. I developed it end to end.',
    description: 'Enterprise Knowledge Portal, developed end to end by Gaurang Ashava: knowledge discovery, knowledge requests, an AI chatbot, an approval queue and leaderboards, with sharing and role-based access. Production deployment is scheduled.',
    facts: [['Where', 'Tata Technologies'], ['My role', 'Developed end to end'], ['Status', '<span class="status-dot status-dot--scheduled">Production deployment scheduled</span>']],
    visual: ILL.kp,
    problem: `<p>Make organizational knowledge easier to discover and use through a shared platform with role-based access. It serves four roles: Viewer, User, Admin and Champion.</p>`,
    contribution: {
      text: `<p>I developed the Enterprise Knowledge Portal end to end, starting from the supplied functional specification document. I implemented the application and incorporated business feedback during UAT. Production deployment is scheduled.</p>`,
      bullets: ['Translated the functional specification’s requirements into the application.', 'Developed the functionality.', 'Incorporated business feedback during UAT.'],
    },
    built: ['What I built', `<p>The portal brings six groups of capabilities together in one platform.</p>
            ${steps([
              ['Discover knowledge', 'A knowledge repository with search, a catalogue and file discovery.'],
              ['Raise knowledge requests', 'Users can raise a request for knowledge they need.'],
              ['Use the chatbot', 'A dedicated AI chatbot offers a conversational way to work with the knowledge.'],
              ['Review requests in the approval queue', 'Requests are reviewed in an approval queue. Managers and portal champions are involved in approvals.'],
              ['View leaderboards', 'Leaderboards are part of the portal.'],
              ['Share and access knowledge by role', 'Knowledge can be shared, and access follows the documented roles: Viewer, User, Admin and Champion.'],
            ])}
            <p class="muted">The chatbot is one capability of the platform, not the whole product.</p>`],
    result: ['Result and current status', `<p>The application brings these knowledge workflows into one place and has been refined through business feedback during UAT. Production deployment is scheduled.</p>`],
    tech: null,
  },
  'business-sheet': {
    kicker: 'Data and AI · Enterprise analytics',
    summary: 'Turns manual Excel reporting into customisable charts and comparisons, with a chatbot that helps users understand the metrics.',
    lede: 'Automates the manual Excel work behind organization and line-of-business reporting: meaningful charts and financial-year comparisons, from FY2014 to the current financial year, with a chatbot that explains the metrics.',
    description: 'Business Sheet: turns manual Excel reporting into customisable charts and financial-year comparisons, from FY2014 to the current financial year, with a chatbot that helps users understand the tracked metrics.',
    facts: [['Where', 'Tata Technologies'], ['Compares', 'FY2014 to the current FY'], ['Outcome', 'A manual process, automated']],
    visual: ILL.sheet,
    problem: `<p>Preparing and comparing information from Excel required manual work, making it cumbersome to turn the data into useful views.</p>`,
    contribution: null,
    built: ['How the solution works', `<p>Business Sheet automates the preparation of meaningful charts and financial-year comparisons, with customisation controls and a chatbot for metric explanations.</p>
            ${steps([
              ['Select', 'Choose the organization, line of business and financial years, from FY2014 to the current financial year.'],
              ['Generate', 'Charts and comparisons are produced with a button, rather than assembled by hand in Excel.'],
              ['Customise', 'Simple button-driven actions customise the views, for example changing the selections.'],
              ['Ask', 'A chatbot helps users understand the tracked metrics.'],
            ])}`],
    result: ['Result', `<p>Users can generate and customise useful views through button-driven actions instead of repeatedly assembling them manually in Excel.</p>`],
    tech: null,
  },
  'contract-intelligence': {
    kicker: 'Generative AI · Document intelligence',
    summary: 'Helps legal teams review contracts by extracting clauses, obligations and key information.',
    lede: 'An AI-powered application for legal teams to analyze and track uploaded contracts and extract important contractual information.',
    description: 'AI Legal Contract Intelligence: an application that helps legal teams analyze and track uploaded contracts, identify clauses and extract obligations and key information.',
    facts: [['Where', 'Tata Technologies'], ['For', 'Legal teams'], ['Type', 'Generative AI application']],
    visual: ILL.contract,
    problem: `<p>Legal teams need to identify and review the clauses, obligations and important information in each contract, and keep track of their contracts.</p>`,
    contribution: null,
    built: ['How the solution works', `${steps([['Upload', 'A contract is uploaded to the application.'], ['Analyze', 'The application analyzes it with generative AI.'], ['Extract', 'It identifies clauses and extracts obligations and other key information.'], ['Track', 'Contracts are tracked in the application.']])}
            <p class="muted">It supports human review: it organizes contract information for the legal team, and doesn’t give legal advice or make legal decisions.</p>`],
    result: ['Result', `<p>Legal teams get each contract’s clauses, obligations and key information as a structured summary to review, and their contracts are tracked in the application.</p>`],
    tech: null,
  },
  'resume-matching': {
    kicker: 'AI · Recruitment',
    live: true,
    summary: 'Evaluates candidate profiles against role requirements.',
    lede: 'An AI-powered solution that evaluates candidate profiles against role requirements. It’s live in production.',
    description: 'AI Resume Matching: an AI-powered solution, live in production, that evaluates candidate profiles against role requirements.',
    facts: [['Where', 'Tata Technologies'], ['For', 'Recruitment'], ['Status', '<span class="status-dot">Live in production</span>']],
    visual: ILL.match,
    problem: `<p>Recruiters need to compare each candidate’s profile with what a role requires.</p>`,
    contribution: { text: `<p>I developed the original proof of concept for this solution, which has since gone live in production.</p>`, bullets: [] },
    built: ['How the solution works', `${steps([['Resume understanding', 'Reads and understands candidate resumes.'], ['Requirement matching', 'Matches profiles against the role’s requirements.'], ['Skill and experience alignment', 'Compares a candidate’s skills and experience with what the role needs.'], ['AI-assisted evaluation', 'Supports the evaluation of each candidate with AI.']])}`],
    result: ['Result and current status', `<p>Candidate profiles are compared with role requirements on skills and experience, supporting the people who make the decision. The solution is live in production.</p>`],
    tech: null,
  },
  'data-migration': {
    kicker: 'Data engineering · SQL Server to Snowflake',
    summary: 'A team initiative I contributed to, migrating data from Microsoft SQL Server to Snowflake, along with dashboards and their underlying data sources.',
    lede: 'A major enterprise initiative to move different types of data from traditional Microsoft SQL Server environments into a Snowflake data warehouse. The initiative also involved migrating dashboards and their underlying data sources.',
    description: 'Enterprise Data Migration: moving different types of data from Microsoft SQL Server into Snowflake through extract, transform, validate and load stages, and migrating dashboards and their underlying data sources. A team initiative Gaurang Ashava contributed to.',
    facts: [['Where', 'Tata Technologies'], ['My part', 'Contributor to a team initiative'], ['From → to', 'SQL Server → Snowflake']],
    visual: ILL.pipe,
    problem: `<p>Different types of enterprise data held in traditional Microsoft SQL Server environments needed to move into a cloud data warehouse, Snowflake.</p>`,
    contribution: { text: `<p>This was a team initiative, and I was one of its contributors.</p>`, bullets: [] },
    scope: ['Scope of work', `${steps([['Data', 'Different types of data, from traditional Microsoft SQL Server environments into Snowflake.'], ['Dashboards and data sources', 'The initiative also involved migrating dashboards and their underlying data sources.']])}`],
    built: ['How the solution works', `${steps([['Extract', 'Data is extracted from the SQL Server sources.'], ['Transform', 'It’s transformed for the target warehouse.'], ['Validate', 'It’s validated before loading.'], ['Load', 'It’s loaded into Snowflake.']])}
            <p class="muted">Validation is its own stage, between transformation and loading, so problems surface before data reaches the warehouse. Azure Data Factory provided supporting infrastructure.</p>`],
    result: null,
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
const caseLink = (slug, label = 'Read the case study') =>
  `<a class="link-more" href="work/${slug}/">${label}<span class="visually-hidden">: ${P[slug].title}</span> <span class="arrow" aria-hidden="true">→</span></a>`;
// a project's preview: the illustration with a real button over it that opens the walkthrough
const preview = (slug, cls = 'project__figure') => `<figure class="${cls} demo-preview">
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
const moreItem = (slug) => `        <li class="more__item">
          <div class="more__main">
            <h4 class="more__name">${P[slug].title}</h4>
            <p class="more__meta">${P[slug].live ? '<span class="live-dot" aria-hidden="true"></span>Live in production' : P[slug].kicker}</p>
          </div>
          <p class="more__desc">${P[slug].summary}</p>
          <div class="more__actions">${demoButton(slug)}${caseLink(slug, 'Read more')}<span class="demo-status" data-demo-status role="status"></span></div>
        </li>`;
const tile = (slug, lead = false) => `      <article class="project${lead ? ' project--lead' : ''}">
        <div class="project__text">
          <p class="kicker">${P[slug].kicker}</p>
          <h3 class="project__title">${P[slug].title}</h3>
${P[slug].status ? `          <p class="project__status"><span class="status-dot status-dot--scheduled">${P[slug].status}</span></p>\n` : ''}          <p class="project__summary">${P[slug].summary}</p>
          ${caseLink(slug)}
        </div>
        ${preview(slug)}
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
{"@context":"https://schema.org","@type":"Person","name":"Gaurang Ashava","jobTitle":"Data & AI Engineer","url":"${SITE}","email":"mailto:${EMAIL}","image":"${SITE}assets/gaurang.jpg","address":{"@type":"PostalAddress","addressLocality":"Pune","addressCountry":"IN"},"worksFor":{"@type":"Organization","name":"Tata Technologies"},"alumniOf":{"@type":"CollegeOrUniversity","name":"SRM Institute of Science and Technology"},"sameAs":["${LINKEDIN}","${GITHUB}"]}
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
${tile(FEATURED[0], true)}

${FEATURED.slice(1).map((slug) => tile(slug)).join('\n\n')}
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
          <p>I’m Gaurang, a Data &amp; AI Engineer at Tata Technologies in Pune. I joined in October 2025 after a B.Tech in computer science with a specialization in big data analytics.</p>
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

        <p class="tools"><b>Tools I use:</b> SQL, Python, Snowflake, Databricks, Azure Data Factory, JavaScript, React, Angular, Git and Jira.</p>
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
        <div>
          <h3 class="row__title">GET – Data and AI Engineer</h3>
          <p class="row__org">Tata Technologies · Pune</p>
          <p class="row__note">Developed the Enterprise Knowledge Portal end to end, from the functional specification through UAT. Also data engineering and migration, other AI-powered applications, and AI agents and automation for engineering workflows.</p>
        </div>
      </li>
      <li class="row">
        <p class="row__when">Dec 2023 – Jan 2024</p>
        <div>
          <h3 class="row__title">Training Internship – Data Analytics</h3>
          <p class="row__org">Vertisystem · Indore</p>
          <p class="row__note">SQL analysis across databases, web scraping and analytical reports.</p>
        </div>
      </li>
      <li class="row">
        <p class="row__when">Jun – Jul 2023</p>
        <div>
          <h3 class="row__title">Software Developer Intern / L1</h3>
          <p class="row__org">Swap Infotech · Indore</p>
          <p class="row__note">Live AngularJS web projects, testing and client documentation in an Agile team.</p>
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
        <dl class="exp__flow">
          <div><dt>Input</dt><dd>A screenshot and a short description of the issue</dd></div>
          <div><dt>Process</dt><dd>An AI agent interprets the two together</dd></div>
          <div><dt>Output</dt><dd>A structured, detailed bug report</dd></div>
        </dl>
      </article>
      <article class="exp">
        <h3 class="exp__title">Web App Builder</h3>
        <dl class="exp__flow">
          <div><dt>Input</dt><dd>Existing application code and the logic it should follow</dd></div>
          <div><dt>Process</dt><dd>An AI agent works out how the code is built, then adapts it to that logic</dd></div>
          <div><dt>Output</dt><dd>Updated code. It assists development rather than building software on its own.</dd></div>
        </dl>
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

/* ---------- case studies ---------- */
const casePage = (slug) => {
  const p = P[slug], d = DEMOS[slug];
  const i = ORDER.indexOf(slug);
  const prev = ORDER[i - 1], next = ORDER[i + 1];
  const base = '../../';
  const sid = (h) => `${slug}-${h.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, '')}`;
  const sec = (h, body) => `      <section class="case-sec" aria-labelledby="${sid(h)}">
        <h2 class="case-sec__h" id="${sid(h)}">${h}</h2>
        <div class="case-sec__body">
            ${body}
        </div>
      </section>`;
  const sections = [
    sec('Business problem', p.problem),
    p.contribution ? sec('My contribution', p.contribution.text + (p.contribution.bullets.length ? `
            <ul class="ticks">
${p.contribution.bullets.map((b) => `              <li>${b}</li>`).join('\n')}
            </ul>` : '')) : '',
    p.scope ? sec(p.scope[0], p.scope[1]) : '',
    sec(p.built[0], p.built[1]),
    p.result ? sec(p.result[0], p.result[1]) : '',
    sec('Demonstration', `<p>A ${Math.round(d.duration / 1000)}-second illustrative walkthrough of the workflow, using sample data. It plays silently and you can pause or replay it at any time.</p>
            ${steps(d.scenes.map((s) => [s.title, s.text]))}
            <p class="case-demo">${demoButton(slug).replace('class="demo-btn js-only"', 'class="demo-btn demo-btn--primary js-only"')}<span class="demo-status" data-demo-status role="status"></span></p>`),
    p.tech ? sec('Technologies', `<ul class="tags">${p.tech.map((t) => `<li>${t}</li>`).join('')}</ul>`) : '',
  ].filter(Boolean).join('\n');
  return `${head({
    base,
    title: `${p.title} — Gaurang Ashava`,
    description: p.description,
    url: `${SITE}work/${slug}/`,
    ogType: 'article',
    ogTitle: `${p.title} — Gaurang Ashava`,
    ogDescription: p.lede,
  })}
<body>
${navBar({ home: false, base })}

<main id="main">
  <article class="case" aria-labelledby="case-title">
    <header class="case-head container" id="top">
      <p class="case-head__back"><a href="${base}#work"><span class="arrow" aria-hidden="true">←</span> All work</a></p>
      <p class="kicker">${p.kicker}</p>
      <h1 class="case-head__title" id="case-title">${p.title}</h1>
      <p class="case-head__lede">${p.lede}</p>
      <dl class="facts">
${p.facts.map(([k, v]) => `        <div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n')}
      </dl>
    </header>

    <div class="container case-visual">
        ${preview(slug, 'case-visual__figure')}
    </div>

    <div class="container">
${sections}

      <nav class="case-next" aria-label="More projects">
${prev ? `        <a href="../${prev}/" rel="prev"><span>Previous project</span><b>${P[prev].title}</b></a>` : ''}
${next ? `        <a href="../${next}/" rel="next"><span>Next project</span><b>${P[next].title}</b></a>` : `        <a href="${base}#work" rel="next"><span>That’s all of them</span><b>Back to all work</b></a>`}
      </nav>
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
