# Ревью проекта web33-angular

- **Дата:** 2026-10-17
- **Коммит на момент проверки:** `1e1a5c5` «аватар вынесен в отдельный компонент»
- **Состав ревью:** код-стайл, архитектура, SSR/hydration, SEO, a11y, тесты, конфигурация сборки
- **Ответственный за замечания:** opencode

---

## Как проверялось

| Проверка     | Команда                                                                                                                 | Результат                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Сборка       | `npx ng build`                                                                                                          | успешно, без ошибок и предупреждений, 8–10 с      |
| Типы         | `npx tsc -p tsconfig.app.json --noEmit`                                                                                 | чисто                                             |
| Тесты        | `npm test`                                                                                                              | 2 теста из 2 прошли (только scaffold)             |
| Формат       | `npx prettier --check "src/**/*.{ts,html,css,scss}"`                                                                    | чисто                                             |
| Strict-режим | `npx tsc -p tsconfig.app.json --noEmit` + `ng build` с `strict`/`noUnusedLocals`/`noUnusedParameters`/`strictTemplates` | чисто (флаги включены, см. «Исправлено»)          |
| Runtime      | dev-server + Playwright, страницы `/`, `/school`, `/cases`, `/about`                                                    | 0 ошибок в консоли, стили компонентов применяются |

**Размеры:** `main` 316 кБ raw / 87 кБ transfer, глобальный `styles.css` 6.36 кБ, 11 пререндеренных маршрутов (после выноса 404 в серверный рендер).

---

## Оценка

**8/10 как портфолио-сайт, 7.5/10 как лидогенератор** — форма отправляет заявку (P0-1 исправлен), но требуется настроенная `mail()` на хостинге; остаются SEO (P1-5) и тесты (P1-4).

---

## Что сделано хорошо

- **SSR/prerender.** `outputMode: server`, все маршруты пререндерятся, `blog/:slug` — по списку слагов (`src/app/app.routes.server.ts:6`), express-статика с `maxAge: '1y'` + `outputHashing: all` (`src/server.ts:30`, `angular.json:58`).
- **Архитектура.** Сигналы, функциональные компоненты, `input.required`, типизированные input'ы; модели в `.model.ts` рядом с компонентами; стили разнесены по компонентам, в `src/styles.css` только дизайн-токены, reset и общие примитивы.
- **Тема.** Inline-скрипт до отрисовки против вспышки (`src/index.html:14`), отслеживание `prefers-color-scheme`, обновление `theme-color`, `try/catch` для приватного режима (`src/app/core/theme.service.ts:59`), SSR-корректно (`PLATFORM_ID`).
- **CSS.** Токенизированная шкала отступов, БЭМ-именование, осмысленный `prefers-reduced-motion` (гасит только движение, оставляет цветовые переходы), бюджеты на компонентные стили (`angular.json:52`).
- **A11y частично.** `aria-pressed` на переключателе темы, `role="status"` на успехе формы, `aria-hidden` на иконках и аватаре, `label[for]` в форме, `rel="noopener"` на внешних ссылках.
- Код почти полностью сигнальный, без ручных подписок кроме двух оправданных (`router.events` в `App` и `Header`).

---

## Проблемы

### P0 — бизнес-критичные

#### 1. Форма обратной связи ничего не отправляет — исправлено

Было: при валидной форме ставился `success = true` и показывалось «Заявка отправлена», без HTTP-запроса; `success` не сбрасывался при редактировании; кнопка не блокировалась.

Стало:

- `ContactForm` отправляет `POST` через `HttpClient` на `/api/send.php` (провайдер `provideHttpClient(withFetch())` в `app.config.ts`);
- PHP-обработчик `public/api/send.php` (попадает в сборку) шлёт письмо на `web33.dev@yandex.ru` через `mail()`: валидация полей, проверка согласия, `clean()` от инъекции в заголовки, honeypot-поле, простой лимит по IP, JSON-ответ `{ ok }`;
- состояние формы — `signal<'idle'|'sending'|'success'|'error'>`: кнопка блокируется и показывает «Отправляю…», при ошибке показывается баннер с ошибкой (а не ложный успех), результат сбрасывается при повторном редактировании;
- добавлены `autocomplete` у полей.

