import { test, expect } from '@playwright/test';
import { gotoApp } from './app';

test.describe('мобильное меню', () => {
  test.use({ viewport: { width: 800, height: 600 } });

  test('закрытое меню скрыто и недоступно (CSS visibility)', async ({ page }) => {
    await gotoApp(page);
    const burger = page.locator('.burger');
    await expect(burger).toBeVisible();
    const links = page.locator('.mobile-nav__link');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toBeHidden();
    }
  });

  test('открытие/закрытие по бургеру', async ({ page }) => {
    await gotoApp(page);
    await page.locator('.burger').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/mobile-nav--open/);
    await page.locator('.burger').click();
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/mobile-nav--open/);
  });

  test('открытое меню делает ссылки видимыми', async ({ page }) => {
    await gotoApp(page);
    await page.locator('.burger').click();
    const links = page.locator('.mobile-nav__link');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toBeVisible();
    }
  });

  test('клик по ссылке закрывает меню', async ({ page }) => {
    await gotoApp(page);
    await page.locator('.burger').click();
    await page.locator('.mobile-nav__link').first().click();
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/mobile-nav--open/);
  });

  test('aria-expanded/aria-label бургера переключаются', async ({ page }) => {
    await gotoApp(page);
    const burger = page.locator('.burger');
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await expect(burger).toHaveAttribute('aria-label', 'Открыть меню');
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await expect(burger).toHaveAttribute('aria-label', 'Закрыть меню');
  });
});
