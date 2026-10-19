import { test, expect } from '@playwright/test';
import { gotoApp } from './app';

test('есть H1 на главной', async ({ page }) => {
  await gotoApp(page);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('нет критических ошибок консоли', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await gotoApp(page);
  expect(errors.length).toBe(0);
});
