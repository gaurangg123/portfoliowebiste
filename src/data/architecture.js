// The interactive data architecture: a reference model of how the domains connect.
// It is deliberately generic. "uses" link a stage to documented project work, and
// never claim that a project was built on this exact architecture.
module.exports = {
  note: 'A reference model of how the domains I work in connect, not the architecture of any single project.',
  stages: [
    {
      id: 'sources',
      name: 'Data Sources',
      short: 'Sources',
      icon: 'sources',
      does: 'Where data originates: operational databases, spreadsheets, documents and application APIs. Each source has its own shape, schedule and quality.',
      tech: ['Microsoft SQL Server', 'Excel workbooks', 'Documents & PDFs', 'REST APIs'],
      uses: [
        ['SQL Server environments as the migration source', 'work/data-migration/'],
        ['Excel reporting data behind Business Sheet', 'work/business-sheet/'],
        ['Uploaded contracts in Contract Intelligence', 'work/contract-intelligence/'],
      ],
    },
    {
      id: 'ingestion',
      name: 'Data Ingestion',
      short: 'Ingestion',
      icon: 'ingest',
      does: 'Brings data from the sources into the platform, in batches or on demand, keeping track of what arrived and when.',
      tech: ['Azure Data Factory', 'Python', 'API integrations', 'File uploads'],
      uses: [
        ['Extraction from SQL Server, with Azure Data Factory as supporting infrastructure', 'work/data-migration/'],
      ],
    },
    {
      id: 'processing',
      name: 'Data Processing',
      short: 'Processing',
      icon: 'process',
      does: 'Cleans, transforms and validates data so that what reaches the warehouse is consistent and can be trusted.',
      tech: ['Apache Spark', 'Databricks', 'Python', 'SQL', 'ETL / ELT'],
      uses: [
        ['Transform and validate stages before loading', 'work/data-migration/'],
      ],
    },
    {
      id: 'warehouse',
      name: 'Data Warehouse',
      short: 'Warehouse',
      icon: 'warehouse',
      does: 'Central, modelled storage that analytics and AI read from: one governed place instead of many copies.',
      tech: ['Snowflake', 'Data Modeling', 'Data Warehousing'],
      uses: [
        ['Snowflake as the migration’s cloud data warehouse', 'work/data-migration/'],
      ],
    },
    {
      id: 'ai',
      name: 'AI / ML Layer',
      short: 'AI / ML',
      icon: 'ai',
      does: 'Models that read, compare, extract and answer: language models with retrieval, agents and evaluation, kept reviewable by people.',
      tech: ['Large Language Models', 'Retrieval-Augmented Generation', 'Machine Learning', 'Prompt Engineering', 'Model Evaluation'],
      uses: [
        ['Clause, obligation and key-detail extraction', 'work/contract-intelligence/'],
        ['Candidate profiles compared with role requirements', 'work/resume-matching/'],
        ['The Knowledge Portal’s AI chatbot', 'work/knowledge-portal/'],
      ],
    },
    {
      id: 'automation',
      name: 'Automation',
      short: 'Automation',
      icon: 'automation',
      does: 'Workflows, integrations and agents that act on the results, so people review outcomes instead of repeating steps.',
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
      short: 'Analytics',
      icon: 'bi',
      does: 'Dashboards, comparisons and explanations that turn the processed data into decisions.',
      tech: ['Power BI', 'Tableau', 'DAX', 'Dashboard Development', 'Data Storytelling'],
      uses: [
        ['Financial-year comparisons with a metrics chatbot', 'work/business-sheet/'],
        ['Dashboards migrated with their underlying data sources', 'work/data-migration/'],
      ],
    },
  ],
};
