// Identity, links and navigation. Every page and the terminal read from here.
// Links are used exactly as given: the résumé is a Google Drive *viewing* URL and
// must stay one (no forced-download conversion).
module.exports = {
  name: 'Gaurang Ashava',
  firstName: 'Gaurang',
  brand: 'DataForge',
  tagline: 'Engineering Intelligence',
  role: 'GET – Data and AI Engineer',        // the confirmed designation
  headline: 'Data & AI Engineer',            // short form for titles and previews
  company: 'Tata Technologies',
  location: 'Pune, India',
  timeZone: 'Asia/Kolkata',
  siteUrl: 'https://gaurangg123.github.io/portfoliowebiste/',
  basePath: '/portfoliowebiste/',
  email: 'gaurangashava@gmail.com',
  github: 'https://github.com/gaurangg123',
  linkedin: 'https://www.linkedin.com/in/gaurang-ashava/',
  resume: 'https://drive.google.com/file/d/1LbktI3_wzj6RZ04ig9SzPOV6p41pssqJ/view?usp=sharing',

  intro: 'I build data-driven solutions, intelligent systems and automated workflows that transform complex information into meaningful outcomes.',
  // the hero's rotating line; the first one is what shows without JavaScript
  titles: ['Data Engineer', 'AI Engineer', 'Machine Learning Enthusiast', 'Automation Engineer', 'Analytics Specialist'],

  // homepage sections in page order: [id, label, show in the desktop bar]
  sections: [
    ['about', 'About', true],
    ['expertise', 'Expertise', true],
    ['projects', 'Projects', true],
    ['experience', 'Experience', true],
    ['education', 'Education', false],
    ['architecture', 'Architecture', false],
    ['terminal', 'Terminal', false],
    ['contact', 'Contact', true],
  ],
};
