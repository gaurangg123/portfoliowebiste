// Query the Engineer: its own page, a local portfolio assistant.
import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;

test.describe('Query the Engineer', () => {
  test('is its own page: direct URL, refresh, and no errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const res = await page.goto('./query-engineer/');
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(/Query the Engineer/);
    await expect(page.locator('h1')).toHaveText(/Query\s+the\s+Engineer\./);
    await expect(page.getByText('Curious about what I build, how I think, or the technologies I work with?')).toBeVisible();
    // the full description and the "how this works" note on wide screens; phones keep the
    // page to one screen with a shorter note in the conversation's header
    if (isMobile(page)) {
      await expect(page.getByText(/Explore my engineering profile through an interactive workspace/)).toBeAttached();
      await expect(page.locator('.qe__mode')).toContainText('not an AI model');
    } else {
      await expect(page.getByText(/Explore my engineering profile through an interactive workspace/)).toBeVisible();
      await expect(page.locator('.qe__how')).toContainText('not an AI chatbot');
    }
    await page.reload();
    expect((await page.request.get('./query-engineer/')).status()).toBe(200);
    // without the trailing slash, the host redirects to the folder
    expect((await page.request.get('./query-engineer', { maxRedirects: 2 })).status()).toBe(200);
    await expect(page.locator('[data-qe-log] .qe-msg')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('fits one screen: the page never scrolls, the conversation does', async ({ page }) => {
    await page.goto('./query-engineer/');
    await expect(page.locator('.qe__topics')).toHaveCount(0);   // no "Try asking" list
    const input = page.locator('[data-qe-input]');
    for (const q of ['What is your experience with Snowflake?', 'Tell me about your AI projects.', 'Tell me about your professional journey.']) {
      await input.fill(q);
      await input.press('Enter');
      await expect(page.locator('.qe-msg--q').last()).toHaveText(q);
    }
    await expect(page.locator('.qe-msg--a').last().locator('.qe-ans__title')).toHaveText('My professional journey');
    const m = await page.evaluate(() => {
      const log = document.querySelector('[data-qe-log]') as HTMLElement;
      const form = (document.querySelector('.qe__form') as HTMLElement).getBoundingClientRect();
      return { page: document.documentElement.scrollHeight - innerHeight, log: log.scrollHeight - log.clientHeight, formInView: form.bottom <= innerHeight && form.top >= 0 };
    });
    expect(m.page).toBeLessThanOrEqual(0);
    expect(m.log).toBeGreaterThan(100);
    expect(m.formInView).toBe(true);
  });

  test('suggested questions in the conversation answer from the portfolio', async ({ page }) => {
    await page.goto('./query-engineer/');
    const chips = page.locator('[data-qe-welcome] [data-qe-ask]');
    await chips.filter({ hasText: 'Snowflake' }).click();
    const answer = page.locator('.qe-msg--a').last();
    await expect(answer.locator('.qe-ans__title')).toHaveText('Experience with Snowflake');
    await expect(answer).toContainText('Enterprise Data Migration');
    await expect(answer).toContainText('Snowflake Ascent');
    await expect(answer.locator('a[href="../work/data-migration/"]').first()).toBeVisible();
    await chips.filter({ hasText: 'Tata Technologies' }).click();
    await expect(page.locator('.qe-msg--a').last().locator('.qe-ans__title')).toHaveText('Experience · Tata Technologies');
    await page.locator('[data-qe-input]').fill('How can I contact you?');
    await page.locator('[data-qe-input]').press('Enter');
    const contact = page.locator('.qe-msg--a').last();
    await expect(contact.locator('a[href="mailto:gaurangashava@gmail.com"]')).toHaveCount(1);
    await expect(contact.locator('a[href*="drive.google.com"]')).toHaveAttribute('href', 'https://drive.google.com/file/d/1LbktI3_wzj6RZ04ig9SzPOV6p41pssqJ/view?usp=sharing');
  });

  test('typed questions, history recall, follow-ups, and an honest "not documented"', async ({ page }) => {
    await page.goto('./query-engineer/');
    const input = page.locator('[data-qe-input]');
    await input.fill('Tell me about Business Sheet');
    await input.press('Enter');
    await expect(page.locator('.qe-msg--q').last()).toHaveText('Tell me about Business Sheet');
    await expect(page.locator('.qe-msg--a').last().locator('.qe-ans__title')).toHaveText('Project · Business Sheet');
    await expect(input).toHaveValue('');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('Tell me about Business Sheet');
    // a follow-up chip asks the next question
    await page.locator('.qe-msg--a').last().locator('.qe-chip').first().click();
    await expect(page.locator('.qe-msg--q')).toHaveCount(2);
    // something the portfolio doesn't cover: it says so
    await input.fill('Do you know Kubernetes?');
    await input.press('Enter');
    await expect(page.locator('.qe-msg--a').last().locator('.qe-ans__title')).toHaveText('Not in this portfolio');
    // typed text is never parsed as markup
    await input.fill('<img src=x onerror="window.__x=1">');
    await input.press('Enter');
    await expect(page.locator('.qe-msg--q').last()).toHaveText('<img src=x onerror="window.__x=1">');
    await expect(page.locator('.qe__log img')).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).__x)).toBeUndefined();
    await page.locator('[data-qe-clear]').click();
    await expect(page.locator('.qe-msg')).toHaveCount(1);
  });

  test('answers link to the case studies, which open', async ({ page }) => {
    await page.goto('./query-engineer/?q=' + encodeURIComponent('Tell me about your AI projects.'));
    const answer = page.locator('.qe-msg--a').last();
    await expect(answer.locator('.qe-ans__title')).toHaveText('AI / ML projects');
    await answer.locator('.qe-ans__links a[href="../work/contract-intelligence/"]').click();
    await expect(page).toHaveURL(/work\/contract-intelligence\/$/);
    await expect(page.locator('h1')).toHaveText('AI Legal Contract Intelligence');
  });

  test('the homepage invitation and the navigation open it; it returns to the portfolio', async ({ page }) => {
    await page.goto('./#query');
    await expect(page.locator('#query h2')).toHaveText('Want to explore my engineering mindset?');
    await page.getByRole('link', { name: /Explore Query the Engineer/ }).click();
    await expect(page).toHaveURL(/query-engineer\/$/);
    await page.getByRole('link', { name: 'Return to portfolio' }).click();
    await expect(page).toHaveURL(/\/portfoliowebiste\/$/);
    if (isMobile(page)) {
      await page.locator('[data-menu-btn]').click();
      await page.locator('.sheet__query').click();
    } else {
      await page.locator('.rail__link--query').click();
    }
    await expect(page).toHaveURL(/query-engineer\/$/);
    if (!isMobile(page)) await expect(page.locator('.rail__link--query')).toHaveAttribute('aria-current', 'page');
    // and from the footer
    await page.goto('./');
    await page.locator('.footer__query').click();
    await expect(page).toHaveURL(/query-engineer\/$/);
  });

  test('the old #terminal address opens Query the Engineer', async ({ page }) => {
    await page.goto('./#terminal');
    await expect(page).toHaveURL(/query-engineer\/$/);
  });

  test('without JavaScript it still answers the common questions', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('./query-engineer/');
    await expect(page.locator('.qe__faq details')).toHaveCount(8);
    await page.locator('.qe__faq summary').nth(2).click();
    await expect(page.locator('.qe__faq details').nth(2)).toContainText('Enterprise Data Migration');
    await expect(page.locator('.qe__chat')).toBeHidden();
    await ctx.close();
  });

  for (const theme of ['dark', 'light']) {
    test(`no serious accessibility violations after a conversation (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('df-theme', t), theme);
      await page.goto('./query-engineer/?q=' + encodeURIComponent('How can I contact you?'));
      await expect(page.locator('.qe-msg--a')).toHaveCount(2);
      await page.waitForTimeout(500);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
    });
  }

  test('works in the light theme', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('df-theme', 'light'));
    await page.goto('./query-engineer/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.locator('[data-qe-input]').fill('What technologies do you work with?');
    await page.locator('[data-qe-input]').press('Enter');
    await expect(page.locator('.qe-msg--a').last().locator('.qe-ans__title')).toHaveText('Technologies I work with');
  });
});
