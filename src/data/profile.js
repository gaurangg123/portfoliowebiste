// The story told in About and by the Query the Engineer assistant: the path so far and
// the way of working. Every line comes from the verified profile; nothing is added.
const edu = require('./education.js');

module.exports = {
  // [when, chapter, what happened]
  chapters: [
    ['2021 – 2025', 'Foundation', `B.Tech in Computer Science Engineering at ${edu.degree.school}, specializing in ${edu.degree.specialization}.`],
    ['2023', 'Software', 'Front-end development on live web projects at Swap Infotech, in an Agile team.'],
    ['2023 – 2024', 'Data', 'SQL analysis, data collection and reporting in a data-analytics internship at Vertisystem.'],
    ['Oct 2025 – now', 'Data & AI', 'Data engineering and applied AI at Tata Technologies: knowledge platforms, analytics automation, document intelligence and a Snowflake migration.'],
    ['Next', 'Agents', 'Going deeper into agentic coding, managing AI agents and tailoring LLMs to business use cases.'],
  ],
  philosophy: 'I like taking an idea from data, to AI, to an application people use.',
};
