// Responsive checks at the nine viewports in the QA brief.
import { test, expect } from '@playwright/test';

const VIEWPORTS: Array<[string, number, number]> = [
  ['desktop-1920', 1920, 1080], ['desktop-1440', 1440, 900], ['desktop-1366', 1366, 768],
  ['tablet-1024', 1024, 768], ['tablet-768', 768, 1024],
  ['mobile-430', 430, 932], ['mobile-390', 390, 844], ['mobile-375', 375, 812], ['mobile-360', 360, 800],
];

for (const [name, width, height] of VIEWPORTS) {
  test.describe(name, () => {
    test.use({ viewport: { width, height } });

    test('no horizontal overflow, nothing past the edge, identity in the first screen', async ({ page }) => {
      for (const path of ['./', './work/knowledge-portal/', './work/business-sheet/', './query-engineer/']) {
        await page.goto(path);
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
        });
        const res = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const off: string[] = [];
          document.querySelectorAll('main *, footer *, .nav__bar *').forEach((el) => {
            const s = getComputedStyle(el);
            if (s.display === 'none' || s.visibility === 'hidden' || s.clipPath === 'inset(50%)' || el.closest('[hidden], svg, canvas, .hero__art, .contact__signal, .px__grid--more, .px__grid--lab, .ribbon-wrap, .nf__log, .visually-hidden, .nav__sheet')) return;
            const r = el.getBoundingClientRect();
            if (r.width && (r.right > vw + 1 || r.left < -1)) off.push(`${el.tagName.toLowerCase()}.${String((el as HTMLElement).className).split(' ')[0]} ${Math.round(r.left)}–${Math.round(r.right)}`);
          });
          return { scroll: document.documentElement.scrollWidth - vw, off: off.slice(0, 5) };
        });
        expect(res.scroll, `${path} scrollWidth overflow`).toBeLessThanOrEqual(0);
        expect(res.off, `${path} elements past the edge`).toEqual([]);
      }
      await page.goto('./');
      await expect(page.locator('.hero__name')).toBeInViewport();
      await expect(page.locator('.hero__sub')).toBeInViewport();
      await expect(page.getByRole('link', { name: 'Explore My Work' })).toBeInViewport();
    });

    test('navigation suits the width', async ({ page }) => {
      await page.goto('./');
      if (width >= 1024) {
        await expect(page.locator('.rail')).toBeVisible();
        await expect(page.locator('[data-menu-btn]')).toBeHidden();
        // the rail fits the screen height with every control reachable
        const last = await page.locator('.rail__resume').boundingBox();
        expect(last!.y + last!.height).toBeLessThanOrEqual(height);
      } else {
        await expect(page.locator('.rail')).toBeHidden();
        await expect(page.locator('[data-menu-btn]')).toBeVisible();
        const box = await page.locator('[data-menu-btn]').boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('images keep their proportions and controls are large enough', async ({ page }) => {
      await page.goto('./');
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      });
      const distorted = await page.locator('img').evaluateAll((list) => list.filter((i) => {
        const img = i as HTMLImageElement;
        if (!img.naturalWidth || !img.clientWidth) return false;
        if (['cover', 'contain'].includes(getComputedStyle(img).objectFit)) return false;   // cropped or letterboxed, never stretched
        return Math.abs(img.clientWidth / img.clientHeight - img.naturalWidth / img.naturalHeight) > 0.02;
      }).map((i) => (i as HTMLImageElement).src));
      expect(distorted).toEqual([]);
      const small = await page.locator('main button:visible:not(.visually-hidden), main .btn:visible, .nav button:visible, .filters button:visible').evaluateAll((list) =>
        list.filter((el) => { const r = el.getBoundingClientRect(); return r.height < 24 || r.width < 24; }).map((el) => el.className));
      expect(small).toEqual([]);
    });
  });
}
