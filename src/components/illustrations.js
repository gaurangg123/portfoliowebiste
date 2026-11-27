// Case-study illustrations: non-interactive figures with sample content, built in HTML/CSS
// (styled by src/styles/case-visuals.css). Moved unchanged from the previous build script.
const I = {
  db: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13"/><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/></svg>',
  flake: '<svg viewBox="0 0 24 24"><path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5"/><path d="M9.6 4.1 12 6.5l2.4-2.4M9.6 19.9 12 17.5l2.4 2.4M4.6 10.4l3.3-.9-.9-3.3M19.4 13.6l-3.3.9.9 3.3M4.6 13.6l3.3.9-.9 3.3M19.4 10.4l-3.3-.9.9-3.3"/></svg>',
};
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

module.exports = { ILL, REV };
