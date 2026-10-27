// Visual explanations for the case studies: one per project, each shaped by what the
// project does. Plain HTML/CSS (selectable text) that reads fully without JavaScript;
// assets/explain.js adds the selection behaviour. Every example uses sample content.

const ICON = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/></svg>',
  request: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h14v11H9.5L5 19.5z"/><path d="M12 7.5v5M9.5 10h5"/></svg>',
  approve: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4.5" width="16" height="15" rx="2"/><path d="M8 12l2.6 2.6L16 9.2"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H11l-4 3.5v-3.5h-.5a2 2 0 0 1-2-2z"/><path d="M8.5 10h7M8.5 12.8h4.5"/></svg>',
  board: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19.5v-6h4v6M10 19.5V8h4v11.5M15 19.5v-9h4v9M3.5 19.5h17"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="2.5"/><circle cx="17" cy="6.5" r="2.5"/><circle cx="17" cy="17.5" r="2.5"/><path d="m9.2 10.8 5.6-3M9.2 13.2l5.6 3"/></svg>',
  sheet: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M4 14h16M10 4v16"/></svg>',
  pick: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M4 12h6M4 17h8"/><circle cx="17" cy="7" r="2.2"/><circle cx="13" cy="12" r="2.2"/><circle cx="15" cy="17" r="2.2"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5h16"/><path d="M7 16.5v-4M11 16.5V9M15 16.5v-6M19 16.5V6"/></svg>',
  tune: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h3M12 7h7M5 17h9M18 17h1"/><circle cx="10" cy="7" r="2.2"/><circle cx="16" cy="17" r="2.2"/></svg>',
  db: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/></svg>',
  flake: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5"/></svg>',
  dash: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M7.5 16v-3M11 16V9.5M14.5 16v-5M18 16V8"/></svg>',
};

/* ---------- Knowledge Portal: a capability map (not a sequence) ---------- */
const CAPS = [
  ['discover', 'Discover and search knowledge', ICON.search, 'A knowledge repository with search, a catalogue and file discovery.',
    `<p class="pv__field">${ICON.search}<span>onboarding</span></p>
          <ul class="pv__list">
            <li><i class="pv__file pv__file--pdf">PDF</i><span><b>New joiner onboarding guide</b><small>HR · Onboarding</small></span></li>
            <li><i class="pv__file pv__file--doc">DOC</i><span><b>Laptop and access setup</b><small>IT · Onboarding</small></span></li>
          </ul>`],
  ['request', 'Raise knowledge requests', ICON.request, 'Users can raise a request for knowledge they need.',
    `<p class="pv__label">What do you need?</p>
          <p class="pv__box">A template for project handover notes</p>
          <p class="pv__row"><span class="pv__btn">Raise request</span><span class="pv__done">Request raised</span></p>`],
  ['approve', 'Review requests in an approval queue', ICON.approve, 'Requests are reviewed in an approval queue. Managers and portal champions are involved in approvals.',
    `<ul class="pv__list pv__list--queue">
            <li><span><b>Template for handover notes</b><small>Raised by Sample user</small></span><span class="pv__chips"><i>Manager</i><i>Portal champion</i></span><em>In review</em></li>
            <li><span><b>Sample request B</b><small>Raised by Sample user B</small></span><span class="pv__chips"><i>Manager</i><i>Portal champion</i></span><em>In review</em></li>
          </ul>
          <p class="pv__note">Who is involved, not an order of approval.</p>`],
  ['chat', 'Ask the chatbot', ICON.chat, 'A dedicated AI chatbot offers a conversational way to work with the knowledge.',
    `<p class="pv__msg pv__msg--me">Where’s the onboarding guide for new joiners?</p>
          <p class="pv__msg pv__msg--bot">It’s in HR › Onboarding, titled “New joiner onboarding guide”.</p>`],
  ['board', 'View leaderboards', ICON.board, 'Leaderboards are part of the portal.',
    `<p class="pv__label">Fictional entries</p>
          <ol class="pv__list pv__list--board">
            <li><i>1</i><span>Contributor A</span></li><li><i>2</i><span>Contributor B</span></li><li><i>3</i><span>Contributor C</span></li>
          </ol>`],
  ['share', 'Share with role-based access', ICON.share, 'Knowledge can be shared, and access follows the documented roles: Viewer, User, Admin and Champion.',
    `<p class="pv__row"><b>New joiner onboarding guide</b><span class="pv__btn pv__btn--ghost">Share</span></p>
          <p class="pv__label">Access follows the documented roles</p>
          <p class="pv__chips"><i>Viewer</i><i>User</i><i>Admin</i><i>Champion</i></p>`],
];
const kpMap = () => `<div class="xp xp--map" data-xp="tabs">
          <p class="xp__lede">Six capabilities in one platform. They aren’t steps: people use whichever they need, in any order. Select one to see what it does.</p>
          <div class="map">
            <svg class="map__spokes" viewBox="0 0 6 6" preserveAspectRatio="none" aria-hidden="true" focusable="false">${['1 1', '3 1', '5 1', '1 5', '3 5', '5 5'].map((p, i) => `<path data-i="${i}" d="M3 3L${p}"/>`).join('')}</svg>
            <p class="map__hub" aria-hidden="true">Knowledge<br />Portal</p>
            <div class="map__caps" data-xp-tabs>
${CAPS.map(([id, name, ico], i) => `              <button class="map__cap" type="button" id="cap-${id}" aria-controls="capp-${id}" data-i="${i}">${ico}<span>${name}</span></button>`).join('\n')}
            </div>
          </div>
          <div class="map__panels">
${CAPS.map(([id, name, , text, pv]) => `            <section class="map__panel" id="capp-${id}" aria-labelledby="caph-${id}">
              <div class="map__text">
                <h3 class="map__h" id="caph-${id}">${name}</h3>
                <p>${text}</p>
              </div>
              <div class="pv" aria-hidden="true">
                <p class="pv__tag">Illustrative preview · sample content</p>
          ${pv}
              </div>
            </section>`).join('\n')}
          </div>
        </div>`;

