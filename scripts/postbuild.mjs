/**
 * postbuild: делает dist/browser/404.html из CSR-шелла.
 *
 * На статическом хостинге без Node серверный маршрут 404 недоступен, поэтому
 * неизвестный URL отдаёт Apache через ErrorDocument 404 (см. public/.htaccess).
 * Файл один в один повторяет index.csr.html: браузер загружает Angular,
 * роутер видит неизвестный путь и рисует страницу not-found.
 *
 * Хэши имен бандлов (main-*.js) в шелле меняются при каждой сборке,
 * поэтому статический public/404.html невозможен — копируем после сборки.
 */
import { copyFileSync, existsSync } from 'node:fs';

const src = 'dist/web33-angular/browser/index.csr.html';
const dest = 'dist/web33-angular/browser/404.html';

if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log(`404 page written → ${dest}`);
} else {
  console.warn(`postbuild: ${src} not found, 404.html skipped`);
}
