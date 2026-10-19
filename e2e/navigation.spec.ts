import { test, expect } from '@playwright/test';

test('главная грузится без ошибок консоли', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('/');
  await expect(page).toHaveTitle(/web33/i);
  expect(errors.length).toBe(0);
});

test('переходы между основными страницами', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Школа' }).first().click();
  await expect(page).toHaveURL(/school/);
  await page.getByRole('link', { name: 'Кейсы' }).click();
  await expect(page).toHaveURL(/cases/);
  await page.getByRole('link', { name: 'Обо мне' }).click();
  await expect(page).toHaveURL(/about/);
  await page.getByRole('link', { name: 'Блог' }).click();
  await expect(page).toHaveURL(/blog/);
});

test('клик по лого ведёт на главную', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('link', { name: 'web33' }).first().click();
  await expect(page).toHaveURL('/');
});
