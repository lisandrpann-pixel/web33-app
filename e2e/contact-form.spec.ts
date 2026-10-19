import { test, expect } from '@playwright/test';
import { gotoApp } from './app';

/* Форма с idPrefix 'f' живёт на главной в секции #contact (home.data.ts). */

test('валидация: обязательные поля показывают ошибки', async ({ page }) => {
  await gotoApp(page);
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('#f-name-error')).toBeVisible();
  await expect(page.locator('#f-contact-error')).toBeVisible();
  await expect(page.locator('#f-agree-error')).toBeVisible();
});

test('успех: форма отправляется, поля сбрасываются', async ({ page }) => {
  await page.route('**/api/send.php', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });
  await gotoApp(page);
  await page.fill('#f-name', 'Иван');
  await page.fill('#f-contact', 'test@example.com');
  await page.check('#f-agree');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('.form__success')).toBeVisible();
  await expect(page.locator('#f-name')).toHaveValue('');
  await expect(page.locator('#f-contact')).toHaveValue('');
});

test('сбой: ошибка сервера показывает баннер ошибки, не успех', async ({ page }) => {
  await page.route('**/api/send.php', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'fail' }),
    });
  });
  await gotoApp(page);
  await page.fill('#f-name', 'Иван');
  await page.fill('#f-contact', 'test@example.com');
  await page.check('#f-agree');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('.form__error-box')).toBeVisible();
  await expect(page.locator('.form__success')).not.toBeVisible();
});

test('блокировка кнопки во время отправки', async ({ page }) => {
  await page.route('**/api/send.php', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });
  await gotoApp(page);
  await page.fill('#f-name', 'Иван');
  await page.fill('#f-contact', 'test@example.com');
  await page.check('#f-agree');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.getByRole('button', { name: 'Отправляю…' })).toBeDisabled();
});

test('редактирование после успеха скрывает прошлый результат', async ({ page }) => {
  await page.route('**/api/send.php', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });
  await gotoApp(page);
  await page.fill('#f-name', 'Иван');
  await page.fill('#f-contact', 'test@example.com');
  await page.check('#f-agree');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('.form__success')).toBeVisible();
  await page.fill('#f-name', 'Новый');
  await expect(page.locator('.form__success')).not.toBeVisible();
});
