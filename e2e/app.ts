import { Page } from '@playwright/test';

/**
 * Открывает страницу и ждёт готовности клиентского приложения.
 *
 * При SSR Playwright успевает кликать раньше гидратации: обработчики Angular
 * ещё не навешены, и, например, сабмит формы уходит нативным GET-запросом.
 * `App` выставляет `data-app-hydrated` после первой навигации — ждём его,
 * а `networkidle` гарантирует, что догрузились ленивые чанки страниц.
 */
export async function gotoApp(page: Page, path = '/'): Promise<void> {
  await page.goto(path);
  await page.waitForSelector('html[data-app-hydrated]');
  await page.waitForLoadState('networkidle');
}
