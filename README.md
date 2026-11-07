# web33 — сайт (Angular + SSR)

Портфолио-сайт и лендинги web33: услуги, кейсы, обучение программированию, форма заявки.
Приложение на **Angular 22** со **SSR/пререндером** (`@angular/ssr`), собирается на **Node.js 22**.

## Стек

- **Angular 22** (standalone components, signals, Control Flow `@if/@for`)
- **SSR + пререндер** (`@angular/ssr`, Express 5)
- **Vitest** (+ jsdom) — юнит-тесты
- **Playwright** — end-to-end тесты
- **ESLint** + **Prettier** — качество и форматирование кода

## Требования

- Node.js **22+** (в CI используется 22)
- npm **10+**

## Быстрый старт

```bash
npm ci          # установка зависимостей (воспроизводимо, как в CI)
npm start       # dev-server с SSR и HMR
```

Открыть http://localhost:4200.

## Скрипты

| Скрипт                            | Что делает                                                                  |
| --------------------------------- | --------------------------------------------------------------------------- |
| `npm start`                       | dev-server (`ng serve`) с SSR и автоперезагрузкой                           |
| `npm run build`                   | production-сборка + пререндер статических маршрутов в `dist/`               |
| `npm run watch`                   | сборка в watch-режиме (development)                                         |
| `npm run serve:ssr:web33-angular` | запуск собранного SSR-сервера (`node dist/web33-angular/server/server.mjs`) |
| `npm test` / `npm run test:unit`  | юнит-тесты в watch-режиме                                                   |
| `npm run test:ci`                 | юнит-тесты один раз без watch (как в CI)                                    |
| `npm run typecheck`               | `tsc --noEmit` по `tsconfig.app.json`                                       |
| `npm run typecheck:spec`          | `tsc --noEmit` по спекам (`tsconfig.spec.json`)                             |
| `npm run lint`                    | ESLint                                                                      |
| `npm run format`                  | проверка форматирования Prettier                                            |
| `npm run format:write`            | автоформатирование Prettier                                                 |
| `npm run e2e`                     | Playwright, только **chromium**                                             |
| `npm run e2e:all`                 | Playwright во всех браузерах (chromium + firefox + webkit)                  |
| `npm run e2e:ui`                  | Playwright **UI mode** (интерактивно, вживую)                               |
| `npm run e2e:headed`              | Playwright с видимым окном браузера, тесты по одному                        |
| `npm run e2e:debug`               | Playwright Inspector: пошаговый режим                                       |

## Структура проекта

```
src/
  app/
    core/                 # сервисы-синглтоны (тема, title/SEO-стратегия)
    data/                 # контент сайта (*.data.ts) и модели (*.model.ts)
    pages/                # страницы-маршруты (lazy, loadComponent)
    shared/               # переиспользуемые компоненты (header, footer, contact-form, …)
    app.config.ts         # конфиг приложения (router, http, hydration)
    app.routes.ts         # маршруты
    app.routes.server.ts  # режимы рендера для SSR (prerender / server)
  server.ts               # Express-сервер для SSR
public/                   # статика: api/send.php, img/, robots.txt, sitemap.xml
e2e/                      # Playwright-тесты
```

## Сборка и запуск SSR

```bash
npm run build
npm run serve:ssr:web33-angular
```

Сервер слушает `PORT` (по умолчанию `4000`):

```bash
PORT=8080 npm run serve:ssr:web33-angular
```

Результат сборки:

- `dist/web33-angular/browser/` — статические файлы (можно раздавать и без Node);
- `dist/web33-angular/server/server.mjs` — SSR-сервер.

Статические маршруты (`/`, `/cases`, `/about`, `/school`, `/privacy`, статьи блога) **пререндерятся**,
остальное рендерится на сервере по запросу — так отдаётся настоящий HTTP 404 (см. `app.routes.server.ts`).

> **Домен.** SSR проверяет `Host` по списку `security.allowedHosts` в `angular.json`
> (`web33.ru`, `www.web33.ru`). При деплое на другой домен добавьте его туда.

## Деплой на обычный (PHP-)хостинг

Сайту **не нужен Node на хостинге**: все маршруты пререндерятся в статику, а SSR-сервер
на обычном хостинге всё равно не запустить. Нужен только PHP — для формы (`api/send.php`).

```bash
npm ci
npm run build
```

1. Загрузите **содержимое** `dist/web33-angular/browser/` в корень сайта
   (`public_html/`, `www/` — как называет его панель хостинга). В том числе скрытый
   `.htaccess`: включите показ скрытых файлов в файловом менеджере/FTP.
