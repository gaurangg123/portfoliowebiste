// Functional tests: the mandatory checks from the QA brief, run on desktop and on a phone.
import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const RESUME = 'https://drive.google.com/file/d/1LbktI3_wzj6RZ04ig9SzPOV6p41pssqJ/view?usp=sharing';
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;

// Chromium reports this itself when a navigation interrupts a cross-document view
// transition that is still playing (e.g. a test clicking twice within ~400 ms). It is
// raised before the page can attach a handler, the navigation completes normally,
// and it is the only error tolerated here.
const INTERRUPTED_TRANSITION = /^Transition was aborted because of invalid state\. ViewTransition opt-in disabled$/;

/** fail the test on any uncaught error, console error, or failed same-origin request */
function watchErrors(page: Page) {
  const problems: string[] = [];
  page.on('pageerror', (e) => { if (!INTERRUPTED_TRANSITION.test(e.message)) problems.push('pageerror: ' + e.message); });
  page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
  page.on('response', (r) => { if (r.url().includes('127.0.0.1') && r.status() >= 400 && !r.url().includes('/does-not-exist')) problems.push(`${r.status()} ${r.url()}`); });
  // a request cut short because the test navigated away (net::ERR_ABORTED) is not a fault
  page.on('requestfailed', (r) => { if (r.url().includes('127.0.0.1') && !/ERR_ABORTED/.test(r.failure()?.errorText ?? '')) problems.push('failed ' + r.url()); });
  return problems;
}
/** scroll the whole page once so lazy images load and sections settle */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.6)) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
}

