// The interactive data architecture: a reference model of how the domains connect.
// It is deliberately generic. "uses" link a stage to documented project work, and
// never claim that a project was built on this exact architecture.
module.exports = {
  note: 'An illustrative view of how data engineering, AI and automation can work together to transform raw information into actionable insights.',
  disclaimer: 'It is a reference model, not the architecture of any single project.',
  stages: [
    {
      id: 'sources',
      name: 'Data Sources',
      icon: 'sources', scene: 'sources', tone: 'cyan',
      does: 'Where data originates: operational databases, spreadsheets, documents and application APIs. Each source has its own shape, schedule and quality.',
      short: 'Databases, spreadsheets, documents',
      tech: ['Microsoft SQL Server', 'Excel workbooks', 'Documents & PDFs', 'APIs'],
      uses: [
        ['SQL Server environments as the migration source', 'work/data-migration/'],
        ['Excel reporting data behind Business Sheet', 'work/business-sheet/'],
        ['Uploaded contracts in Contract Intelligence', 'work/contract-intelligence/'],
      ],
    },
    {
      id: 'ingestion',
      name: 'Data Ingestion',
      icon: 'ingest', scene: 'ingest', tone: 'blue',
      does: 'Brings data from the sources into the platform, in batches or on demand, keeping track of what arrived and when.',
      short: 'Bringing data in',
      tech: ['Azure Data Factory', 'Python', 'API Integrations', 'File uploads'],
      uses: [
        ['Extraction from SQL Server, with Azure Data Factory as supporting infrastructure', 'work/data-migration/'],
      ],
    },
    {
      id: 'processing',
      name: 'Data Processing',
      icon: 'process', scene: 'process', tone: 'blue',
      does: 'Cleans, transforms and validates data so that what reaches the warehouse is consistent and can be trusted.',
      short: 'Clean, transform, validate',
      tech: ['Databricks', 'Python', 'SQL', 'ETL / ELT'],
      uses: [
        ['Transform and validate stages before loading', 'work/data-migration/'],
      ],
    },
    {
      id: 'warehouse',
      name: 'Data Warehouse',
      icon: 'warehouse', scene: 'warehouse', tone: 'cyan',
      does: 'Central, modelled storage that analytics and AI read from: one governed place instead of many copies.',
      short: 'One governed store',
      tech: ['Snowflake', 'Data Warehousing', 'Data Pipelines'],
      uses: [
        ['Snowflake as the migration’s cloud data warehouse', 'work/data-migration/'],
      ],
    },
    {
      id: 'ai',
      name: 'AI / ML Layer',
      icon: 'ai', scene: 'ai', tone: 'violet',
      does: 'Models that read, compare, extract and answer: language models with retrieval, agents and evaluation, kept reviewable by people.',
      short: 'Read, match, extract, answer',
      tech: ['Large Language Models', 'Retrieval-Augmented Generation', 'Machine Learning', 'AI Agents', 'Model Evaluation'],
      uses: [
        ['Clause, obligation and key-detail extraction', 'work/contract-intelligence/'],
        ['Candidate profiles compared with role requirements', 'work/resume-matching/'],
        ['The Knowledge Portal’s AI chatbot', 'work/knowledge-portal/'],
      ],
    },
    {
      id: 'automation',
      name: 'Automation',
      icon: 'automation', scene: 'automation', tone: 'green',
      does: 'Workflows, integrations and agents that act on the results, so people review outcomes instead of repeating steps.',
      short: 'Act on the results',
      tech: ['Workflow Automation', 'AI Agents', 'API Integrations', 'Process Automation'],
      uses: [
        ['Requests routed through an approval queue', 'work/knowledge-portal/'],
        ['Charts generated in one action instead of by hand', 'work/business-sheet/'],
        ['AI agents for bug reports and code adaptation', '#projects'],
      ],
    },
    {
      id: 'bi',
      name: 'Analytics & BI',
      icon: 'bi', scene: 'bi', tone: 'amber',
      does: 'Dashboards, comparisons and explanations that turn the processed data into decisions.',
      short: 'Decisions and insight',
      tech: ['Power BI', 'Tableau', 'DAX', 'Business Intelligence', 'Data Storytelling'],
      uses: [
        ['Financial-year comparisons with a metrics chatbot', 'work/business-sheet/'],
        ['Dashboards migrated with their underlying data sources', 'work/data-migration/'],
      ],
    },
  ],
};