2. В панели хостинга включите HTTPS (Let's Encrypt) и убедитесь, что PHP работает
   с расширением `openssl` и не блокирует исходящие соединения — письма формы
   идут напрямую через SMTP Яндекса (порт 465), без локального `mail()`.
3. Проверьте: главная, `/cases`, `/blog/...`, несуществующий URL (должна открыться
   страница 404 приложения со статусом 404) и отправку формы.

`public/.htaccess` (копируется в сборку) делает:

- `ErrorDocument 404 /404.html` — неизвестный путь отдаёт CSR-шелл, роутер рисует `not-found`,
  статус остаётся 404. Сам `404.html` создаёт пост-сборкой `scripts/postbuild.mjs`
  (`npm run postbuild` выполняется автоматически после `npm run build`), потому что в нём
  хэши имен бандлов, меняющиеся при каждой сборке;
- кэш «год» для хэшированных бандлов и «без кэша» для HTML — после пересборки
  пользователь сразу видит новую версию;
- gzip, запрет индексации директорий и отдачи скрытых файлов.

Ограничения статического режима:

- сайт должен лежать в **корне домена**: `<base href="/">`, форма шлёт POST на `/api/send.php`;
- в URL маршрутов появляется `/` на конце (`/cases` → `/cases/`, Apache отдаёт папку),
  это обычная одна 301-редирекция.

## Юнит-тесты (Vitest)

```bash
npm test            # watch
npm run test:ci     # один прогон (используется в CI)
```

Окружение — **jsdom** (без реального браузера), поэтому тесты быстрые и не требуют установки браузеров.

## E2E-тесты (Playwright)

### Установка браузеров

Playwright не скачивает браузеры автоматически при `npm ci`. Перед первым запуском:

```bash
npx playwright install            # chromium + firefox + webkit
# или только нужное:
npx playwright install chromium
```

> В CI ставится только chromium (`npx playwright install --with-deps chromium`) и тесты идут
> с `--project=chromium`. Для прогона firefox/webkit в CI добавьте их в шаг установки.

### Запуск

```bash
npm run e2e                          # chromium (быстро, как в CI)
npm run e2e:all                      # все браузеры
npm run e2e -- e2e/contact-form.spec.ts     # один файл
npm run e2e -- -g "валидация"               # тесты, подходящие по имени
```

Dev-server Playwright поднимает сам (`webServer` в `playwright.config.ts`), поэтому отдельно
`npm start` запускать не нужно. Если сервер уже запущен на `:4200`, он будет переиспользован.

### Посмотреть, как всё происходит вживую

**UI mode — самый удобный способ:**

```bash
npm run e2e:ui
```

Открывается приложение Playwright: список тестов, таймлайн шагов, DOM-снимок на каждом шаге,
watch-режим (тест перезапускается при сохранении файла) и «Pick locator» для подбора селекторов.

**Видимое окно браузера:**

```bash
npm run e2e:headed                                 # по одному тесту, окно видно
$env:PWSLOWMO=400; npm run e2e:headed              # PowerShell: пауза 400 мс между шагами
PWSLOWMO=400 npm run e2e:headed                    # bash
```

`PWSLOWMO` задаёт `slowMo` в конфиге (по умолчанию `0`, на CI и обычные прогоны не влияет).

**Пошаговая отладка (Inspector):**

```bash
npm run e2e:debug                                  # пауза на каждом шаге, «Step over», подсветка локаторов
```

### Отчёты и трейсы

При сбое сохраняются скриншот, видео и trace (`test-results/`). Посмотреть трейс пошагово:

```bash
npx playwright show-trace test-results/<папка-теста>/trace.zip
```

HTML-отчёт:

```bash
npm run e2e -- --reporter=html
npx playwright show-report
```

### Как писать тесты в этом проекте

```ts
import { test, expect } from '@playwright/test';
import { gotoApp } from './app';

test('валидация формы', async ({ page }) => {
  await gotoApp(page); // открыть страницу и дождаться готовности
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.locator('#f-name-error')).toBeVisible();
});
```

Важные правила:

1. **Открывайте страницу через `gotoApp(page, path?)`**, а не через `page.goto()`. Приложение
   рендерится на сервере, и без ожидания гидратации можно «кликнуть в пустоту» — например,
   сабмит формы уйдёт нативным GET-запросом. Хелпер ждёт маркер `html[data-app-hydrated]`
   (его ставит `App` после гидратации и первой навигации) и `networkidle` для догрузки ленивых чанков.
2. **Селекторы — по роли и доступному имени** (`getByRole`, `getByLabel`), а не по CSS-классам,
   где это возможно. Строки в тестах должны совпадать с текстом в разметке.
3. **Сетевые запросы мокайте через `page.route`**, чтобы не зависеть от бэкенда:

   ```ts
   await page.route('**/api/send.php', (route) =>
     route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
   );
   ```

4. Тесты идут **параллельно** (`fullyParallel: true`), каждый тест — в своём браузерном контексте.
   В CI `workers: 1` и `retries: 2`.

### Что покрыто

`e2e/` — навигация и переходы, мобильное меню, переключатель темы, форма заявки
(валидация / успех / ошибка / блокировка во время отправки), страница 404.

## Качество и CI

Проверки локально:

```bash
npm run format && npm run lint && npm run typecheck && npm run typecheck:spec
npm run build && npm run test:ci && npm run e2e
```

GitHub Actions (`.github/workflows/ci.yml`) на push в `master` и PR выполняет те же шаги
по порядку: format → lint → typecheck → typecheck:spec → build → unit-тесты → e2e (chromium).

## SEO

- `public/robots.txt` и `public/sitemap.xml` — статические файлы;
- canonical, Open Graph и Twitter-теги, а также `<title>`/`description` формирует
  `AppTitleStrategy` (`src/app/core/title-strategy.service.ts`);
- канонический домен задаётся константой `SITE_URL` в `src/app/data/site.data.ts`.

## Форма обратной связи

Компонент `src/app/shared/contact-form` отправляет POST на `/api/send.php`.
Скрипт (`public/api/send.php`) валидирует поля (honeypot от ботов, rate-limit по IP)
и отправляет письмо **напрямую через SMTP Яндекса** (`smtp.yandex.ru:465`, SSL,
AUTH LOGIN) мини-клиентом без зависимостей `public/api/smtp-mailer.php` —
локальный `mail()` и почтовая служба хостинга не используются.

Настройка: в `send.php` укажите `SMTP_PASS` — «пароль приложения» Яндекса
(<https://passport.yandex.ru/profile/security/app-passwords>); логин и получатель
по умолчанию — `web33.dev@yandex.ru`. Файл с паролем не публикуйте в открытом
репозитории.
