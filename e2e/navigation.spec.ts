import { test, expect } from '@playwright/test';
import { gotoApp } from './app';

test('страница загружается без ошибок в консоли и со стилем web33', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await gotoApp(page);
  await expect(page).toHaveTitle(/web33/i);
  expect(errors.length).toBe(0);
});

test('переходы по основным пунктам навигации', async ({ page }) => {
  await gotoApp(page);
  await page.getByRole('link', { name: 'Школа кода' }).first().click();
  await expect(page).toHaveURL(/school/);
  await page.getByRole('link', { name: 'Кейсы' }).first().click();
  await expect(page).toHaveURL(/cases/);
  await page.getByRole('link', { name: 'Обо мне' }).first().click();
  await expect(page).toHaveURL(/about/);
});

test('логотип из любого раздела ведёт на главную', async ({ page }) => {
  await gotoApp(page, '/about');
  await page.getByRole('link', { name: 'web33' }).first().click();
  await expect(page).toHaveURL('/');
});
