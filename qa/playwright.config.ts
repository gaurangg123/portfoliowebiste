// Playwright end-to-end tests. The site is served exactly as GitHub Pages serves it:
// under /portfoliowebiste/, with 404.html for missing paths (tools/serve.js).
//   npm run test:e2e
import { defineConfig, devices } from '@playwright/test';

const PORT = 4174;

export default defineConfig({
  testDir: './playwright',
  timeout: 45_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}/portfoliowebiste/`,
    trace: 'off',
  },
  webServer: {
    command: `node tools/serve.js ${PORT}`,
    cwd: '..',
    url: `http://127.0.0.1:${PORT}/portfoliowebiste/`,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } }, testIgnore: /responsive/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /responsive/ },
    { name: 'responsive', testMatch: /responsive/ },
  ],
});
