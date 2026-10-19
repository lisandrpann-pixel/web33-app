import { test, expect } from '@playwright/test';
import { gotoApp } from './app';

test('несуществующий маршрут → страница 404', async ({ page }) => {
  await gotoApp(page, '/page-not-exists');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Страница не найдена');
  const link = page.getByRole('link', { name: 'На главную' });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL('/');
});
