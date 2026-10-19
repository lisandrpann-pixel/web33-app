import { test, expect } from '@playwright/test';

test.describe('Мобильное меню', () => {
  test.use({ viewport: { width: 800, height: 600 } });

  test('бургер виден, меню скрыто', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('.burger');
    await expect(burger).toBeVisible();
    const links = page.locator('.mobile-nav__link');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('tabindex', '-1');
    }
  });

  test('открытие/закрытие', async ({ page }) => {
    await page.goto('/');
    await page.locator('.burger').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/mobile-nav--open/);
    await page.locator('.burger').click();
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/mobile-nav--open/);
  });

  test('при открытом меню ссылки доступны', async ({ page }) => {
    await page.goto('/');
    await page.locator('.burger').click();
    const links = page.locator('.mobile-nav__link');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).not.toHaveAttribute('tabindex', '-1');
    }
  });

  test('клик по ссылке закрывает меню', async ({ page }) => {
    await page.goto('/');
    await page.locator('.burger').click();
    await page.locator('.mobile-nav__link').first().click();
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/mobile-nav--open/);
  });

  test('aria-expanded/aria-label корректны', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('.burger');
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await expect(burger).toHaveAttribute('aria-label', 'Открыть меню');
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await expect(burger).toHaveAttribute('aria-label', 'Закрыть меню');
  });
});