// my part, as a delivery timeline: three completed stages, then the scheduled one
const kpTimeline = () => `<p class="tl__label">Delivery timeline</p>
            <ol class="tl">
              <li class="tl__item"><span class="tl__dot" aria-hidden="true"></span><b>Supplied FSD</b><small>The starting point: the functional specification document</small><span class="tl__state">Completed</span></li>
              <li class="tl__item"><span class="tl__dot" aria-hidden="true"></span><b>Development</b><small>The application, developed end to end</small><span class="tl__state">Completed</span></li>
              <li class="tl__item"><span class="tl__dot" aria-hidden="true"></span><b>Business feedback during UAT</b><small>Incorporated into the application</small><span class="tl__state">Completed</span></li>
              <li class="tl__item tl__item--next"><span class="tl__dot" aria-hidden="true"></span><b>Production deployment</b><small>Not yet live</small><span class="tl__state">Scheduled</span></li>
            </ol>`;

/* ---------- Business Sheet: from spreadsheet to generated, customisable charts ---------- */
// sample revenue for Org A, FY2014 → current FY; LOB 2 is the series the walkthrough uses
const FY = ['FY2014', 'FY2015', 'FY2016', 'FY2017', 'FY2018', 'FY2019', 'FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024', 'Current FY'];
const SERIES = { 'LOB 1': [40, 43, 45, 44, 50, 52, 56, 58, 61, 63, 66, 70], 'LOB 2': [64, 70, 68, 76, 81, 79, 88, 96, 92, 108, 120, 132] };
const RANGES = [[0, 'FY2014 → Current FY'], [6, 'FY2020 → Current FY']];
// shared with assets/explain.js through data attributes, so the page and the script compute the same numbers
const growth = (a, b) => { const g = (b - a) / a * 100; return Number.isInteger(g) ? `${g}%` : `about ${Math.round(g)}%`; };
const answer = (lob, from) => {
  const v = SERIES[lob], a = v[from], b = v[v.length - 1], g = growth(a, b);
  return `It’s how much revenue changed across the years you’ve selected, as a share of the first year. For Org A · ${lob}: (${b} − ${a}) ÷ ${a} = ${g.replace('about ', '≈ ')} from ${FY[from]} to the current FY.`;
};
const sheetRows = (lob, from) => {
  const v = SERIES[lob], idx = v.map((_, i) => i).filter((i) => i >= from);
  const show = idx.length > 7 ? idx.slice(0, 2).concat(['gap'], idx.slice(-3)) : idx;
  return show.map((i) => (i === 'gap' ? '<tr class="bsx__gap"><td>⋮</td><td>⋮</td></tr>' : `<tr><td>${FY[i]}</td><td>${v[i]}</td></tr>`)).join('');
};
const bars = (lob, from) => {
  const v = SERIES[lob].slice(from), max = 132;
  return v.map((x, i) => `<i style="--h:${(x / max * 100).toFixed(1)}%"${i === 0 || i === v.length - 1 ? ` data-v="${x}"` : ''}></i>`).join('');
};
const bsSheet = () => {
  const lob = 'LOB 2', from = 6;
  return `<div class="xp xp--bs" data-xp="sheet" data-fy='${JSON.stringify(FY)}' data-series='${JSON.stringify(SERIES)}'>
          <ol class="flow4">
            <li><span class="flow4__ico">${ICON.sheet}</span><b>Excel data</b><small>Figures by organisation, line of business and financial year</small></li>
            <li><span class="flow4__ico">${ICON.pick}</span><b>Select</b><small>Organisation, line of business and financial years</small></li>
            <li><span class="flow4__ico">${ICON.chart}</span><b>Generate charts</b><small>One action, instead of building each view by hand</small></li>
            <li><span class="flow4__ico">${ICON.tune}</span><b>Customise the view</b><small>Button-driven changes, such as the selections</small></li>
          </ol>
          <div class="bsx">
            <p class="xp__tag">Illustrative example · sample data, not the real application</p>
            <div class="bsx__controls js-only">
              <p class="bsx__fixed"><span>Organisation</span><b>Org A</b></p>
              <div class="bsx__group" role="group" aria-labelledby="bsx-lob"><span id="bsx-lob">Line of business</span>${Object.keys(SERIES).map((k) => `<button type="button" data-lob="${k}" aria-pressed="${k === lob}">${k}</button>`).join('')}</div>
              <div class="bsx__group" role="group" aria-labelledby="bsx-fy"><span id="bsx-fy">Financial years</span>${RANGES.map(([i, l]) => `<button type="button" data-from="${i}" aria-pressed="${i === from}">${l}</button>`).join('')}</div>
            </div>
            <div class="bsx__body">
              <table class="bsx__sheet">
                <caption>sample-data.xlsx · <span data-bsx="title">Org A · ${lob}</span></caption>
                <thead><tr><th scope="col">FY</th><th scope="col">Revenue</th></tr></thead>
                <tbody data-bsx="rows">${sheetRows(lob, from)}</tbody>
              </table>
              <figure class="bsx__chart">
                <figcaption><b>Revenue · <span data-bsx="title">Org A · ${lob}</span></b><span data-bsx="range">${RANGES.find(([i]) => i === from)[1]}</span></figcaption>
                <div class="bsx__plot" data-bsx="bars" role="img" aria-label="Bar chart of the selected sample revenue">${bars(lob, from)}</div>
              </figure>
              <div class="bsx__chat">
                <p class="bsx__chat-h">Chatbot · explains the metrics</p>
                <p class="bsx__q">What does growth mean in this chart?</p>
                <p class="bsx__a" data-bsx="answer" aria-live="polite">${answer(lob, from)}</p>
                <p class="bsx__note">Sample answer, from the figures in the chart</p>
              </div>
            </div>
          </div>
        </div>`;
};

