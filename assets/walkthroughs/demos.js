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
      duration: 16000,
      video: null,
      scenes: [
        { at: 0,     title: 'An information need', text: 'A new joiner (a sample user) needs onboarding information.' },
        { at: 3000,  title: 'Search and catalogue', text: 'They search for “onboarding” and browse the catalogue to HR › Onboarding.' },
        { at: 6000,  title: 'Relevant documents', text: 'Matching sample documents appear, with the onboarding guide first.' },
        { at: 9200,  title: 'Ask the AI chatbot', text: 'The dedicated chatbot answers in conversation and points to where the guide is.' },
        { at: 12600, title: 'One platform', text: 'Repository, search and catalogue, file discovery, sharing and the chatbot in one place, with role-based access.' }
      ],
      stage:
        '<div class="wt-kp">' + SAMPLE +
          '<div class="wt-kp__need wt-in in-1 out-2">' +
            '<p class="wt-chip"><i></i>Sample user · New joiner</p>' +
            '<p class="wt-note">“Where do I find the onboarding guide and the laptop setup steps?”</p>' +
          '</div>' +
          '<div class="wt-win wt-kp__win wt-in in-2 out-5">' +
            '<div class="wt-win__bar"><span class="wt-dots"><i></i><i></i><i></i></span><b>Knowledge portal</b><span>Role: User</span></div>' +
            '<div class="wt-kp__body">' +
              '<ul class="wt-kp__cat">' +
                '<li>Catalogue</li><li class="is-pick">HR › Onboarding</li><li>IT › Onboarding</li><li>Finance</li><li>Policies</li>' +
              '</ul>' +
              '<div class="wt-kp__main">' +
                '<p class="wt-kp__query"><span>Search</span><b>onboarding</b></p>' +
                '<ul class="wt-kp__results">' +
                  '<li class="wt-in in-3 is-top"><span class="wt-file wt-file--pdf">PDF</span><span><b>New joiner onboarding guide</b><small>HR · Onboarding</small></span></li>' +
                  '<li class="wt-in in-3"><span class="wt-file wt-file--doc">DOC</span><span><b>Laptop and access setup</b><small>IT · Onboarding</small></span></li>' +
                  '<li class="wt-in in-3"><span class="wt-file wt-file--xls">XLS</span><span><b>First-week checklist</b><small>HR · Templates</small></span></li>' +
                '</ul>' +
              '</div>' +
              '<div class="wt-kp__chat wt-in in-4">' +
                '<p class="wt-kp__chat-h"><i></i>Assistant</p>' +
                '<p class="wt-bubble wt-bubble--me">Where’s the onboarding guide for new joiners?</p>' +
                '<p class="wt-bubble wt-bubble--bot wt-in in-4 wt-late">It’s in HR › Onboarding: “New joiner onboarding guide”. Laptop setup is under IT › Onboarding.</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="wt-kp__map wt-in in-5">' +
            '<ul class="wt-kp__tiles">' +
              '<li>Repository</li><li>Search and catalogue</li><li>File discovery</li><li>Sharing</li><li class="is-ai">AI chatbot</li>' +
            '</ul>' +
            '<p class="wt-kp__roles"><b>Role-based access</b><span>Viewer</span><span>User</span><span>Admin</span><span>Champion</span></p>' +
          '</div>' +
        '</div>'
    },

    'data-migration': {
      title: 'Enterprise Data Migration',
      caseUrl: 'work/data-migration/',
      caption: 'Illustrative walkthrough · sample data',
      duration: 16000,
      video: null,
      scenes: [
        { at: 0,     title: 'Source data', text: 'Different types of data sit in traditional Microsoft SQL Server environments (sample tables).' },
        { at: 3000,  title: 'Extract', text: 'Data is extracted from the SQL Server sources.' },
        { at: 6000,  title: 'Transform and validate', text: 'It’s transformed for the target warehouse, then validated before loading.' },
        { at: 10000, title: 'Load into Snowflake', text: 'Validated data is loaded into the Snowflake data warehouse.' },
        { at: 13000, title: 'The end-to-end flow', text: 'Extract, transform, validate, load — with Azure Data Factory as supporting infrastructure.' }
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
          '<p class="wt-dm__infra wt-in in-5">Azure Data Factory · supporting infrastructure</p>' +
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
      duration: 15000,
      video: null,
      scenes: [
        { at: 0,     title: 'Choose what to compare', text: 'An organization, a line of business and the financial years are selected (sample selections).' },
        { at: 3500,  title: 'Compare across years', text: 'A sample metric is compared year by year, from FY2014 to the current FY.' },
        { at: 7500,  title: 'Ask about metrics', text: 'A user asks the chatbot which metrics are tracked.' },
        { at: 11000, title: 'Metric explanation', text: 'The chatbot lists the metrics and explains what one of them means (sample answer).' }
      ],
      stage:
        '<div class="wt-bs">' + SAMPLE +
          '<div class="wt-bs__sel wt-in wt-shift in-1">' +
            '<p><span>Organization</span><b>Org A</b></p>' +
            '<p><span>Line of business</span><b>LOB 2</b></p>' +
            '<p><span>Financial years</span><b>FY2014 → Current FY</b></p>' +
          '</div>' +
          '<div class="wt-win wt-bs__chart wt-in wt-shift wt-late in-1">' +
            '<div class="wt-win__bar"><b>Sample metric A · Org A · LOB 2</b><span>Sample data</span></div>' +
            '<div class="wt-bs__plot">' +
              [34, 38, 36, 44, 47, 45, 52, 58, 55, 63, 68, 74].map(function (h, i) {
                return '<i style="--h:' + h + '%;--i:' + i + '"></i>';
              }).join('') +
            '</div>' +
            '<p class="wt-bs__axis"><span>FY2014</span><span>Current FY</span></p>' +
          '</div>' +
          '<div class="wt-bs__chat wt-in in-3">' +
            '<p class="wt-kp__chat-h"><i></i>Metrics assistant</p>' +
            '<p class="wt-bubble wt-bubble--me">Which metrics are tracked?</p>' +
            '<p class="wt-bubble wt-bubble--bot wt-in in-3 wt-late">Sample metric A, Sample metric B and Sample metric C.</p>' +
            '<p class="wt-bubble wt-bubble--me wt-in in-4">What does Sample metric B mean?</p>' +
            '<p class="wt-bubble wt-bubble--bot wt-in in-4 wt-late"><b>Sample metric B</b> — an illustrative definition: what it measures and how it’s compared across financial years.</p>' +
          '</div>' +
        '</div>'
    }
  };
})();