**Проверено:** Playwright с моком endpoint — успех + сброс формы, баннер ошибки на 500, кнопка `disabled` во время запроса. Требуется, чтобы на хостинге была настроена `mail()`; при её недоступности `send.php` вернёт 500 и пользователь увидит ошибку с советом написать напрямую.

### P1 — качество, доступность, SEO

#### 2. Скрытое мобильное меню перехватывает клавиатурный фокус — исправлено

Было: `.mobile-nav` пряталось только через `transform: translateX(100%)`, ссылки оставались в tab-порядке — пользователь с клавиатурой проваливался в невидимое меню.

Стало (`src/app/shared/header/header.scss`): закрытое меню имеет `visibility: hidden`, у `.mobile-nav--open` — `visibility: visible`. Скрытие отложено на `var(--t)`, чтобы успевала проиграть анимация выезда при закрытии.

**Проверено:** Playwright (viewport 800px) — при закрытом меню `visibility: hidden` и 0 ссылок `.mobile-nav__link` в tab-порядке; при открытом — `visible` и 7 ссылок; после закрытия снова `hidden`.

#### 3. Strict-режим TypeScript выключен — исправлено

Было: `tsconfig.json` без `"strict": true`, `noUnusedLocals`, `noUnusedParameters`; `tsconfig.app.json` без `"strictTemplates": true`.

Стало (`tsconfig.json`):

- `compilerOptions`: `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`;
- `angularCompilerOptions`: `"strictTemplates": true` (в корне — покрывает и app, и spec).

**Проверено:** `npx tsc -p tsconfig.app.json --noEmit`, `npm run build` (12 пререндеренных маршрутов) и `ng test` — без ошибок.

#### 4. Тестов почти нет

Единственные тесты — scaffold в `src/app/app.spec.ts` (2 шт.), хотя vitest + jsdom настроены (`package.json:36`, builder `@angular/build:unit-test`).

Стоит покрыть минимум:

- `ThemeService` — чтение из `localStorage`, fallback на `prefers-color-scheme`, отсутствие сохранения в приватном режиме;
- `ContactForm` — валидация, фокус на первой ошибке, поведение `success`;
- `Avatar` — фолбэк на первую букву имени, отрисовка картинки при `imgSrc`;
- `BlogPostPage` — перенаправление на `/blog` для неизвестного slug.

#### 5. SEO слабое для маркетингового сайта

- нет `og:*` и Twitter-метатегов;
- нет `canonical`;
- нет `robots.txt` и `sitemap.xml` (в `public/` только иконки и картинки);
- ~~маршрут `**` редиректит на главную (`src/app/app.routes.ts:73`) — вместо 404 отдаётся 200 (soft-404)~~ — исправлено: отдельная страница `NotFound` и маршрут `**`, серверный рендер с реальным статусом 404 (см. «Исправлено»);
- `title`/`description` дублируются в `src/index.html` и в `app.routes.ts`, легко рассинхронизировать.

**Что сделать:** отдельная страница 404 с реальным статусом, `withRouterMeta()` для мета-данных, sitemap/robots, og-теги.

#### 6. Редирект через `effect()` — исправлено

Было: `src/app/pages/blog-post/blog-post.ts:27` — навигация внутри change detection (при неизвестном slug `effect` делал `navigateByUrl('/blog')`).

Стало: на маршруте `blog/:slug` объявлен `canMatch`-гард (`app.routes.ts`), который пропускает только известные slug'и. Неизвестный slug не совпадает с маршрутом и попадает на `**` → страница 404. `effect` и `Router` из `BlogPostPage` убраны. Заодно исчезла ошибка `Invalid redirect status code: 404` при серверном рендере.

