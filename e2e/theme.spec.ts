import { test, expect } from '@playwright/test';

test('переключатель темы меняет data-theme', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('header .theme-toggle, .theme-toggle').first();
  await expect(btn).toBeVisible();
  const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await btn.click();
  const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(after).not.toBe(before);
});

test('запоминает выбор в localStorage', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('header .theme-toggle, .theme-toggle').first();
  await btn.click();
  const theme = await page.evaluate(() => localStorage.getItem('theme'));
  expect(theme === 'light' || theme === 'dark').toBeTruthy();
});

test('восстанавливает сохранённую тему после перезагрузки', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('header .theme-toggle, .theme-toggle').first();
  await btn.click();
  const saved = await page.evaluate(() => localStorage.getItem('theme'));
  await page.reload();
  const current = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(current).toBe(saved);
});
