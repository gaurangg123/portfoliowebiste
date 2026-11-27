// What the Query the Engineer assistant knows: assembled at build time from the same data
// as the pages, so the two can never disagree. Embedded in /query-engineer/ as JSON and read
// by src/scripts/query-engine.js. Links are relative to the site root.
const site = require('./site.js');
const domains = require('./domains.js');
const roles = require('./experience.js');
const edu = require('./education.js');
const workflow = require('./workflow.js');
const profile = require('./profile.js');
const { CATEGORIES, PROJECTS } = require('./projects.js');

// the eight questions offered on the page (and pre-answered for visitors without JavaScript)
const SUGGESTIONS = [
  'Tell me about your experience at Tata Technologies.',
  'What Data Engineering projects have you worked on?',
  'What is your experience with Snowflake?',
  'Tell me about your AI projects.',
  'How do you approach building an AI-powered application?',
  'What technologies do you work with?',
  'Tell me about your professional journey.',
  'How can I contact you?',
];

// how visitors might name each project or organisation
const PROJECT_ALIASES = {
  'knowledge-portal': ['knowledge portal', 'enterprise knowledge portal', 'knowledge platform'],
  'business-sheet': ['business sheet', 'excel reporting', 'metrics chatbot'],
  'contract-intelligence': ['contract intelligence', 'legal contract', 'contract', 'contracts', 'legal'],
  'resume-matching': ['resume matching', 'résumé matching', 'candidate', 'candidates', 'recruitment', 'hiring tool'],
  'data-migration': ['data migration', 'migration', 'migrating', 'sql server to snowflake'],
  'bug-detailer': ['bug detailer', 'bug report', 'bug reports'],
  'web-app-builder': ['web app builder', 'app builder'],
};
const ORG_ALIASES = {
  tata: ['tata technologies', 'tata', 'current role', 'current job', 'current position', 'present role'],
  vertisystem: ['vertisystem', 'verti system'],
  swap: ['swap infotech', 'swap'],
};
// other names for technologies that appear in the data
const TECH_SYNONYMS = {
  'large language models': ['llm', 'llms', 'large language model'],
  'retrieval-augmented generation': ['rag', 'retrieval augmented generation'],
  'machine learning': ['ml'],
  'generative ai': ['genai', 'gen ai'],
  'ai agents': ['agents', 'agentic', 'ai agent'],
  'azure data factory': ['adf', 'azure'],
  'microsoft sql server': ['sql server', 'mssql'],
  'power bi': ['powerbi'],
  'etl / elt': ['etl', 'elt'],
  'business intelligence': ['bi'],
  angularjs: ['angular'],
  javascript: ['js'],
  'ai chatbots': ['chatbot', 'chatbots'],
};

module.exports = (titles) => {
  const cat = Object.fromEntries(CATEGORIES);
  return {
    name: site.name,
    firstName: site.firstName,
    role: site.role,
    company: site.company,
    location: site.location,
    intro: site.intro,
    contact: { email: site.email, linkedin: site.linkedin, github: site.github, resume: site.resume, timeZone: 'IST (UTC+5:30)' },
    chapters: profile.chapters,
    philosophy: profile.philosophy,
    roles: roles.map((r) => ({ id: r.id, when: r.when, current: !!r.current, role: r.role, org: r.org, place: r.place, description: r.description, achievements: r.achievements, more: r.more, tech: r.tech, aliases: ORG_ALIASES[r.id] || [] })),
    projects: PROJECTS.map((p) => ({
      slug: p.slug,
      code: p.code,
      title: titles[p.slug],
      type: p.type,
      kicker: p.kicker,
      categories: p.categories,
      summary: p.summary,
      role: p.role,
      contribution: p.contribution || null,
      approach: p.approach || null,
      outcome: p.outcome || null,
      status: p.status ? p.status[1] : null,
      tech: p.tech || null,
      url: p.type === 'Company project' ? `work/${p.slug}/` : '#projects',
      aliases: PROJECT_ALIASES[p.slug] || [],
    })),
    categories: cat,
    domains: domains.map((d) => ({ id: d.id, name: d.name, line: d.line, tech: d.tech, applied: d.applied, link: d.link })),
    workflow: { note: workflow.note, stages: workflow.stages.map((s) => ({ num: s.num, name: s.name, what: s.what, activities: s.activities, tools: s.tools, example: s.example })) },
    education: {
      degree: edu.degree.title, school: edu.degree.school, when: edu.degree.when, specialization: edu.degree.specialization,
      cgpa: `${edu.degree.cgpa} / ${edu.degree.scale}`,
      certs: edu.certifications,
    },
    synonyms: TECH_SYNONYMS,
    suggestions: SUGGESTIONS,
  };
};
module.exports.SUGGESTIONS = SUGGESTIONS;
