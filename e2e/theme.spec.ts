import { test, expect } from '@playwright/test';
import { gotoApp } from './app';

const THEME_KEY = 'web33-theme';

test('по умолчанию открывается тёмная тема', async ({ page }) => {
  await gotoApp(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('клик по кнопке меняет атрибут data-theme', async ({ page }) => {
  await gotoApp(page);
  const btn = page.locator('.theme-toggle').first();
  await expect(btn).toBeVisible();
  const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await btn.click();
  const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(after).not.toBe(before);
});

test('сохранённая тема персистится в localStorage', async ({ page }) => {
  await gotoApp(page);
  const btn = page.locator('.theme-toggle').first();
  await btn.click();
  const theme = await page.evaluate((key) => localStorage.getItem(key), THEME_KEY);
  expect(theme === 'light' || theme === 'dark').toBe(true);
});

test('сохранённая тема применяется после перезагрузки', async ({ page }) => {
  await gotoApp(page);
  const btn = page.locator('.theme-toggle').first();
  await btn.click();
  const saved = await page.evaluate((key) => localStorage.getItem(key), THEME_KEY);
  await page.reload();
  const current = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(current).toBe(saved);
});