#### 7. Мета-обновление в конструкторе — исправлено

Было: `src/app/app.ts:19` — подписка на `NavigationEnd` ради смены `description`.

Стало: подписки нет; `<title>` и `<meta name="description">` обновляет `AppTitleStrategy` — наследник `TitleStrategy` (`src/app/core/title-strategy.service.ts`), зарегистрированный в `app.config.ts` через `{ provide: TitleStrategy, useClass: AppTitleStrategy }`. Стратегия ставит заголовок через `buildTitle()` и описание из `data`/`resolve` маршрута (на самом глубоком уровне, где оно задано). Работает и при пререндере, и при клиентской навигации.

> Отдельного `withRouterMeta()` в Angular 22 нет — вариант с кастомным `TitleStrategy` покрывает и `Title`, и `Meta`.

### P2 — архитектура и гигиена

#### 8. Нет `ChangeDetectionStrategy.OnPush` — исправлено

Было: ни один компонент не использовал OnPush (0 вхождений).

Стало: `changeDetection: ChangeDetectionStrategy.OnPush` добавлен во все 27 компонентов. Проект полностью сигнальный, поэтому изменений логики не потребовалось. Проверено в рантайме: клиентская навигация, обновление `<title>`/`meta description`, переключение темы и `aria-pressed` работают, ошибок в консоли нет.

#### 9. Контент хранится в TS-файлах

`src/app/data/blog.data.ts` — 15 кБ, `home.data.ts` — 13 кБ. Для блога удобнее MD/JSON с типизацией: контент меняется без пересборки и не смешивается с кодом.

#### 10. `[innerHTML]` ради одного слова в заголовке — исправлено

Было: `src/app/shared/hero/hero.html:5` — акцентное слово вставлялось через `[innerHTML]`, что вынуждало использовать `:host ::ng-deep` в `hero.scss`.

Стало: `titleParts` рендерятся через `@for`; акцентная часть оборачивается в `<em class="hero__accent">`, обычная — в `<span>`. Убраны `headingHtml`, `escapeHtml` и `::ng-deep`. Тёмная тема по-прежнему через `:host-context([data-theme='dark'])` (атрибут темы стоит на `<html>`, вне компонента). Проверено в рантайме: текст H1 совпадает посимвольно (пробелы не «потерялись» и не продублировались), маркер применяется в светлой теме и отключается в тёмной.

#### 11. Мелочи доступности — исправлено

- кнопка бургера: `aria-label` теперь динамический — «Открыть меню»/«Закрыть меню» в зависимости от `menuOpen()` (`src/app/shared/header/header.html`);
- ошибки формы связаны с полями: у полей `name` и `contact` есть `aria-invalid` и `aria-describedby`, указывающий на текст ошибки (появляется только при активной ошибке, вместе с видимым сообщением);
- у полей добавлен `autocomplete`: `name` для имени, `email` для контакта, `off` у honeypot.

**Проверено:** Playwright — `aria-label` бургера переключается вместе с `aria-expanded`; после blur на пустом поле `aria-invalid="true"` и `aria-describedby="f-name-error"` → «Укажите имя»; `autocomplete="name"`/`"email"` на месте.

#### 12. Нет линтера и CI — исправлено

Было: настроен только Prettier; ESLint (angular-eslint) и CI-проверки отсутствовали.

Стало:

- добавлен ESLint через `ng add angular-eslint@22`: `eslint.config.js` (flat config) с `eslint.configs.recommended`, `tseslint.configs.recommended`/`stylistic`, `angular.configs.tsRecommended` и шаблонными `templateRecommended`/`templateAccessibility`; selector-правила `app` / `kebab-case`;
- в `angular.json` добавлена цель `lint` (`@angular-eslint/builder:lint`), в `package.json` — скрипты `lint`, `format`, `format:write`, `typecheck`, `test:ci`;
- добавлен CI-workflow `.github/workflows/ci.yml` (GitHub Actions): на push в `master` и на PR ставит зависимости (`npm ci`) и прогоняет `format` → `lint` → `typecheck` → `build` → `test:ci` на Node 22.

