// "Inside my engineering workflow": how I approach a problem, in five stages.
// Written for recruiters and non-technical visitors. Each example points to documented
// work; the section says plainly that not every activity applies to every project.
// Tools come only from the owner's own lists (see src/data/domains.js).
module.exports = {
  note: 'This is how I approach engineering work. The examples point to documented projects; not every activity applies to every project.',
  stages: [
    {
      key: 'understand', num: '01', tone: 'cyan', icon: 'understand', scene: 'understand',
      name: 'Understand the problem',
      short: 'Requirements, data, constraints, outcomes',
      what: 'Understand business requirements, data sources, constraints and desired outcomes, before choosing any technology.',
      activities: ['Clarify who will use the solution, and what decision or task it should support', 'Read the requirements or specification closely', 'Look at the data that exists, where it lives and how reliable it is', 'Agree what a good outcome looks like'],
      tools: ['SQL', 'Python', 'Requirement documents'],
      example: ['The Knowledge Portal began from a supplied functional specification, which set out its roles and capabilities.', 'work/knowledge-portal/'],
    },
    {
      key: 'design', num: '02', tone: 'violet', icon: 'design', scene: 'design',
      name: 'Design the system',
      short: 'Architecture, stack, data flow, plan',
      what: 'Plan the architecture, technology stack, data flow and implementation strategy, so the build has a clear shape.',
      activities: ['Map how data moves from its source to the people who use it', 'Decide where data is stored and how it is shaped', 'Split the work into stages that can each be checked', 'Plan where people review what AI produces'],
      tools: ['Snowflake', 'ETL / ELT', 'Data Pipelines', 'Data Warehousing'],
      example: ['In the Data Migration initiative, validation is its own stage between transforming and loading, so problems surface before data reaches Snowflake.', 'work/data-migration/'],
    },
    {
      key: 'build', num: '03', tone: 'blue', icon: 'build', scene: 'build',
      name: 'Build & engineer',
      short: 'Pipelines, applications, AI, automation',
      what: 'Develop data pipelines, applications, AI capabilities and automation workflows that people can actually use.',
      activities: ['Build pipelines and transformations', 'Develop the application and its interface', 'Add AI capabilities such as chatbots, extraction or matching', 'Automate steps that used to be repeated by hand'],
      tools: ['Python', 'SQL', 'Snowflake', 'Databricks', 'Generative AI', 'LLMs', 'RAG', 'AI Agents'],
      example: ['Business Sheet was built end to end: from chart generation that replaces manual Excel work to the chatbot that explains the metrics.', 'work/business-sheet/'],
    },
    {
      key: 'validate', num: '04', tone: 'green', icon: 'validate', scene: 'validate',
      name: 'Test & validate',
      short: 'Function, data quality, accuracy, reliability',
      what: 'Validate functionality, data quality, performance, accuracy and reliability, and keep people in the loop where AI is involved.',
      activities: ['Test features and fix defects', 'Check data quality before it is loaded or shown', 'Evaluate AI output and keep a human review step', 'Confirm the solution meets the requirements'],
      tools: ['SQL', 'Model Evaluation', 'Testing and debugging'],
      example: ['Contract Intelligence presents extracted clauses and obligations as a summary for the legal team to review: it supports their decisions rather than making them.', 'work/contract-intelligence/'],
    },
    {
      key: 'deploy', num: '05', tone: 'amber', icon: 'deploy', scene: 'deploy',
      name: 'Deploy & improve',
      short: 'Release, observe, refine',
      what: 'Deploy the solution, monitor its performance and continuously improve it.',
      activities: ['Release to the people who will use it', 'Collect feedback and questions', 'Refine the solution in small iterations', 'Document it so others can run it'],
      tools: ['Stakeholder feedback', 'Iterative releases', 'Documentation'],
      example: ['Resume Matching began as my proof of concept and is now live in production; the Knowledge Portal has been refined through business feedback.', 'work/resume-matching/'],
    },
  ],
};