/* ---------- Contract Intelligence: an annotated contract ---------- */
const ciDoc = () => `<div class="xp xp--ci" data-xp="pick">
          <p class="xp__lede">A fictional contract excerpt beside the information drawn from it. Select an item to see where it comes from in the text.</p>
          <p class="ann__legend" aria-hidden="true"><span class="ann__key">Key detail</span><span class="ann__ob">Obligation</span><span class="ann__cl">Clause</span></p>
          <div class="ann">
            <div class="ann__doc">
              <p class="ann__file">sample-services-agreement.pdf · fictional</p>
              <p class="ann__title">Master services agreement</p>
              <p>This agreement is between <mark class="ann__key" data-key="parties">Sample Client Pvt. Ltd.</mark> and <mark class="ann__key" data-key="parties">Sample Supplier Ltd.</mark>, effective <mark class="ann__key" data-key="effective">1 April 2025</mark>.</p>
              <p class="ann__cl" data-key="c7"><b>7. Term.</b> This agreement runs for <mark class="ann__key" data-key="term">24 months</mark>.</p>
              <p class="ann__cl" data-key="c9"><b>9. Reporting.</b> <mark class="ann__ob" data-key="report">The Supplier shall deliver a monthly service report.</mark></p>
              <p class="ann__cl" data-key="c12"><b>12. Termination.</b> Either party may terminate with 60 days’ written notice.</p>
            </div>
            <div class="ann__out">
              <p class="ann__h">Extracted information</p>
              <p class="ann__gh"><span class="ann__key">Key details</span></p>
              <ul class="ann__list">
                <li><button type="button" data-pick="parties"><span>Parties</span><b>Sample Client Pvt. Ltd. · Sample Supplier Ltd.</b></button></li>
                <li><button type="button" data-pick="effective"><span>Effective</span><b>1 April 2025</b></button></li>
                <li><button type="button" data-pick="term"><span>Term</span><b>24 months</b></button></li>
              </ul>
              <p class="ann__gh"><span class="ann__cl">Clauses</span></p>
              <ul class="ann__list ann__list--row">
                <li><button type="button" data-pick="c7"><b>7 · Term</b></button></li>
                <li><button type="button" data-pick="c9"><b>9 · Reporting</b></button></li>
                <li><button type="button" data-pick="c12"><b>12 · Termination</b></button></li>
              </ul>
              <p class="ann__gh"><span class="ann__ob">Obligations</span></p>
              <ul class="ann__list">
                <li><button type="button" data-pick="report"><span>Supplier</span><b>Deliver a monthly service report</b></button></li>
              </ul>
              <p class="ann__track"><b>Tracked</b> in the application · term 1 April 2025 to 31 March 2027</p>
              <p class="ann__review"><b>For human review.</b> The summary supports the legal team’s review. It doesn’t give legal advice or make legal decisions.</p>
            </div>
          </div>
        </div>`;

