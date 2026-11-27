// What the terminal knows, assembled from the same data as the page, so the two
// can never disagree. Embedded in the homepage as JSON for src/scripts/terminal.js.
const site = require('./site.js');
const domains = require('./domains.js');
const roles = require('./experience.js');
const edu = require('./education.js');
const { PROJECTS, EXPERIMENT_TITLES } = require('./projects.js');

module.exports = (titles) => ({
  prompt: 'gaurang@dataforge:~$',
  whoami: `${site.firstName.toLowerCase()} · ${site.role} @ ${site.company} · ${site.location}`,
  about: [
    `${site.name}: ${site.role} at ${site.company}, ${site.location}.`,
    'B.Tech in Computer Science Engineering, specializing in Big Data Analytics.',
    'Works across data engineering and applied AI: from data, to AI, to an application people use.',
    'Next: agentic coding, managing AI agents and tailoring LLMs to business use cases.',
  ],
  skills: domains.map((d) => ({ name: d.name, tech: d.tech })),
  projects: PROJECTS.map((p) => ({
    code: p.code,
    title: titles[p.slug] || EXPERIMENT_TITLES[p.slug],
    kicker: p.kicker,
    role: p.role,
    status: p.status ? p.status[1] : null,
    url: p.type === 'Company project' ? `work/${p.slug}/` : null,
  })),
  experience: roles.map((x) => ({ when: x.when, role: x.role, org: x.org, place: x.place, points: x.achievements })),
  education: {
    degree: `${edu.degree.title}, ${edu.degree.school}`,
    detail: `${edu.degree.when} · ${edu.degree.specialization} · CGPA ${edu.degree.cgpa}/${edu.degree.scale}`,
    certs: edu.certifications.map((c) => c.title),
  },
  stack: [
    ['Languages', ['Python', 'SQL', 'JavaScript']],
    ['Data', ['Snowflake', 'Databricks', 'Apache Spark', 'Microsoft SQL Server', 'Azure Data Factory']],
    ['AI', ['Large Language Models', 'Retrieval-Augmented Generation', 'AI Agents', 'Prompt Engineering']],
    ['Analytics', ['Power BI', 'Tableau', 'DAX']],
    ['This site', ['Static HTML generated with Node.js', 'Vanilla JavaScript', 'CSS', 'GitHub Pages']],
  ],
  contact: { email: site.email, linkedin: site.linkedin, github: site.github, resume: site.resume },
});
