// Functional tests: the mandatory checks from the QA brief, run on desktop and on a phone.
import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const RESUME = 'https://drive.google.com/file/d/1LbktI3_wzj6RZ04ig9SzPOV6p41pssqJ/view?usp=sharing';
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 900;

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
  page.on('requestfailed', (r) => { if (r.url().includes('127.0.0.1')) problems.push('failed ' + r.url()); });
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
    await scrollThrough(page);
    await page.waitForLoadState('networkidle');
    // images are lazy: wait until every one the scroll requested has finished
    await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete), null, { timeout: 10_000 });
    const imgs = await page.locator('img').evaluateAll((list) => list.map((i) => {
      const img = i as HTMLImageElement;
      return { src: img.currentSrc || img.src, ok: img.complete && img.naturalWidth > 0, alt: img.getAttribute('alt') };
    }));
    expect(imgs.length).toBeGreaterThan(5);
    for (const i of imgs) { expect(i.ok, i.src).toBe(true); expect(i.alt, i.src).not.toBeNull(); }
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

  test('project filters show the matching missions and announce the count', async ({ page }) => {
    await page.goto('./#projects');
    const cards = page.locator('[data-mission]:visible');
    await expect(cards).toHaveCount(7);
    await page.locator('[data-filter="data"]').click();
    await expect(page.locator('[data-filter="data"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Enterprise Data Migration');
    await expect(page.locator('[data-filter-status]')).toHaveText(/Showing 1 of 7 projects · Data Engineering/);
    await page.locator('[data-filter="automation"]').click();
    await expect(cards).toHaveCount(3);
    await expect(page.locator('[data-mission].is-lead:visible')).toHaveCount(1);
    await page.locator('[data-filter="all"]').click();
    await expect(cards).toHaveCount(7);
    await expect(page.locator('[data-filter-status]')).toHaveText('Showing all 7 projects');
  });

  test('a mission opens its case study, and the case study links back', async ({ page }) => {
    const problems = watchErrors(page);
    await page.goto('./#projects');
    await page.getByRole('link', { name: 'Enterprise Data Migration' }).click();
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

  test('architecture stages select by pointer and keyboard', async ({ page }) => {
    await page.goto('./#architecture');
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(7);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toHaveCount(1);
    await tabs.nth(3).click();
    await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Data Warehouse');
    await expect(page.getByRole('tabpanel')).toContainText('Snowflake');
    await expect(page.locator('.arch__step').nth(2)).toHaveClass(/is-linked/);
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(4)).toBeFocused();
    await expect(page.getByRole('tabpanel')).toContainText('AI / ML Layer');
    await page.keyboard.press('End');
    await expect(page.getByRole('tabpanel')).toContainText('Analytics & BI');
    await page.keyboard.press('Home');
    await expect(page.getByRole('tabpanel')).toContainText('Data Sources');
  });

  test('the terminal runs commands, keeps history, completes and clears', async ({ page }) => {
    await page.goto('./#terminal');
    const input = page.getByRole('textbox', { name: 'Terminal command' });
    const out = page.locator('[data-term-out]');
    await input.fill('projects');
    await input.press('Enter');
    await expect(out).toContainText('Engineering missions');
    await expect(out.getByRole('link', { name: 'Enterprise Knowledge Portal' })).toHaveAttribute('href', 'work/knowledge-portal/');
    await input.fill('educ');
    await input.press('Tab');
    await expect(input).toHaveValue('education');
    await input.press('Enter');
    await expect(out).toContainText('SRM Institute of Science & Technology');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('education');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('projects');
    await input.fill('<img src=x onerror=alert(1)>');
    await input.press('Enter');
    await expect(out).toContainText('command not found: <img src=x');
    await expect(out.locator('img')).toHaveCount(0);
    await input.fill('clear');
    await input.press('Enter');
    await expect(out.locator('.t-line')).toHaveCount(0);
    await page.locator('.term__chip', { hasText: 'contact' }).click();
    await expect(out.getByRole('link', { name: 'gaurangashava@gmail.com' })).toHaveAttribute('href', 'mailto:gaurangashava@gmail.com');
    await expect(input).toBeFocused();
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

  test('/work/ redirects to the projects section', async ({ page }) => {
    await page.goto('./work/');
    await expect(page).toHaveURL(/#projects$/);
  });

  test('old shareable links redirect to their case studies', async ({ page }) => {
    await page.goto('./#/trk-05');
    await expect(page).toHaveURL(/work\/data-migration\/$/);
  });
});
