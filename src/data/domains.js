// The four engineering disciplines. Technologies are exactly the owner's lists;
// "applied" points only at documented work; there are no skill percentages anywhere.
module.exports = [
  {
    id: 'data', code: 'D-01', name: 'Data Engineering', tone: 'cyan', motif: 'pipeline', icon: 'warehouse',
    short: 'Pipelines · warehouses · ETL',
    line: 'Moving data reliably from source systems into warehouses, and shaping it so analytics and AI can trust it.',
    involves: ['Extracting data from operational systems', 'Transforming and validating it on the way', 'Loading it into a governed warehouse'],
    applied: 'Contributed to a completed SQL Server → Snowflake migration, covering data, dashboards and their data sources.',
    link: 'work/data-migration/',
    tech: ['Snowflake', 'Databricks', 'Python', 'SQL', 'ETL / ELT', 'Data Pipelines', 'Data Warehousing'],
  },
  {
    id: 'ai', code: 'D-02', name: 'AI & Machine Learning', tone: 'violet', motif: 'neural', icon: 'ai',
    short: 'LLMs · RAG · agents',
    line: 'Building applications on language models that read, match, extract and answer, with people kept in the loop.',
    involves: ['Chatbots that answer from organisational knowledge', 'Extracting structured information from documents', 'Comparing profiles against requirements'],
    applied: 'A knowledge-portal chatbot, contract clause and obligation extraction, and the Resume Matching proof of concept, now live.',
    link: '#projects',
    tech: ['Machine Learning', 'Generative AI', 'Large Language Models', 'Retrieval-Augmented Generation', 'AI Agents', 'Model Evaluation'],
  },
  {
    id: 'automation', code: 'D-03', name: 'Intelligent Automation', tone: 'green', motif: 'workflow', icon: 'automation',
    short: 'Workflows · APIs · assistants',
    line: 'Replacing repetitive, manual steps with workflows, integrations and AI agents that hand the result back to a person.',
    involves: ['Turning manual, repeated steps into one action', 'Connecting systems through APIs', 'Assistants that draft work for a person to review'],
    applied: 'Business Sheet automates manual Excel reporting; two AI-agent experiments write bug reports and adapt code.',
    link: 'work/business-sheet/',
    tech: ['Workflow Automation', 'API Integrations', 'Intelligent Assistants', 'Process Automation'],
  },
  {
    id: 'analytics', code: 'D-04', name: 'Analytics & Visualization', tone: 'amber', motif: 'chart', icon: 'bi',
    short: 'BI · dashboards · storytelling',
    line: 'Turning data into charts, dashboards and comparisons that make a decision easier to take.',
    involves: ['Choosing the view that answers the question', 'Comparisons across periods and segments', 'Explaining what a metric means'],
    applied: 'Financial-year comparisons in Business Sheet, migrated dashboards, and SQL reporting during a data-analytics internship.',
    link: 'work/business-sheet/',
    tech: ['Power BI', 'Tableau', 'DAX', 'Business Intelligence', 'Data Storytelling'],
  },
];