**Проверено:** `npm run format`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:ci` — локально зелёные.

#### 13. Рассинхрон имён

Страница называется `school`, а данные — в `src/app/data/training.data.ts`. Лучше привести к одному имени.

#### 14. Внешняя зависимость для шрифта

Google Fonts подключён render-blocking (`src/index.html:27`). `display=swap` и `preconnect` уже есть, но для полной автономии лучше self-host + `preload`.

---

## Исправлено во время ревью

- `src/app/shared/header/header.ts:2` — удалён неиспользуемый импорт `input` (ловится только `noUnusedLocals`).
- P1-7 — мета-описание обновляется через `AppTitleStrategy` (`TitleStrategy`), а не подпиской на `NavigationEnd` в `App`.
- P2-8 — во все компоненты добавлен `ChangeDetectionStrategy.OnPush`.
- P2-10 — заголовок hero рендерится через `@for`/`<em>`, без `[innerHTML]` и `::ng-deep`.
- P0-1 — форма отправляет заявку на `/api/send.php` (PHP + `mail()`); кнопка блокируется, ошибка показывается честно.
- P1-2 — закрытое мобильное меню скрыто (`visibility: hidden`), ссылки не попадают в tab-порядок.
- P1-3 — включены `strict`, `noUnusedLocals`, `noUnusedParameters`, `strictTemplates`.
- P1-6 — неизвестный slug блога больше не редиректит через `effect`: на `blog/:slug` добавлен `canMatch`, неизвестное уходит на 404.
- P1-11 — `aria-label` бургера динамический; ошибки формы связаны с полями через `aria-invalid`/`aria-describedby`; у полей есть `autocomplete`.
- Soft-404 (часть P1-5) — отдельная страница `NotFound` (`src/app/pages/not-found/`) и маршрут `**`; `**` рендерится на сервере (`RenderMode.Server`), статус 404 выставляется через `RESPONSE_INIT`.
- P2-12 — добавлен ESLint (flat config, `angular-eslint@22`) и CI-workflow `.github/workflows/ci.yml` (format/lint/typecheck/build/tests).
- Отдельно — убран deprecated `withFetch()` (`FetchBackend` теперь бэкенд по умолчанию).

---

## План действий (рекомендуемый порядок)

1. ~~**P0-1** — реальная отправка формы + честное состояние ошибки.~~ готово
2. ~~**P1-3 + P2-8** — включить `strict`, `strictTemplates`, `OnPush`.~~ готово
3. ~~**P1-2 + P1-11** — фокус в мобильном меню, `aria-label` бургера, `aria-describedby` у ошибок.~~ готово
4. **P1-5** — sitemap/robots/og-теги (404-страница готова).
5. **P1-4** — тесты на тему, форму, аватар, перенаправления.
6. **P2** — по мере развития.

---

## Чеклист повторной проверки

```bash
npm run format
npm run lint
npm run typecheck
npm run build
npm run test:ci
```

Ручная проверка после изменений:

- `/`, `/school`, `/cases`, `/about`, `/blog`, `/blog/<slug>` — открываются, без ошибок в консоли;
- переключение темы — цвета меняются, нет «вспышки» при загрузке с сохранённой тёмной темой;
- Tab с шапки не попадает в закрытое мобильное меню;
- отправка формы доходит до приёмника, при ошибке сети показывается ошибка;
- неизвестный маршрут (`/page`, `/blog/xyz`) отдаёт статус 404 и страницу «Страница не найдена»; известная статья `/blog/<slug>` открывается.