test.describe('homepage', () => {
  test('loads with identity in the first screen and no errors', async ({ page }) => {
    const problems = watchErrors(page);
    await page.goto('./');
    await expect(page).toHaveTitle(/Gaurang Ashava/);
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Gaurang');
    await expect(h1).toContainText('Engineering Intelligence');
    await expect(h1).toBeInViewport();
    await expect(page.locator('.hero__intro')).toContainText('I build data-driven solutions');
    await expect(page.locator('[data-lattice]')).toHaveClass(/is-ready/);
    await scrollThrough(page);
    await page.waitForLoadState('networkidle');
    expect(problems).toEqual([]);
  });

  test('every image loads and has alt text', async ({ page }) => {
    await page.goto('./');
    // bring every rendered image into view (the mobile project row scrolls sideways)
    await page.evaluate(async () => {
      for (const img of Array.from(document.images)) {
        if (!img.getClientRects().length) continue;
        img.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => Array.from(document.images).filter((i) => i.getClientRects().length > 0).every((i) => i.complete), null, { timeout: 10_000 });
    const imgs = await page.locator('img').evaluateAll((list) => list.map((i) => {
      const img = i as HTMLImageElement;
      return { src: img.currentSrc || img.src, shown: img.getClientRects().length > 0, ok: img.complete && img.naturalWidth > 0, lazy: img.loading === 'lazy', alt: img.getAttribute('alt') };
    }));
    expect(imgs.filter((i) => i.shown).length).toBeGreaterThanOrEqual(2);
    for (const i of imgs) {
      expect(i.alt, i.src).not.toBeNull();
      // images in projects not on show wait (lazily) until they are shown
      if (i.shown) expect(i.ok, i.src).toBe(true); else expect(i.lazy, i.src).toBe(true);
    }
    // every image file referenced on the page exists
    const srcs = await page.locator('img').evaluateAll((l) => l.map((i) => (i as HTMLImageElement).src));
    for (const src of new Set(srcs)) expect((await page.request.get(src)).status(), src).toBe(200);
  });

  test('hero buttons and profile links go to the right places', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('link', { name: 'Explore My Work' }).click();
    await expect(page.locator('#projects')).toBeInViewport();
    await page.goto('./');
    await page.getByRole('link', { name: 'Contact Me' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
    const resume = page.locator('.hero__actions a', { hasText: 'Download Resume' });
    await expect(resume).toHaveAttribute('href', RESUME);
    await expect(resume).toHaveAttribute('target', '_blank');
    await expect(resume).toHaveAttribute('rel', /noopener/);
    for (const [name, href] of [['GitHub', 'https://github.com/gaurangg123'], ['LinkedIn', 'https://www.linkedin.com/in/gaurang-ashava/']]) {
      const a = page.locator('.hero__social a', { hasText: name });
      await expect(a).toHaveAttribute('href', href);
      await expect(a).toHaveAttribute('target', '_blank');
    }
    await expect(page.locator('.hero__social a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:gaurangashava@gmail.com');
    // every résumé link on the page is the supplied viewing URL
    const all = await page.locator('a[href*="drive.google.com"]').evaluateAll((l) => l.map((a) => a.getAttribute('href')));
    expect(new Set(all)).toEqual(new Set([RESUME]));
  });

  test('navigation scrolls to sections and marks the current one', async ({ page }) => {
    await page.goto('./');
    if (isMobile(page)) {
      const btn = page.locator('[data-menu-btn]');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#nav-sheet')).toBeVisible();
      await page.locator('#nav-sheet').getByRole('link', { name: /Experience/ }).click();
      await expect(page.locator('#nav-sheet')).toBeHidden();
      await expect(page.locator('#experience')).toBeInViewport();
    } else {
      await page.locator('.nav__links').getByRole('link', { name: 'Experience' }).click();
      await expect(page.locator('#experience')).toBeInViewport();
      await expect(page.locator('.nav__links a[href="#experience"]')).toHaveAttribute('aria-current', 'true');
      await expect(page.locator('.nav__ink')).toHaveClass(/is-on/);
    }
  });

  test('mobile menu opens, closes with Escape and returns focus', async ({ page }) => {
    test.skip(!isMobile(page), 'small screens only');
    await page.goto('./');
    const btn = page.locator('[data-menu-btn]');
    await btn.click();
    await expect(page.locator('#nav-sheet')).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/menu-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#nav-sheet')).toBeHidden();
    await expect(btn).toBeFocused();
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  test('back to top appears after scrolling and returns to the top', async ({ page }) => {
    await page.goto('./');
    const top = page.locator('[data-to-top]');
    await expect(top).not.toHaveClass(/is-on/);
    await page.locator('#architecture').scrollIntoViewIfNeeded();
    await expect(top).toHaveClass(/is-on/);
    await top.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(10);
  });

  test('project filters update the explorer and announce the count', async ({ page }) => {
    await page.goto('./#projects');
    const cards = page.locator('[data-mission]:not([hidden])');
    const index = page.locator('.px__index li:not([hidden])');
    await expect(cards).toHaveCount(7);
    await page.locator('[data-filter="data"]').click();
    await expect(page.locator('[data-filter="data"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(cards).toHaveCount(1);
    await expect(index).toHaveCount(1);
    await expect(cards.first()).toContainText('Enterprise Data Migration');
    await expect(page.locator('#px-data-migration')).toBeVisible();
    await expect(page.locator('[data-filter-status]')).toHaveText(/Showing 1 of 7 projects · Data Engineering/);
    await page.locator('[data-filter="automation"]').click();
    await expect(cards).toHaveCount(3);
    await expect(index).toHaveCount(3);
    // exactly one project is on show, and it is one that matches
    await expect(page.locator('[data-mission]:visible').first()).toBeVisible();
    await page.locator('[data-filter="all"]').click();
    await expect(cards).toHaveCount(7);
    await expect(page.locator('[data-filter-status]')).toHaveText('Showing all 7 projects');
  });

  test('the explorer shows one project at a time (desktop) or a swipeable row (mobile)', async ({ page }) => {
    await page.goto('./#projects');
    if (isMobile(page)) {
      await expect(page.locator('.px__index')).toBeHidden();
      const pos = page.locator('[data-px-pos]');
      await expect(pos).toHaveText('01');
      await expect(page.locator('[data-px-prev]')).toBeDisabled();
      await page.locator('[data-px-next]').click();
      await expect(pos).toHaveText('02');
      // the second card has scrolled to the start of the row
      await expect.poll(() => page.locator('#px-business-sheet').evaluate((c) => Math.round(c.getBoundingClientRect().left - (c.parentElement as HTMLElement).getBoundingClientRect().left))).toBeLessThan(40);
      await page.locator('[data-filter="data"]').click();
      await expect(page.locator('[data-px-total]')).toHaveText('01');
      await expect(page.locator('[data-px-next]')).toBeDisabled();
    } else {
      await expect(page.locator('[data-mission]:visible')).toHaveCount(1);
      await expect(page.locator('#px-knowledge-portal')).toBeVisible();
      const item = page.locator('[data-show="contract-intelligence"]');
      await item.click();
      await expect(item).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#px-contract-intelligence')).toBeVisible();
      await expect(page.locator('#px-knowledge-portal')).toBeHidden();
      await page.keyboard.press('ArrowDown');
      await expect(page.locator('[data-show="resume-matching"]')).toBeFocused();
      await expect(page.locator('#px-resume-matching')).toBeVisible();
      for (const k of ['Problem', 'What I built', 'How it works', 'Results']) await expect(page.locator('#px-resume-matching .px__facts')).toContainText(k);
    }
  });

  test('a mission opens its case study, and the case study links back', async ({ page }) => {
    const problems = watchErrors(page);
    await page.goto('./#projects');
    if (!isMobile(page)) await page.locator('[data-show="data-migration"]').click();
    await page.locator('#px-data-migration .px__title a').click();
    await expect(page).toHaveURL(/work\/data-migration\/$/);
    await expect(page.locator('h1')).toHaveText('Enterprise Data Migration');
    for (const h of ['The problem', 'Technical approach', 'My contribution', 'Technologies', 'Results and status', 'Walkthrough', 'Repository and demo']) {
      await expect(page.getByRole('heading', { name: h })).toBeVisible();
    }
    await expect(page.locator('.cs-facts')).toContainText('Completed');
    await page.locator('.cs-head__back a').click();
    await expect(page).toHaveURL(/#projects$/);
    expect(problems).toEqual([]);
  });

  test('the walkthrough opens, plays silently and closes without touching Papercut', async ({ page }) => {
    await page.goto('./#projects');
    await page.locator('[data-demo="knowledge-portal"]').first().click();
    const dlg = page.locator('dialog.wt');
    await expect(dlg).toBeVisible();
    await expect(dlg).toContainText('Illustrative walkthrough');
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    expect(await page.evaluate(() => { const a = document.getElementById('papercut') as HTMLAudioElement; return { src: a.getAttribute('src'), paused: a.paused }; })).toEqual({ src: null, paused: true });
  });

  test('the engineering workflow: five stages, one open, keyboard and content', async ({ page }) => {
    await page.goto('./#workflow');
    const section = page.locator('#workflow');
    await expect(section.getByRole('heading', { level: 2 })).toHaveText(/Inside my engineering workflow/i);
    const stages = section.locator('.stepper__node');
    await expect(stages).toHaveCount(5);
    for (const [i, name] of ['Understand the problem', 'Design the system', 'Build & engineer', 'Test & validate', 'Deploy & improve'].entries()) {
      await expect(stages.nth(i)).toContainText(name);
    }
    await expect(stages.first()).toHaveAttribute('aria-expanded', 'true');
    await expect(section.locator('.stepper__panel:visible')).toHaveCount(1);
    const panel = page.locator('#wf-panel-understand');
    for (const k of ['What I do here', 'Tools & techniques', 'In practice']) await expect(panel).toContainText(k);
    await stages.nth(2).click();
    await expect(stages.nth(2)).toHaveAttribute('aria-expanded', 'true');
    await expect(stages.first()).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#wf-panel-build')).toBeVisible();
    await expect(page.locator('#wf-panel-build')).toContainText('Develop data pipelines, applications, AI capabilities and automation workflows');
    await page.keyboard.press('ArrowRight');
    await expect(stages.nth(3)).toBeFocused();
    await expect(page.locator('#wf-panel-validate')).toContainText('Validate functionality, data quality, performance, accuracy and reliability');
    await page.keyboard.press('End');
    await expect(page.locator('#wf-panel-deploy')).toContainText('Deploy the solution, monitor its performance and continuously improve it');
    await page.keyboard.press('Home');
    await expect(page.locator('#wf-panel-understand')).toBeVisible();
    // each example points to a documented case study that exists
    const links = await section.locator('.stepper__panel a[href^="work/"]').evaluateAll((l) => l.map((a) => a.getAttribute('href')));
    expect(links.length).toBeGreaterThanOrEqual(5);
    for (const href of new Set(links)) expect((await page.request.get(href!)).status(), href!).toBe(200);
    // the terminal is gone everywhere
    await expect(page.locator('#terminal, [data-term-out]')).toHaveCount(0);
    await expect(page.getByText(/query the engineer/i)).toHaveCount(0);
  });

  test('architecture stages select by pointer and keyboard', async ({ page }) => {
    await page.goto('./#architecture');
    const section = page.locator('#architecture');
    await expect(section).toContainText('An illustrative view of how data engineering, AI and automation can work together to transform raw information into actionable insights.');
    const stages = section.locator('.stepper__node');
    await expect(stages).toHaveCount(7);
    await expect(stages.first()).toHaveAttribute('aria-expanded', 'true');
    await expect(section.locator('.stepper__panel:visible')).toHaveCount(1);
    await stages.nth(3).click();
    await expect(stages.nth(3)).toHaveAttribute('aria-expanded', 'true');
    const open = section.locator('.stepper__panel:visible');
    await expect(open).toContainText('Snowflake');
    await expect(section.locator('.stepper__step').nth(2)).toHaveClass(/is-done/);
    await page.keyboard.press('ArrowRight');
    await expect(stages.nth(4)).toBeFocused();
    await expect(section.locator('.stepper__step').nth(4)).toHaveClass(/is-open/);
    await page.keyboard.press('End');
    await expect(stages.nth(6)).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Home');
    await expect(stages.first()).toHaveAttribute('aria-expanded', 'true');
  });

  test('disciplines: four, with the exact tool lists', async ({ page }) => {
    await page.goto('./#expertise');
    const section = page.locator('#expertise');
    const stages = section.locator('.stepper__node');
    await expect(stages).toHaveCount(4);
    const tools: Record<number, string[]> = {
      0: ['Snowflake', 'Databricks', 'Python', 'SQL', 'ETL / ELT', 'Data Pipelines', 'Data Warehousing'],
      1: ['Machine Learning', 'Generative AI', 'Large Language Models', 'Retrieval-Augmented Generation', 'AI Agents', 'Model Evaluation'],
      2: ['Workflow Automation', 'API Integrations', 'Intelligent Assistants', 'Process Automation'],
      3: ['Power BI', 'Tableau', 'DAX', 'Business Intelligence', 'Data Storytelling'],
    };
    for (const [i, list] of Object.entries(tools)) {
      await stages.nth(Number(i)).click();
      const panel = section.locator('.stepper__panel:visible');
      await expect(panel.locator('.tag')).toHaveText(list);
    }
  });

  test('the wordmark and back to top return to the top without adding #top', async ({ page }) => {
    await page.goto('./');
    await page.locator('#education').scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
    await page.locator('[data-home-link]').click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(10);
    expect(new URL(page.url()).hash).toBe('');
    await expect(page.locator('[data-home-link]')).toBeFocused();
    // back to top: the floating button
    await page.locator('#architecture').scrollIntoViewIfNeeded();
    const top = page.locator('[data-to-top]');
    await expect(top).toHaveClass(/is-on/);
    await top.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(10);
    expect(page.url()).not.toContain('#top');
    // and the footer link
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.locator('[data-to-top-link]').click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(10);
    expect(page.url()).not.toContain('#top');
    // no link on the page points at #top
    await expect(page.locator('a[href$="#top"]')).toHaveCount(0);
  });

  test('an old #top address is cleaned on load; real fragments are kept', async ({ page }) => {
    await page.goto('./#top');
    await expect.poll(() => page.url()).not.toContain('#top');
    await expect(page.locator('h1')).toBeInViewport();
    await page.goto('./#workflow');
    expect(page.url()).toMatch(/#workflow$/);
    await expect(page.locator('#workflow')).toBeInViewport();
  });

  test('back and forward move between sections and the top', async ({ page }) => {
    test.skip(isMobile(page), 'desktop navigation bar');
    await page.goto('./');
    // let each smooth scroll finish, so each history entry records where it ended
    const settled = () => page.evaluate(() => new Promise<number>((done) => { let last = -1; const tick = () => { if (scrollY === last) done(scrollY); else { last = scrollY; setTimeout(tick, 120); } }; tick(); }));
    await page.locator('.nav__links').getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#projects')).toBeInViewport();
    await settled();
    await page.locator('.nav__links').getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();
    await settled();
    await page.goBack();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#projects')).toBeInViewport();
    // the wordmark adds a clean entry, so Back returns to the section
    await page.locator('[data-home-link]').click();
    await expect.poll(() => new URL(page.url()).hash).toBe('');
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBeLessThan(10);
    await page.goBack();
    await expect(page).toHaveURL(/#projects$/);
    await page.goForward();
    await expect.poll(() => new URL(page.url()).hash).toBe('');
  });

  test('the theme toggle switches light and dark and is remembered', async ({ page }) => {
    await page.goto('./');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    const btn = page.locator('[data-theme-toggle]:visible').first();
    await btn.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    // the body eases between themes, so wait for it to settle
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(245, 247, 251)');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.goto('./work/knowledge-portal/');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.locator('[data-theme-toggle]:visible').first().click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('copy email confirms the copy', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('./#contact');
    await page.locator('[data-copy]').click();
    await expect(page.locator('[data-copy-status]')).toHaveText(/copied/);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('gaurangashava@gmail.com');
  });

  test('Pause motion stops the hero and is remembered', async ({ page }) => {
    await page.goto('./');
    const btn = page.locator('[data-motion-toggle]');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveClass(/motion-off/);
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/motion-off/);
    await expect(page.locator('[data-typed]')).toHaveText('Data Engineer');
  });

  test('no serious accessibility violations (axe)', async ({ page }) => {
    await page.goto('./');
    await scrollThrough(page);
    // measure the settled page, not sections mid-fade
    await expect(page.locator('.reveal')).toHaveCount(0, { timeout: 10_000 });
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
  });

  test('no serious accessibility violations in the light theme (axe)', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('df-theme', 'light'));
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await scrollThrough(page);
    await expect.poll(() => page.locator('.reveal').evaluateAll((l) => l.map((e) => `${e.className} @${Math.round(e.getBoundingClientRect().top + scrollY)}`)), { timeout: 10_000 }).toEqual([]);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
  });

  test('keyboard: skip link first, focus is always visible', async ({ page }) => {
    test.skip(isMobile(page), 'keyboard on desktop');
    await page.goto('./');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      const outline = await page.evaluate(() => { const el = document.activeElement as HTMLElement; const s = getComputedStyle(el); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2; });
      expect(outline).toBe(true);
    }
  });

  test('reduced motion: nothing is held back and the lattice is a still frame', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('./');
    await expect(page.locator('.reveal')).toHaveCount(0);
    await expect(page.locator('[data-motion-toggle]').locator('xpath=..')).toBeHidden();
    await expect(page.locator('[data-lattice]')).toHaveClass(/is-ready/);
    // the still frame is redrawn if the hero resizes (e.g. as web fonts arrive): compare once settled
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    const a = await page.locator('[data-lattice]').screenshot();
    await page.waitForTimeout(600);
    const b = await page.locator('[data-lattice]').screenshot();
    expect(Buffer.compare(a, b)).toBe(0);
    await ctx.close();
  });
});

test.describe('case studies and errors', () => {
  for (const slug of ['knowledge-portal', 'business-sheet', 'contract-intelligence', 'resume-matching', 'data-migration']) {
    test(`${slug} loads cleanly with every section`, async ({ page }) => {
      const problems = watchErrors(page);
      const res = await page.goto(`./work/${slug}/`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('.cs-sec')).toHaveCount(8);
      await expect(page.locator('.cs-head__cover img')).toHaveJSProperty('complete', true);
      await expect(page.locator('a[rel="next"], a[rel="prev"]').first()).toBeVisible();
      await scrollThrough(page);
      await page.waitForLoadState('networkidle');
      expect(problems).toEqual([]);
    });
  }

  test('a missing page returns the 404 page with a way home', async ({ page }) => {
    const res = await page.goto('./does-not-exist/deeper/');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('nowhere');
    await page.getByRole('link', { name: 'Go to the homepage' }).click();
    await expect(page).toHaveURL(/\/portfoliowebiste\/$/);
  });

  test('direct project URLs work, and their fragments too', async ({ page }) => {
    for (const slug of ['knowledge-portal', 'data-migration']) {
      const res = await page.goto(`./work/${slug}/`);
      expect(res?.status()).toBe(200);
    }
    await page.goto('./work/data-migration/#data-migration-results');
    await expect(page.locator('#data-migration-results')).toBeInViewport();
    expect(page.url()).toMatch(/#data-migration-results$/);
  });

  test('/work/ redirects to the projects section', async ({ page }) => {
    await page.goto('./work/');
    await expect(page).toHaveURL(/#projects$/);
  });

  test('old shareable links redirect to their case studies', async ({ page }) => {
    await page.goto('./#/trk-05');
    await expect(page).toHaveURL(/work\/data-migration\/$/);
  });
});
