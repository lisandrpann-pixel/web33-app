import { test, expect } from '@playwright/test';

test('валидация: пустая форма не отправляет', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('#f-name-error')).toBeVisible();
  await expect(page.locator('#f-contact-error')).toBeVisible();
  await expect(page.locator('#f-agree-error')).toBeVisible();
});

test('успех: мокаем POST /api/send.php', async ({ page }) => {
  await page.route('/api/send.php', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/about');
  await page.fill('#f-name', 'Тест');
  await page.fill('#f-contact', 'test@example.com');
  await page.check('#f-agree');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('.form__success')).toBeVisible();
  await expect(page.locator('#f-name')).toHaveValue('');
  await expect(page.locator('#f-contact')).toHaveValue('');
});

test('ошибка: показывается баннер ошибки', async ({ page }) => {
  await page.route('/api/send.php', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'fail' }) });
  });
  await page.goto('/about');
  await page.fill('#f-name', 'Тест');
  await page.fill('#f-contact', 'test@example.com');
  await page.check('#f-agree');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('.form__error')).toBeVisible();
  await expect(page.locator('.form__success')).not.toBeVisible();
});

test('блокировка кнопки во время запроса', async ({ page }) => {
  await page.route('/api/send.php', async (route) => {
    await page.waitForTimeout(300);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/about');
  await page.fill('#f-name', 'Тест');
  await page.fill('#f-contact', 'test@example.com');
  await page.check('#f-agree');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.getByRole('button', { name: 'Отправляю…' })).toBeDisabled();
});

test('сброс success при редактировании', async ({ page }) => {
  await page.route('/api/send.php', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/about');
  await page.fill('#f-name', 'Тест');
  await page.fill('#f-contact', 'test@example.com');
  await page.check('#f-agree');
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('.form__success')).toBeVisible();
  await page.fill('#f-name', 'Другой');
  await expect(page.locator('.form__success')).not.toBeVisible();
});