/* ---------- Resume Matching: requirements beside evidence ---------- */
const RM_ROWS = [
  ['sql', 'SQL', 'Required', 'Wrote SQL reports for sales data', 'yes', 'Direct experience writing SQL for reporting.'],
  ['python', 'Python', 'Required', 'Python scripts for data cleaning', 'yes', 'Uses Python to prepare data.'],
  ['exp', '2+ years in analytics', 'Required', '3 years as a junior analyst', 'yes', 'More than the minimum experience.'],
  ['dash', 'Dashboards', 'Preferred', 'Spreadsheet charts for monthly reviews', 'part', 'Charts, but no dashboard work is mentioned.'],
];
const FIT = { yes: 'Aligned', part: 'Partly aligned' };
const rmMatrix = () => `<div class="xp xp--rm" data-xp="pick">
          <p class="xp__lede">A fictional role beside evidence from a fictional candidate profile. Select a requirement to see the supporting evidence.</p>
          <div class="mx">
            <table class="mx__table" role="table">
              <caption class="mx__cap">Data Analyst (fictional role) compared with Candidate A (fictional profile)</caption>
              <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Requirement</th><th scope="col" role="columnheader">Evidence in the profile</th><th scope="col" role="columnheader">Alignment</th></tr></thead>
              <tbody role="rowgroup">
${RM_ROWS.map(([k, req, need, ev, fit, why]) => `                <tr role="row" data-key="${k}">
                  <th scope="row" role="rowheader"><button type="button" data-pick="${k}"><b>${req}</b><small>${need}</small></button></th>
                  <td role="cell" data-label="Evidence">${ev}</td>
                  <td role="cell" data-label="Alignment"><span class="mx__fit mx__fit--${fit}">${FIT[fit]}</span><small>${why}</small></td>
                </tr>`).join('\n')}
              </tbody>
            </table>
            <div class="mx__profile">
              <p class="ann__file">candidate-a-resume.pdf · fictional</p>
              <p class="mx__name">Candidate A</p>
              <p>Junior data analyst, <mark data-key="exp">3 years</mark> in a retail analytics team.</p>
              <ul>
                <li><mark data-key="sql">Wrote SQL reports for sales data</mark></li>
                <li><mark data-key="python">Python scripts for data cleaning</mark></li>
                <li><mark data-key="dash">Spreadsheet charts for monthly reviews</mark></li>
              </ul>
            </div>
          </div>
          <p class="mx__review"><b>Human review.</b> The comparison supports the recruiter; people make the decision. No scores or rankings are shown or implied.</p>
        </div>`;

/* ---------- Data Migration: source to destination, with related scope ---------- */
const DM_STAGES = [['Extract', 'From the SQL Server sources'], ['Transform', 'For the target warehouse'], ['Validate', 'Before loading'], ['Load', 'Into Snowflake']];
const dmFlow = () => `<div class="xp xp--dm" data-xp="trace">
          <ol class="mflow">
            <li class="mflow__end"><span class="mflow__ico">${ICON.db}</span><b>Microsoft SQL Server</b><small>Traditional sources</small></li>
${DM_STAGES.map(([b, s]) => `            <li class="mflow__stage"><span class="mflow__dot" aria-hidden="true"></span><b>${b}</b><small>${s}</small></li>`).join('\n')}
            <li class="mflow__end mflow__end--dst"><span class="mflow__ico">${ICON.flake}</span><b>Snowflake</b><small>Cloud data warehouse</small></li>
          </ol>
          <p class="mflow__infra">Azure Data Factory · supporting infrastructure</p>
          <div class="mflow__scope">
            <p class="mflow__scope-h">Also part of the initiative</p>
            <ul>
              <li><span class="mflow__ico">${ICON.dash}</span>Dashboards</li>
              <li><span class="mflow__ico">${ICON.db}</span>Their underlying data sources</li>
            </ul>
            <p class="mflow__scope-note">Related scope; no order or dependency is implied.</p>
          </div>
          <p class="mflow__actions js-only"><button class="mflow__trace" type="button" data-trace>Trace the flow</button></p>
        </div>`;

module.exports = { kpMap, kpTimeline, bsSheet, ciDoc, rmMatrix, dmFlow, SERIES, FY };
