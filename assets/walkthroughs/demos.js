/* ============================================================
   Project walkthroughs — data
   One entry per project. The player (walkthrough.js) reads this and
   never needs to change when a project's demo changes.

   Today every entry is an illustrative animation built from HTML/CSS
   with sample data. To use a real screen recording later, add:
     video: { src: 'assets/walkthroughs/<id>.mp4', poster: 'assets/walkthroughs/<id>.jpg',
              captions: 'assets/walkthroughs/<id>.vtt' }   // captions optional
   and set caption to describe it (e.g. 'Screen recording · sample data').
   Paths are relative to the site root. Nothing is requested until a
   walkthrough is opened.
   ============================================================ */
(function () {
  'use strict';

  var SAMPLE = '<span class="wt-sample">Sample data</span>';

  window.PortfolioDemos = {

    'knowledge-portal': {
      title: 'Enterprise Knowledge Portal',
      caseUrl: 'work/knowledge-portal/',
      caption: 'Illustrative walkthrough · sample data',
      duration: 22000,
      video: null,
      scenes: [
        { at: 0,     title: 'Discover knowledge', text: 'A sample user searches for “onboarding” and browses the catalogue to find documents.' },
        { at: 3600,  title: 'Raise a knowledge request', text: 'They can also raise a knowledge request for something they need.' },
        { at: 7400,  title: 'Approval queue', text: 'The request appears in an approval queue. Managers and portal champions are involved in approvals.' },
        { at: 11000, title: 'Ask the AI chatbot', text: 'The chatbot answers a sample question and points to where the guide is.' },
        { at: 14800, title: 'Leaderboards', text: 'An illustrative leaderboard with fictional entries.' },
        { at: 18400, title: 'One platform', text: 'Discovery, requests, the chatbot, approvals and leaderboards in one platform, with sharing and role-based access.' }
      ],
      /* the portal window stays put; its sidebar and main view follow the current step */
      stage:
        '<div class="wt-kp">' + SAMPLE +
          '<div class="wt-win wt-kp__win wt-in in-1 out-6">' +
            '<div class="wt-win__bar"><span class="wt-dots"><i></i><i></i><i></i></span><b>Knowledge portal</b></div>' +
            '<div class="wt-kp__body">' +
              '<ul class="wt-kp__nav">' +
                '<li class="n1">Discover</li><li class="n2">Requests</li><li class="n3">Approvals</li><li class="n4">Assistant</li><li class="n5">Leaderboard</li>' +
              '</ul>' +
              '<div class="wt-kp__views">' +
                '<div class="wt-kp__view v1">' +
                  '<p class="wt-kp__query"><span>Search</span><b>onboarding</b></p>' +
                  '<ul class="wt-kp__cats"><li class="is-pick">HR › Onboarding</li><li>IT › Onboarding</li><li>Policies</li></ul>' +
                  '<ul class="wt-kp__results">' +
                    '<li class="is-top"><span class="wt-file wt-file--pdf">PDF</span><span><b>New joiner onboarding guide</b><small>HR · Onboarding</small></span></li>' +
                    '<li><span class="wt-file wt-file--doc">DOC</span><span><b>Laptop and access setup</b><small>IT · Onboarding</small></span></li>' +
                    '<li><span class="wt-file wt-file--xls">XLS</span><span><b>First-week checklist</b><small>HR · Templates</small></span></li>' +
                  '</ul>' +
                '</div>' +
                '<div class="wt-kp__view v2">' +
                  '<p class="wt-kp__h">Raise a knowledge request</p>' +
                  '<div class="wt-kp__field"><span>What knowledge do you need?</span><p>A laptop setup checklist for new joiners</p></div>' +
                  '<p class="wt-kp__send"><span class="wt-kp__btn">Raise request</span><span class="wt-kp__done">Request raised</span></p>' +
                '</div>' +
                '<div class="wt-kp__view v3">' +
                  '<p class="wt-kp__h">Approval queue</p>' +
                  '<ul class="wt-kp__queue">' +
                    '<li class="is-new"><span><b>Laptop setup checklist for new joiners</b><small>Raised by Sample user</small></span><span class="wt-kp__who"><i>Manager</i><i>Portal champion</i></span><em>In review</em></li>' +
                    '<li><span><b>Sample request B</b><small>Raised by Sample user B</small></span><span class="wt-kp__who"><i>Manager</i><i>Portal champion</i></span><em>In review</em></li>' +
                    '<li><span><b>Sample request C</b><small>Raised by Sample user C</small></span><span class="wt-kp__who"><i>Manager</i><i>Portal champion</i></span><em>In review</em></li>' +
                  '</ul>' +
                '</div>' +
                '<div class="wt-kp__view v4">' +
                  '<p class="wt-kp__chat-h"><i></i>Assistant</p>' +
                  '<p class="wt-bubble wt-bubble--me">Where’s the onboarding guide for new joiners?</p>' +
                  '<p class="wt-bubble wt-bubble--bot wt-kp__reply">It’s in HR › Onboarding: “New joiner onboarding guide”. Laptop setup is under IT › Onboarding.</p>' +
                '</div>' +
                '<div class="wt-kp__view v5">' +
                  '<p class="wt-kp__h">Leaderboard <span>Fictional entries</span></p>' +
                  '<ol class="wt-kp__board">' +
                    '<li><span class="wt-kp__rank">1</span><span class="wt-kp__av">CA</span><b>Contributor A</b></li>' +
                    '<li><span class="wt-kp__rank">2</span><span class="wt-kp__av">CB</span><b>Contributor B</b></li>' +
                    '<li><span class="wt-kp__rank">3</span><span class="wt-kp__av">CC</span><b>Contributor C</b></li>' +
                    '<li><span class="wt-kp__rank">4</span><span class="wt-kp__av">CD</span><b>Contributor D</b></li>' +
                  '</ol>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="wt-kp__map wt-in in-6">' +
            '<ul class="wt-kp__tiles">' +
              '<li>Discover</li><li>Knowledge requests</li><li class="is-ai">AI chatbot</li><li>Approval queue</li><li>Leaderboards</li><li>Sharing</li>' +
            '</ul>' +
            '<p class="wt-kp__roles"><b>Role-based access</b><span>Viewer</span><span>User</span><span>Admin</span><span>Champion</span></p>' +
          '</div>' +
        '</div>'
    },

    'data-migration': {
      title: 'Enterprise Data Migration',
      caseUrl: 'work/data-migration/',
      caption: 'Illustrative walkthrough · sample data',
      duration: 20000,
      video: null,
      scenes: [
        { at: 0,     title: 'Source data', text: 'Different types of data sit in traditional Microsoft SQL Server environments (sample tables).' },
        { at: 3000,  title: 'Extract', text: 'Data is extracted from the SQL Server sources.' },
        { at: 6000,  title: 'Transform and validate', text: 'It’s transformed for the target warehouse, then validated before loading.' },
        { at: 10000, title: 'Load into Snowflake', text: 'Validated data is loaded into the Snowflake data warehouse.' },
        { at: 13000, title: 'Dashboards and data sources', text: 'The initiative also involved migrating dashboards and their underlying data sources.' },
        { at: 16000, title: 'The end-to-end flow', text: 'Extract, transform, validate, load, plus dashboards and their data sources, with Azure Data Factory as supporting infrastructure.' }
      ],
      stage:
        '<div class="wt-dm">' + SAMPLE +
          '<div class="wt-dm__track">' +
          '<ol class="wt-dm__flow">' +
            '<li class="wt-dm__node wt-dm__src"><b>Microsoft SQL Server</b><small>Source</small>' +
              '<span class="wt-dm__tables"><i>Table A</i><i>Table B</i><i>Table C</i></span></li>' +
            '<li class="wt-dm__stage st-1"><b>Extract</b></li>' +
            '<li class="wt-dm__stage st-2"><b>Transform</b></li>' +
            '<li class="wt-dm__stage st-3"><b>Validate</b></li>' +
            '<li class="wt-dm__stage st-4"><b>Load</b></li>' +
            '<li class="wt-dm__node wt-dm__dst"><b>Snowflake</b><small>Cloud data warehouse</small></li>' +
          '</ol>' +
          '<div class="wt-dm__lane" aria-hidden="true">' +
            '<span class="wt-dm__blk" style="--d:0s"><i></i></span>' +
            '<span class="wt-dm__blk" style="--d:.18s"><i></i></span>' +
            '<span class="wt-dm__blk" style="--d:.36s"><i></i></span>' +
          '</div>' +
          '</div>' +
          '<div class="wt-dm__scope wt-in in-5">' +
            '<p class="wt-dm__scope-h">Also migrated</p>' +
            '<ul>' +
              '<li class="wt-dm__dash"><i aria-hidden="true"></i><span><b>Dashboards</b><small>Sample dashboard 1 · Sample dashboard 2</small></span></li>' +
              '<li class="wt-dm__srcs"><i aria-hidden="true"></i><span><b>Their underlying data sources</b><small>Migrated with the dashboards</small></span></li>' +
            '</ul>' +
          '</div>' +
          '<p class="wt-dm__infra wt-in in-6">Azure Data Factory · supporting infrastructure</p>' +
        '</div>'
    },

    'contract-intelligence': {
      title: 'AI Legal Contract Intelligence',
      caseUrl: 'work/contract-intelligence/',
      caption: 'Illustrative walkthrough · sample data',
      duration: 14000,
      video: null,
      scenes: [
        { at: 0,     title: 'A sample contract', text: 'A fictional services agreement is uploaded for analysis.' },
        { at: 3000,  title: 'Clauses and obligations', text: 'Example clauses, obligations and key details are highlighted in the text.' },
        { at: 7000,  title: 'Structured summary', text: 'The extracted information is organized into a structured summary.' },
        { at: 10500, title: 'Human review', text: 'The legal team reviews the summary and makes the decisions. The application doesn’t give legal advice.' }
      ],
      stage:
        '<div class="wt-ci">' + SAMPLE +
          '<div class="wt-win wt-ci__doc wt-in wt-shift in-1">' +
            '<div class="wt-win__bar"><span class="wt-dots"><i></i><i></i><i></i></span><b>sample-services-agreement.pdf</b></div>' +
            '<div class="wt-ci__page">' +
              '<p class="wt-ci__t">Master services agreement</p>' +
              '<p>Between Sample Client Pvt. Ltd. and Sample Supplier Ltd., effective 1 April 2025.</p>' +
              '<p><b>7. Term.</b> This agreement runs for <mark class="wt-hl wt-hl--key">24 months</mark>.</p>' +
              '<p><b>9. Reporting.</b> <mark class="wt-hl wt-hl--ob">The Supplier shall deliver a monthly service report.</mark></p>' +
              '<p><b>12. Termination.</b> <mark class="wt-hl wt-hl--cl">Either party may terminate with 60 days’ written notice.</mark></p>' +
            '</div>' +
            '<p class="wt-ci__legend wt-in in-2"><span class="k">Key detail</span><span class="o">Obligation</span><span class="c">Clause</span></p>' +
          '</div>' +
          '<div class="wt-ci__sum wt-in in-3">' +
            '<p class="wt-ci__h">Summary</p>' +
            '<dl>' +
              '<div><dt>Parties</dt><dd>2</dd></div>' +
              '<div><dt>Effective</dt><dd>1 Apr 2025</dd></div>' +
              '<div><dt>Term</dt><dd>24 months</dd></div>' +
              '<div><dt>Obligation</dt><dd>Monthly service report · Supplier</dd></div>' +
              '<div><dt>Clauses</dt><dd>Term · Reporting · Termination</dd></div>' +
            '</dl>' +
            '<div class="wt-ci__review wt-in in-4">' +
              '<p><b>Ready for legal review</b></p>' +
              '<p>Reviewed and decided by the legal team · Tracked: review before Apr 2027</p>' +
            '</div>' +
          '</div>' +
        '</div>'
    },

    'resume-matching': {
      title: 'AI Resume Matching',
      caseUrl: 'work/resume-matching/',
      caption: 'Illustrative walkthrough · sample data',
      duration: 14000,
      video: null,
      scenes: [
        { at: 0,     title: 'Role requirements', text: 'A fictional Data Analyst role lists required and preferred skills and experience.' },
        { at: 3000,  title: 'Candidate profile', text: 'A fictional candidate’s resume is read and understood.' },
        { at: 6500,  title: 'Skills and experience', text: 'Relevant skills and experience in the profile are matched to the requirements.' },
        { at: 10000, title: 'Comparison for review', text: 'A structured comparison supports the people who make the decision.' }
      ],
      stage:
        '<div class="wt-rm">' + SAMPLE +
          '<div class="wt-rm__pair wt-in in-1 out-4">' +
            '<div class="wt-rm__card wt-rm__role">' +
              '<p class="wt-rm__h">Role requirements</p>' +
              '<p class="wt-rm__name">Data Analyst <small>Fictional role</small></p>' +
              '<ul>' +
                '<li data-m="1">SQL <em>Required</em></li>' +
                '<li data-m="2">Python <em>Required</em></li>' +
                '<li data-m="3">2+ years in analytics <em>Required</em></li>' +
                '<li data-m="4" class="is-part">Dashboards <em>Preferred</em></li>' +
              '</ul>' +
            '</div>' +
            '<div class="wt-rm__card wt-rm__cand wt-in in-2">' +
              '<p class="wt-rm__h">Candidate profile</p>' +
              '<p class="wt-rm__name">Candidate A <small>Fictional resume</small></p>' +
              '<ul>' +
                '<li data-m="1">SQL reports for sales data</li>' +
                '<li data-m="2">Python scripts for data cleaning</li>' +
                '<li data-m="3">3 years as a junior analyst</li>' +
                '<li data-m="4" class="is-part">Spreadsheet charts for monthly reviews</li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="wt-rm__table wt-in in-4">' +
            '<p class="wt-rm__h">Comparison · Candidate A and Data Analyst (fictional)</p>' +
            '<div class="wt-rm__row wt-rm__row--h"><span>Requirement</span><span>In the profile</span><span>Alignment</span></div>' +
            '<div class="wt-rm__row"><span>SQL</span><span>SQL reports for sales data</span><span class="ok">Aligned</span></div>' +
            '<div class="wt-rm__row"><span>Python</span><span>Python scripts for data cleaning</span><span class="ok">Aligned</span></div>' +
            '<div class="wt-rm__row"><span>2+ years in analytics</span><span>3 years as a junior analyst</span><span class="ok">Aligned</span></div>' +
            '<div class="wt-rm__row"><span>Dashboards (preferred)</span><span>Spreadsheet charts for monthly reviews</span><span class="part">Partly aligned</span></div>' +
            '<p class="wt-rm__review">For the recruiter to review and decide</p>' +
          '</div>' +
        '</div>'
    },

    'business-sheet': {
      title: 'Business Sheet',
      caseUrl: 'work/business-sheet/',
      caption: 'Illustrative walkthrough · sample data',
      duration: 21000,
      video: null,
      scenes: [
        { at: 0,     title: 'Excel data', text: 'The starting point: sample financial-year data in an Excel-style sheet, which used to be turned into views by hand.' },
        { at: 3400,  title: 'Choose what to compare', text: 'An organization, a line of business and a financial-year range are selected (sample selections).' },
        { at: 6800,  title: 'Generate charts', text: 'One button turns the selected data into a chart, instead of building it manually in Excel.' },
        { at: 10200, title: 'Compare across years', text: 'The chart compares sample revenue from FY2014 to the current FY: 64 at the start, 132 now.' },
        { at: 13600, title: 'Change a selection', text: 'Changing a selection, here the first financial year, updates the chart.' },
        { at: 17000, title: 'Ask about a metric', text: 'The chatbot explains a metric using the figures in the chart (sample answer).' }
      ],
      stage: (function () {
        /* sample revenue for Org A · LOB 2, FY2014 to the current FY; the sheet, the charts
           and the chatbot's answer all use these numbers */
        var fy = ['FY2014', 'FY2015', 'FY2016', 'FY2017', 'FY2018', 'FY2019', 'FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024', 'Current FY'];
        var rev = [64, 70, 68, 76, 81, 79, 88, 96, 92, 108, 120, 132];
        var bars = function (from) {
          return rev.slice(from).map(function (v, i, a) {
            var edge = i === 0 || i === a.length - 1;
            return '<li' + (edge ? ' class="is-edge"' : '') + ' style="--h:' + Math.round(v / 132 * 88) + '%;--i:' + i + '">' +
              (edge ? '<span>' + v + '</span>' : '') + '<i></i></li>';
          }).join('');
        };
        var gap = '<tr class="is-gap"><th scope="row">⋮</th><td>⋮</td><td></td><td></td><td>⋮</td></tr>';
        var row = function (i) {
          return '<tr><th scope="row">' + (i + 2) + '</th><td>' + fy[i] + '</td><td>Org A</td><td>LOB 2</td><td>' + rev[i] + '</td></tr>';
        };
        return '<div class="wt-bs">' + SAMPLE +
          '<div class="wt-win wt-bs__win wt-in in-1">' +
            '<div class="wt-win__bar"><span class="wt-dots"><i></i><i></i><i></i></span><b>Business Sheet</b></div>' +
            '<div class="wt-bs__tools">' +
              '<p class="wt-bs__pick p1"><span>Organization</span><b class="wt-bs__val"><i class="ph">Select…</i><i class="v">Org A</i></b></p>' +
              '<p class="wt-bs__pick p2"><span>Line of business</span><b class="wt-bs__val"><i class="ph">Select…</i><i class="v">LOB 2</i></b></p>' +
              '<p class="wt-bs__pick p3"><span>Financial years</span><b class="wt-bs__val"><i class="ph">Select…</i><i class="v"><span class="wt-bs__from"><span class="a">FY2014</span><span class="b">FY2020</span></span> → Current FY</i></b></p>' +
              '<p class="wt-bs__go"><span>Generate charts</span></p>' +
            '</div>' +
            '<div class="wt-bs__body">' +
              '<div class="wt-bs__sheet wt-shift">' +
                '<p class="wt-bs__file">sample-data.xlsx</p>' +
                '<table>' +
                  '<thead><tr><td></td><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th><th scope="col">D</th></tr></thead>' +
                  '<tbody>' +
                    '<tr class="is-head"><th scope="row">1</th><td>FY</td><td>Org</td><td>LOB</td><td>Revenue</td></tr>' +
                    row(0) + row(1) + gap + row(6) + gap + row(11) +
                  '</tbody>' +
                '</table>' +
              '</div>' +
              '<div class="wt-bs__chart">' +
                '<p class="wt-bs__title"><b>Revenue · Org A · LOB 2</b><span>Sample data</span></p>' +
                '<div class="wt-bs__plots">' +
                  '<ol class="wt-bs__plot wt-bs__all">' + bars(0) + '</ol>' +
                  '<ol class="wt-bs__plot wt-bs__few">' + bars(6) + '</ol>' +
                '</div>' +
                '<p class="wt-bs__axis"><span class="wt-bs__from"><span class="a">FY2014</span><span class="b">FY2020</span></span><span>Current FY</span></p>' +
              '</div>' +
              '<div class="wt-bs__chat">' +
                '<p class="wt-kp__chat-h"><i></i>Metrics assistant</p>' +
                '<p class="wt-bubble wt-bubble--me">What does revenue growth mean here?</p>' +
                '<p class="wt-bubble wt-bubble--bot wt-bs__reply">It’s how much revenue changed across the years you’ve selected, as a share of the first year. For Org A · LOB 2: (132 − 88) ÷ 88 = <b>50%</b> from FY2020 to the current FY.<small>Sample answer</small></p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      })()
    }
  };
})();
